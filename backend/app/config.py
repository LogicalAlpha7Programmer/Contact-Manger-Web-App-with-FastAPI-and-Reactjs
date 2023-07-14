from pydantic import BaseSettings, EmailStr

class Settings(BaseSettings):
    app_name: str = "ERP API"
    admin_email: EmailStr

Settings = Settings()