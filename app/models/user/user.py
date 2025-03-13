from app.models.abstract import AbstractBase, fields
import bcrypt


class User(AbstractBase):
    USERNAME_FIELD: str = "username"

    username = fields.CharField(unique=True, max_length=50)
    password_hash = fields.CharField(max_length=255, null=True)
    is_superuser = fields.BooleanField(default=False)

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
