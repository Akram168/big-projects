# Task Manager API

A REST API for CRUD on tasks, with per-user API-key authentication and JSON file persistence. Pure Node.js standard library (`http`, `fs`, `crypto`) — zero npm dependencies.

## Run

```bash
node server.js   # http://localhost:4010
```

## Endpoints

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/signup` | none | Creates a new user, returns `{userId, apiKey}` |
| GET | `/tasks` | required | List the authenticated user's tasks |
| POST | `/tasks` | required | Create a task: `{"title": "..."}` |
| PATCH | `/tasks/:id` | required | Update `title` and/or `done` |
| DELETE | `/tasks/:id` | required | Delete a task |

Authenticated requests need `Authorization: Bearer <apiKey>`.

## Example session

```bash
$ curl -X POST http://localhost:4010/signup
{"userId":"b7c25ed6-...","apiKey":"478500b894fc..."}

$ curl -X POST http://localhost:4010/tasks -H "Authorization: Bearer 478500b894fc..." \
    -H "Content-Type: application/json" -d '{"title":"Write portfolio README"}'
{"id":"e8af3aff-...","userId":"b7c25ed6-...","title":"Write portfolio README","done":false,"createdAt":"2026-08-24T22:09:23.442Z"}

$ curl http://localhost:4010/tasks -H "Authorization: Bearer 478500b894fc..."
[{"id":"e8af3aff-...","title":"Write portfolio README","done":false,...}]

$ curl -X PATCH http://localhost:4010/tasks/e8af3aff-... -H "Authorization: Bearer 478500b894fc..." \
    -H "Content-Type: application/json" -d '{"done":true}'
{"id":"e8af3aff-...","done":true,...}

$ curl -X DELETE http://localhost:4010/tasks/e8af3aff-... -H "Authorization: Bearer 478500b894fc..."
(204 No Content)
```

Requests without a valid `Authorization` header get `401`. Trying to read/update/delete another user's task returns `404`, not `403` — deliberately not confirming the task *exists* to a caller who doesn't own it (avoids leaking which IDs are valid to an unauthorized caller).

## Design notes

- **Ownership check on every task operation** — `task.userId !== auth.userId` is checked before returning, updating, or deleting a task. This is the exact check that was *missing* in the [`juice-shop-exploit-writeup`](../../small-projects/juice-shop-exploit-writeup) IDOR finding; this project is the "how you actually do it" counterpart.
- **API keys are random 24-byte tokens** (`crypto.randomBytes`), not JWTs — no signing/parsing complexity needed for a demo this size, and there's nothing to leak from a bearer token that's just an opaque lookup key.
- **Request body size is capped** (1MB) to avoid a trivial memory-exhaustion vector on the JSON body parser.

## Note

This is a demo/portfolio project, not hardened for production: no rate limiting, no HTTPS termination (put it behind a reverse proxy for that), and JSON-file storage doesn't handle concurrent writes safely at any real scale — swap in a real database for that.
