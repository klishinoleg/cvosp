import asyncio
import logging
import sys
from getpass import getpass
from aerich import migrate
from app.cfg.database import init_db


def get_input(prompt: str) -> str:
    return input(prompt).strip()


async def add_admin():
    from app.models import User
    await init_db()
    username = sys.argv[2] if len(sys.argv) >= 3 else get_input("Enter admin username: ")
    password = sys.argv[3] if len(sys.argv) >= 4 else getpass("Enter admin password: ")
    admin = await User.create(
        username=username,
        is_superuser=True,
        first_name="First name",
        last_name="Last name",
        description="Description",
        children_desc="Children description",
        text="Text",
        location="Location",
    )
    print("Admin successfully added")
    await admin.set_password(password)
    await admin.save()


def show_help():
    print("python t.py add_admin")


if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == "add_admin":
        asyncio.run(add_admin())
    else:
        show_help()
