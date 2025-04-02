from typing import Optional

from ..base_schema import BaseSchema, BS
from app.models import Image


class ImageSchema(BaseSchema):
    image: str
    thumbnail: str

    @classmethod
    async def from_orm(cls, obj: Image) -> Optional["BS"]:
        return cls(
            id=obj.id,
            image=obj.get_image_url(),
            thumbnail=await obj.get_image_webp(300, 250)
        )

    class Config:
        model = Image
