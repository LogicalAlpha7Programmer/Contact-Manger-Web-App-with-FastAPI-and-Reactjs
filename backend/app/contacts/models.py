import sqlalchemy as _sql
import sqlalchemy.orm as _orm
from .. import database as _db
import datetime as dt


class Contact(_db.Base):
    __tablename__ = "contacts"
    id = _sql.Column(_sql.Integer, primary_key=True, index=True)
    user_id = _sql.Column(_sql.Integer, _sql.ForeignKey("users.id"))
    email = _sql.Column(_sql.String, index=True, nullable=True)
    first_name = _sql.Column(_sql.String, index=True, nullable=True)
    last_name = _sql.Column(_sql.String, index=True, nullable=True)
    phone_no = _sql.Column(_sql.String, index=True, nullable=True)
    created_date = _sql.Column(_sql.DateTime, default=dt.datetime.utcnow)

    # status = _sql.Column(_sql.String, index=True)

    user = _orm.relationship("User", back_populates="contacts")
