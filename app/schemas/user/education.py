from datetime import date
from typing import Optional

from ..base_schema import BaseSchema, BS
from app.models import Job


class EducationSchema(BaseSchema):
    name: str
    profession: str
    description: str
    start_date: date
    end_date: Optional[date]
    icon: str
    site: Optional[str]

    @classmethod
    async def from_orm(cls, obj: Job) -> Optional["BS"]:
        return cls(
            id=obj.id,
            name=obj.name,
            profession=obj.profession,
            description=obj.description,
            icon=obj.get_icon_url(),
            start_date=obj.start_date,
            end_date=obj.end_date,
            site=obj.site,
        )

    class Config:
        model = Job
