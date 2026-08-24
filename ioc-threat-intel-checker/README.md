# IOC Threat-Intel Checker

Classifies an indicator (IP / domain / file hash) and checks it against a JSON blocklist feed. Ships with a small illustrative sample feed so it runs and gives real results with **zero API keys and zero network calls** — the lookup function is a deliberate seam for wiring in a real feed (AbuseIPDB, VirusTotal, OTX, MISP) later without changing anything else.

## Run

```bash
python checker.py 192.0.2.55
python checker.py --file iocs.txt
python checker.py --feed feeds/sample_feed.json 44d88612fea8a8f36de82e1278abb02f
```

Exit code `2` if anything checked comes back malicious (script/CI friendly), `0` otherwise.

## Example (real output)

```
$ python checker.py 192.0.2.55
192.0.2.55  (ip)
  VERDICT: MALICIOUS
  Source:  sample-feed
  Notes:   Example: known C2 server (documentation IP, not real)

$ python checker.py 44d88612fea8a8f36de82e1278abb02f
44d88612fea8a8f36de82e1278abb02f  (hash)
  VERDICT: MALICIOUS
  Source:  sample-feed
  Notes:   EICAR standard antivirus test file (MD5) -- intentionally harmless, used to test detection tooling

$ python checker.py 8.8.8.8
8.8.8.8  (ip)
  VERDICT: not in feed (no verdict -- absence isn't proof of safety)
```

The last case matters: a clean result from a *local* feed means "not in this feed," not "confirmed safe" — the tool says exactly that instead of implying more confidence than it has.

## About the sample feed (`feeds/sample_feed.json`)

Every entry in it is intentionally non-sensitive:
- IPs are from [RFC 5737](https://datatracker.ietf.org/doc/html/rfc5737) documentation ranges (`192.0.2.0/24`, `198.51.100.0/24`, `203.0.113.0/24`) — reserved for examples, never real or routable.
- Domains use the reserved `.test`/`.example` TLDs — not real registrable domains.
- The one hash is the [EICAR test file](https://en.wikipedia.org/wiki/EICAR_test_file)'s published MD5 (`44d88612fea8a8f36de82e1278abb02f`) — a standard, intentionally harmless string the entire antivirus industry uses to test detection without needing real malware.

Point `--feed` at a different JSON file with the same `{ips, domains, hashes}` shape to use a real blocklist.

## How it's built to grow into a real tool

`lookup()` in `checker.py` is the one function that would change to call a live API instead of reading a local file — same input (`value`, `feed`), same output shape (`{ioc, type, verdict, source, notes}`). Everything else (classification, CLI, batch mode, exit codes) stays as-is. That's the actual shape a production version takes: swap the local dict lookup for `requests.get("https://api.abuseipdb.com/...")`, add response caching so you're not re-querying the same IOC every run, and this becomes a real threat-intel client.

## Limitations

A local static feed is only as current as the last time you updated the file — no expiry, no automatic refresh, no rate limiting (irrelevant here since there's no network call, but very relevant the moment a real API is wired in).
