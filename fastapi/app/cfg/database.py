from tortoise import Tortoise

from app.services.secret import Secret

secrets = Secret()

DB_USER = secrets.get('DB_USER')
DB_PASSWORD = secrets.get('DB_PASSWORD')
DB_NAME = secrets.get('DB_NAME')
DB_HOST = secrets.get('DB_HOST')
DB_PORT = secrets.get('DB_PORT')

DATABASE_URL = f"postgres://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}?sslmode=disable"

TORTOISE_ORM = {
    "connections": {"default": DATABASE_URL},
    "apps": {
        "models": {
            "models": ["app.models", "aerich.models"],
            "default_connection": "default",
        },
    },
    "use_tz": False,
    "timezone": "UTC",
}


async def init_db():
    await Tortoise.init(config=TORTOISE_ORM)
    await Tortoise.generate_schemas()
