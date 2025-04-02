from tortoise_imagefield import ImageField

from ..abstract import AbstractBase, fields
from fastapi18n.decorators import multilangual_model

from ...cfg.constants import STORAGE_TYPE


@multilangual_model({"name", "description"})
class Profile(AbstractBase):
    name = fields.CharField(max_length=100)
    description = fields.TextField()

    class Meta:
        ordering = ("ordering", "id")

    icon = ImageField(null=True, storage_type=STORAGE_TYPE, field_for_name="name", directory_name="profile_icons")
    user = fields.ForeignKeyField("models.User", related_name="profiles", on_delete=fields.CASCADE)
    year = fields.IntField(null=True)
    ordering = fields.SmallIntField(default=50)
