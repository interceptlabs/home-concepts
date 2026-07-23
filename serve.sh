#!/usr/bin/env bash
# Intercept homepage concepts — local review server
cd "$(dirname "$0")"
echo "Serving http://localhost:4340 (gallery + concepts)"
exec python3 -m http.server 4340
