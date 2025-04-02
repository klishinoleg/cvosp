from datetime import date
from typing import Optional, List
from ..projects.project import ProjectListSchema
from ..base_schema import BaseSchema, BS
from app.models import Job


class JobSchema(BaseSchema):
    name: str
    profession: str
    description: str
    start_date: date
    end_date: Optional[date]
    icon: str
    site: Optional[str]
    projects: List[ProjectListSchema]

    @classmethod
    async def from_orm(cls, obj: Job) -> Optional["BS"]:
        await obj.fetch_related("projects")
        return cls(
            id=obj.id,
            name=obj.name,
            profession=obj.profession,
            description=obj.description,
            icon=obj.get_icon_url(),
            start_date=obj.start_date,
            end_date=obj.end_date,
            site=obj.site,
            projects=[await ProjectListSchema.from_orm(o) for o in obj.projects]
        )

    class Config:
        model = Job
