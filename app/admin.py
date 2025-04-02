from __future__ import annotations
from typing import Optional, Any
from uuid import UUID
from fastadmin import TortoiseModelAdmin, register, WidgetType
from fastadmin.models.schemas import ModelFieldWidgetSchema
from tortoise_imagefield import ImageField

from app.models import User, Skill, UserSkill, KeyQuality, Profile, Job, Education, Project, Image, ContactInfo, \
    UserContact


class ModelWithImageFields(TortoiseModelAdmin):
    def __init__(self, *args, **kwargs):
        self.formfield_overrides.update(
            {k: (WidgetType.Upload, {"required": getattr(args[0]._meta.fields_map.get(k), "required", False)})
             for k in self._get_image_fields(args[0])}
        )
        return super().__init__(*args, **kwargs)

    def _get_image_fields(self, model=None):
        if not model:
            model = self.model_cls
        return set(field_name for field_name, field in model._meta.fields_map.items() if
                   isinstance(field, ImageField))

    async def orm_get_obj(self, id: UUID | int) -> Any | None:
        obj = await super().orm_get_obj(id)
        for field_name in self._get_image_fields():
            setattr(obj, field_name, getattr(obj, f"get_{field_name}_url")())
        return obj

    async def orm_save_obj(self, id: UUID | Any | None, payload: dict) -> Any:
        payload = {k: v for k, v in payload.items() if k not in self._get_image_fields() or str(v).startswith("data:")}
        return await super().orm_save_obj(id, payload)

    def get_model_fields_with_widget_types(
            self,
            with_m2m: bool | None = None,
            with_upload: bool | None = None,
    ) -> list[ModelFieldWidgetSchema]:
        fields_with_types = super().get_model_fields_with_widget_types(with_m2m=with_m2m, with_upload=with_upload)
        if with_m2m is None and with_upload is None:
            return fields_with_types
        if with_m2m:
            return fields_with_types
        if with_upload:
            return [v for v in fields_with_types if v.column_name not in self._get_image_fields()]
        _upload_fields = super().get_model_fields_with_widget_types(with_upload=True)
        fields_with_types += [v for v in _upload_fields if v.column_name in self._get_image_fields()]
        return fields_with_types


@register(User)
class UserAdmin(ModelWithImageFields):
    exclude = ("password_hash", "first_name", "last_name", "description", "children_desc", "text", "location")
    list_display = ("id", "username")

    async def authenticate(self, username: str, password: str) -> Optional[int]:
        try:
            user = await User.authenticate(username, password)
            if not user.is_superuser:
                return None
        except PermissionError as e:
            return None
        return user.id


@register(Skill)
class SkillAdmin(TortoiseModelAdmin):
    list_display = ("id", "name_en", "name_ru")
    exclude = ("name",)


@register(UserSkill)
class UserSkillAdmin(TortoiseModelAdmin):
    list_display = ("id", "skill_name", "competition_level", "group", "ordering")
    list_select_related = ("skill",)

    def get_model_fields_with_widget_types(
            self, *args, **kwargs
    ) -> list[ModelFieldWidgetSchema]:
        fields = super().get_model_fields_with_widget_types(*args, **kwargs)
        fields.append(ListFieldSchema("skill_name"))
        return fields

    formfield_overrides = {
        "competition_level": (WidgetType.InputNumber, {"min": 1, "max": 100, "defaultValue": 90}),
        "group": (WidgetType.InputNumber, {"defaultValue": 1}),
        "ordering": (WidgetType.InputNumber, {"defaultValue": 50}),
    }


@register(KeyQuality)
class KeyQualityAdmin(TortoiseModelAdmin):
    list_display = ("id", "name_en", "ordering")
    exclude = ("name", "description")


@register(Profile)
class ProfileAdmin(ModelWithImageFields):
    list_display = ("id", "name_en", "ordering")
    exclude = ("name", "description")


@register(Job)
class JobAdmin(ModelWithImageFields):
    list_display = ("id", "name_en", "start_date", "end_date")
    exclude = ("name", "description", "profession")


@register(Education)
class EducationAdmin(ModelWithImageFields):
    list_display = ("id", "name_en", "start_date", "end_date", "profession_en")
    exclude = ("name", "description", "profession")


@register(Project)
class ProjectAdmin(ModelWithImageFields):
    list_display = ("id", "name_en", "ordering")
    exclude = ("name", "description")


@register(ContactInfo)
class ProjectAdmin(ModelWithImageFields):
    list_display = ("id", "name")


@register(UserContact)
class ProjectAdmin(ModelWithImageFields):
    list_display = ("id", "title", "link", "ordering")


@register(Image)
class ProjectAdmin(ModelWithImageFields):
    list_display = ("id", "name_en")
    exclude = ("name", "description")


class ListFieldSchema(ModelFieldWidgetSchema):
    def __init__(self, field_name) -> None:
        super().__init__(
            column_name=field_name,
            is_m2m=False, is_pk=False,
            name=field_name,
            form_widget_props={'options': [{'label': 'Yes', 'value': True}, {'label': 'No', 'value': False}],
                               'required': False},
            form_widget_type=WidgetType.Input,
            filter_widget_type=WidgetType.Input,
            is_immutable=True,
            filter_widget_props={},
        )
