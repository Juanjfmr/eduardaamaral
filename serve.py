import http.server, socketserver, os, sys

PORT = 8123

class Handler(http.server.SimpleHTTPRequestHandler):
    extensions_map = {
        **http.server.SimpleHTTPRequestHandler.extensions_map,
        ".js": "text/javascript",
        ".css": "text/css",
        ".woff2": "font/woff2",
        ".svg": "image/svg+xml",
    }

    def end_headers(self):
        self.send_header("Cache-Control", "no-store, no-cache, must-revalidate")
        self.send_header("Pragma", "no-cache")
        super().end_headers()

    def log_message(self, fmt, *args):
        sys.stderr.write("%s - %s\n" % (self.address_string(), fmt % args))
        sys.stderr.flush()


class ThreadingHTTPServer(socketserver.ThreadingMixIn, http.server.HTTPServer):
    daemon_threads = True
    allow_reuse_address = True
    request_queue_size = 32


os.chdir(os.path.dirname(os.path.abspath(__file__)))
with ThreadingHTTPServer(("127.0.0.1", PORT), Handler) as httpd:
    httpd.timeout = 30
    Handler.timeout = 60
    sys.stderr.write("SERVING http://127.0.0.1:%s\n" % PORT)
    sys.stderr.flush()
    httpd.serve_forever()
