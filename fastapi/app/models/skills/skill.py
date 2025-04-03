from app.models.abstract import AbstractBase, fields
from fastapi18n.decorators import multilangual_model


@multilangual_model({"name"})
class Skill(AbstractBase):
    name = fields.CharField(max_length=100, null=True)

    def __repr__(self):
        return f"<Skill {self.name}>"
