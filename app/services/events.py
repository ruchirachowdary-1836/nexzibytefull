"""Event lifecycle operations for summits and founder meets."""

from datetime import date

from fastapi import HTTPException
from sqlalchemy.orm import Session

from ..models import FounderMeet, Speaker, Summit


def item(obj):
    return {column.name: getattr(obj, column.name) for column in obj.__table__.columns}


def one(db: Session, model, ident):
    value = db.get(model, ident)
    if not value:
        raise HTTPException(404, detail=f"{model.__name__} not found")
    return value


def attach_speakers(db: Session, event, speaker_ids):
    event.speakers = [one(db, Speaker, speaker_id) for speaker_id in speaker_ids]


def event_response(event):
    result = item(event)
    result["status"] = (
        "past" if event.status == "past" or event.date < date.today() else "upcoming"
    )
    result["speakers"] = [item(speaker) for speaker in event.speakers]
    return result


def list_events(db: Session, model, status):
    query = db.query(model)
    if status:
        if status not in ("upcoming", "past"):
            raise HTTPException(422, detail="status must be upcoming or past")
        comparison = (
            model.date >= date.today()
            if status == "upcoming"
            else model.date < date.today()
        )
        query = query.filter(comparison)
    return [event_response(value) for value in query.order_by(model.date)]


def make_event(db: Session, model, body):
    data = body.model_dump(
        exclude={"speaker_ids", "venue", "founder_information", "networking_info"}
    )
    if model is Summit:
        data["venue"] = body.venue
    else:
        data.update(
            founder_information=body.founder_information,
            networking_info=body.networking_info,
        )
    event = model(**data)
    event.status = "upcoming" if event.date >= date.today() else "past"
    attach_speakers(db, event, body.speaker_ids)
    db.add(event)
    db.commit()
    db.refresh(event)
    return event_response(event)


def update_event(db: Session, model, ident, body):
    event = one(db, model, ident)
    data = body.model_dump(exclude={"speaker_ids"})
    for key, value in data.items():
        if value is not None:
            setattr(event, key, value)
    event.status = "upcoming" if event.date >= date.today() else "past"
    attach_speakers(db, event, body.speaker_ids)
    db.commit()
    db.refresh(event)
    return event_response(event)


def event_state(db: Session, model, ident, action):
    event = one(db, model, ident)
    if action in ("publish", "unpublish"):
        event.is_published = action == "publish"
    elif action == "archive":
        event.status = "past"
    db.commit()
    db.refresh(event)
    return event_response(event)
