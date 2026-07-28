#!/usr/bin/env python3
"""Local review server for the Intercept homepage concepts.

Replaces `python3 -m http.server`, which is single-threaded and has no HTTP
Range support -- <video> elements hold connections open to stream, so a few
of them deadlock the single worker and every request (video or not) then
hangs. This server is threaded (one worker per connection), speaks HTTP/1.1
keep-alive, answers Range requests with 206 (smooth seeking + loop), and
sends no-cache so overwritten assets (same filename, new bytes) are always
re-fetched during review.
"""
import os
import re
import sys
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 4340


class Handler(SimpleHTTPRequestHandler):
    protocol_version = "HTTP/1.1"  # keep-alive so streaming connections reuse

    def end_headers(self):
        # Review server: revalidate so overwritten assets are re-fetched, but
        # DO NOT send `no-store` -- Chrome's media stack must buffer the file
        # to decode/seek, and no-store forbids that and stalls <video>.
        self.send_header("Cache-Control", "no-cache")
        self.send_header("Accept-Ranges", "bytes")
        super().end_headers()

    def do_GET(self):
        rng = self.headers.get("Range")
        if not rng:
            return super().do_GET()
        m = re.match(r"bytes=(\d+)-(\d*)\s*$", rng)
        path = self.translate_path(self.path)
        if not m or not os.path.isfile(path):
            return super().do_GET()

        size = os.path.getsize(path)
        start = int(m.group(1))
        end = int(m.group(2)) if m.group(2) else size - 1
        if start >= size:
            self.send_response(416)
            self.send_header("Content-Range", "bytes */%d" % size)
            self.end_headers()
            return
        end = min(end, size - 1)
        length = end - start + 1

        self.send_response(206)
        self.send_header("Content-Type", self.guess_type(path))
        self.send_header("Content-Range", "bytes %d-%d/%d" % (start, end, size))
        self.send_header("Content-Length", str(length))
        self.end_headers()
        with open(path, "rb") as f:
            f.seek(start)
            remaining = length
            while remaining > 0:
                chunk = f.read(min(64 * 1024, remaining))
                if not chunk:
                    break
                self.wfile.write(chunk)
                remaining -= len(chunk)


if __name__ == "__main__":
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    srv = ThreadingHTTPServer(("", PORT), Handler)
    srv.daemon_threads = True
    print("Serving http://localhost:%d (threaded + Range)" % PORT)
    try:
        srv.serve_forever()
    except KeyboardInterrupt:
        srv.shutdown()
