from starlette.staticfiles import StaticFiles
from tortoise_imagefield import Config

from app.cfg.i18n import *
import app.admin as admin
from app.cfg.database import init_db
import uvicorn
from fastapi import FastAPI
from fastadmin import fastapi_app as admin_app
from app.urls import router
from fastapi18n.middlewares import LocalizationMiddleware
from fastapi.middleware.cors import CORSMiddleware

cfg = Config()

app = FastAPI()
app.add_event_handler("startup", init_db)
if not os.path.exists(cfg.image_dir):
    os.mkdir(cfg.image_dir)
app.mount("/" + cfg.image_url, StaticFiles(directory=cfg.image_dir), name="upload")
app.mount("/admin", admin_app, name="admin")
app.include_router(router)
app.add_middleware(LocalizationMiddleware)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


@app.get("/text/")
async def read_root():
    return {"message": translate("Text")}


if __name__ == "__main__":
    uvicorn.run(app, host="localhost", port=8001)
