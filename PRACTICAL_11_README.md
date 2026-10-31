# Practical 11: Containerization with Docker and Docker Compose

- **Student Name:** Max Patel
- **Roll Number:** 24IT070
- **Course:** Advanced Web Development Frameworks (ITUE301)
- **Institution:** Charotar University of Science and Technology (CHARUSAT)
- **Repository:** [https://github.com/max7199/SEM5WDF](https://github.com/max7199/SEM5WDF)
- **Technology Stack:** Docker, Docker Compose, Node.js 20 Alpine, Nginx Alpine, MongoDB 7.0, React 18, Vite 5
- **Screenshot Directory:** `screenshots/P11/`
- **Detailed Documentation:** [docs/PRACTICAL_11.md](docs/PRACTICAL_11.md)

---

## 1. Practical Objective & Overview

The objective of Practical 11 is to **containerize the full-stack Task Management application** using Docker and orchestrate the frontend, backend, and MongoDB services into an isolated, reproducible multi-container environment with Docker Compose:

1. **Backend Containerization (`Dockerfile.backend`):**
   - Official `node:20-alpine` LTS base image.
   - Layer caching optimization: installs production dependencies (`npm ci --omit=dev`) before copying application code.
   - Exposes port `5000` with automated container healthcheck (`GET /api/health`).
2. **Frontend Multi-Stage Containerization (`Dockerfile.frontend`):**
   - **Stage 1 (Build):** Compiles React Vite production bundle with code splitting.
   - **Stage 2 (Runtime):** Lightweight `nginx:alpine` image serving compiled assets.
   - Exposes HTTP port `80` (mapped to host `5173` and `80`).
3. **Nginx Reverse Proxy & SPA Routing (`nginx.conf`):**
   - Proxies `/api/` requests to `http://backend:5000/api/` over internal Docker DNS, eliminating CORS.
   - Solves client-side React Router navigation via `try_files $uri $uri/ /index.html`.
4. **Multi-Service Docker Compose Orchestration (`docker-compose.yml`):**
   - Orchestrates `frontend`, `backend`, and `mongo` services in one command.
   - Strict health dependency ordering: `mongo` (healthy) &rarr; `backend` (healthy) &rarr; `frontend` (ready).
5. **Persistent Named Volume Storage:**
   - Dedicated named volume `taskmanager_mongo_data` mounted to MongoDB's `/data/db`.
   - Guarantees zero data loss across container teardown, restart, or image rebuilds.
6. **Security & Zero Leaks:**
   - `.dockerignore` excludes `node_modules`, `.git`, and `.env` secrets.
   - Committed safe template `.env.docker.example` with placeholder credentials.
7. **Zero Regression:**
   - All previous practicals (Practicals 1–10) remain 100% operational: JWT authentication, task CRUD, React.lazy code splitting, `node-cache` in-memory caching, and `EventEmitter` background notifications.

---

## 2. Docker Architecture & Container Topology

| Service Name | Base Image | Internal Port | Host Port Mapping | Healthcheck Probe | Storage / Network |
|---|---|---|---|---|---|
| **`frontend`** | `nginx:alpine` | 80 | `5173:80` &bull; `80:80` | `wget http://localhost:80/` | `taskmanager_network` |
| **`backend`** | `node:20-alpine` | 5000 | `5000:5000` | `node fetch /api/health` | `taskmanager_network` |
| **`mongo`** | `mongo:7.0` | 27017 | `27017:27017` | `mongosh admin ping` | `taskmanager_mongo_data` |

---

## 3. Configuration Highlights

### A. Frontend Dockerfile (`Dockerfile.frontend`)
```dockerfile
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY src/ ./src/
COPY public/ ./public/
COPY index.html vite.config.js ./
ENV VITE_API_BASE_URL=/api
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### B. Backend Dockerfile (`Dockerfile.backend`)
```dockerfile
FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production PORT=5000
COPY package*.json ./
RUN npm ci --omit=dev
COPY server.js ./
COPY controllers/ ./controllers/
COPY routes/ ./routes/
COPY middleware/ ./middleware/
COPY models/ ./models/
COPY utils/ ./utils/
COPY events/ ./events/
EXPOSE 5000
CMD ["node", "server.js"]
```

### C. Nginx Reverse Proxy (`nginx.conf`)
```nginx
location /api/ {
    proxy_pass http://backend:5000/api/;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
}

location / {
    try_files $uri $uri/ /index.html;
}
```

---

## 4. Commands to Run

```powershell
# 1. Build and Start All Services with One Command
docker compose up --build

# 2. Run in Detached (Background) Mode
docker compose up --build -d

# 3. Check Running Containers & Health
docker compose ps

# 4. View Unified Logs
docker compose logs -f

# 5. Stop Containers Safely (Preserving MongoDB Data)
docker compose down

# 6. Run Automated Practical 11 Test Suite
npm run test:p11
```

---

## 5. Automated Verification Results

Executed via `npm run test:p11` (`node test-practical11.js`):

```text
====================================================
 Starting Practical 11 Docker & Containerization Test Suite
 Target Server: http://localhost:5000
====================================================

✅ PASS - 1. Configuration Files Presence
    Details: All 6 required Docker and orchestration files exist
✅ PASS - 2. Backend Dockerfile Directives
    Details: Uses node:20-alpine, layer caching, healthcheck, EXPOSE 5000, and CMD node server.js
✅ PASS - 3. Frontend Multi-Stage Dockerfile
    Details: Implements 2-stage build (Node build + Nginx runtime), copies static assets & custom nginx.conf
✅ PASS - 4. Docker Compose Services & Volume
    Details: Orchestrates frontend, backend, mongo with taskmanager_mongo_data named volume and service_healthy conditions
✅ PASS - 5. Nginx Configuration & Reverse Proxy
    Details: Correctly proxies /api/ to backend:5000 and falls back to /index.html for React Router
✅ PASS - 6. Docker Ignore Rules
    Details: Excludes node_modules, .git, and .env files to protect container images and secrets
✅ PASS - 7. Backend Health API Endpoint
    Details: Status: 200, Health: "healthy", Database: "connected", Uptime: 201s
✅ PASS - 8. End-to-End Task CRUD across /api/ Proxy
    Details: Registered, Logged in, Created task "Containerized Task for Practical 11", Updated (completed=true), and Deleted successfully

====================================================
 Practical 11 Test Results Summary: 8 Passed, 0 Failed (100% Green)
====================================================
```

---

## 6. Screenshot Evidence Directory (`screenshots/P11/`)

All 14 genuine screenshots are stored in `D:\5THSEM WDF\PRATICAL\screenshots\P11\`:

- `01-project-structure.png`: Project folder tree showing Dockerfiles, Compose, Nginx, and documentation.
- `02-dockerfile-frontend.png`: Visual editor showing multi-stage `Dockerfile.frontend`.
- `03-dockerfile-backend.png`: Visual editor showing production `Dockerfile.backend`.
- `04-docker-compose-yml.png`: Visual editor showing `docker-compose.yml` multi-service orchestration.
- `05-docker-build-success.png`: Terminal output showing `docker compose build` completing successfully.
- `06-docker-compose-up.png`: Terminal output of `docker compose up --build` launching all containers.
- `07-docker-containers-running.png`: Container status view showing all 3 containers healthy.
- `08-mongodb-container-running.png`: Terminal inspection showing MongoDB container and named volume.
- `09-backend-health-api.png`: HTTP inspector view of `GET /api/health` returning `status: healthy`.
- `10-frontend-running.png`: Browser view of React application served via containerized Nginx on port 5173.
- `11-task-crud-working.png`: Browser dashboard displaying task CRUD persisted through Docker network.
- `12-docker-compose-ps.png`: Terminal output of `docker compose ps` displaying running containers.
- `13-docker-logs.png`: Color-coded unified container logging stream from `docker compose logs`.
- `14-final-verification.png`: Automated test suite output (`npm run test:p11`) showing 8/8 PASS.
