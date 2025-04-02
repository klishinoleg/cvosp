from tortoise_imagefield import ImageField

from app.models.abstract import AbstractBase, fields
from app.cfg.constants import STORAGE_TYPE


class ContactInfo(AbstractBase):
    name = fields.CharField(max_length=100)
    icon = ImageField(storage_type=STORAGE_TYPE, directory_name="contacts_info", field_for_name="name")

    def __repr__(self):
        return f"<ContactInfo: {self.name}>"
