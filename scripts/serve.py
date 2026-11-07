"""Local preview server for the Zeotrope site.

    python scripts/serve.py          then open http://localhost:8000
    python scripts/serve.py 9000     use a different port

It works like GitHub Pages: /tour is served from tour.html, /bio from bio.html, and so on.
Python's built-in `http.server` alone does not do that, so the nav links would 404.
Only uses Python's standard library, so there is nothing to install.
"""
import os
import sys
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

SITE_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))  # the folder above scripts/


class CleanUrlHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=SITE_ROOT, **kwargs)

    def translate_path(self, path):
        translated = super().translate_path(path)
        # "/tour" -> tour.html, like GitHub Pages. A trailing slash or a real file wins.
        wants_folder = path.split("?", 1)[0].endswith("/")
        if not wants_folder and not os.path.isfile(translated) and os.path.isfile(translated + ".html"):
            return translated + ".html"
        return translated


if __name__ == "__main__":
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8000
    with ThreadingHTTPServer(("127.0.0.1", port), CleanUrlHandler) as server:
        print(f"Serving the site at http://localhost:{port}  (Ctrl+C to stop)")
        try:
            server.serve_forever()
        except KeyboardInterrupt:
            print("\nStopped.")
