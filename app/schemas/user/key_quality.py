from typing import Optional

from ..base_schema import BaseSchema, BS
from app.models import KeyQuality


class KeyQualitySchema(BaseSchema):
    name: str
    description: str
    ordering: int

    @classmethod
    async def from_orm(cls, obj: KeyQuality) -> Optional["BS"]:
        return cls(
            id=obj.id,
            name=obj.name,
            description=obj.description,
            ordering=obj.ordering,
        )

    class Config:
        model = KeyQuality
