import fastapi as _fastapi
import fastapi.security as _security
import sqlalchemy.orm as _orm

from . import schemas as _schemas

from . import service as _service
from .. import app_service

router = _fastapi.APIRouter(prefix="/users", tags=["user"])


@router.post("/token")
async def generate_token(
    # res: _fastapi.Response,
    form_data: _security.OAuth2PasswordRequestForm = _fastapi.Depends(),
    db: _orm.Session = _fastapi.Depends(app_service.get_db),
):
    user = await _service.authenticate_user(
        username_or_email=form_data.username, password=form_data.password, db=db
    )

    if not user:
        raise _fastapi.HTTPException(status_code=401, detail="Invalid Credentials")

    token = await _service.create_token(user=user)
    # res.set_cookie("token", tsoken["access_token"])

    return token


@router.get("/user")
async def get_user(user: _schemas.User = _fastapi.Depends(_service.current_user)):
    return {"username": user.username, "email": user.email}


# @router.get("/author")
# async def get_user(req:_fastapi.Request, db:_orm.Session = _fastapi.Depends(app_service.get_db)):
#     user = await _service.verify_token_get_user(req=req, db=db)
#     return user


@router.post("/")
async def create_user(
    # res: _fastapi.Response,
    user: _schemas.UserCreate,
    db: _orm.Session = _fastapi.Depends(app_service.get_db),
):
    db_user1 = await _service.get_user_by_email(email=user.email, db=db)
    db_user2 = await _service.get_user_by_username(username=user.username, db=db)
    if db_user1 or db_user2:
        raise _fastapi.HTTPException(
            status_code=400, detail="Email or username already in use"
        )

    user = await _service.create_user(user, db)

    token = await _service.create_token(user)
    # res.set_cookie("token", token["access_token"])
    return token
