import sqlalchemy.orm as _orm
from fastapi import HTTPException, Request
import sqlalchemy as _sql

# from typing import List
from . import schemas as _schemas, models as _models
from ..auth import schemas as authSchemas, service as authService


async def get_contact_by_detail(
    contact: _schemas.ContactCreate, db: _orm.Session, user: authSchemas.User
):
    return (
        db.query(_models.Contact)
        .filter_by(user_id=user.id)
        .filter(
            _models.Contact.email == contact.email,
            _models.Contact.phone_no == contact.phone_no,
        )
        .first()
    )


async def create_contact(
    user: authSchemas.User, db: _orm.Session, contact: _schemas.ContactCreate
):
    contact = _models.Contact(**contact.dict(), user_id=user.id)

    db.add(contact)
    db.commit()
    db.refresh(contact)

    return _schemas.Contact.from_orm(contact)


async def get_contacts(user: authSchemas.User, db: _orm.Session):
    contacts = db.query(_models.Contact).filter_by(user_id=user.id)
    return list(map(_schemas.Contact.from_orm, contacts))


async def get_contact(
    contact_id: int, user: authSchemas.User, db: _orm.Session, for_router: bool = False
):
    contact = (
        db.query(_models.Contact)
        .filter_by(user_id=user.id)
        .filter(_models.Contact.id == contact_id)
    )

    if contact is None:
        raise HTTPException(status_code=404, detail="contact not found")
    if for_router == True:
        return _schemas.Contact.from_orm(contact.first())
    elif for_router == False:
        return contact


async def delete_contact(user: authSchemas.User, db: _orm.Session, contact_id: int):
    contact = await get_contact(contact_id=contact_id, user=user, db=db)
    db.delete(contact.first())
    db.commit()


async def update_contact(
    user: authSchemas.User,
    db: _orm.Session,
    contact_id: int,
    contactSchema: _schemas.ContactCreate,
):
    contact = await get_contact(contact_id=contact_id, user=user, db=db)
    contact.update(
        {
            "first_name": contactSchema.first_name,
            "last_name": contactSchema.last_name,
            "email": contactSchema.email,
            "phone_no": contactSchema.phone_no,
        }
    )
    db.commit()
