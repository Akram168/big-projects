# Command Injection: Vulnerable vs. Safe

Two tiny Node.js HTTP servers that both expose the same feature — "ping a host and show the result" — implemented two ways: one vulnerable to OS command injection, one fixed. Pure Node.js standard library, no dependencies.

> Run these on localhost only. `vulnerable.js` is deliberately exploitable.

## Run

```bash
node vulnerable.js   # http://localhost:4001/ping?host=...
node safe.js          # http://localhost:4002/ping?host=...
```

## The vulnerability

`vulnerable.js` builds a shell command by string-concatenating user input:

```js
const cmd = `ping -n 1 ${host}`;
exec(cmd, ...);
```

`exec()` runs this through a real shell, so shell metacharacters in `host` (like `&`, `;`, `|`, `` ` ``) don't get treated as part of the hostname — they get treated as shell syntax.

### Proof — normal use

```
$ curl "http://localhost:4001/ping?host=localhost"
$ ping -n 1 localhost

Pinging DESKTOP-PG7F8AF [::1] with 32 bytes of data:
Reply from ::1: time<1ms
...
```

### Proof — injection

```
$ curl -G "http://localhost:4001/ping" --data-urlencode "host=localhost & whoami"
$ ping -n 1 localhost & whoami

Pinging DESKTOP-PG7F8AF [::1] with 32 bytes of data:
Reply from ::1: time<1ms
...
Move pc
```

That last line, `Move pc`, is the real output of `whoami` running on the host machine — an attacker-supplied command executed outside the intended `ping`, with whatever privileges the server process has. In a real deployment this is a path to full remote code execution, not just information disclosure.

## The fix

`safe.js` makes the same request behave correctly and rejects the same payload:

```
$ curl "http://localhost:4002/ping?host=localhost"
$ ping -n 1 localhost
...(normal output)...

$ curl -G "http://localhost:4002/ping" --data-urlencode "host=localhost & whoami"
Rejected: 'localhost & whoami' is not a valid hostname.
```

Two independent layers:

1. **`execFile` instead of `exec`** — arguments are passed as an array (`["-n", "1", host]`) directly to the OS process, with no shell in between. There's no command string for metacharacters to escape out of, because there's no string being parsed as shell syntax at all.
2. **Allowlist validation** — `host` is checked against `/^[a-zA-Z0-9.-]{1,253}$/` before it's used anywhere. Defense in depth: even if the execution method changed later, obviously-malicious input never gets that far.

## Takeaway

The general rule this demonstrates: **never build a shell command string from untrusted input.** If you need to run an external program, prefer APIs that take arguments as a list (`execFile`, `spawn` with an args array, Python's `subprocess.run([...])` without `shell=True`) over anything that hands a single string to a shell.
