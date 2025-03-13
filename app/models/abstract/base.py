from datetime import datetime

from tortoise import fields, models


class AbstractBase(models.Model):
    """Base abstract model with timestamps, active status, and utility functions."""
    id = fields.IntField(pk=True)
    is_active = fields.BooleanField(default=True)
    created_at = fields.DatetimeField(auto_now_add=True)
    updated_at = fields.DatetimeField(auto_now=True)

    class Meta:
        abstract = True
        ordering = ("id",)

    async def activate(self):
        """Activate the object"""
        self.is_active = True
        await self.save(update_fields=["is_active", "updated_at"])

    async def deactivate(self):
        """Deactivate the object"""
        self.is_active = False
        await self.save(update_fields=["is_active", "updated_at"])
