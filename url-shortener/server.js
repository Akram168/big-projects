/**
 * URL Shortener -- pure Node.js (http + fs + crypto), no dependencies.
 * Data persisted to links.json next to this file.
 */
const http = require("http");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const { URL } = require("url");

const PORT = 4020;
const DATA_FILE = path.join(__dirname, "links.json");
const CODE_LENGTH = 6;

function loadLinks() {
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
  } catch {
    return {};
  }
}

function saveLinks(links) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(links, null, 2));
}

let links = loadLinks(); // { code: {target, createdAt, hits} }

function isValidUrl(str) {
  try {
    const u = new URL(str);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

function generateCode() {
  // base62-ish short code from random bytes
  let code;
  do {
    code = crypto.randomBytes(8).toString("base64url").slice(0, CODE_LENGTH);
  } while (links[code]);
  return code;
}

function send(res, status, body) {
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(JSON.stringify(body));
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let raw = "";
    req.on("data", (chunk) => {
      raw += chunk;
      if (raw.length > 1e5) req.destroy();
    });
    req.on("end", () => {
      if (!raw) return resolve({});
      try {
        resolve(JSON.parse(raw));
      } catch {
        reject(new Error("invalid JSON body"));
      }
    });
  });
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  const parts = url.pathname.split("/").filter(Boolean);

  try {
    // POST /shorten { "url": "https://..." } -> { code, shortUrl }
    if (req.method === "POST" && parts[0] === "shorten") {
      const body = await readBody(req);
      if (!isValidUrl(body.url || "")) {
        return send(res, 400, { error: "url must be a valid http(s) URL" });
      }
      const code = generateCode();
      links[code] = { target: body.url, createdAt: new Date().toISOString(), hits: 0 };
      saveLinks(links);
      return send(res, 201, { code, shortUrl: `http://localhost:${PORT}/${code}` });
    }

    // GET /stats/:code -> { target, createdAt, hits }
    if (req.method === "GET" && parts[0] === "stats" && parts.length === 2) {
      const entry = links[parts[1]];
      if (!entry) return send(res, 404, { error: "unknown code" });
      return send(res, 200, entry);
    }

    // GET /:code -> 302 redirect to target, increments hit counter
    if (req.method === "GET" && parts.length === 1) {
      const entry = links[parts[0]];
      if (!entry) return send(res, 404, { error: "unknown code" });
      entry.hits += 1;
      saveLinks(links);
      res.writeHead(302, { Location: entry.target });
      return res.end();
    }

    return send(res, 404, { error: "not found" });
  } catch (err) {
    return send(res, 400, { error: err.message });
  }
});

server.listen(PORT, () => console.log(`URL shortener on http://localhost:${PORT}`));
