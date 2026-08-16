"""Backfill curated portfolio cases into the cvosp database.

Dry run:
    python -m app.backfills.portfolio_cases

Apply:
    python -m app.backfills.portfolio_cases --apply

This script is intentionally separate from migrations: it only updates public
portfolio content and must be run explicitly.
"""

from __future__ import annotations

import argparse
import asyncio
from dataclasses import dataclass
from typing import Any

from tortoise import Tortoise

from app.cfg.database import TORTOISE_ORM


@dataclass(frozen=True)
class PortfolioCase:
    name: str
    description: str
    icon: str
    site: str
    ordering: int
    skills: tuple[str, ...]
    images: tuple[str, ...]


CASES: tuple[PortfolioCase, ...] = (
    PortfolioCase(
        name="Exlibrus",
        description=(
            "Production book commerce and digital reading platform: catalog, "
            "orders, publishers, imports, email workflows, admin operations, "
            "AI assistants, performance optimization and production diagnostics."
        ),
        icon="/cases/exlibrus-home.png",
        site="https://exlibrus.net/",
        ordering=1,
        skills=(
            "Next.js",
            "React",
            "FastAPI",
            "PostgreSQL",
            "Redis",
            "Celery",
            "Docker",
            "Nginx",
            "AI / LLM",
            "Playwright",
        ),
        images=("/cases/exlibrus-home.png", "/cases/exlibrus-architecture.png"),
    ),
    PortfolioCase(
        name="Other Worlds",
        description=(
            "Web3/MMORPG ecosystem: Telegram Mini App, browser game, NFT "
            "avatars as playable characters, TON smart contracts, IPFS media "
            "pipeline, real-time battles and market-making tooling."
        ),
        icon="/cases/otherworlds-case.png",
        site="https://other-worlds.io/",
        ordering=2,
        skills=(
            "React",
            "Vite",
            "TypeScript",
            "FastAPI",
            "PostgreSQL",
            "Redis",
            "Kafka",
            "WebSocket",
            "TON",
            "FunC",
            "IPFS",
        ),
        images=("/cases/otherworlds-case.png", "/cases/otherworlds-stack.png"),
    ),
)


def one(rows: list[dict[str, Any]], key: str = "id") -> Any | None:
    return rows[0][key] if rows else None


async def table_columns(table: str) -> set[str]:
    connection = Tortoise.get_connection("default")
    rows = await connection.execute_query_dict(
        """
        select column_name
        from information_schema.columns
        where table_schema = 'public' and table_name = $1
        """,
        [table],
    )
    return {row["column_name"] for row in rows}


def localized_payload(
    columns: set[str],
    field: str,
    value: str,
    ru_value: str | None = None,
) -> dict[str, str]:
    payload: dict[str, str] = {}
    if field in columns:
        payload[field] = value
    if f"{field}_en" in columns:
        payload[f"{field}_en"] = value
    if f"{field}_ru" in columns:
        payload[f"{field}_ru"] = ru_value or value
    return payload


def localized_columns(columns: set[str], field: str) -> list[str]:
    return [column for column in (field, f"{field}_en", f"{field}_ru") if column in columns]


def localized_match_clause(columns: set[str], field: str, param: str = "$1") -> str:
    candidates = localized_columns(columns, field)
    if not candidates:
        raise RuntimeError(f"No localized columns found for {field}")
    return " or ".join(f"lower({column}) = lower({param})" for column in candidates)


def localized_search_clause(columns: set[str], field: str, param: str = "$1") -> str:
    candidates = localized_columns(columns, field)
    if not candidates:
        raise RuntimeError(f"No localized columns found for {field}")
    return " or ".join(f"{column} ilike {param}" for column in candidates)


async def get_owner_job_id() -> int:
    connection = Tortoise.get_connection("default")
    job_columns = await table_columns("job")
    freelance_clause = localized_search_clause(job_columns, "name", "$2")
    user_id = one(
        await connection.execute_query_dict(
            'select id from public."user" where username = $1 limit 1',
            ["klishinoleg"],
        )
    )
    if user_id is None:
        user_id = one(
            await connection.execute_query_dict(
                'select id from public."user" order by id limit 1',
            )
        )
    if user_id is None:
        raise RuntimeError("No user found for portfolio backfill")

    job_id = one(
        await connection.execute_query_dict(
            f"""
            select id
            from public.job
            where user_id = $1
              and ({freelance_clause})
            order by start_date desc nulls last, id desc
            limit 1
            """,
            [user_id, "%Freelance%"],
        )
    )
    if job_id is None:
        job_id = one(
            await connection.execute_query_dict(
                """
                select id
                from public.job
                where user_id = $1
                order by start_date desc nulls last, id desc
                limit 1
                """,
                [user_id],
            )
        )
    if job_id is None:
        raise RuntimeError(f"No job found for user id {user_id}")

    return int(job_id)


async def ensure_skill_id(name: str, skill_columns: set[str]) -> int:
    connection = Tortoise.get_connection("default")
    match_clause = localized_match_clause(skill_columns, "name")
    skill_id = one(
        await connection.execute_query_dict(
            f"""
            select id
            from public.skill
            where {match_clause}
            limit 1
            """,
            [name],
        )
    )
    if skill_id is not None:
        return int(skill_id)

    payload = localized_payload(skill_columns, "name", name)
    columns = ", ".join(payload)
    placeholders = ", ".join(f"${index}" for index in range(1, len(payload) + 1))
    rows = await connection.execute_query_dict(
        f"insert into public.skill ({columns}) values ({placeholders}) returning id",
        list(payload.values()),
    )
    return int(rows[0]["id"])


async def ensure_project_id(
    case: PortfolioCase,
    job_id: int,
    project_columns: set[str],
) -> int:
    connection = Tortoise.get_connection("default")
    match_clause = localized_match_clause(project_columns, "name")
    project_id = one(
        await connection.execute_query_dict(
            f"""
            select id
            from public.project
            where {match_clause}
            limit 1
            """,
            [case.name],
        )
    )

    payload = {
        **localized_payload(project_columns, "name", case.name),
        **localized_payload(project_columns, "description", case.description),
        "icon": case.icon,
        "site": case.site,
        "ordering": case.ordering,
        "job_id": job_id,
    }

    if project_id is None:
        columns = ", ".join(payload)
        placeholders = ", ".join(f"${index}" for index in range(1, len(payload) + 1))
        rows = await connection.execute_query_dict(
            f"insert into public.project ({columns}) values ({placeholders}) returning id",
            list(payload.values()),
        )
        return int(rows[0]["id"])

    assignments = ", ".join(
        f"{column} = ${index + 1}" for index, column in enumerate(payload)
    )
    await connection.execute_query(
        f"update public.project set {assignments}, updated_at = current_timestamp where id = ${len(payload) + 1}",
        [*payload.values(), project_id],
    )
    return int(project_id)


async def apply_case(
    case: PortfolioCase,
    job_id: int,
    project_columns: set[str],
    skill_columns: set[str],
) -> None:
    connection = Tortoise.get_connection("default")
    project_id = await ensure_project_id(case, job_id, project_columns)

    skill_ids = [await ensure_skill_id(name, skill_columns) for name in case.skills]
    await connection.execute_query(
        "delete from public.project_skill where project_id = $1",
        [project_id],
    )
    for skill_id in skill_ids:
        await connection.execute_query(
            """
            insert into public.project_skill (project_id, skill_id)
            select $1, $2
            where not exists (
                select 1 from public.project_skill where project_id = $1 and skill_id = $2
            )
            """,
            [project_id, skill_id],
        )

    for image_path in case.images:
        exists = one(
            await connection.execute_query_dict(
                "select 1 as id from public.image where project_id = $1 and image = $2 limit 1",
                [project_id, image_path],
            )
        )
        if exists is None:
            await connection.execute_query(
                "insert into public.image (project_id, image) values ($1, $2)",
                [project_id, image_path],
            )


async def run(apply: bool) -> None:
    if not apply:
        print("Dry run. Cases that would be applied:")
        for case in CASES:
            print(f"- {case.name}: {len(case.skills)} skills, {len(case.images)} images")
        print("Run with --apply to update the database.")
        return

    await Tortoise.init(config=TORTOISE_ORM)
    try:
        job_id = await get_owner_job_id()
        project_columns = await table_columns("project")
        skill_columns = await table_columns("skill")
        for case in CASES:
            await apply_case(case, job_id, project_columns, skill_columns)
            print(f"Applied portfolio case: {case.name}")
    finally:
        await Tortoise.close_connections()


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--apply", action="store_true", help="Actually update the configured database")
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    asyncio.run(run(apply=args.apply))


if __name__ == "__main__":
    main()
