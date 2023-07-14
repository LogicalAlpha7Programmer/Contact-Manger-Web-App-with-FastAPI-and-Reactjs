from pydantic import BaseModel, EmailStr, validator, Field


class ContactBase(BaseModel):
    email: EmailStr
    first_name: str
    last_name: str
    phone_no: str = Field(
        regex="^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$"
    )

    @validator("first_name", "last_name", "email", "phone_no")
    def check_spaces(cls, value: str, field: str):
        if value.strip() != "" and (" " in value and value.isspace()):
            raise ValueError(f"{field} is invalid!")
        return value

    @validator("first_name", "last_name")
    def check_names(cls, value: str, field: str):
        if value.strip() != "" and not value.isalpha():
            raise ValueError(f"{field} is invalid!")
        return value


class ContactCreate(ContactBase):
    pass


class Contact(ContactBase):
    id: int

    class Config:
        orm_mode = True
