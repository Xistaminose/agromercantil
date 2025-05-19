import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text

from app.api.api import api_router
from app.core.config import settings
from app.db.session import engine, Base
from app.commands.user_seeder import seed_admin_user
from app.commands.state_seeder import seed_states
from app.commands.product_seeder import seed_products
from app.commands.region_seeder import seed_regions

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

origins = settings.CORS_ORIGINS

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix=settings.API_V1_STR)

@app.on_event("startup")
async def initialize_data():
    seed_admin_user()
    seed_states()
    seed_products()
    seed_regions()

@app.get("/")
def root():
    return {"message": "Bem-vindo à AgroMercantil API. Acesse /docs para a documentação."} 