import os
from typing import Any, Dict, List, Optional, Union
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "AgroMercantil API"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = os.getenv("SECRET_KEY", "changeme_in_production_environment")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8
    
    CORS_ORIGINS: Union[str, List[str]] = os.getenv("CORS_ORIGINS", "http://localhost:3000")
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///data/agromercantil.db")
    
    class Config:
        env_file = ".env"
        case_sensitive = True

    def __init__(self, **values: Any):
        super().__init__(**values)
        
        if isinstance(self.CORS_ORIGINS, str):
            if self.CORS_ORIGINS.startswith("[") and self.CORS_ORIGINS.endswith("]"):
                cors_values = self.CORS_ORIGINS[1:-1].replace("\"", "").replace("'", "").split(",")
                self.CORS_ORIGINS = [origin.strip() for origin in cors_values if origin.strip()]
            else:
                self.CORS_ORIGINS = [origin.strip() for origin in self.CORS_ORIGINS.split(",") if origin.strip()]

settings = Settings() 