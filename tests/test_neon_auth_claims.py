import base64
import json
import time

import pytest
from cryptography.hazmat.primitives.asymmetric.ed25519 import Ed25519PrivateKey
from cryptography.hazmat.primitives.serialization import Encoding, PublicFormat
from fastapi.testclient import TestClient

from app.auth import get_current_user
from app.config import settings
from app.database import Base, SessionLocal, engine
from app.main import app
from app.models import User


def _b64(value: bytes) -> str:
    return base64.urlsafe_b64encode(value).rstrip(b"=").decode()


def _token(private_key: Ed25519PrivateKey, claims: dict) -> str:
    header = _b64(json.dumps({"alg": "EdDSA", "kid": "test-key", "typ": "JWT"}, separators=(",", ":")).encode())
    payload = _b64(json.dumps(claims, separators=(",", ":")).encode())
    signing_input = f"{header}.{payload}".encode()
    return f"{header}.{payload}.{_b64(private_key.sign(signing_input))}"


@pytest.fixture()
def neon_profile_auth(monkeypatch):
    Base.metadata.create_all(engine)
    db = SessionLocal()
    email = "neon-claims@example.com"
    db.query(User).filter(User.email == email).delete()
    db.query(User).filter(User.neon_auth_user_id == "neon-user-claims").delete()
    db.add(User(name="Neon Claims User", email=email, is_active=False, email_verified=False, password_hash=None))
    db.commit()
    db.close()

    private_key = Ed25519PrivateKey.generate()
    public_key = private_key.public_key().public_bytes(Encoding.Raw, PublicFormat.Raw)
    monkeypatch.setattr(settings, "neon_auth_jwks_url", "https://example.test/jwks.json")
    monkeypatch.setattr(settings, "neon_auth_issuer", "https://example.test/auth")
    monkeypatch.setattr(settings, "neon_auth_audience", None)
    monkeypatch.setattr(
        "app.auth._neon_keys",
        lambda _url: [{"kid": "test-key", "kty": "OKP", "crv": "Ed25519", "x": _b64(public_key)}],
    )
    app.dependency_overrides.clear()
    yield private_key, email
    app.dependency_overrides.clear()


def _claims(email: str, verification_claim: dict) -> dict:
    return {
        "iss": "https://example.test/auth",
        "sub": "neon-user-claims",
        "email": email,
        "exp": time.time() + 300,
        **verification_claim,
    }


def test_users_me_accepts_verified_email_password_login(neon_profile_auth):
    private_key, email = neon_profile_auth
    response = TestClient(app).get(
        "/users/me",
        headers={"Authorization": f"Bearer {_token(private_key, _claims(email, {'emailVerified': True}))}"},
    )
    assert response.status_code == 200


@pytest.mark.parametrize("verification_claim", [{"emailVerified": False}, {}])
def test_users_me_rejects_unverified_email_password_login(neon_profile_auth, verification_claim):
    private_key, email = neon_profile_auth
    response = TestClient(app).get(
        "/users/me",
        headers={"Authorization": f"Bearer {_token(private_key, _claims(email, verification_claim))}"},
    )
    assert response.status_code == 401
    assert response.json()["detail"] == "Email verification is required before accessing this account"
    with SessionLocal() as db:
        user = db.query(User).filter_by(neon_auth_user_id="neon-user-claims").one()
        assert user.email_verified is False
        assert user.is_active is False


def test_users_me_syncs_verified_user_row_on_first_login(neon_profile_auth):
    private_key, _ = neon_profile_auth
    email = "new-neon-user@example.com"
    response = TestClient(app).get(
        "/users/me",
        headers={"Authorization": f"Bearer {_token(private_key, _claims(email, {'emailVerified': True}))}"},
    )
    assert response.status_code == 200
    with SessionLocal() as db:
        user = db.query(User).filter_by(neon_auth_user_id="neon-user-claims").one()
        assert user.email == email
        assert user.neon_auth_user_id == "neon-user-claims"
        assert user.email_verified is True
        assert user.is_active is True


def test_users_me_accepts_google_style_verified_claim(neon_profile_auth):
    private_key, _ = neon_profile_auth
    email = "google-user@example.com"
    response = TestClient(app).get(
        "/users/me",
        headers={
            "Authorization": f"Bearer {_token(private_key, _claims(email, {'emailVerified': True, 'provider': 'google'}))}"
        },
    )

    assert response.status_code == 200
    with SessionLocal() as db:
        user = db.query(User).filter_by(neon_auth_user_id="neon-user-claims").one()
        assert user.email == email
        assert user.email_verified is True
        assert user.is_active is True


def test_users_me_rejects_expired_and_not_yet_valid_tokens(neon_profile_auth):
    private_key, email = neon_profile_auth
    expired = _claims(email, {"emailVerified": True, "exp": time.time() - 1})
    not_yet_valid = _claims(
        email, {"emailVerified": True, "nbf": time.time() + 300}
    )
    for claims in (expired, not_yet_valid):
        response = TestClient(app).get(
            "/users/me",
            headers={"Authorization": f"Bearer {_token(private_key, claims)}"},
        )
        assert response.status_code == 401


def test_users_me_enforces_configured_audience(neon_profile_auth, monkeypatch):
    private_key, email = neon_profile_auth
    monkeypatch.setattr(settings, "neon_auth_audience", "techtalk-api")
    valid = _claims(email, {"emailVerified": True, "aud": "techtalk-api"})
    invalid = _claims(email, {"emailVerified": True, "aud": "another-api"})
    assert TestClient(app).get(
        "/users/me",
        headers={"Authorization": f"Bearer {_token(private_key, valid)}"},
    ).status_code == 200
    assert TestClient(app).get(
        "/users/me",
        headers={"Authorization": f"Bearer {_token(private_key, invalid)}"},
    ).status_code == 401
