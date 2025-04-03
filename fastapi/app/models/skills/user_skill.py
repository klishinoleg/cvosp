from ..abstract.base import AbstractBase, fields


class UserSkill(AbstractBase):
    class Meta:
        ordering = ("group", "ordering", "id")
        unique_together = ("user", "skill")
        index_together = ("user", "skill", "group", "ordering")

    skill = fields.ForeignKeyField("models.Skill", on_delete=fields.CASCADE, related_name="users")
    user = fields.ForeignKeyField("models.User", on_delete=fields.CASCADE, related_name="skills")
    competition_level = fields.SmallIntField(max=100, min=1, default=100)
    group = fields.SmallIntField(default=1)
    ordering = fields.SmallIntField(default=100)

    @property
    def skill_name(self):
        from tortoise.queryset import QuerySet
        if isinstance(self.skill, QuerySet):
            return None
        return self.skill.name

    @property
    def user_name(self):
        from tortoise.queryset import QuerySet
        if isinstance(self.user, QuerySet):
            return None
        return self.user.username
