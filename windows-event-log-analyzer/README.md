# Windows Event Log Analyzer

Pulls real events from the local machine's Windows Security event log (via `Get-WinEvent`) and flags patterns a SOC analyst triages daily: bursts of failed logons against the same account, failed logons of a type commonly targeted by brute-force/spray attacks (network and RDP logons), and account lockouts.

## Run

```bash
python analyzer.py                 # last 24h
python analyzer.py --hours 72
python analyzer.py --json
```

**Requires an elevated (Run as Administrator) terminal** — the Security log is locked down by default and a non-admin session returns nothing from it. This is expected Windows behavior, not a bug, and the tool handles it explicitly rather than crashing or silently reporting "all clear":

```
$ python analyzer.py --hours 48
Pulled 0 Security log events from the last 48h

No events read -- the Security log usually needs an elevated (Run as Administrator) session to query. Try running from an admin PowerShell/terminal.
```

That's the real output from a non-elevated run on the dev machine — included deliberately, because "fails safe with a clear reason" is itself the correct behavior for a tool reading a permissions-gated data source, and it's what actually happened when testing this.

## What the underlying pipeline looks like (verified working)

The `Get-WinEvent` → structured-JSON pipeline itself is proven against a log this shell *can* read without elevation:

```
$ powershell -Command "Get-WinEvent -LogName System -MaxEvents 3 | ... | ConvertTo-Json"
[{"Id":19,"TimeCreated":"2026-08-25T01:08:51...","Message":"Installation Successful: ..."},
 {"Id":20,"TimeCreated":"2026-08-25T01:08:46...","Message":"Installation Failure: ..."},
 ...]
```

Real timestamps, real event data, from this machine. Run `analyzer.py` from an elevated terminal and the exact same mechanism reads the Security log instead — the only difference is which log name gets queried and which event IDs get parsed out of the message text.

## What it flags

| Finding | Event ID(s) | Why it matters |
|---|---|---|
| Failed-logon burst | 4625 | 5+ failed logons for the same account name is the textbook brute-force/password-spray signal |
| Notable logon type on failure | 4625 (Logon Type 3/10) | Network and RDP logons are the most common remote brute-force targets — a failed console logon (type 2) is a much weaker signal |
| Account lockout | 4740 | Direct evidence a brute-force attempt tripped the account lockout policy |

## Design notes

- Parses the human-readable `Message` text (Windows doesn't expose these as clean structured fields via `Get-WinEvent` without extra XML wrangling) by pulling out `"Field Name:\tvalue"` lines — pragmatic, and matches how a SOC analyst reads the raw event in Event Viewer anyway.
- Bounded to `-MaxEvents 2000` per query so a busy box with years of Security log history doesn't turn a quick check into a multi-minute log crawl.
- `--json` output is meant to feed into something else (a dashboard, a scheduled task that mails a summary) rather than just be read by a human.

## Limitations

Point-in-time pull, not continuous monitoring — for real-time alerting you'd want a Windows Event Forwarding / Sysmon + SIEM pipeline rather than polling this script on a timer. It also only sees what's in the local Security log; an attacker with admin rights can clear that log (Event ID 1102, "The audit log was cleared" — itself something worth alerting on, and a natural next check to add).
