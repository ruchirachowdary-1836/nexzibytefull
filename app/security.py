import hashlib
import base64
import hmac
import json
import secrets
import binascii
import threading
import time
from datetime import datetime
from collections import defaultdict, deque
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen

from .config import settings


def sign_pass_payload(pass_id: str, expires_at) -> str:
    """Create a compact, tamper-evident QR payload."""
    payload = {"v": 1, "pid": pass_id, "exp": int(expires_at.timestamp()) if expires_at else None,
               "nonce": secrets.token_urlsafe(12)}
    encoded = base64.urlsafe_b64encode(
        json.dumps(payload, separators=(",", ":"), sort_keys=True).encode()
    ).decode().rstrip("=")
    secret = (settings.pass_qr_secret or settings.jwt_secret).encode()
    signature = hmac.new(secret, encoded.encode(), hashlib.sha256).hexdigest()
    return f"techtalk:pass:{encoded}.{signature}"


def validate_pass_payload(value: str) -> dict:
    if not value.startswith("techtalk:pass:"):
        raise ValueError("Invalid pass payload")
    try:
        encoded, signature = value.removeprefix("techtalk:pass:").rsplit(".", 1)
        secret = (settings.pass_qr_secret or settings.jwt_secret).encode()
        expected = hmac.new(secret, encoded.encode(), hashlib.sha256).hexdigest()
        if not hmac.compare_digest(signature, expected):
            raise ValueError("Invalid pass signature")
        decoded = base64.urlsafe_b64decode(encoded + "=" * (-len(encoded) % 4))
        payload = json.loads(decoded)
        if not isinstance(payload, dict):
            raise ValueError("Invalid pass payload")
        if payload.get("v") != 1 or not payload.get("pid") or not payload.get("nonce"):
            raise ValueError("Invalid pass payload")
        if payload.get("exp") is not None and int(payload["exp"]) <= int(datetime.utcnow().timestamp()):
            raise ValueError("Pass has expired")
        return payload
    except (ValueError, KeyError, TypeError, AttributeError, OverflowError, json.JSONDecodeError, binascii.Error) as exc:
        raise ValueError("Invalid pass payload") from exc


generate_pass_qr_payload = sign_pass_payload
validate_pass_qr_payload = validate_pass_payload

_attempts: defaultdict[str, deque[float]] = defaultdict(deque)
_lock = threading.Lock()

def rate_limit(key: str, limit: int, window: int = 60) -> bool:
    now = time.monotonic()
    with _lock:
        bucket = _attempts[key]
        while bucket and bucket[0] <= now - window:
            bucket.popleft()
        if len(bucket) >= limit:
            return False
        bucket.append(now)
        return True

def password_policy(password: str) -> None:
    if len(password) < settings.password_min_length:
        raise ValueError(f'Password must be at least {settings.password_min_length} characters.')
    if password.lower() == password or password.upper() == password or not any(c.isdigit() for c in password):
        raise ValueError('Password must include upper-case, lower-case, and a number.')
    if settings.hibp_enabled:
        digest = hashlib.sha1(password.encode()).hexdigest().upper()
        try:
            req = Request(f'https://api.pwnedpasswords.com/range/{digest[:5]}', headers={'User-Agent': 'TechTalk password checker'})
            with urlopen(req, timeout=settings.hibp_timeout_seconds) as response:
                suffixes = response.read().decode('ascii', errors='ignore').splitlines()
            if any(line.split(':', 1)[0] == digest[5:] for line in suffixes if ':' in line):
                raise ValueError('This password has appeared in a data breach. Choose another password.')
        except ValueError:
            raise
        except (HTTPError, URLError, TimeoutError, OSError):
            # Availability of HIBP must never prevent account creation.
            pass
