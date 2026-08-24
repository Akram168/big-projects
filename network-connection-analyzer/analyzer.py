#!/usr/bin/env python3
"""
Network connection analyzer: runs the OS's own connection table
(netstat on Windows, ss/netstat on Linux/macOS) and flags things worth
a second look -- listeners on all interfaces, uncommon high ports,
and remote IPs with an unusually high number of connections.

This reads real live connection state from the machine it runs on.
No packet capture / raw sockets involved, so no elevated privileges
or extra libraries (e.g. Scapy + Npcap) are needed.

Usage:
  python analyzer.py
  python analyzer.py --json
"""

import argparse
import json
import platform
import re
import subprocess
import sys
from collections import Counter

COMMON_PORTS = {
    20, 21, 22, 23, 25, 53, 67, 68, 80, 110, 123, 143, 143, 443, 445,
    465, 587, 993, 995, 3306, 3389, 5432, 5900, 8080, 8443,
}

HIGH_CONN_THRESHOLD = 10  # remote IPs with more than this many connections get flagged


def run_netstat_windows():
    out = subprocess.run(
        ["netstat", "-ano"], capture_output=True, text=True, timeout=15
    ).stdout
    entries = []
    for line in out.splitlines():
        m = re.match(
            r"\s*(TCP|UDP)\s+(\S+):(\d+)\s+(\S+):(\d+|\*)\s*(\S+)?\s*(\d+)?",
            line,
        )
        if not m:
            continue
        proto, laddr, lport, raddr, rport, state, pid = m.groups()
        entries.append({
            "proto": proto,
            "local_addr": laddr,
            "local_port": int(lport),
            "remote_addr": raddr,
            "remote_port": None if rport in ("*", None) else int(rport),
            "state": state or "",
            "pid": int(pid) if pid else None,
        })
    return entries


def run_netstat_unix():
    out = subprocess.run(
        ["netstat", "-antu"], capture_output=True, text=True, timeout=15
    ).stdout
    entries = []
    for line in out.splitlines():
        m = re.match(
            r"\s*(tcp6?|udp6?)\s+\d+\s+\d+\s+(\S+):(\d+)\s+(\S+):(\d+|\*)\s*(\S+)?",
            line,
        )
        if not m:
            continue
        proto, laddr, lport, raddr, rport, state = m.groups()
        entries.append({
            "proto": proto.upper(),
            "local_addr": laddr,
            "local_port": int(lport),
            "remote_addr": raddr,
            "remote_port": None if rport == "*" else int(rport),
            "state": state or "",
            "pid": None,
        })
    return entries


def get_connections():
    if platform.system() == "Windows":
        return run_netstat_windows()
    return run_netstat_unix()


def analyze(entries):
    findings = []

    listeners = [e for e in entries if e["state"] == "LISTENING" or e["remote_port"] is None and e["proto"].startswith("TCP")]
    for e in listeners:
        if e["local_addr"] in ("0.0.0.0", "::", "*"):
            note = "common service port" if e["local_port"] in COMMON_PORTS else "UNCOMMON port"
            findings.append({
                "type": "listener_all_interfaces",
                "detail": f"{e['proto']} listening on {e['local_addr']}:{e['local_port']} (all interfaces) -- {note}",
                "entry": e,
            })

    established = [e for e in entries if e["state"] == "ESTABLISHED"]
    remote_counts = Counter(e["remote_addr"] for e in established)
    for remote_ip, count in remote_counts.items():
        if count > HIGH_CONN_THRESHOLD and remote_ip not in ("127.0.0.1", "::1"):
            findings.append({
                "type": "high_connection_count",
                "detail": f"{count} established connections to the same remote IP {remote_ip} -- worth checking what process/purpose this is",
                "entry": {"remote_addr": remote_ip, "count": count},
            })

    return findings


def main():
    parser = argparse.ArgumentParser(description="Network connection analyzer")
    parser.add_argument("--json", action="store_true", help="output raw JSON instead of a report")
    args = parser.parse_args()

    entries = get_connections()
    findings = analyze(entries)

    if args.json:
        print(json.dumps({"connections": entries, "findings": findings}, indent=2))
        return

    print(f"Scanned {len(entries)} connection table entries ({platform.system()})\n")
    if not findings:
        print("Nothing flagged.")
    for f in findings:
        print(f"[{f['type']}] {f['detail']}")


if __name__ == "__main__":
    main()
