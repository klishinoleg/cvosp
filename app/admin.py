from typing import Optional
from uuid import UUID

from fastadmin import TortoiseModelAdmin, register
from app.models import User


@register(User)
class UserAdmin(TortoiseModelAdmin):
    exclude = ("hashed_password",)
    list_display = ("username", "email", "password")
    list_display_links = ("id", "username")
    search_fields = ("username",)

    async def authenticate(self, username: str, password: str) -> Optional[int]:
        try:
            user = await User.authenticate(username, password)
            if not user.is_superuser:
                return None
        except PermissionError as e:
            return None
        return user.id
