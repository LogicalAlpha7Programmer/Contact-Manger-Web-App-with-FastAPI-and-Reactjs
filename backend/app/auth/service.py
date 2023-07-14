import fastapi as _fastapi
import fastapi.security as _security
import jwt as _jwt
import datetime as _dt
import sqlalchemy.orm as _orm
import passlib.hash as _hash

from . import models as _models, schemas as _schemas
from ..app_service import get_db

oauth2schema = _security.OAuth2PasswordBearer(tokenUrl="/users/token")

JWT_SECRET = "m#*@938yjwts364*&^^&34535ger34gecoifjgret"
JWT_ALGORITHM = "HS256"


async def get_user_by_email(email: str, db: _orm.Session):
    return db.query(_models.User).filter(_models.User.email == email).first()


async def get_user_by_username(username: str, db: _orm.Session):
    return db.query(_models.User).filter(_models.User.username == username).first()


async def create_user(user: _schemas.UserCreate, db: _orm.Session):
    user_obj = _models.User(
        username=user.username,
        email=user.email,
        hashed_password=_hash.bcrypt.hash(user.hashed_password),
    )
    db.add(user_obj)
    db.commit()
    db.refresh(user_obj)
    return user_obj


async def authenticate_user(username_or_email: str, password: str, db: _orm.Session):
    user = await get_user_by_email(db=db, email=username_or_email)

    if not user:
        user = await get_user_by_username(db=db, username=username_or_email)
        if not user:
            return False

    if not user.verify_password(password):
        return False

    return user


async def create_token(user: _models.User):
    user_obj = _schemas.User.from_orm(user)

    token = _jwt.encode(user_obj.dict(), JWT_SECRET)

    return dict(access_token=token, token_type="bearer")


# async def verify_token_get_user(req: _fastapi.Request, db: _orm.Session): #IMPOrtant
#     token = req.cookies.get("token")
#     try:

#         payload = _jwt.decode(jwt=token, key=JWT_SECRET, algorithms=[JWT_ALGORITHM])

#         user = db.query(_models.User).get(payload["id"])

#     except:
#         raise _fastapi.HTTPException(
#             status_code=401, detail="Not authenticated"
#         )

#     return _schemas.User.from_orm(user)


async def current_user(
    db: _orm.Session = _fastapi.Depends(get_db),
    token: str = _fastapi.Depends(oauth2schema),
):
    try:
        payload = _jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        user = db.query(_models.User).get(payload["id"])
    except:
        raise _fastapi.HTTPException(
            status_code=401, detail="Invalid Email or Password"
        )

    return _schemas.User.from_orm(user)
