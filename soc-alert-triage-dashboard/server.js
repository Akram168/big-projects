/**
 * SOC Alert Triage Dashboard -- ingests mock SIEM-style alerts, computes
 * a priority score for each (severity x asset criticality x confidence),
 * and serves a small web dashboard sorted by priority. Pure Node.js
 * (http + fs), no dependencies, in-memory + JSON-file persistence.
 */
const http = require("http");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { URL } = require("url");

const PORT = 4030;
const DATA_FILE = path.join(__dirname, "alerts.json");

const SEVERITY_WEIGHT = { critical: 40, high: 30, medium: 15, low: 5 };
const CRITICALITY_WEIGHT = { critical: 30, high: 20, medium: 10, low: 5 };

function loadAlerts() {
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
  } catch {
    return [];
  }
}

function saveAlerts(alerts) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(alerts, null, 2));
}

let alerts = loadAlerts();

function priorityScore(alert) {
  const sev = SEVERITY_WEIGHT[alert.severity] ?? 0;
  const crit = CRITICALITY_WEIGHT[alert.assetCriticality] ?? 0;
  const confidence = Math.max(0, Math.min(1, Number(alert.confidence ?? 0.5)));
  // Confidence scales the combined severity+criticality signal -- a
  // low-confidence detection on a critical asset shouldn't outrank a
  // high-confidence one on a lesser asset.
  return Math.round((sev + crit) * confidence);
}

function withScores(list) {
  return list
    .map((a) => ({ ...a, priorityScore: priorityScore(a) }))
    .sort((a, b) => b.priorityScore - a.priorityScore);
}

function send(res, status, body, contentType = "application/json") {
  res.writeHead(status, { "Content-Type": contentType });
  res.end(contentType === "application/json" ? JSON.stringify(body) : body);
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let raw = "";
    req.on("data", (chunk) => {
      raw += chunk;
      if (raw.length > 1e6) req.destroy();
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

const DASHBOARD_HTML = `<!doctype html>
<html>
<head>
<meta charset="utf-8">
<title>SOC Alert Triage</title>
<style>
  body { font-family: system-ui, sans-serif; background: #0f1115; color: #e6e6e6; margin: 0; padding: 24px; }
  h1 { font-size: 20px; margin-bottom: 4px; }
  .sub { color: #999; font-size: 13px; margin-bottom: 20px; }
  table { width: 100%; border-collapse: collapse; }
  th, td { text-align: left; padding: 10px 12px; border-bottom: 1px solid #2a2d35; font-size: 14px; }
  th { color: #999; font-weight: 600; text-transform: uppercase; font-size: 11px; letter-spacing: 0.05em; }
  .score { font-weight: 700; font-size: 16px; }
  .sev-critical { color: #ff5c5c; }
  .sev-high { color: #ff9c4a; }
  .sev-medium { color: #ffd24a; }
  .sev-low { color: #7ad17a; }
  .badge { display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 11px; text-transform: uppercase; background: #1e2128; }
  #empty { color: #999; padding: 40px 0; text-align: center; }
</style>
</head>
<body>
  <h1>SOC Alert Triage Dashboard</h1>
  <div class="sub">Alerts sorted by priority score (severity &times; asset criticality &times; confidence)</div>
  <table id="table">
    <thead><tr><th>Score</th><th>Alert</th><th>Severity</th><th>Asset</th><th>Criticality</th><th>Confidence</th></tr></thead>
    <tbody id="rows"></tbody>
  </table>
  <div id="empty" style="display:none">No alerts yet. POST some to /api/alerts.</div>
<script>
async function load() {
  const res = await fetch('/api/alerts');
  const alerts = await res.json();
  const rows = document.getElementById('rows');
  const empty = document.getElementById('empty');
  rows.innerHTML = '';
  if (alerts.length === 0) { empty.style.display = 'block'; return; }
  empty.style.display = 'none';
  for (const a of alerts) {
    const tr = document.createElement('tr');
    tr.innerHTML = \`
      <td class="score">\${a.priorityScore}</td>
      <td>\${a.title}</td>
      <td class="sev-\${a.severity}">\${a.severity}</td>
      <td>\${a.asset}</td>
      <td><span class="badge">\${a.assetCriticality}</span></td>
      <td>\${Math.round((a.confidence ?? 0.5) * 100)}%</td>
    \`;
    rows.appendChild(tr);
  }
}
load();
setInterval(load, 5000);
</script>
</body>
</html>`;

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);

  try {
    if (req.method === "GET" && url.pathname === "/") {
      return send(res, 200, DASHBOARD_HTML, "text/html");
    }

    if (req.method === "GET" && url.pathname === "/api/alerts") {
      return send(res, 200, withScores(alerts));
    }

    if (req.method === "POST" && url.pathname === "/api/alerts") {
      const body = await readBody(req);
      const required = ["title", "severity", "asset", "assetCriticality"];
      const missing = required.filter((f) => !body[f]);
      if (missing.length) {
        return send(res, 400, { error: `missing fields: ${missing.join(", ")}` });
      }
      if (!(body.severity in SEVERITY_WEIGHT)) {
        return send(res, 400, { error: `severity must be one of: ${Object.keys(SEVERITY_WEIGHT).join(", ")}` });
      }
      if (!(body.assetCriticality in CRITICALITY_WEIGHT)) {
        return send(res, 400, { error: `assetCriticality must be one of: ${Object.keys(CRITICALITY_WEIGHT).join(", ")}` });
      }
      const alert = {
        id: crypto.randomUUID(),
        title: body.title,
        severity: body.severity,
        asset: body.asset,
        assetCriticality: body.assetCriticality,
        confidence: body.confidence ?? 0.5,
        createdAt: new Date().toISOString(),
      };
      alerts.push(alert);
      saveAlerts(alerts);
      return send(res, 201, { ...alert, priorityScore: priorityScore(alert) });
    }

    return send(res, 404, { error: "not found" });
  } catch (err) {
    return send(res, 400, { error: err.message });
  }
});

server.listen(PORT, () => console.log(`SOC dashboard on http://localhost:${PORT}`));
