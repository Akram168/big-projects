# URL Shortener

A minimal URL shortener REST API: submit a URL, get back a short code, visiting it redirects and tracks hit counts. Pure Node.js standard library — zero dependencies.

## Run

```bash
node server.js   # http://localhost:4020
```

## Endpoints

| Method | Path | Description |
|---|---|---|
| POST | `/shorten` | Body `{"url": "https://..."}` → `{code, shortUrl}` |
| GET | `/:code` | 302 redirect to the target URL, increments hit counter |
| GET | `/stats/:code` | `{target, createdAt, hits}` |

## Example session

```bash
$ curl -X POST http://localhost:4020/shorten -H "Content-Type: application/json" \
    -d '{"url":"https://github.com/Akram168"}'
{"code":"IPL4yZ","shortUrl":"http://localhost:4020/IPL4yZ"}

$ curl -i http://localhost:4020/IPL4yZ
HTTP/1.1 302 Found
Location: https://github.com/Akram168

$ curl http://localhost:4020/stats/IPL4yZ
{"target":"https://github.com/Akram168","createdAt":"2026-08-24T22:10:24.312Z","hits":1}

$ curl -X POST http://localhost:4020/shorten -d '{"url":"not-a-url"}'
{"error":"url must be a valid http(s) URL"}
```

## Design notes

- **Codes** are 6 characters from `crypto.randomBytes` base64url-encoded — collision-checked against existing codes before being assigned, rather than trusting randomness alone.
- **URL validation** rejects anything that doesn't parse as a well-formed `http:`/`https:` URL — notably this blocks `javascript:` URIs and other schemes that would turn this into an open redirect to something worse than a bad link (see the DOM XSS finding in [`juice-shop-exploit-writeup`](../../small-projects/juice-shop-exploit-writeup) for what a `javascript:` URI does when a browser follows it unchecked).
- Persisted to a flat JSON file for simplicity — fine for a demo, not for concurrent production traffic (same caveat as `task-manager-api`).

## A note on open redirects

Any URL shortener is, by design, an open redirector — that's a known abuse vector (phishing links that hide behind a trusted short domain). Production shorteners typically add: rate limiting per submitter, a blocklist/reputation check on the target URL before accepting it, and a warning interstitial page before redirecting to an unfamiliar domain. None of that is implemented here — this project demonstrates the core mechanism, not a hardened public service.
