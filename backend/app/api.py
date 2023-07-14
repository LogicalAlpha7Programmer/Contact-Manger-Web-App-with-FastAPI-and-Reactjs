from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .auth import router as authRouter
from .contacts import router as contactRouter
from .app_service import create_database

create_database()

app = FastAPI(title="Contact_list_app API")

origins = ["http://localhost:3001"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(authRouter.router)
app.include_router(contactRouter.router)
