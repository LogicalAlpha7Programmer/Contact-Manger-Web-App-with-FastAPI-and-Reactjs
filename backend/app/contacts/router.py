from fastapi import APIRouter, Depends, HTTPException, Request
import sqlalchemy.orm as _orm
from typing import List

from . import schemas as _schemas, service as _service
from ..auth import schemas as authSchemas, service as authService
from .. import app_service

router = APIRouter(prefix="/contacts", tags=["Contact"])


@router.post("/")
async def create_contact(
    contact: _schemas.ContactCreate,
    db: _orm.Session = Depends(app_service.get_db),
    user: authSchemas.User = Depends(authService.current_user),
):
    contact_query = await _service.get_contact_by_detail(
        contact=contact, db=db, user=user
    )

    if contact_query:
        return HTTPException(status_code=400, detail="contact already created!")
    return await _service.create_contact(user=user, db=db, contact=contact)


# @router.get("/", response_model=List[_schemas.Contact])
@router.get("/")
async def get_contacts(
    db: _orm.Session = Depends(app_service.get_db),
    user: authSchemas.User = Depends(authService.current_user),
):
    return await _service.get_contacts(user=user, db=db)


@router.get("/{contact_id}", status_code=200)
async def get_contact(
    contact_id: int,
    db: _orm.Session = Depends(app_service.get_db),
    user: authSchemas.User = Depends(authService.current_user),
):
    return await _service.get_contact(
        contact_id=contact_id, user=user, db=db, for_router=True
    )


@router.delete("/{contact_id}", status_code=200)
async def delete_contact(
    contact_id: int,
    db: _orm.Session = Depends(app_service.get_db),
    user: authSchemas.User = Depends(authService.current_user),
):
    await _service.delete_contact(contact_id=contact_id, user=user, db=db)
    return {"message": f"contact deleted succesfully"}


@router.put("/{contact_id}")
async def update_contact(
    contact_id: int,
    contact: _schemas.ContactCreate,
    db: _orm.Session = Depends(app_service.get_db),
    user: authSchemas.User = Depends(authService.current_user),
):
    await _service.update_contact(
        contact_id=contact_id, user=user, db=db, contactSchema=contact
    )
    return {"message": f"updated id:{contact_id} successfully"}
