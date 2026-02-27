from pydantic_settings import BaseSettings
from functools import lru_cache
import os


class Settings(BaseSettings):
    openai_api_key: str = ""
    embedding_model: str = "openai"
    llm_model: str = "gpt-4o-mini"
    chroma_persist_dir: str = "./chroma_db"
    upload_dir: str = "./uploads"
    allowed_origins: str = "http://localhost:3000"
    max_file_size_mb: int = 50

    class Config:
        env_file = ".env"


@lru_cache()
def get_settings() -> Settings:
    return Settings()
