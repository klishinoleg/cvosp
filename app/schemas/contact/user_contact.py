from typing import Optional
from .contact_info import ContactInfoSchema
from ..base_schema import BaseSchema, BS
from app.models import UserContact


class UserContactSchema(BaseSchema):
    title: str
    link: str
    contact_info: ContactInfoSchema

    @classmethod
    async def from_orm(cls, obj: UserContact) -> Optional["BS"]:
        await obj.fetch_related("contact")
        return cls(
            id=obj.id,
            title=obj.title,
            link=obj.link,
            contact_info=await ContactInfoSchema.from_orm(obj.contact),
        )

    class Config:
        model = UserContact
