from typing import Optional

from ..base_schema import BaseSchema
from app.models import Profile


class ProfileSchema(BaseSchema):
    name: str
    description: str
    ordering: int
    icon: str
    year: int

    @classmethod
    async def from_orm(cls, obj: Profile) -> Optional["BS"]:
        return cls(
            id=obj.id,
            name=obj.name,
            description=obj.description,
            icon=await obj.get_icon_webp(30, 30),
            ordering=obj.ordering,
            year=obj.year
        )

    class Config:
        model = Profile
