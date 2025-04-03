from fastapi18n import multilangual_model
from tortoise_imagefield import ImageField
from ..abstract import AbstractBase, fields


@multilangual_model({"name", "description"})
class Project(AbstractBase):
    class Meta:
        ordering = ("ordering", "id")

    name = fields.CharField(max_length=100)
    description = fields.TextField()
    skills = fields.ManyToManyField("models.Skill", related_name="projects")
    job = fields.ForeignKeyField("models.Job", related_name="projects", on_delete=fields.CASCADE)
    icon = ImageField(directory_name="projects_icons", field_for_name="name", null=True)
    site = fields.CharField(max_length=50)
    ordering = fields.SmallIntField(default=100)

    def __repr__(self):
        return f"<Project {self.name}>"
