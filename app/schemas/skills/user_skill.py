from typing import Optional
from .skill import SkillSchema
from ..base_schema import BaseSchema, BS
from app.models import UserSkill


class UserSkillSchema(BaseSchema):
    skill: SkillSchema
    competition_level: int
    group: int
    ordering: int

    @classmethod
    async def from_orm(cls, obj: UserSkill) -> Optional["BS"]:
        await obj.fetch_related("skill")
        return cls(
            id=obj.id,
            skill=obj.skill,
            competition_level=obj.competition_level,
            group=obj.group,
            ordering=obj.ordering
        )

    class Config:
        model = UserSkill
