from fastapi import FastAPI
from fastadmin import fastapi_app as admin_app
from app.cfg.database import init_db
import app.admin as admin

app = FastAPI()
app.add_event_handler("startup", init_db)
app.mount("/admin", admin_app, name="admin")


@app.get("/")
async def root():
    return {"message": "Hello World"}


@app.get("/hello/{name}")
async def say_hello(name: str):
    return {"message": f"Hello {name}"}
