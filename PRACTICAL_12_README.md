# Practical 12: CI/CD Pipeline with GitHub Actions

- **Student Name:** Max Patel
- **Roll Number:** 24IT070
- **Course:** Advanced Web Development Frameworks (ITUE301)
- **Institution:** Charotar University of Science and Technology (CHARUSAT)
- **Repository:** [https://github.com/max7199/SEM5WDF](https://github.com/max7199/SEM5WDF)
- **CI/CD Platform:** GitHub Actions (`ubuntu-latest`)
- **Technology Stack:** Node.js 20 LTS, Jest 29, Supertest 7, Express 5, React 18, Vite 5
- **Screenshot Directory:** `screenshots/P12/`
- **Detailed Documentation:** [docs/PRACTICAL_12.md](docs/PRACTICAL_12.md)
- **CI Status Badge:** [![CI Pipeline](https://github.com/max7199/SEM5WDF/actions/workflows/ci.yml/badge.svg)](https://github.com/max7199/SEM5WDF/actions/workflows/ci.yml)

---

## 1. Practical Objective & Overview

The objective of Practical 12 is to **automate dependency installation, testing, and pipeline status reporting** using GitHub Actions:

1. **Separation of Application and Server (`app.js` vs `server.js`):**
   - `app.js`: Configures Express middleware, routes, `/api/health`, and error handling; exports `app`.
   - `server.js`: Connects to MongoDB and starts listening on port 5000.
2. **Jest & Supertest Automated Testing:**
   - Integration test suite in `tests/api.test.js` exercising health probes, API metadata, route protection (401), validation (400), and 404 handling.
3. **GitHub Actions Workflow (`.github/workflows/ci.yml`):**
   - Automatically triggered on push and PR to `main`.
   - Executes 2 parallel jobs on `ubuntu-latest`:
     - **API Tests:** `npm install` &rarr; `npm test` (Jest + Supertest).
     - **Build Verification:** `npm install` &rarr; `npm run build` (React Vite bundle compilation).
4. **Demonstrations:**
   - **Deliberate Failure:** Broken assertion pushed to verify red failure reporting (`practical12: demonstrate failing test`).
   - **Fix and Recovery:** Restored assertion pushed to restore green checkmark (`practical12: fix failing test`).
5. **README Status Badge:**
   - Live SVG badge embedded in `README.md` reflecting real-time pipeline status.

---

## 2. GitHub Actions Workflow Configuration (`.github/workflows/ci.yml`)

```yaml
name: CI Pipeline

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    name: Run Automated API Tests
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Repository
        uses: actions/checkout@v4
      - name: Setup Node.js 20 LTS Environment
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
      - name: Install Dependencies
        run: npm install
      - name: Execute Jest & Supertest Automated Tests
        run: npm test

  build:
    name: Verify Production Build
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Repository
        uses: actions/checkout@v4
      - name: Setup Node.js 20 LTS Environment
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
      - name: Install Dependencies
        run: npm install
      - name: Compile React Vite Bundle
        run: npm run build
```

---

## 3. Automated Tests Implemented (`tests/api.test.js`)

```javascript
import request from 'supertest';
import app from '../app.js';

describe('Task Management API Test Suite (Practical 12 CI/CD)', () => {
  test('GET /api/health returns HTTP 200 and healthy status', async () => {
    const res = await request(app).get('/api/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('healthy');
  });

  test('GET / returns HTTP 200 and API metadata information', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  test('GET /api/nonexistent-route returns HTTP 404', async () => {
    const res = await request(app).get('/api/nonexistent-route');
    expect(res.statusCode).toBe(404);
  });

  test('GET /tasks returns HTTP 401 when Authorization token is missing', async () => {
    const res = await request(app).get('/tasks');
    expect(res.statusCode).toBe(401);
  });

  test('POST /register returns HTTP 400 when body is invalid', async () => {
    const res = await request(app).post('/register').set('Content-Type', 'application/json').send({});
    expect(res.statusCode).toBe(400);
  });
});
```

---

## 4. Commands to Run Locally

```powershell
# 1. Run Jest & Supertest Automated Tests
npm test

# 2. Run Practical 12 Specific Test Script
npm run test:p12

# 3. Compile Production Frontend Bundle
npm run build

# 4. Start Local Backend Server
node server.js
```

---

## 5. Screenshot Evidence Directory (`screenshots/P12/`)

All 12 genuine screenshots are stored in `D:\5THSEM WDF\PRATICAL\screenshots\P12\`:

- `01-project-structure.png`: Project folder tree showing `.github/workflows/ci.yml`, `app.js`, `server.js`, and `tests/`.
- `02-github-workflow-yml.png`: Visual code editor showing `.github/workflows/ci.yml`.
- `03-jest-supertest-installed.png`: Terminal output of `npm install --save-dev jest supertest`.
- `04-automated-test-files.png`: Source code of `tests/api.test.js`.
- `05-local-tests-passing.png`: Local terminal output of `npm test` passing 5/5 tests.
- `06-github-actions-workflow.png`: GitHub Actions web interface showing workflow configuration.
- `07-github-actions-failed-run.png`: GitHub Actions web UI displaying red failure status (✖).
- `08-failed-test-log.png`: GitHub Actions raw runner logs showing assertion failure.
- `09-github-actions-passed-run.png`: GitHub Actions web UI displaying green passing status (✔).
- `10-passed-test-log.png`: GitHub Actions runner logs showing 5/5 passing tests and Vite build success.
- `11-readme-ci-badge.png`: Browser view of `README.md` displaying the live green passing badge.
- `12-final-git-status.png`: Git terminal showing clean git status and commit history.
