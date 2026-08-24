# SOC Alert Triage Dashboard

A small web dashboard for the first thing a SOC analyst does with a pile of alerts: figure out which ones actually need attention first. Ingests mock alerts via a REST API, computes a priority score from severity × asset criticality × detection confidence, and shows them sorted, auto-refreshing every 5 seconds. Pure Node.js (`http`), zero dependencies, no frontend framework/build step — one HTML string served straight from the server.

## Run

```bash
node server.js   # dashboard at http://localhost:4030
```

## Feed it alerts

```bash
curl -X POST http://localhost:4030/api/alerts -H "Content-Type: application/json" -d '{
  "title": "Multiple failed RDP logons",
  "severity": "high",
  "asset": "DC01",
  "assetCriticality": "critical",
  "confidence": 0.9
}'
```

`severity` and `assetCriticality` are each one of `critical`/`high`/`medium`/`low`; `confidence` is 0.0–1.0 (defaults to 0.5). Invalid values are rejected with a 400 and a clear error message.

## Example — real seeded data, real sort order

```
$ curl http://localhost:4030/api/alerts
SCORE  ALERT                              SEVERITY  ASSET          CRITICALITY  CONFIDENCE
57     Suspicious PowerShell -enc usage   critical  FIN-WKS-14     HIGH         95%
54     Multiple failed RDP logons         high      DC01           CRITICAL     90%
6      Port scan detected                low       guest-wifi-ap  LOW          60%
6      AV signature match (adware)        medium    HR-WKS-02      LOW          30%
```

Worth noticing: the *critical-severity* PowerShell alert outranks the *high-severity* RDP alert even though RDP hit a critical-criticality asset (a domain controller) — because its confidence (0.95) and severity (critical=40) combine to edge out the RDP alert's slightly lower severity weight (high=30) plus critical-asset weight (30). And the medium-severity adware alert ties with the low-severity port scan — a real detection with low confidence (0.3, "might be a false positive") gets discounted down to where a low-severity-but-more-certain finding lands right next to it. That's the actual point of a confidence-weighted score: a "maybe" on a low-value asset shouldn't outrank a "probably" on another low-value asset just because its raw severity label sounds worse.

## Scoring formula

```
score = round((severityWeight + assetCriticalityWeight) × confidence)

severity:          critical=40  high=30  medium=15  low=5
assetCriticality:   critical=30  high=20  medium=10  low=5
confidence:         0.0-1.0 (how sure the detection itself is, independent of severity)
```

## Design notes

- **Confidence is a separate axis from severity on purpose.** A detection rule can be very confident about a low-severity finding (adware, definitely present, doesn't matter much) or unsure about a high-severity one (possible ransomware behavior, could be a false positive) — collapsing those into one number loses exactly the distinction an analyst needs to triage well.
- Dashboard auto-refreshes (`setInterval`, 5s) rather than needing a manual reload — meant to sit on a second monitor during a shift, not be actively clicked through.
- No framework, no build step: the HTML/CSS/JS is a template string served by the same process that runs the API, so `node server.js` is the entire deployment story.

## Limitations

In-memory + flat-file storage, no auth, no real alert ingestion pipeline (this is the triage/display layer, not a SIEM) — feeding it from a real source (Sysmon via Winlogbeat, a EDR webhook, etc.) would mean writing an adapter that POSTs to `/api/alerts` in this shape, which is a deliberately thin, easy integration surface.
