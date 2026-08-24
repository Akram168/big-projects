#!/usr/bin/env python3
"""
IOC threat-intel checker: looks up IPs, domains, and file hashes against
a local JSON blocklist feed, with a pluggable structure for wiring in a
real threat-intel API (AbuseIPDB, VirusTotal, OTX, etc.) later.

Ships with a small illustrative sample feed (feeds/sample_feed.json) so
this runs and gives real results with zero API keys and zero network
calls -- swap in a real feed file (or a live API call in fetch_verdict)
for production use.

Usage:
  python checker.py 185.220.101.7
  python checker.py --file iocs.txt
  python checker.py --feed feeds/sample_feed.json 45.9.20.11
"""

import argparse
import ipaddress
import json
import re
import sys
from pathlib import Path

DEFAULT_FEED = Path(__file__).parent / "feeds" / "sample_feed.json"


def load_feed(path):
    with open(path) as f:
        data = json.load(f)
    # normalize everything to lowercase/stripped for reliable lookups
    return {
        "ips": {k.strip(): v for k, v in data.get("ips", {}).items()},
        "domains": {k.strip().lower(): v for k, v in data.get("domains", {}).items()},
        "hashes": {k.strip().lower(): v for k, v in data.get("hashes", {}).items()},
    }


def classify_ioc(value):
    value = value.strip()
    try:
        ipaddress.ip_address(value)
        return "ip"
    except ValueError:
        pass
    if re.fullmatch(r"[a-fA-F0-9]{32,128}", value):
        return "hash"
    if re.fullmatch(r"[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}", value):
        return "domain"
    return "unknown"


def lookup(value, feed):
    """This is the seam where a real threat-intel API call would go --
    same input/output contract, swap the body for an HTTP request to
    AbuseIPDB/VirusTotal/OTX/etc. and cache the result."""
    ioc_type = classify_ioc(value)
    key = value.strip() if ioc_type != "domain" and ioc_type != "hash" else value.strip().lower()

    if ioc_type == "ip":
        entry = feed["ips"].get(key)
    elif ioc_type == "domain":
        entry = feed["domains"].get(key)
    elif ioc_type == "hash":
        entry = feed["hashes"].get(key)
    else:
        entry = None

    if entry is None:
        return {"ioc": value, "type": ioc_type, "verdict": "unknown", "source": None, "notes": None}

    return {
        "ioc": value, "type": ioc_type, "verdict": "malicious",
        "source": entry.get("source"), "notes": entry.get("notes"),
    }


def print_result(r):
    print(f"\n{r['ioc']}  ({r['type']})")
    if r["verdict"] == "malicious":
        print(f"  VERDICT: MALICIOUS")
        print(f"  Source:  {r['source']}")
        print(f"  Notes:   {r['notes']}")
    elif r["verdict"] == "unknown" and r["type"] != "unknown":
        print(f"  VERDICT: not in feed (no verdict -- absence isn't proof of safety)")
    else:
        print(f"  VERDICT: could not classify as IP/domain/hash")


def main():
    parser = argparse.ArgumentParser(description="IOC threat-intel checker (local feed, pluggable for a real API)")
    parser.add_argument("ioc", nargs="?", help="an IP, domain, or file hash")
    parser.add_argument("--file", help="file with one IOC per line")
    parser.add_argument("--feed", default=str(DEFAULT_FEED), help="path to a JSON feed file")
    args = parser.parse_args()

    feed = load_feed(args.feed)

    if args.file:
        with open(args.file) as f:
            iocs = [line.strip() for line in f if line.strip()]
    elif args.ioc:
        iocs = [args.ioc]
    else:
        print("Provide an IOC argument or --file <path>.", file=sys.stderr)
        sys.exit(1)

    hits = 0
    for ioc in iocs:
        result = lookup(ioc, feed)
        print_result(result)
        if result["verdict"] == "malicious":
            hits += 1

    if hits:
        sys.exit(2)


if __name__ == "__main__":
    main()
