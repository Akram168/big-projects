#!/usr/bin/env python3
"""
Windows Security Event Log analyzer: pulls real events from the local
machine's Security log via PowerShell's Get-WinEvent, and flags patterns
a SOC analyst would care about -- clusters of failed logons (4625),
logons with an unusual logon type, and account lockouts (4740).

Requires Windows and (for the Security log specifically) usually admin
rights to read -- run from an elevated PowerShell/terminal if you get
an empty result with no error.

Usage:
  python analyzer.py                     # last 24h, default checks
  python analyzer.py --hours 72
  python analyzer.py --json
"""

import argparse
import json
import subprocess
import sys
from collections import Counter, defaultdict
from datetime import datetime

EVENT_IDS = {
    4624: "Successful logon",
    4625: "Failed logon",
    4634: "Logoff",
    4720: "User account created",
    4726: "User account deleted",
    4740: "Account locked out",
    4672: "Special privileges assigned to new logon",
}

FAILED_LOGON_ID = 4625
LOCKOUT_ID = 4740
BURST_THRESHOLD = 5  # failed logons from the same account within the window = flagged

# Logon type 3 = network, 10 = RDP -- both common brute-force targets;
# see Microsoft's logon type reference for the full list.
NOTABLE_LOGON_TYPES = {3: "Network", 10: "RemoteInteractive (RDP)"}


def fetch_events(hours, max_events=2000):
    """Calls Get-WinEvent via PowerShell and returns parsed events as JSON.
    Falls back gracefully (empty list) if the Security log isn't readable
    without elevation, rather than crashing."""
    ps_script = f"""
    $ErrorActionPreference = 'Stop'
    try {{
        $events = Get-WinEvent -FilterHashtable @{{
            LogName = 'Security'
            StartTime = (Get-Date).AddHours(-{hours})
        }} -MaxEvents {max_events} -ErrorAction Stop
        $events | ForEach-Object {{
            [PSCustomObject]@{{
                Id = $_.Id
                TimeCreated = $_.TimeCreated.ToString('o')
                Message = $_.Message
            }}
        }} | ConvertTo-Json -Depth 2 -Compress
    }} catch {{
        Write-Output '[]'
    }}
    """
    result = subprocess.run(
        ["powershell.exe", "-NoProfile", "-NonInteractive", "-Command", ps_script],
        capture_output=True, text=True, timeout=60,
    )
    raw = result.stdout.strip()
    if not raw:
        return []
    data = json.loads(raw)
    if isinstance(data, dict):  # PowerShell returns a bare object, not an array, for a single event
        data = [data]
    return data


def extract_field(message, field_name):
    """Get-WinEvent's Message text is a human-readable block with
    'Field Name:\\t\\tvalue' lines -- pull one out by label."""
    if not message:
        return None
    for line in message.splitlines():
        if line.strip().startswith(field_name):
            parts = line.split(":", 1)
            if len(parts) == 2:
                return parts[1].strip()
    return None


def analyze(events):
    findings = []

    failed_by_account = defaultdict(list)
    for e in events:
        if e["Id"] == FAILED_LOGON_ID:
            account = extract_field(e.get("Message", ""), "Account Name") or "unknown"
            failed_by_account[account].append(e)

    for account, attempts in failed_by_account.items():
        if len(attempts) >= BURST_THRESHOLD:
            findings.append({
                "type": "failed_logon_burst",
                "detail": f"{len(attempts)} failed logon attempts for account '{account}'",
            })

    logon_type_counts = Counter()
    for e in events:
        if e["Id"] == FAILED_LOGON_ID:
            lt = extract_field(e.get("Message", ""), "Logon Type")
            if lt and int(lt) in NOTABLE_LOGON_TYPES:
                logon_type_counts[NOTABLE_LOGON_TYPES[int(lt)]] += 1

    for logon_type, count in logon_type_counts.items():
        findings.append({
            "type": "notable_failed_logon_type",
            "detail": f"{count} failed logons of type '{logon_type}' -- common brute-force target",
        })

    lockouts = [e for e in events if e["Id"] == LOCKOUT_ID]
    for e in lockouts:
        account = extract_field(e.get("Message", ""), "Account Name") or "unknown"
        findings.append({
            "type": "account_lockout",
            "detail": f"Account '{account}' was locked out at {e['TimeCreated']}",
        })

    return findings


def main():
    parser = argparse.ArgumentParser(description="Windows Security Event Log analyzer")
    parser.add_argument("--hours", type=int, default=24, help="how far back to look")
    parser.add_argument("--json", action="store_true")
    args = parser.parse_args()

    if sys.platform != "win32":
        print("This tool reads the Windows Security event log and only runs on Windows.", file=sys.stderr)
        sys.exit(1)

    events = fetch_events(args.hours)
    id_counts = Counter(e["Id"] for e in events)
    findings = analyze(events)

    if args.json:
        print(json.dumps({"total_events": len(events), "event_id_counts": id_counts, "findings": findings}, indent=2))
        return

    print(f"Pulled {len(events)} Security log events from the last {args.hours}h\n")
    if events:
        print("Event type breakdown:")
        for eid, count in id_counts.most_common():
            label = EVENT_IDS.get(eid, "Other")
            print(f"  {eid} ({label}): {count}")
        print()

    if not events:
        print("No events read -- the Security log usually needs an elevated (Run as Administrator) session to query. Try running from an admin PowerShell/terminal.")
        return

    if not findings:
        print("Nothing flagged in this window.")
    for f in findings:
        print(f"[{f['type']}] {f['detail']}")


if __name__ == "__main__":
    main()
