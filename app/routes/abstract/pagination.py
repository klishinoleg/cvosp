from tortoise.queryset import QuerySet
from pydantic import BaseModel
from typing import Type, TypeVar, List, Dict, Any
from fastapi import HTTPException
from app.models.abstract.base import _

# Define a generic type variable bound to Pydantic BaseModel
T = TypeVar("T", bound=BaseModel)


async def paginate(query: QuerySet, schema: Type[T], page: int, page_size: int) -> Dict[str, Any] or List[T]:
    """
    Paginate a Tortoise QuerySet and return paginated results as a dictionary.

    :param query: QuerySet to be paginated.
    :param schema: Pydantic schema used for serialization.
    :param page: The page number requested.
    :param page_size: The number of items per page. If 0, return all results.
    :return: A dictionary containing pagination metadata and the paginated results.
    """

    if page_size == 0:
        # If page_size is 0, return all objects without pagination.
        objects = await query.all()
        return [await schema.from_orm(obj) for obj in objects]
    else:
        # Count the total number of objects in the query.
        total_count = await query.count()
        # Calculate the total number of pages.
        total_pages = (total_count + page_size - 1) // page_size

        if total_pages == 0:
            results = []
        else:
            # Validate page number
            if page < 1 or (page - 1) * page_size > total_pages:
                raise HTTPException(status_code=400, detail=_("Invalid page number"))

            # Fetch the paginated objects
            objects = await query.offset((page - 1) * page_size).limit(page_size)
            results = [await schema.from_orm(obj) for obj in objects]

        # Return pagination metadata along with the results
        return {
            "count": total_count,
            "total_pages": total_pages,
            "page": page,
            "page_size": page_size,
            "results": results
        }
