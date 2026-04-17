#!/usr/bin/env bash
set -euo pipefail

PORT="${PORT:-8000}"
WEB_CONCURRENCY="${WEB_CONCURRENCY:-2}"

exec gunicorn main:app \
  --worker-class uvicorn.workers.UvicornWorker \
  --workers "${WEB_CONCURRENCY}" \
  --bind "0.0.0.0:${PORT}" \
  --timeout 120 \
  --access-logfile - \
  --error-logfile -
