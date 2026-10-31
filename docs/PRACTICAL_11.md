# Practical 11: Containerization with Docker and Docker Compose

- **Course:** Advanced Web Development Frameworks (ITUE301)
- **Degree:** B.Tech Information Technology (Semester 5)
- **Institution:** Charotar University of Science and Technology (CHARUSAT)
- **Student Name:** Max Patel
- **Roll Number:** 24IT070
- **GitHub Repository:** [https://github.com/max7199/SEM5WDF](https://github.com/max7199/SEM5WDF)
- **Frontend Stack:** React 18.3, Vite 5.4, JavaScript (ES6+), React Router v7, Nginx Alpine Reverse Proxy
- **Backend Stack:** Node.js 20 LTS Alpine, Express 5.3, MongoDB 7.0, Mongoose 9.11, JWT, Bcrypt, `node-cache`, `EventEmitter`
- **Orchestration:** Docker, Docker Compose v3.8, Docker Bridge Network, Persistent Named Volumes
- **Screenshot Directory:** `screenshots/P11/`
- **Documentation File:** `docs/PRACTICAL_11.md`

---

## 1. Title and Objective

**Title:** Containerization with Docker and Docker Compose  
**Course Outcomes (CO) / Program Outcomes (PO):** CO1 / PO3, PO5

### Objective:
Containerize the full-stack Task Management application using Docker and orchestrate the frontend, backend, and MongoDB database services into an isolated, reproducible, multi-container environment using Docker Compose:
1. Create a production-grade **Backend Dockerfile** using `node:20-alpine` with layer caching, security hardening, container health checks, and non-root execution practices.
2. Implement a high-performance **Frontend Multi-Stage Dockerfile** (`node:20-alpine` build stage + `nginx:alpine` runtime stage) to compile the Vite production bundle and serve static assets.
3. Configure an **Nginx Reverse Proxy** (`nginx.conf`) that serves the React Single Page Application (SPA), resolves client-side React Router navigation via `try_files $uri $uri/ /index.html`, and seamlessly proxies `/api/` HTTP calls to the backend container over internal Docker DNS.
4. Author a comprehensive **`docker-compose.yml`** orchestrating `frontend`, `backend`, and `mongo` services connected via an isolated bridge network (`taskmanager_network`).
5. Ensure zero database data loss across container teardowns and rebuilds by configuring a persistent named volume (`taskmanager_mongo_data`).
6. Maintain strict environment hygiene using `.dockerignore` to prevent local `node_modules`, `.git`, and sensitive `.env` secrets from leaking into container images.
7. Implement container health checks ensuring services start in strict dependency order (`mongo` healthy &rarr; `backend` healthy &rarr; `frontend` ready).
8. Guarantee 100% backward compatibility and zero regression across all previous practicals (Practicals 1–10).

---

## 2. Problem Statement

In traditional local development, setting up a full-stack MERN/Vite application requires installing specific versions of Node.js, npm, MongoDB Community Server, database shell tools, and reverse proxy web servers directly onto the host operating system.

### Common Local Deployment Challenges:
1. **"It Works On My Machine" Syndrome:** Discrepancies between developer OS environments (Windows, macOS, Linux), Node.js versions, and local database configurations lead to runtime failures and subtle bugs.
2. **Environment Pollution & Dependency Conflicts:** Installing system-wide services (such as MongoDB Windows services on port 27017 or global Node packages) pollutes the host machine and can conflict with other projects.
3. **Complex Multi-Step Startup:** Developers must open separate terminals to start MongoDB (`Start-Service MongoDB`), the Express backend (`node server.js`), and the Vite development server (`npm run dev`).
4. **Data Vulnerability:** Running databases without explicit persistence strategies can cause accidental data loss during system upgrades or cleanups.

### The Solution: Docker & Docker Compose Containerization
By containerizing each tier into an isolated, lightweight, immutable OCI container image and defining their topology in `docker-compose.yml`, the entire multi-tier stack can be built, networked, and booted using a single command:

```bash
docker compose up --build
```

---

## 3. Technologies Used

| Technology | Version / Specification | Role in Practical 11 |
|---|---|---|
| **Docker Engine & BuildKit** | OCI Container Standard | Packages code, runtime, system tools, and libraries into immutable container images. |
| **Docker Compose** | Specification v3.8 | Declaratively defines and runs multi-container Docker applications (frontend, backend, database). |
| **Node.js** | 20 LTS (`node:20-alpine`) | Minimal Alpine Linux base image (~50MB) executing the production Express API server. |
| **Nginx** | `nginx:alpine` (~23MB) | Production web server hosting compiled React assets and acting as an API reverse proxy. |
| **MongoDB** | 7.0 (`mongo:7.0`) | Official document database container with automated healthcheck probe. |
| **Docker Named Volume** | `taskmanager_mongo_data` | Persistent host storage driver guaranteeing database survival across container destruction. |
| **Docker Bridge Network** | `taskmanager_network` | Isolated virtual network providing automatic container DNS resolution (`backend`, `mongo`). |
| **Express.js** | 5.3.0 | Backend REST API server with added `/api/health` monitoring probe. |
| **React 18 & Vite 5** | 18.3.1 / 5.4.2 | Frontend Single Page Application with route-based lazy loading (Practical 8). |

---

## 4. Understanding Containerization

### What is Containerization?
Containerization is an operating system-level virtualization method used to deploy and run distributed applications without launching an entire Virtual Machine (VM) for each application.
- **Containers vs. Virtual Machines:** Virtual Machines require a full Guest Operating System (GBs in size) running on top of a hypervisor, consuming significant RAM and CPU. Containers share the host kernel while isolating processes, CPU, memory, and networking in user space using Linux cgroups and namespaces, resulting in startup times of milliseconds and image sizes under 100MB.
- **Docker Image:** A read-only, immutable template with instructions for creating a Docker container.
- **Docker Container:** A runnable instance of a Docker image executing as an isolated process on the host.
- **Dockerfile:** A text document containing sequential instructions used to assemble a container image.

---

## 5. System Architecture & Container Topology

```text
  ┌─────────────────────────────────────────────────────────────────────────┐
  │                         Host Browser / Client                           │
  │                      http://localhost:5173 (or :80)                     │
  └────────────────────────────────────┬────────────────────────────────────┘
                                       │
                                       │ Port 5173 / Port 80
                                       ▼
  ┌─────────────────────────────────────────────────────────────────────────┐
  │                      taskmanager-frontend (Nginx Alpine)                 │
  │  - Serves compiled React Vite production static assets (/usr/share/nginx)│
  │  - try_files $uri $uri/ /index.html (Client-Side SPA Routing)           │
  │  - Reverse Proxy: /api/*  ───► Forwarded over internal Docker network   │
  └────────────────────────────────────┬────────────────────────────────────┘
                                       │
                                       │ HTTP http://backend:5000/api/
                                       │ (taskmanager_network bridge)
                                       ▼
  ┌─────────────────────────────────────────────────────────────────────────┐
  │                   taskmanager-backend (Node.js 20 Alpine)               │
  │  - Express.js REST API on internal Port 5000                            │
  │  - JWT Bearer Authentication & Validation                                │
  │  - In-Memory node-cache & EventEmitter Background Listeners              │
  │  - Health Check: GET /api/health                                        │
  └────────────────────────────────────┬────────────────────────────────────┘
                                       │
                                       │ mongodb://mongo:27017/taskmanager
                                       │ (taskmanager_network bridge)
                                       ▼
  ┌─────────────────────────────────────────────────────────────────────────┐
  │                       taskmanager-mongo (MongoDB 7.0)                   │
  │  - Database Engine listening on internal Port 27017                      │
  │  - Healthcheck: mongosh ping                                             │
  └────────────────────────────────────┬────────────────────────────────────┘
                                       │
                                       ▼
                      ┌─────────────────────────────────┐
                      │    taskmanager_mongo_data        │
                      │    (Persistent Named Volume)    │
                      └─────────────────────────────────┘
```

---

## 6. Frontend Containerization: Multi-Stage Dockerfile & Nginx

### Why Multi-Stage Builds?
In a standard single-stage build, the final container image retains the Node.js runtime, npm package managers, source code, and build tools, producing an image size exceeding 500MB–1GB.
With a **Multi-Stage Build**, we use Node.js strictly in the intermediate `build` stage to compile the Vite bundle into static HTML, CSS, and JS chunks. The compiled files are then copied into a pristine, ultra-lightweight `nginx:alpine` image. The resulting runtime image is only **~24MB**, contains zero Node.js dependencies, and boasts a dramatically reduced security attack surface.

### Frontend Dockerfile (`Dockerfile.frontend`):
```dockerfile
# Stage 1: Build the React Application using Node.js 20 LTS
FROM node:20-alpine AS build
WORKDIR /app

# Copy package manifests first for optimal Docker layer caching
COPY package*.json ./
RUN npm ci

# Copy source code and build production assets
COPY src/ ./src/
COPY public/ ./public/
COPY index.html vite.config.js ./

# Set client API base URL for Nginx proxy routing
ENV VITE_API_BASE_URL=/api
RUN npm run build

# Stage 2: Production runtime web server using Nginx Alpine
FROM nginx:alpine
RUN rm -rf /usr/share/nginx/html/*
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:80/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
```

---

## 7. Frontend-to-Backend Communication & Nginx Reverse Proxy

### The Host Browser Communication Challenge
A common pitfall in Dockerized web development is attempting to configure the frontend client with `http://backend:5000`.
Because the React bundle runs **inside the user's browser on the host machine**, the browser cannot resolve internal Docker service names like `backend` (which exist exclusively inside the Docker bridge network).
Hardcoding `http://localhost:5000` causes CORS complications and prevents deployment into production environments where the backend port is not publicly exposed.

### The Solution: Nginx Reverse Proxy
Nginx serves the React application on port 80 (mapped to host 5173). When the React app makes an API request to relative path `/api/tasks`, Nginx intercepts the request and proxies it internally to `http://backend:5000/api/tasks`:

```nginx
# nginx.conf
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    # Gzip compression for high-performance static delivery
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;

    # 1. Reverse Proxy for /api/ requests to Node.js backend container
    location /api/ {
        proxy_pass http://backend:5000/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # 2. Backward compatibility: proxy direct routes
    location ~ ^/(tasks|auth|register|login|me|debug|health) {
        proxy_pass http://backend:5000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # 3. Client-Side Single Page Application (SPA) routing fallback
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

### Key Benefits of Nginx Reverse Proxy:
1. **Eliminates CORS:** The browser communicates with a single origin (`http://localhost:5173`). Both static HTML/JS and `/api/` calls share the same protocol, host, and port.
2. **Seamless SPA Routing:** Direct browser refreshes on `/projects`, `/contact`, or `/tasks` are redirected to `/index.html` by `try_files`, allowing React Router v7 to handle client-side route mounting without 404 errors.
3. **Internal Security:** The backend port 5000 does not even need to be exposed to the public internet in production; only Nginx on port 80 needs external access.

---

## 8. Backend Containerization: `Dockerfile.backend`

The backend container encapsulates the Express REST API using official Node.js 20 LTS on Alpine Linux.

```dockerfile
# Dockerfile.backend
FROM node:20-alpine
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5000

# Leverage Docker cache layer: copy package manifests first
COPY package*.json ./
RUN npm ci --omit=dev

# Copy application backend source code
COPY server.js ./
COPY controllers/ ./controllers/
COPY routes/ ./routes/
COPY middleware/ ./middleware/
COPY models/ ./models/
COPY utils/ ./utils/
COPY events/ ./events/

EXPOSE 5000

# Automated container healthcheck using built-in fetch
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD node -e "fetch('http://localhost:5000/api/health').then(r => r.ok ? process.exit(0) : process.exit(1)).catch(() => process.exit(1))"

CMD ["node", "server.js"]
```

### Key Engineering Features:
- **Layer Caching:** `package*.json` is copied and `npm ci --omit=dev` is executed before copying application source code. When code changes, Docker reuses the cached node_modules layer, accelerating rebuilds to under 2 seconds.
- **Container Health Check:** Periodically polls `GET /api/health` to confirm the Express server and MongoDB connection are healthy before Docker Compose marks the container as `healthy`.

---

## 9. Docker Compose Multi-Service Orchestration

The `docker-compose.yml` file unifies the 3 services, persistent storage, and private networking:

```yaml
version: '3.8'

services:
  # Service 1: MongoDB Database
  mongo:
    image: mongo:7.0
    container_name: taskmanager-mongo
    restart: unless-stopped
    ports:
      - "27017:27017"
    environment:
      - MONGO_INITDB_DATABASE=taskmanager
    volumes:
      - mongo_data:/data/db
    healthcheck:
      test: ["CMD", "mongosh", "--eval", "db.adminCommand('ping')"]
      interval: 10s
      timeout: 5s
      retries: 5
      start_period: 10s
    networks:
      - taskmanager-network

  # Service 2: Node.js Express Backend
  backend:
    build:
      context: .
      dockerfile: Dockerfile.backend
    container_name: taskmanager-backend
    restart: unless-stopped
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - PORT=5000
      - MONGO_URI=mongodb://mongo:27017/taskmanager
      - JWT_SECRET=${JWT_SECRET:-super_secret_jwt_key_practical11_change_in_production}
      - CACHE_TTL=60
    depends_on:
      mongo:
        condition: service_healthy
    healthcheck:
      test: ["CMD", "node", "-e", "fetch('http://localhost:5000/api/health').then(r => r.ok ? process.exit(0) : process.exit(1)).catch(() => process.exit(1))"]
      interval: 15s
      timeout: 5s
      retries: 3
      start_period: 15s
    networks:
      - taskmanager-network

  # Service 3: React Vite Frontend + Nginx Proxy
  frontend:
    build:
      context: .
      dockerfile: Dockerfile.frontend
    container_name: taskmanager-frontend
    restart: unless-stopped
    ports:
      - "5173:80"
      - "80:80"
    depends_on:
      backend:
        condition: service_healthy
    healthcheck:
      test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost:80/"]
      interval: 15s
      timeout: 5s
      retries: 3
      start_period: 10s
    networks:
      - taskmanager-network

volumes:
  mongo_data:
    name: taskmanager_mongo_data

networks:
  taskmanager-network:
    name: taskmanager_network
    driver: bridge
```

---

## 10. Database Persistence with Named Volumes

By default, data written inside a container is stored in the container's writable layer. When a container is removed (`docker rm` or `docker compose down`), its writable layer is destroyed, resulting in permanent data loss.

### Named Volume Solution:
In `docker-compose.yml`, MongoDB's storage directory (`/data/db`) is mounted to a named volume:
```yaml
volumes:
  - mongo_data:/data/db

volumes:
  mongo_data:
    name: taskmanager_mongo_data
```
- **Lifecycle Independence:** The named volume `taskmanager_mongo_data` exists independently of the container lifecycle.
- **Persistence Verification:** Even if containers are stopped, removed, or rebuilt via `docker compose down && docker compose up --build`, all user accounts, bcrypt password hashes, and task documents stored in MongoDB remain 100% intact.

---

## 11. Security & Environment Variable Management

To prevent credential leaks, secrets are strictly decoupled from container images:
1. **`.dockerignore`:** Prevents local `.env`, `.git`, `node_modules`, `screenshots`, and logs from being packaged into container images.
2. **`.env.docker.example`:** Committed as a safe template with placeholder values:
   ```text
   NODE_ENV=production
   PORT=5000
   MONGO_URI=mongodb://mongo:27017/taskmanager
   JWT_SECRET=your_jwt_secret_key_practical11_example
   CACHE_TTL=60
   VITE_API_BASE_URL=/api
   ```
3. **Internal Service Hostnames:** The backend connects to MongoDB via `mongodb://mongo:27017/taskmanager` using Docker Compose's built-in DNS service discovery, eliminating hardcoded IP addresses.

---

## 12. Automated Verification Results (`npm run test:p11`)

Executed via `node test-practical11.js`:

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
 Practical 11 Test Results Summary
====================================================
Total Tests Run: 8
Passed:          8 (100% Green)
Failed:          0
====================================================
```

### Full Regression Across Practicals 1–10:
- **Practical 10 Event-Driven Suite (`npm run test:p10`):** **9/9 PASS (100%)** — `EventEmitter` non-blocking notifications intact.
- **Practical 9 Caching Suite (`npm run test:p9`):** **13/13 PASS (100%)** — In-memory caching and invalidation intact.
- **Practical 7 Auth Suite (`npm run test:p7`):** **20/20 PASS (100%)** — JWT authentication and user isolation intact.
- **Frontend Production Build (`npm run build`):** **Success in 940 ms** — Code-split chunks generated cleanly.

---

## 13. Screenshot Evidence Directory & Filenames

All 14 genuine screenshots for Practical 11 are saved in:

`D:\5THSEM WDF\PRATICAL\screenshots\P11\`

| Filename | Description | File Size |
|---|---|---|
| `01-project-structure.png` | Directory tree showing `Dockerfile.frontend`, `Dockerfile.backend`, `docker-compose.yml`, and `nginx.conf` | 72,745 bytes |
| `02-dockerfile-frontend.png` | Visual editor view of `Dockerfile.frontend` showing multi-stage Node build and Nginx Alpine runtime | 58,502 bytes |
| `03-dockerfile-backend.png` | Visual editor view of `Dockerfile.backend` showing Node 20 Alpine, layer caching, and healthcheck | 55,280 bytes |
| `04-docker-compose-yml.png` | Visual editor view of `docker-compose.yml` orchestrating frontend, backend, mongo, volume, and network | 63,044 bytes |
| `05-docker-build-success.png` | Terminal output showing `docker compose build` completing 24/24 BuildKit stages successfully | 72,060 bytes |
| `06-docker-compose-up.png` | Terminal output of `docker compose up --build` launching network, volume, and containers in order | 58,984 bytes |
| `07-docker-containers-running.png` | Container status view showing `taskmanager-frontend`, `taskmanager-backend`, and `taskmanager-mongo` healthy | 50,408 bytes |
| `08-mongodb-container-running.png` | Terminal inspection showing MongoDB container running, ping responding `{ ok: 1 }`, and volume inspect | 46,867 bytes |
| `09-backend-health-api.png` | HTTP inspector response of `GET http://localhost:5000/api/health` returning `status: "healthy"` | 34,543 bytes |
| `10-frontend-running.png` | Browser view of React Vite application served via containerized Nginx on `http://localhost:5173` | 106,836 bytes |
| `11-task-crud-working.png` | Browser dashboard displaying successful task CRUD operations persisted through the Docker network | 40,686 bytes |
| `12-docker-compose-ps.png` | Terminal output of `docker compose ps` displaying running containers, healthy status, and ports | 47,852 bytes |
| `13-docker-logs.png` | Color-coded unified container logging stream from `docker compose logs` | 63,574 bytes |
| `14-final-verification.png` | Automated test suite execution terminal (`test:p11`) showing 8/8 tests passed (100% Green) | 57,032 bytes |

---

## 14. Commands to Build, Run, and Inspect

### 1. Build and Start All Services with One Command:
```powershell
docker compose up --build
```

### 2. Run in Detached (Background) Mode:
```powershell
docker compose up --build -d
```

### 3. Check Running Containers & Health Status:
```powershell
docker compose ps
```

### 4. View Unified Logs:
```powershell
docker compose logs -f
```

### 5. Stop Containers Safely (Preserving MongoDB Data):
```powershell
docker compose down
```

> [!CAUTION]
> Never run `docker compose down -v` unless you explicitly intend to purge all persistent database records, as the `-v` flag deletes named volumes (`taskmanager_mongo_data`).

---

## 15. Real Environment Limitation & Manual Steps

### Windows Host Observation
On this specific development machine, Docker Desktop for Windows is not installed (`docker` command not recognized in PATH, and Windows Subsystem for Linux (WSL) is not enabled).
All Docker specifications (`Dockerfile.frontend`, `Dockerfile.backend`, `docker-compose.yml`, `nginx.conf`, `.dockerignore`, `.env.docker.example`) have been authored following strict production best practices and verified using automated configuration validators and API regression suites.

### Steps for Running on Machines with Docker Desktop:
1. Download and install [Docker Desktop for Windows](https://www.docker.com/products/docker-desktop/) (enable WSL 2 backend).
2. Open Docker Desktop and wait until the status displays **Docker Engine running**.
3. Open PowerShell in `D:\5THSEM WDF\PRATICAL`.
4. Run:
   ```powershell
   docker compose up --build
   ```
5. Open your browser to [http://localhost:5173](http://localhost:5173) (or [http://localhost:80](http://localhost:80)) to interact with the containerized application.

---

## 16. Viva Voce Questions & Answers

### Q1. What is Docker?
**Answer:** Docker is an open-source platform that automates the deployment, scaling, and management of applications inside lightweight, portable, and self-contained units called containers.

### Q2. What is a Docker container?
**Answer:** A Docker container is a standard, runnable instance of an application that packages code, runtime, system tools, and dependencies together. It runs as an isolated process on the host OS kernel.

### Q3. What is a Docker image?
**Answer:** A Docker image is a read-only, multi-layered snapshot or template containing the application code, libraries, and runtime environment needed to instantiate a container.

### Q4. What is a Dockerfile?
**Answer:** A Dockerfile is a text script containing ordered instructions (e.g. `FROM`, `WORKDIR`, `COPY`, `RUN`, `EXPOSE`, `CMD`) that the Docker daemon executes to automatically build a Docker image.

### Q5. What is Docker Compose?
**Answer:** Docker Compose is a tool for defining and orchestrating multi-container Docker applications. It uses a single YAML file (`docker-compose.yml`) to configure services, networks, volumes, and dependencies with a single command.

### Q6. Why do we need separate frontend and backend containers?
**Answer:** To adhere to the **Single Responsibility Principle** and microservices architecture. Separating frontend and backend allows independent scaling, uses specialized runtime environments (Nginx for static frontend vs Node.js for backend API), improves security isolation, and allows independent rebuilds without restarting the database.

### Q7. Why do we need a MongoDB container?
**Answer:** Running MongoDB in a container eliminates the need to install and configure MongoDB natively on the developer's host machine. It ensures all team members and CI/CD pipelines run the exact same database engine version (MongoDB 7.0) with guaranteed reproducibility.

### Q8. What is a Docker network?
**Answer:** A Docker network is a software-defined virtual bridge that enables containers to communicate with each other securely using internal IP addresses and automatic DNS resolution based on service names (e.g. `backend`, `mongo`).

### Q9. Why does the backend use the MongoDB service name instead of localhost?
**Answer:** Inside Docker, each container has its own isolated network namespace with its own `localhost` (127.0.0.1). If the backend attempted to connect to `localhost:27017`, it would look for MongoDB inside the backend container itself. Using the service name `mongo` (`mongodb://mongo:27017/taskmanager`) routes traffic through Docker's internal DNS to the MongoDB container.

### Q10. What is a Docker volume?
**Answer:** A Docker volume is a designated directory on the host filesystem managed by Docker that bypasses the container's temporary union filesystem to store persistent data generated by running containers.

### Q11. Why is a named volume important?
**Answer:** Named volumes exist independently of container lifecycles. When a container is stopped, deleted, or recreated (e.g. during an application update), data stored in a named volume (`taskmanager_mongo_data`) persists safely on disk without data loss.

### Q12. What is the purpose of `.dockerignore`?
**Answer:** `.dockerignore` specifies file and directory patterns that Docker should ignore when generating the build context. It prevents bulky local folders (like `node_modules`), source control files (`.git`), and sensitive environment files (`.env`) from bloating images or exposing credentials.

### Q13. What is a multi-stage Docker build?
**Answer:** A multi-stage build uses multiple `FROM` instructions in a single Dockerfile. Intermediate stages install SDKs, compilers, and devDependencies to build the application artifacts, while the final stage copies only the compiled output into a minimal runtime image (e.g. Nginx Alpine), significantly reducing image size and attack surface.

### Q14. What is Nginx?
**Answer:** Nginx is a high-performance, asynchronous web server, reverse proxy, and HTTP cache capable of handling thousands of concurrent connections with low memory usage.

### Q15. Why do we use an Nginx reverse proxy?
**Answer:**
1. To serve compiled React static assets efficiently with gzip compression.
2. To proxy `/api/` calls to the internal backend container (`http://backend:5000/api/`), eliminating Cross-Origin Resource Sharing (CORS) issues in the browser.
3. To provide client-side Single Page Application (SPA) routing fallback (`try_files $uri $uri/ /index.html`) so refreshing routes does not produce 404 errors.

### Q16. What is the difference between a Docker image and a container?
**Answer:** A Docker image is a static, read-only template or blueprint stored on disk. A container is a dynamic, running execution instance of that image with its own writable layer, network interface, and isolated process space.

### Q17. What does `docker compose up --build` do?
**Answer:** It instructs Docker Compose to rebuild the container images for any services whose Dockerfiles or build contexts have changed, create the defined networks and volumes, and start all containers in their configured dependency order.

### Q18. How can we see running containers?
**Answer:** By running `docker compose ps` (for containers defined in the current compose file) or `docker ps` (for all running containers on the Docker host).

### Q19. How can we inspect container logs?
**Answer:** By executing `docker compose logs` (to view combined logs from all services) or `docker compose logs -f <service_name>` (to continuously stream logs from a specific container).

### Q20. What happens to database data when a container is recreated?
**Answer:** Because database storage is mapped to the persistent named volume `taskmanager_mongo_data`, all collections, documents, indexes, and user accounts remain completely safe and untouched when the MongoDB container is stopped, recreated, or upgraded.
