import json
import os
from dotenv import load_dotenv
from tortoise import Tortoise
import boto3

load_dotenv()


class Secret:
    secrets: dict = {}

    def __init__(self):
        """Intit AWS sectrets if it's possible"""
        aws_secret_name = os.getenv("SECRET_NAME")
        aws_region = os.getenv("AWS_REGION")
        if aws_region and aws_secret_name:
            client = boto3.client("secretsmanager", aws_region)
            secret_value = client.get_secret_value(SecretId=aws_secret_name)
            self.secrets = json.loads(secret_value["SecretString"])

    def get(self, key):
        return self.secrets.get(key) or os.getenv(key)


secrets = Secret()

DB_USER = secrets.get('POSTGRES_USER')
DB_PASSWORD = secrets.get('POSTGRES_PASSWORD')
DB_NAME = secrets.get('DB_NAME')
DB_HOST = secrets.get('DB_HOST')
DB_PORT = secrets.get('DB_PORT')

DATABASE_URL = f"postgres://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

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
