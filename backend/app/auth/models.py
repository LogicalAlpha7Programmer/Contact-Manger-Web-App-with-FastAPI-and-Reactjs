import datetime as _dt

import sqlalchemy as _sql
import sqlalchemy.orm as _orm
import passlib.hash as _hash

from .. import database as _database


class User(_database.Base):
    __tablename__ = "users"
    id = _sql.Column(_sql.Integer, primary_key=True, index=True)
    username = _sql.Column(_sql.String, unique=True, index=True)
    email = _sql.Column(_sql.String, unique=True, index=True)
    hashed_password = _sql.Column(_sql.String)
    created_datetime = _sql.Column(_sql.DateTime, default=_dt.datetime.utcnow)
    # last_updated_datetime = _sql.Column(_sql.DateTime, default=_dt.datetime.utcnow)

    contacts = _orm.relationship("Contact", back_populates="user")

    def verify_password(self, password: str):
        return _hash.bcrypt.verify(password, self.hashed_password)
