#!/usr/bin/env python3
"""
Firewall rule auditor: reads the real local Windows Firewall
configuration (via netsh) and flags overly permissive inbound rules --
the kind of drift-detection pass a SOC/sysadmin should run periodically
on any exposed host.

Usage:
  python audit.py
  python audit.py --json
"""

import argparse
import json
import subprocess
import sys
from collections import defaultdict

RISKY_PORTS = {
    3389: "RDP", 445: "SMB", 5985: "WinRM (HTTP)", 5986: "WinRM (HTTPS)",
    1433: "MSSQL", 3306: "MySQL", 22: "SSH", 23: "Telnet", 21: "FTP",
}


def get_firewall_rules():
    """Pulls all inbound rules via netsh in a script-parseable verbose
    format. Returns a list of rule dicts."""
    out = subprocess.run(
        ["netsh", "advfirewall", "firewall", "show", "rule", "name=all", "verbose"],
        capture_output=True, text=True, timeout=30,
    ).stdout

    rules = []
    current = {}
    for line in out.splitlines():
        line = line.rstrip()
        if line.startswith("Rule Name:"):
            if current:
                rules.append(current)
            current = {"Rule Name": line.split(":", 1)[1].strip()}
        elif ":" in line and current is not None:
            key, _, value = line.partition(":")
            key = key.strip()
            value = value.strip()
            if key:
                current[key] = value
    if current:
        rules.append(current)
    return rules


def parse_ports(port_field):
    """netsh reports ports like '3389' or '80,443' or 'Any' or a range."""
    if not port_field or port_field.lower() == "any":
        return None  # None means "any port" -- the interesting case
    ports = set()
    for part in port_field.split(","):
        part = part.strip()
        if part.isdigit():
            ports.add(int(part))
    return ports


def audit(rules):
    findings = []
    for rule in rules:
        if rule.get("Direction", "").lower() != "in":
            continue
        if rule.get("Enabled", "").lower() != "yes":
            continue
        if rule.get("Action", "").lower() != "allow":
            continue

        name = rule.get("Rule Name", "(unnamed)")
        local_ip = rule.get("LocalIP", "Any")
        remote_ip = rule.get("RemoteIP", "Any")
        local_port = rule.get("LocalPort", "Any")
        ports = parse_ports(local_port)

        program = rule.get("Program", "").strip()
        # A rule scoped to a specific executable only exposes whatever
        # that program itself listens on -- much lower risk than a rule
        # with no program scope at all (which applies system-wide).
        is_system_wide = program in ("", "System", "Any")

        if remote_ip.lower() == "any":
            if ports is None:
                findings.append({
                    "type": "wide_open_system_rule" if is_system_wide else "wide_open_app_scoped_rule",
                    "rule": name,
                    "detail": (
                        f"'{name}': allows ANY remote IP on ANY port, no program scope (LocalIP={local_ip}) -- system-wide exposure"
                        if is_system_wide else
                        f"'{name}': allows ANY remote IP on ANY port, scoped to '{program}' -- exposure limited to what that program listens on"
                    ),
                })
            else:
                risky = ports & set(RISKY_PORTS)
                for port in risky:
                    findings.append({
                        "type": "risky_port_open_to_any",
                        "rule": name,
                        "detail": f"'{name}': allows ANY remote IP on port {port} ({RISKY_PORTS[port]}) -- sensitive service exposed with no source restriction",
                    })

    return findings


def main():
    parser = argparse.ArgumentParser(description="Windows Firewall rule auditor")
    parser.add_argument("--json", action="store_true")
    args = parser.parse_args()

    if sys.platform != "win32":
        print("This tool audits Windows Firewall rules via netsh and only runs on Windows.", file=sys.stderr)
        sys.exit(1)

    rules = get_firewall_rules()
    findings = audit(rules)

    if args.json:
        print(json.dumps({"total_rules": len(rules), "findings": findings}, indent=2))
        return

    print(f"Audited {len(rules)} firewall rules\n")
    if not findings:
        print("No overly permissive inbound rules for tracked sensitive ports found.")
        return

    by_type = defaultdict(list)
    for f in findings:
        by_type[f["type"]].append(f)

    for finding_type, group in by_type.items():
        print(f"{finding_type} ({len(group)}):")
        for f in group[:3]:
            print(f"  {f['detail']}")
        if len(group) > 3:
            print(f"  ... and {len(group) - 3} more")
        print()


if __name__ == "__main__":
    main()
