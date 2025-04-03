# cvosp

Minimalistic CV Website using FastAPI & React

# Description:

A personal resume website built with a modern full-stack approach using FastAPI for the backend and React for the
frontend. The site presents structured CV information such as experience, education, skills, and projects, all fetched
via a REST API. The backend is lightweight and fast, powered by asynchronous endpoints and Python. The frontend offers a
clean, responsive interface with dynamic components for easy updates and interaction. This setup allows for full
separation of concerns and easy deployment, making it ideal for developers who want to showcase their profile with both
elegance and technical efficiency.


# 🐳 Docker Compose – Network Structure and Access Control

This setup defines a secure, modular, and production-ready Docker networking scheme using `docker-compose`.

---

## 🔧 Defined Networks

```yaml
networks:
  frontend:
  backend:
  database:
```

Each service is connected only to the networks it needs:

| Service | Networks       | Description |
|---------|----------------|-------------|
| `db`    | `database`     | Isolated database network. Not exposed externally. |
| `api`   | `backend`, `database` | Can access `db` and communicate with `nginx`. |
| `nginx` | `frontend`, `backend` | Acts as a reverse proxy between `vite` and `api`. No access to `db`. |
| `vite`  | `frontend`     | Public frontend service. No access to backend or database. |

---

## 🔐 Security Highlights

- `db` is **completely isolated** from public access — no `ports`, only `expose` for internal API access.
- `nginx` is not in the `database` network — no risk of leaking DB access via misconfiguration.
- `api` acts as the middleman between `nginx` and `db`.
- `vite` has access only to `nginx`.

---

## 🧭 Access Flow

```
[client] ─▶ nginx ─▶ vite
                 └──▶ api ───▶ db
```

- End-users talk to `nginx`, which proxies to either `vite` (static assets/dev frontend) or `api`.
- `api` connects to `db` securely and privately.

---

## 🛠 Example Use Cases

- **Security by design:** Prevents accidental DB exposure.
- **CI/CD:** Each service can be tested independently in isolation.
- **Horizontal scaling:** Vite/nginx can scale separately from API/DB.

---

## 🚀 Notes for CI/CD / Team

- Update `.env` to control host ports (`SERVER_PORT`, `VITE_PORT`).
- Keep internal container ports fixed (e.g., `api:8000`, `db:5432`).
- Avoid declaring the same host port twice (e.g., don't map `80:80` more than once).
- Exposed ports (`ports:`) are only needed if the service must be accessed from **outside** the Docker host.

