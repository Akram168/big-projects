# Big Projects

Larger, full-scope projects.

- **[chaoscraft-site](./chaoscraft-site)** — Next.js/TypeScript website for a Minecraft server community: multi-page marketing/info site (home, modes, leaderboards, rules, events) with a custom UI component library.
- **[hidden-archive](./hidden-archive)** — End-to-end Python pipeline that turns a topic into a finished faceless YouTube Shorts/TikTok video: script generation, AI narration, stock b-roll fetching, captioning, and composition, all chained into a single command.
- **[command-injection-demo](./command-injection-demo)** — Two Node.js servers, same feature, two implementations: one vulnerable to OS command injection (with a real proof-of-concept exploit), one fixed. A hands-on before/after of a top-10 web vulnerability class.
- **[task-manager-api](./task-manager-api)** — REST API for task CRUD with per-user API-key auth and strict ownership checks on every request — the "how you actually prevent IDOR" counterpart to the Juice Shop basket-access finding.
- **[url-shortener](./url-shortener)** — URL shortener REST API with input validation, collision-checked short codes, and hit tracking.
- **[network-connection-analyzer](./network-connection-analyzer)** — cross-platform tool that reads live OS connection state and flags exposed listeners and suspicious connection patterns, no elevated privileges needed.
- **[encrypted-notes-cli](./encrypted-notes-cli)** — notes app encrypted at rest with a passphrase-derived key (PBKDF2 + Fernet/AES), built on audited crypto rather than hand-rolled ciphers.
- **[windows-event-log-analyzer](./windows-event-log-analyzer)** — reads real Windows Security event logs and flags failed-logon bursts, brute-force-prone logon types, and account lockouts.
- **[firewall-rule-auditor](./firewall-rule-auditor)** — audits real local Windows Firewall rules, tiered by actual risk (system-wide exposure vs. app-scoped) to cut noise on a normal desktop.
- **[ioc-threat-intel-checker](./ioc-threat-intel-checker)** — classifies and looks up IOCs (IP/domain/hash) against a local feed, with a clean seam for plugging in a real threat-intel API.
- **[soc-alert-triage-dashboard](./soc-alert-triage-dashboard)** — web dashboard that ranks mock SIEM alerts by a severity × asset-criticality × confidence priority score.
