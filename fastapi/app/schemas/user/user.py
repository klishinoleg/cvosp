from datetime import date
from typing import Optional, List
from ..contact.user_contact import UserContactSchema
from ..skills.user_skill import UserSkillSchema
from .key_quality import KeyQualitySchema
from .profile import ProfileSchema
from .job import JobSchema
from .education import EducationSchema
from ..base_schema import BaseSchema
from app.models import User


class UserSchema(BaseSchema):
    username: str
    first_name: str
    last_name: str
    description: str
    children_desc: str
    gender: str
    married: bool
    location: str
    birthday: date
    text: str
    jobs: List[JobSchema]
    profiles: List[ProfileSchema]
    key_qualities: List[KeyQualitySchema]
    skills: List[UserSkillSchema]
    educations: List[EducationSchema]
    contacts: List[UserContactSchema]
    picture: str
    thumbnail: str

    @classmethod
    async def from_orm(cls, obj: User) -> Optional["BS"]:
        return cls(
            id=obj.id,
            username=obj.username,
            first_name=obj.first_name,
            last_name=obj.last_name,
            description=obj.description,
            children_desc=obj.children_desc,
            gender=obj.gender,
            location=obj.location,
            married=obj.married,
            birthday=obj.birthday,
            text=obj.text,
            picture=obj.get_picture_url(),
            thumbnail=await obj.get_picture_webp(300, 300),
            key_qualities=[await KeyQualitySchema.from_orm(o) for o in await getattr(obj, "key_qualities")],
            skills=[await UserSkillSchema.from_orm(o) for o in await getattr(obj, "skills")],
            profiles=[await ProfileSchema.from_orm(o) for o in await getattr(obj, "profiles")],
            jobs=[await JobSchema.from_orm(o) for o in await getattr(obj, "jobs")],
            educations=[await EducationSchema.from_orm(o) for o in await getattr(obj, "educations")],
            contacts=[await UserContactSchema.from_orm(o) for o in await getattr(obj, "contacts")],
        )

    class Congif:
        model = User
