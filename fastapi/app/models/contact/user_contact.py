from ..abstract import AbstractBase, fields


class UserContact(AbstractBase):
    class Meta:
        ordering = ("ordering", "id")

    title = fields.CharField(max_length=50)
    link = fields.CharField(max_length=255)
    user = fields.ForeignKeyField("models.User", related_name="contacts")
    contact = fields.ForeignKeyField("models.ContactInfo", related_name="contacts")
    ordering = fields.SmallIntField(default=10)

    def __repr__(self):
        return f"<UserContact {self.title}>"
