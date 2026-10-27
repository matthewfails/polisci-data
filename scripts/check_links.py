#!/usr/bin/env python3
"""Check every URL in site/data/sources.yaml.

Usage:  python3 scripts/check_links.py

Reports three kinds of result:
  DEAD      404/410, DNS failure, or timeout: fix or remove the link.
  MOVED     the link now redirects to a different website: check it in a
            browser. Domains that lapse are sometimes bought by spammers
            (this happened to congressionalbills.org).
  BLOCKED   403/429/503: the site blocks automated checkers. Almost always
            fine; open it in a browser if you're unsure.
Exits with status 1 if anything is DEAD or MOVED, so the monthly GitHub
Action fails and emails you.
"""
import re
import sys
import urllib.error
import urllib.request
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
from urllib.parse import urlparse

SOURCES = Path(__file__).resolve().parent.parent / "site" / "data" / "sources.yaml"
UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36"

# Redirects between these are expected and not worth flagging.
SAME_SITE = [
    ("worldbank.org",), ("oecd.org", "oecd-ilibrary.org"), ("un.org",),
    ("census.gov",), ("europa.eu",), ("start.umd.edu",),
]


def base_domain(host):
    parts = (host or "").lower().removeprefix("www.").split(".")
    return ".".join(parts[-2:])


def same_site(a, b):
    a, b = base_domain(a), base_domain(b)
    if a == b:
        return True
    return any(a in group and b in group for group in SAME_SITE)


def check(url):
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept": "text/html,*/*"})
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            final = resp.geturl()
            # DOI links always redirect to the publisher; that's expected.
            if base_domain(urlparse(url).hostname) != "doi.org" and not same_site(urlparse(url).hostname, urlparse(final).hostname):
                return "MOVED", url, f"now goes to {final}"
            return "OK", url, ""
    except urllib.error.HTTPError as e:
        if e.code in (401, 403, 429, 503, 202):
            return "BLOCKED", url, f"HTTP {e.code}"
        return "DEAD", url, f"HTTP {e.code}"
    except Exception as e:  # DNS failure, timeout, TLS error
        return "DEAD", url, type(e).__name__ + ": " + str(e)[:80]


def main():
    # Skip comment lines (the template at the top of the file has example URLs).
    text = "\n".join(l for l in SOURCES.read_text(encoding="utf-8").splitlines() if not l.lstrip().startswith("#"))
    urls = sorted(set(re.findall(r'url:\s*"?(https?://[^"\s}]+)', text)))
    print(f"Checking {len(urls)} links in {SOURCES.name}…\n")
    with ThreadPoolExecutor(max_workers=12) as pool:
        results = list(pool.map(check, urls))
    for kind in ("DEAD", "MOVED", "BLOCKED"):
        rows = [r for r in results if r[0] == kind]
        if rows:
            print(f"{kind} ({len(rows)})")
            for _, url, why in rows:
                print(f"  {url}\n      {why}")
            print()
    ok = sum(r[0] == "OK" for r in results)
    print(f"{ok} OK, {len(results) - ok} need a look (BLOCKED ones are usually fine).")
    sys.exit(1 if any(r[0] in ("DEAD", "MOVED") for r in results) else 0)


if __name__ == "__main__":
    main()
