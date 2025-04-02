import asyncio
from pydantic import BaseModel, ValidationError
from typing import Optional, TypeVar
from app.models.abstract import AbstractBase

# Type variable bound to AbstractBase to enforce type constraints
M = TypeVar('M', bound=AbstractBase)


class BaseSchema(BaseModel):
    """Base schema class with common fields and helper methods for ORM conversion."""

    id: Optional[int]

    @classmethod
    async def _from_orm(cls, obj: "M") -> "BS":
        """Private method to convert ORM object to schema instance."""
        return cls()

    @classmethod
    async def from_orm(cls, obj: "M") -> Optional["BS"]:
        """
        Convert an ORM object into a schema instance.

        - Returns `None` if the object does not exist.
        - Otherwise, calls `_from_orm()` to create an instance.
        """
        if obj is None:
            return None
        return await cls._from_orm(obj)

    @classmethod
    async def save_from_dict(cls, obj: "M", data: dict, as_obj: bool = False) -> "BS" or "M":
        """
        Update an ORM object from a dictionary and save it.

        - Filters data to only allow editable fields.
        - Saves the object and optionally returns it as an ORM object or a schema instance.
        """
        if not cls.Config.allow_update:
            raise ValidationError("Not allowed to update schema")

        if cls.Config.editable_fields:
            data = {k: v for k, v in data.items() if k in cls.Config.editable_fields}

        await obj.update_from_dict(data).save()

        if as_obj:
            return obj
        return await cls.from_orm(obj)

    @classmethod
    def _create_validate(cls, data: dict):
        """Placeholder for data validation before creating an object."""
        pass

    @classmethod
    async def create_from_dict(cls, data: dict, as_obj: bool = False) -> "BS" or "M":
        """
        Create a new ORM object from a dictionary.

        - Validates the input data before creation.
        - Returns either the ORM object or a schema instance.
        """
        if not cls.Config.allow_create:
            raise ValidationError("Not allowed to create an object.")
        cls._create_validate(data)
        obj = await cls.Config.model.create(**data)

        if as_obj:
            return obj
        return await cls.from_orm(obj)

    class Config:
        """Configuration class for defining model behavior and editable fields."""
        from_attributes = True  # Enable ORM conversion
        editable_fields: Optional[list] = None  # Define which fields can be edited
        model: M  # Reference to the ORM model
        allow_update: bool = False
        allow_create: bool = False


# Type variable bound to BaseSchema to enforce type constraints
BS = TypeVar("BS", bound=BaseSchema)
