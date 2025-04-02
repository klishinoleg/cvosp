from typing import Optional

from ..base_schema import BaseSchema, BS
from app.models import Skill


class SkillSchema(BaseSchema):
    name: str

    @classmethod
    async def from_orm(cls, obj: Skill) -> Optional["BS"]:
        return cls(
            id=obj.id,
            name=obj.name
        )

    class Config:
        model = Skill
