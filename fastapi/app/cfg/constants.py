from tortoise_imagefield import StorageTypes

from app.services.secret import Secret

secret = Secret()

LANGUAGES = secret.get("LANGUAGES").split("|") or "en"
STORAGE_TYPE = StorageTypes.S3_AWS if secret.get("USE_S3") and secret.get("S3_SECRET_KEY") else StorageTypes.LOCAL
