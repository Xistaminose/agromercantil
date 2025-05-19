from fastapi import APIRouter

from app.api.endpoints import auth, users, clients, quotes

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(clients.router, prefix="/clients", tags=["clients"])
api_router.include_router(quotes.router, prefix="/quotes", tags=["quotes"]) 