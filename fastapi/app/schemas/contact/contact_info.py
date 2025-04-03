from typing import Optional

from ..base_schema import BaseSchema
from app.models import ContactInfo


class ContactInfoSchema(BaseSchema):
    name: str
    icon: str

    @classmethod
    async def from_orm(cls, obj: ContactInfo) -> Optional["BS"]:
        return cls(
            id=obj.id,
            icon=await obj.get_icon_webp(50, 50),
            name=obj.name
        )

    class Config:
        model = ContactInfo
