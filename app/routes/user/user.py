from fastapi import APIRouter
from app.models import User
from app.schemas.user.user import UserSchema
from ..abstract import APIAbstractViewSet

router = APIRouter(prefix='/users', tags=["Users"])


class ViewSet(APIAbstractViewSet):
    model = User
    schema = UserSchema
    router = router


view = ViewSet(router)
