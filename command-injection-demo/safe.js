/**
 * SAFE ping server -- same feature, fixed against command injection.
 */
const http = require("http");
const { execFile } = require("child_process");
const { URL } = require("url");

const PORT = 4002;

function isValidHost(host) {
  // Only allow plain hostnames/IPv4 -- no shell metacharacters, no spaces.
  return /^[a-zA-Z0-9.-]{1,253}$/.test(host) && !host.startsWith("-");
}

http.createServer((req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  if (url.pathname !== "/ping") {
    res.writeHead(404);
    return res.end("not found");
  }

  const host = url.searchParams.get("host") || "localhost";

  if (!isValidHost(host)) {
    res.writeHead(400, { "Content-Type": "text/plain" });
    return res.end(`Rejected: '${host}' is not a valid hostname.`);
  }

  // SAFE: execFile passes arguments as an array -- no shell is invoked,
  // so there's no string to inject metacharacters into. The host is also
  // allowlist-validated before it ever reaches the OS command.
  execFile("ping", ["-n", "1", host], (err, stdout, stderr) => {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end(`$ ping -n 1 ${host}\n\n${stdout || stderr || String(err)}`);
  });
}).listen(PORT, () => console.log(`Safe server on http://localhost:${PORT}`));

module.exports = { isValidHost };
