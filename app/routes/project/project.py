from fastapi import APIRouter
from app.models import Project
from app.schemas.projects.project import ProjectSchema
from ..abstract import APIAbstractViewSet

router = APIRouter(prefix='/projects', tags=["Projects"])


class ViewSet(APIAbstractViewSet):
    model = Project
    schema = ProjectSchema
    router = router


view = ViewSet(router)
