import datetime as _dt

import pydantic as _pydantic


class _UserBase(_pydantic.BaseModel):
    username: str = _pydantic.Field(min_length=5)
    email: _pydantic.EmailStr

    @_pydantic.validator("username", "email")
    def check_spaces(cls, value: str):
        if value.isspace():
            raise ValueError("Empty spaces is not accepted")
        return value.lstrip().rstrip()


class UserCreate(_UserBase):
    hashed_password: str = _pydantic.Field(min_length=6)

    class Config:
        orm_mode = True


class User(_UserBase):
    id: int

    # created_date: _dt.datetime = _pydantic.Field(default=_dt.datetime.utcnow)
    # last_updated_date: _dt.datetime = _pydantic.Field(default=_dt.datetime.utcnow)
    # is_active: bool
    class Config:
        orm_mode = True
