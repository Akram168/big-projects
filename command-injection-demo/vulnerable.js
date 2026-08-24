/**
 * VULNERABLE ping server -- demonstrates OS command injection.
 * Do not run this on anything but localhost for demonstration.
 */
const http = require("http");
const { exec } = require("child_process");
const { URL } = require("url");

const PORT = 4001;

http.createServer((req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  if (url.pathname !== "/ping") {
    res.writeHead(404);
    return res.end("not found");
  }

  const host = url.searchParams.get("host") || "localhost";

  // VULNERABLE: user input concatenated straight into a shell command.
  const cmd = `ping -n 1 ${host}`;
  exec(cmd, (err, stdout, stderr) => {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end(`$ ${cmd}\n\n${stdout || stderr || String(err)}`);
  });
}).listen(PORT, () => console.log(`Vulnerable server on http://localhost:${PORT}`));
