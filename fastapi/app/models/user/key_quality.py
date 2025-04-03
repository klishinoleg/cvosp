from ..abstract import AbstractBase, fields
from fastapi18n.decorators import multilangual_model


@multilangual_model({"name", "description"})
class KeyQuality(AbstractBase):
    name = fields.CharField(max_length=100)
    description = fields.TextField()

    class Meta:
        ordering = ("ordering", "id")

    user = fields.ForeignKeyField("models.User", related_name="key_qualities", on_delete=fields.CASCADE)
    ordering = fields.SmallIntField(default=50)
