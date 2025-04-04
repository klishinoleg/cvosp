from tortoise_imagefield import ImageField

from ..abstract import AbstractBase, fields
from fastapi18n.decorators import multilangual_model

from ...cfg.constants import STORAGE_TYPE


@multilangual_model({"name", "description", "profession"})
class Education(AbstractBase):
    name = fields.CharField(max_length=100)
    profession = fields.CharField(max_length=100)
    description = fields.TextField()

    class Meta:
        ordering = ["-start_date", "-id"]

    start_date = fields.DateField(null=True)
    end_date = fields.DateField(null=True)
    user = fields.ForeignKeyField('models.User', related_name='educations')
    icon = ImageField(null=True, storage_type=STORAGE_TYPE, field_for_name="name", directory_name="educations_icons")
    site = fields.CharField(max_length=100, null=True)
