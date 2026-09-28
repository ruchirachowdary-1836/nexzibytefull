from types import SimpleNamespace

import pytest
from fastapi import HTTPException
from sqlalchemy.exc import SQLAlchemyError

from app.main import user_profile_payload
from app.observability import request_id_context


class FailingProfileQuery:
    def query(self, _model):
        raise SQLAlchemyError("simulated related-table query failure")


def test_profile_related_query_failure_is_logged_and_returns_clear_service_error(monkeypatch):
    logged = []
    monkeypatch.setattr(
        "app.main.logger.exception",
        lambda message, **kwargs: logged.append((message, kwargs)),
    )
    request_token = request_id_context.set("profile-query-request-id")
    try:
        with pytest.raises(HTTPException) as error:
            user_profile_payload(SimpleNamespace(id=123), FailingProfileQuery())
    finally:
        request_id_context.reset(request_token)

    assert error.value.status_code == 503
    assert error.value.detail == (
        "Member profile data is temporarily unavailable. Please try again shortly."
    )
    assert logged == [
        (
            "user_profile_query_failed",
            {"extra": {"request_id": "profile-query-request-id"}},
        )
    ]
