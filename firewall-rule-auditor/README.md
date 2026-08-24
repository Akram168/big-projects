# Firewall Rule Auditor

Reads the real local Windows Firewall configuration (via `netsh advfirewall`) and flags overly permissive inbound rules — the periodic drift-detection pass any exposed host should get. Distinguishes **system-wide** exposure (no program scope — the dangerous kind) from **application-scoped** exposure (limited to what one specific `.exe` listens on — much lower risk, and the overwhelming majority of rules on a normal desktop).

## Run

```bash
python audit.py
python audit.py --json
```

## Example (real output, run on the dev machine)

```
$ python audit.py
Audited 670 firewall rules

wide_open_system_rule (37):
  'Game Bar': allows ANY remote IP on ANY port, no program scope (LocalIP=Any) -- system-wide exposure
  'Microsoft Store': allows ANY remote IP on ANY port, no program scope (LocalIP=Any) -- system-wide exposure
  ...and 34 more

wide_open_app_scoped_rule (121):
  'AnyDesk': allows ANY remote IP on ANY port, scoped to 'C:\Program Files (x86)\AnyDesk\AnyDesk.exe' -- exposure limited to what that program listens on
  'ms-resource:AppTitle': allows ANY remote IP on ANY port, scoped to '...\SpotifyLauncher.exe' -- exposure limited to what that program listens on
  ...and 119 more
```

Zero hits in the `risky_port_open_to_any` category (RDP/SMB/SSH/database ports explicitly exposed to any remote IP) — the specific, high-confidence finding type this tool is really built to catch. That's the expected result for a home desktop that was never configured to expose those services; on a server, that category is the one to actually worry about.

## First iteration was too noisy — here's the fix

The first version flagged every rule with no port restriction as "wide open," full stop — **158 hits** on this machine, because Windows creates a per-application inbound rule for nearly everything installed (every game, Spotify, Steam, Teams...) with no port restriction by design, since it's scoped to that program's own executable rather than a system service. Treating all 158 the same would bury the two or three findings that actually matter under 150+ that don't.

The fix: check the rule's `Program` field. No program scope (applies to the whole system) is genuinely dangerous and rare — 37 hits, mostly built-in Windows network-discovery/casting features. Scoped to one executable is far lower risk (an attacker can only reach whatever *that program* happens to be listening on, not an open door to the machine) — 121 hits, and correctly de-prioritized rather than hidden.

This is the actual job of an audit tool: not "does the rule technically say Any," but "does this represent risk a human should act on today." A tool that reports 158 equally-weighted findings on a normal desktop trains its user to ignore the output — which defeats the purpose.

## What it flags

| Finding | Meaning |
|---|---|
| `risky_port_open_to_any` | A named sensitive port (RDP/SMB/SSH/database/etc.) explicitly open to any remote IP — the finding this tool exists to catch |
| `wide_open_system_rule` | No port restriction AND no program scope — applies machine-wide |
| `wide_open_app_scoped_rule` | No port restriction but scoped to one executable — lower priority, shown for completeness |

## Limitations

Reads the *configured* rule set, not runtime state — a rule can exist without the port actually being listened on right now (pair this with [`network-connection-analyzer`](../network-connection-analyzer) to cross-reference configured-open vs. actually-listening). Also Windows-only (`netsh`); a Linux/iptables or cloud-security-group version would need a different parser but the same tiering logic.
