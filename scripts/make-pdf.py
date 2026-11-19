"""Render Civic Paper No. 01 to PDF from the built page, using its print stylesheet.
Run: npm run pdf   (needs Python Playwright and Chromium; fonts: Gelasio and Liberation Sans stand in for Georgia and Arial)
"""
import http.server, socketserver, threading, functools, pathlib, sys
from playwright.sync_api import sync_playwright

ROOT = pathlib.Path(__file__).resolve().parent.parent / "public"
OUT = ROOT / "water" / "lis-civic-paper-01-water.pdf"

handler = functools.partial(http.server.SimpleHTTPRequestHandler, directory=str(ROOT))
handler.log_message = lambda *a: None
socketserver.TCPServer.allow_reuse_address = True
httpd = socketserver.TCPServer(("127.0.0.1", 0), handler)
PORT = httpd.server_address[1]
threading.Thread(target=httpd.serve_forever, daemon=True).start()

import re
_model = (ROOT / "assets" / "water" / "model.js").read_text()
VERSION = re.search(r"VERSION = '([^']+)'", _model).group(1)
CHECKED = re.search(r"CHECKED = '([^']+)'", _model).group(1)

FOOT = ('<div style="width:100%;font:7.5pt Arial,Liberation Sans,sans-serif;color:#56615c;padding:0 19mm;display:flex;justify-content:space-between">'
        f'<span>Leeds Intelligence Society &nbsp;·&nbsp; Civic Paper No. 01 &nbsp;·&nbsp; The Leeds Water Guarantee &nbsp;·&nbsp; Draft v{VERSION} &nbsp;·&nbsp; Facts checked {CHECKED}</span>'
        '<span><span class="pageNumber"></span> / <span class="totalPages"></span></span></div>')

try:
    with sync_playwright() as p:
        kwargs = {}
        for exe in ("/usr/bin/google-chrome", "/usr/bin/chromium"):
            if pathlib.Path(exe).exists(): kwargs["executable_path"] = exe; break
        b = p.chromium.launch(**kwargs)
        pg = b.new_page()
        pg.goto(f"http://127.0.0.1:{PORT}/water/", wait_until="networkidle")
        pg.emulate_media(media="print")
        pg.pdf(path=str(OUT), format="A4", print_background=True, prefer_css_page_size=True,
               display_header_footer=True, header_template="<span></span>", footer_template=FOOT,
               margin={"top": "20mm", "bottom": "22mm", "left": "19mm", "right": "19mm"})
        b.close()
    print("Wrote", OUT.relative_to(ROOT.parent), f"({OUT.stat().st_size // 1024} KB)")
finally:
    httpd.shutdown()
    httpd.server_close()
