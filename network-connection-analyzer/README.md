# Network Connection Analyzer

Reads the OS's own live connection table (`netstat`) and flags things worth a second look: services listening on all interfaces (`0.0.0.0`) rather than just localhost, listeners on uncommon ports, and remote IPs with an unusually high number of established connections (possible C2 beaconing / data exfil pattern, or just a chatty legitimate service — the tool flags, a human decides).

Cross-platform (Windows `netstat -ano`, Linux/macOS `netstat -antu`). Pure Python standard library — no Scapy/Npcap, no elevated privileges, no raw sockets. This reads process-table-level connection state, not packet contents.

## Usage

```bash
python analyzer.py             # human-readable report
python analyzer.py --json      # full connection table + findings as JSON
```

## Example (real output, run on the dev machine)

```
$ python analyzer.py
Scanned 212 connection table entries (Windows)

[listener_all_interfaces] TCP listening on 0.0.0.0:135 (all interfaces) -- UNCOMMON port
[listener_all_interfaces] TCP listening on 0.0.0.0:445 (all interfaces) -- common service port
[listener_all_interfaces] TCP listening on 0.0.0.0:3000 (all interfaces) -- UNCOMMON port
[listener_all_interfaces] TCP listening on 0.0.0.0:49664 (all interfaces) -- UNCOMMON port
...
```

Port 135 and 445 are Windows RPC/SMB — expected on any Windows box. Port 3000 in that run was a local dev server (OWASP Juice Shop, from the [`juice-shop-exploit-writeup`](../../small-projects/juice-shop-exploit-writeup) project) that happened to be running at the time — exactly the kind of "wait, why is that listening on all interfaces" question this tool is meant to prompt. On a real host, an unrecognized listener like this is worth tracing back to its PID (Windows: the last column of `netstat -ano`; the tool captures it in `--json` output) and asking whether it should be bound to `127.0.0.1` instead of `0.0.0.0`.

## What it flags

- **Listeners on `0.0.0.0`/`::`** — reachable from any network interface, not just localhost. A dev tool or internal service bound this way is exposed to the whole LAN (or the internet, if there's no firewall/NAT in the way) even though the developer probably only meant to reach it from their own machine.
- **High-volume connections to a single remote IP** — more than 10 established connections to the same address is unusual for normal browsing/app traffic and can indicate a beaconing implant, a misbehaving client, or (far more often in practice) a legitimate CDN/API host being hit repeatedly — the tool surfaces the pattern, it doesn't claim to know which.

## Limitations

This is host-based connection-table analysis, not network traffic inspection — it can't see packet contents, DNS queries, or connections a compromised process might be actively hiding (a real rootkit can lie to `netstat` too). For deeper visibility you'd want packet capture (Wireshark/Scapy) or EDR-level kernel hooking — this tool is a fast, dependency-free first pass, not a replacement for either.
