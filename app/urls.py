from fastapi import APIRouter
from app import routes

router = APIRouter(prefix="/api/v1")

router.include_router(routes.user_router)
router.include_router(routes.project_router)
