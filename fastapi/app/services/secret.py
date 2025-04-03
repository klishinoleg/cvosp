from dotenv import load_dotenv
import os
import boto3
import json

load_dotenv()


class Secret:
    secrets: dict = {}
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance

    def __init__(self):
        """Intit AWS sectrets if it's possible"""
        aws_secret_name = os.getenv("SECRET_NAME")
        aws_region = os.getenv("AWS_REGION")
        if aws_region and aws_secret_name:
            client = boto3.client("secretsmanager", aws_region)
            secret_value = client.get_secret_value(SecretId=aws_secret_name)
            self.secrets = json.loads(secret_value["SecretString"])
            for key, value in self.secrets.items():
                os.environ.setdefault(key, value)

    def get(self, key):
        return self.secrets.get(key) or os.getenv(key)
