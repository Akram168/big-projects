/**
 * Task Manager API -- a small REST API for CRUD on tasks, with simple
 * per-user API-key auth. Pure Node.js (http + fs), no dependencies.
 *
 * Data is persisted to tasks.json next to this file.
 */
const http = require("http");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const { URL } = require("url");

const PORT = 4010;
const DATA_FILE = path.join(__dirname, "tasks.json");
const USERS_FILE = path.join(__dirname, "users.json");

function loadJson(file, fallback) {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    return fallback;
  }
}

function saveJson(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

let tasks = loadJson(DATA_FILE, []); // [{id, userId, title, done, createdAt}]
let users = loadJson(USERS_FILE, {}); // { apiKey: userId }

function send(res, status, body) {
  if (body === null) {
    res.writeHead(status);
    return res.end();
  }
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(JSON.stringify(body));
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let raw = "";
    req.on("data", (chunk) => {
      raw += chunk;
      if (raw.length > 1e6) req.destroy(); // basic body-size guard
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

function authenticate(req) {
  const header = req.headers["authorization"] || "";
  const match = header.match(/^Bearer (.+)$/);
  if (!match) return null;
  const apiKey = match[1];
  const userId = users[apiKey];
  return userId ? { apiKey, userId } : null;
}

function createUser() {
  const userId = crypto.randomUUID();
  const apiKey = crypto.randomBytes(24).toString("hex");
  users[apiKey] = userId;
  saveJson(USERS_FILE, users);
  return { userId, apiKey };
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  const parts = url.pathname.split("/").filter(Boolean); // e.g. ['tasks', '<id>']

  try {
    // Signup: no auth needed, issues a new API key.
    if (req.method === "POST" && parts[0] === "signup") {
      return send(res, 201, createUser());
    }

    const auth = authenticate(req);
    if (!auth) {
      return send(res, 401, { error: "missing or invalid Authorization: Bearer <api-key>" });
    }

    // GET /tasks -- list this user's tasks
    if (req.method === "GET" && parts[0] === "tasks" && parts.length === 1) {
      const mine = tasks.filter((t) => t.userId === auth.userId);
      return send(res, 200, mine);
    }

    // POST /tasks -- create a task
    if (req.method === "POST" && parts[0] === "tasks" && parts.length === 1) {
      const body = await readBody(req);
      if (!body.title || typeof body.title !== "string") {
        return send(res, 400, { error: "title (string) is required" });
      }
      const task = {
        id: crypto.randomUUID(),
        userId: auth.userId,
        title: body.title,
        done: false,
        createdAt: new Date().toISOString(),
      };
      tasks.push(task);
      saveJson(DATA_FILE, tasks);
      return send(res, 201, task);
    }

    // PATCH /tasks/:id -- update a task (only if it belongs to this user)
    if (req.method === "PATCH" && parts[0] === "tasks" && parts.length === 2) {
      const task = tasks.find((t) => t.id === parts[1]);
      if (!task || task.userId !== auth.userId) {
        return send(res, 404, { error: "task not found" });
      }
      const body = await readBody(req);
      if (typeof body.title === "string") task.title = body.title;
      if (typeof body.done === "boolean") task.done = body.done;
      saveJson(DATA_FILE, tasks);
      return send(res, 200, task);
    }

    // DELETE /tasks/:id
    if (req.method === "DELETE" && parts[0] === "tasks" && parts.length === 2) {
      const idx = tasks.findIndex((t) => t.id === parts[1]);
      if (idx === -1 || tasks[idx].userId !== auth.userId) {
        return send(res, 404, { error: "task not found" });
      }
      tasks.splice(idx, 1);
      saveJson(DATA_FILE, tasks);
      return send(res, 204, null);
    }

    return send(res, 404, { error: "not found" });
  } catch (err) {
    return send(res, 400, { error: err.message });
  }
});

server.listen(PORT, () => console.log(`Task Manager API on http://localhost:${PORT}`));
