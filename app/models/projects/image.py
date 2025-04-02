from fastapi18n import multilangual_model
from tortoise_imagefield import ImageField
from ..abstract import AbstractBase, fields
from ...cfg.constants import STORAGE_TYPE


class Image(AbstractBase):
    image = ImageField(null=True, blank=True, storage_type=STORAGE_TYPE, field_for_name="name",
                       directory_name="project_images")
    project = fields.ForeignKeyField("models.Project", related_name="images", on_delete=fields.CASCADE)
