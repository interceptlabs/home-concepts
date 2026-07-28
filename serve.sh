#!/usr/bin/env bash
# Intercept homepage concepts — local review server
cd "$(dirname "$0")"
# Threaded + Range-request server (see serve.py). Plain `python3 -m http.server`
# is single-threaded and deadlocks once a few <video> streams hold connections.
exec python3 serve.py 4340
