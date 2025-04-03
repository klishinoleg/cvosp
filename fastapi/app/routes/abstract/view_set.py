import asyncio

from fastapi import APIRouter, HTTPException
from typing import Type, TypeVar, Generic, List
import json
from typing import Optional

from tortoise.exceptions import ValidationError
from tortoise.models import Model
from app.schemas.base_schema import BS
from starlette.requests import Request
from .pagination import paginate, _
from app.models import User

T = TypeVar("T", bound=Model)


class NotFoundError(ValueError):
    """Custom exception for handling 'Object not found' errors."""
    args = [{"detail": _("Object not found")}]


class APIAbstractViewSet(Generic[T, BS]):
    """
    A generic base class for FastAPI view sets.
    It provides basic CRUD operations with permission handling and pagination.
    """

    model: Type[T]  # The database model class
    schema: Type[BS]  # The Pydantic schema class
    list_schema: Optional[Type[BS]] = None  # Optional schema for list responses
    router: APIRouter  # API router for registering endpoints
    queryset = None  # Custom queryset, defaults to model.all()
    permission_classes = []  # List of permission classes
    page_size: int = 10  # Default page size for pagination
    tags: List[str] = []  # Tags for API documentation
    request: Request = None  # Current request object
    ordering: tuple = ("id",)  # Default ordering field

    def __init__(self, router):
        """
        Initialize the view set and set up API routes.
        """
        self.router = router
        self._set_routes()

    @classmethod
    def get_queryset(cls, request: Request) -> T:
        """Return the queryset for retrieving objects."""
        return cls.queryset or cls.model

    @classmethod
    def get_user(cls, request: Request) -> Optional[User]:
        """Retrieve the authenticated user from the request."""
        return request.user

    def _set_routes(self):
        """Register API routes for CRUD operations."""
        self.router.add_api_route("/", self.list_objects, methods=["GET"])
        self.router.add_api_route("/{obj_id}/", self.retrieve_object, response_model=self.schema, methods=["GET"])
        self.router.add_api_route("/", self.create_object, response_model=self.schema, methods=["POST"])
        self.router.add_api_route("/{obj_id}/", self.update_object, response_model=self.schema, methods=["PATCH"])
        self.router.add_api_route("/{obj_id}/", self.delete_object, response_model=dict, methods=["DELETE"])

    @classmethod
    async def get_data(cls, request: Request) -> dict:
        """
        Extract and return request data for POST, PUT, PATCH requests.
        If 'account_id' is missing, add it from the authenticated user.
        """
        if request.method in ["POST", "PUT", "PATCH"]:
            data = await request.json()
            user = cls.get_user(request)
            if 'account_id' not in data:
                data['account_id'] = user.id
            return data
        return dict(request.query_params)

    @classmethod
    async def response(cls, func, *args,
                       schema: Optional[Type[BS]] = None,
                       many: bool = False, **kwargs) -> dict or list[dict]:
        """
        Execute a function and return a properly formatted response.

        - Handles both synchronous and asynchronous functions.
        - Converts ORM objects to Pydantic schemas if provided.
        - Catches and handles validation errors.
        """
        try:
            if asyncio.iscoroutinefunction(func):
                result = await func(*args, **kwargs)
            else:
                result = func(*args, **kwargs)
            if schema:
                if many:
                    return [await schema.from_orm(o) for o in result]
                return await schema.from_orm(result)
            return result
        except ValidationError as e:
            await cls._error_response(e, status_code=403)
        except ValueError as e:
            await cls._error_response(e, status_code=400)

    @classmethod
    async def not_found_error(cls, detail=None):
        """Raise a 404 HTTP exception with a custom error message."""
        await cls._error_response(NotFoundError(detail), status_code=404)

    @classmethod
    async def _error_response(cls, e, status_code=403):
        """
        Handle errors and raise an HTTPException with a structured error response.
        """
        detail = ""
        if len(e.args) > 0:
            if isinstance(e.args[0], dict):
                detail = e.args[0]
            elif isinstance(e.args[0], str):
                try:
                    message = json.loads(e.args[0])
                except json.JSONDecodeError:
                    message = e.args[0]
                detail = message
        else:
            detail = str(e)
        raise HTTPException(status_code=status_code, detail=detail)

    @classmethod
    async def check_permissions(cls, request: Request, obj=None, allow_empty=False):
        """
        Check if the user has permissions to access or modify an object.

        - If `allow_empty` is False and the object is None, raise a 404 error.
        - Iterate over permission classes and check access.
        """
        if not allow_empty and not obj:
            await cls._error_response(NotFoundError(), status_code=404)
        for perm in cls.permission_classes:
            if obj:
                await perm.check(request, obj)
            else:
                await perm.check(request)

    @classmethod
    async def get_object(cls, request: Request, obj_id: int or str):
        """
        Retrieve an object by its ID, checking permissions before returning it.
        """
        q = cls.get_queryset(request)
        obj = await q.filter(id=obj_id).first()
        await cls.check_permissions(request, obj)
        return obj

    async def list_objects(self, request: Request, page: int = 1):
        """
        Return a paginated list of objects.
        """
        await self.check_permissions(request, allow_empty=True)
        query = self.get_queryset(request)
        return await paginate(query, self.list_schema or self.schema, page, self.page_size)

    async def retrieve_object(self, obj_id: int, request: Request):
        """
        Retrieve a single object by ID and return it as a schema instance.
        """
        obj = await self.get_object(request, obj_id)
        await self.check_permissions(request, obj)
        return await self.schema.from_orm(obj)

    async def create_object(self, request: Request):
        """
        Create a new object based on request data.
        """
        await self.check_permissions(request, allow_empty=True)
        data = await self.get_data(request)
        return await self.response(self.schema.create_from_dict, data=data)

    async def update_object(self, obj_id: int, request: Request):
        """
        Update an existing object with request data.
        """
        obj = await self.get_queryset(request).get_or_none(id=obj_id)
        await self.check_permissions(request, obj)
        data = await self.get_data(request)
        return await self.response(self.schema.save_from_dict, obj=obj, data=data)

    async def delete_object(self, obj_id: int, request: Request):
        """
        Delete an object by ID and return a success message.
        """
        obj = await self.get_queryset(request).get_or_none(id=obj_id)
        await self.check_permissions(request, obj)
        await obj.delete()
        return {"detail": _("Deleted successfully")}

    @staticmethod
    def get_client_ip(request: Request) -> str:
        """
        Extract the client's IP address from request headers.
        """
        x_forwarded_for = request.headers.get("X-Forwarded-For")
        if x_forwarded_for:
            ip = x_forwarded_for.split(",")[-1].strip()
        else:
            ip = request.client.host if request.client else "Unknown"
        return ip
