import asyncio
import json
import logging
import time
import uuid
from collections import Counter
from contextvars import ContextVar

from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response

request_id_context: ContextVar[str] = ContextVar("request_id", default="")
request_metrics: Counter[tuple[str, str]] = Counter()


class JsonFormatter(logging.Formatter):
    def format(self, record: logging.LogRecord) -> str:
        payload = {
            "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime(record.created)),
            "level": record.levelname,
            "logger": record.name,
            "message": record.getMessage(),
        }
        request_id = request_id_context.get()
        if request_id:
            payload["request_id"] = request_id
        for key in ("method", "path", "status_code", "duration_ms"):
            if hasattr(record, key):
                payload[key] = getattr(record, key)
        return json.dumps(payload, separators=(",", ":"))


def configure_logging() -> None:
    handler = logging.StreamHandler()
    handler.setFormatter(JsonFormatter())
    root = logging.getLogger()
    root.handlers.clear()
    root.addHandler(handler)
    root.setLevel(logging.INFO)


class ObservabilityMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next) -> Response:
        request_id = request.headers.get("X-Request-ID") or str(uuid.uuid4())
        token = request_id_context.set(request_id)
        started = time.perf_counter()
        status_code = 500
        try:
            response = await call_next(request)
            status_code = response.status_code
            response.headers["X-Request-ID"] = request_id
            return response
        except Exception:
            logging.getLogger("http").exception("request_failed")
            raise
        finally:
            duration_ms = round((time.perf_counter() - started) * 1000, 2)
            request_metrics[(request.method, request.url.path)] += 1
            logging.getLogger("http").info(
                "request_complete",
                extra={
                    "method": request.method,
                    "path": request.url.path,
                    "status_code": status_code,
                    "duration_ms": duration_ms,
                },
            )
            request_id_context.reset(token)


class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next) -> Response:
        response = await call_next(request)
        response.headers.setdefault("X-Content-Type-Options", "nosniff")
        response.headers.setdefault("X-Frame-Options", "DENY")
        response.headers.setdefault("Referrer-Policy", "strict-origin-when-cross-origin")
        response.headers.setdefault("Permissions-Policy", "camera=(), microphone=(), geolocation=()")
        return response


def metrics_text() -> str:
    lines = [
        "# HELP http_requests_total Total HTTP requests.",
        "# TYPE http_requests_total counter",
    ]
    for (method, path), count in sorted(request_metrics.items()):
        safe_method = method.replace('"', "")
        safe_path = path.replace("\\", "\\\\").replace('"', '\\"')
        lines.append(
            f'http_requests_total{{method="{safe_method}",path="{safe_path}"}} {count}'
        )
    return "\n".join(lines) + "\n"


async def run_cleanup(stop_event: asyncio.Event, cleanup, interval_seconds: int) -> None:
    while not stop_event.is_set():
        try:
            cleanup()
        except Exception:
            logging.getLogger("cleanup").exception("background_cleanup_failed")
        try:
            await asyncio.wait_for(stop_event.wait(), timeout=interval_seconds)
        except asyncio.TimeoutError:
            continue
