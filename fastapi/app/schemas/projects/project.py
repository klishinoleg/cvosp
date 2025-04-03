from typing import Optional
from .image import ImageSchema
from ..base_schema import BaseSchema
from ..skills.skill import SkillSchema
from app.models import Project


class ProjectSchema(BaseSchema):
    name: str
    description: str
    icon: str
    images: list[ImageSchema]
    skills: list[SkillSchema]
    site: str

    @classmethod
    async def from_orm(cls, obj: Project) -> Optional["BS"]:
        await obj.fetch_related("images", "skills")
        return cls(
            id=obj.id,
            name=obj.name,
            description=obj.description,
            site=obj.site,
            icon=obj.get_icon_url(),
            images=[await ImageSchema.from_orm(o) for o in obj.images],
            skills=[await SkillSchema.from_orm(o) for o in obj.skills],
        )

    class Config:
        model = Project


class ProjectListSchema(BaseSchema):
    name: str
    thumb: str

    @classmethod
    async def from_orm(cls, obj: Project) -> Optional["BS"]:
        return cls(
            id=obj.id,
            name=obj.name,
            thumb=await obj.get_icon_webp(50, 50),
        )

    class Config:
        model = Project
