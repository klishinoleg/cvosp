from tortoise_imagefield import ImageField

from app.cfg.constants import STORAGE_TYPE
from app.models.abstract import AbstractBase, fields
import bcrypt
from app.enums.gender import Gender
from fastapi18n.decorators import multilangual_model


@multilangual_model(multilangual_fields={"first_name", "last_name", "description", "children_desc", "text", "location"})
class User(AbstractBase):
    USERNAME_FIELD: str = "username"
    first_name = fields.CharField(max_length=100, null=True)
    last_name = fields.CharField(max_length=100, null=True)
    description = fields.CharField(max_length=255, null=True)
    children_desc = fields.CharField(max_length=100, null=True)
    text = fields.TextField(max_length=100, null=True)

    username = fields.CharField(unique=True, max_length=50)
    password_hash = fields.CharField(max_length=255, null=True)
    is_superuser = fields.BooleanField(default=False)
    picture = ImageField(null=True, directory_name="avatars", field_for_name="fullname", storage_type=STORAGE_TYPE)
    birthday = fields.DateField(null=True)
    gender = fields.CharEnumField(Gender, null=True)
    married = fields.BooleanField(default=False)
    location = fields.CharField(max_length=150, null=True, default="")

    @property
    def fullname(self):
        return f"{self.first_name} {self.last_name}"

    @classmethod
    async def authenticate(cls, username: str, password: str):
        user = await cls.get_or_none(username=username)
        if not user:
            raise PermissionError("User not found")
        return user

    async def set_password(self, password: str):
        """Set pasword hash"""
        self.password_hash = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")
        await self.save(update_fields=["password_hash", "updated_at"])

    async def check_password(self, password: str) -> bool:
        """Check user password against hashed password"""
        return bcrypt.checkpw(password.encode("utf-8"), self.password_hash.encode("utf-8"))

    def __repr__(self):
        return f"<User {self.username}>"

    async def save(self, *args, **kwargs):
        return await super().save(*args, **kwargs)
