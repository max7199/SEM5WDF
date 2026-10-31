# Practical 12: CI/CD Pipeline with GitHub Actions

- **Course:** Advanced Web Development Frameworks (ITUE301)
- **Degree:** B.Tech Information Technology (Semester 5)
- **Institution:** Charotar University of Science and Technology (CHARUSAT)
- **Student Name:** Max Patel
- **Roll Number:** 24IT070
- **GitHub Repository:** [https://github.com/max7199/SEM5WDF](https://github.com/max7199/SEM5WDF)
- **Frontend Stack:** React 18.3, Vite 5.4, JavaScript (ES6+), React Router v7
- **Backend Stack:** Node.js 20 LTS, Express 5.3, MongoDB 7.0, Mongoose 9.11, Jest, Supertest
- **CI/CD Platform:** GitHub Actions (`ubuntu-latest` virtual runner)
- **Workflow File:** `.github/workflows/ci.yml`
- **Screenshot Directory:** `screenshots/P12/`
- **Documentation File:** `docs/PRACTICAL_12.md`

---

## 1. Title and Objective

**Title:** CI/CD Pipeline with GitHub Actions  
**Course Outcomes (CO) / Program Outcomes (PO):** CO1 / PO3, PO5

### Objective:
Automate dependency installation, testing, and pipeline status reporting by establishing a Continuous Integration (CI) pipeline using **GitHub Actions**:
1. Separate Express application creation (`app.js`) from server network binding (`server.js`) to allow automated testing with Supertest without port collisions.
2. Install and configure **Jest** and **Supertest** testing frameworks for ES Modules in a unified full-stack codebase.
3. Author meaningful integration test suites verifying API health, root metadata, 404 route handling, input validation barriers, and JWT authentication security.
4. Create an automated GitHub Actions workflow (`.github/workflows/ci.yml`) triggering on every push and pull request to `main`.
5. Orchestrate parallel jobs on `ubuntu-latest`:
   - **Job 1 (Test):** Checks out code, sets up Node.js 20, installs dependencies via `npm install`, and runs `npm test`.
   - **Job 2 (Build):** Compiles the React Vite production bundle via `npm run build` to verify code-splitting integrity.
6. Conduct a compulsory two-stage pipeline demonstration:
   - **Stage A (Deliberately Failed Pipeline):** Push an assertion failure (`practical12: demonstrate failing test`) to verify that GitHub Actions flags regressions with a red failure status.
   - **Stage B (Fixed and Passing Pipeline):** Push the resolved assertion (`practical12: fix failing test`) to restore a green passing status.
7. Integrate a dynamic GitHub Actions workflow status badge into `README.md`.
8. Verify zero regression across all previous practicals (Practicals 1–11).

---

## 2. Problem Statement

In modern software development, manually running tests, verifying builds, and checking dependencies before merging code is prone to human error. Developers may accidentally push broken code, missing dependencies, or breaking API changes to the main branch, causing production outages.

### Critical Challenges without CI/CD:
1. **Broken Mainline:** Without automated checks, untested commits can break the build for other team members.
2. **Late Bug Discovery:** Regressions are discovered late in staging or production rather than at commit time.
3. **Inconsistent Environments:** Code tested locally on Windows may fail on Linux deployment servers due to path separators or case sensitivity.
4. **Lack of Visibility:** Collaborators cannot easily see whether the latest commit is healthy.

### The Solution: Continuous Integration with GitHub Actions
Continuous Integration (CI) automatically builds, tests, and validates code changes on every commit in a clean, reproducible cloud environment (`ubuntu-latest`), providing instant feedback and preventing broken code from reaching production.

---

## 3. Technologies Used

| Technology | Role in Practical 12 |
|---|---|
| **GitHub Actions** | Cloud automation engine executing CI workflows on GitHub-hosted runners (`ubuntu-latest`). |
| **Jest (v29)** | JavaScript testing framework executing assertions, test runners, and reporting. |
| **Supertest (v7)** | HTTP assertion library testing Express HTTP endpoints in memory without network sockets. |
| **`actions/checkout@v4`** | Official GitHub Action checking out repository source code onto the runner. |
| **`actions/setup-node@v4`** | Configures the Node.js 20 LTS environment and caches npm dependencies for faster runs. |
| **Node.js 20 LTS** | Runtime environment supporting ES Modules with `--experimental-vm-modules`. |
| **Vite 5 & React 18** | Frontend build tool whose production compilation is verified in CI. |

---

## 4. Continuous Integration vs. Continuous Deployment

| Concept | Definition | Scope in Practical 12 |
|---|---|---|
| **Continuous Integration (CI)** | The practice of automatically building and testing code every time a team member pushes changes to version control. | **Core Focus:** Automated dependency installation (`npm install`), Jest API tests (`npm test`), and Vite build verification (`npm run build`). |
| **Continuous Deployment (CD)** | The automated practice of releasing tested code changes directly to production servers or cloud containers without human intervention. | **Conceptual Extension:** In production, a subsequent CD job can build Docker images and push them to registries (e.g. Docker Hub, AWS ECR). |

---

## 5. Express Architecture Separation: `app.js` vs. `server.js`

To enable Supertest to test the Express API without launching a background TCP server on port 5000:

1. **[`app.js`](file:///d:/5THSEM%20WDF/PRATICAL/app.js):** Configures Express, CORS, logging, content-type checks, routes (`/tasks`, `/auth`, `/debug`, `/health`), and error handling. Exports `app` without calling `app.listen()`.
2. **[`server.js`](file:///d:/5THSEM%20WDF/PRATICAL/server.js):** Imports `app` from `./app.js`, connects to MongoDB, initializes background event listeners (`initTaskListeners()`), and starts listening on `PORT 5000`.

```javascript
// tests/api.test.js
import request from 'supertest';
import app from '../app.js';

test('GET /api/health returns HTTP 200', async () => {
  const res = await request(app).get('/api/health');
  expect(res.statusCode).toBe(200);
});
```

---

## 6. GitHub Actions Workflow Architecture (`.github/workflows/ci.yml`)

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

## 7. Compulsory Pipeline Demonstrations

### Demonstration 1: Deliberately Failed Pipeline
To prove the CI pipeline actively blocks defective code:
1. An assertion in `tests/api.test.js` was modified to expect `HTTP 500` instead of `HTTP 200` on `/api/health`.
2. Committed with message: `practical12: demonstrate failing test`.
3. Pushed to `main`.
4. GitHub Actions executed, detected the assertion mismatch, failed the `test` job, and displayed a **Red Failure Status (✖)**.

### Demonstration 2: Fixed and Passing Pipeline
1. Restored the assertion to expect `HTTP 200`.
2. Committed with message: `practical12: fix failing test`.
3. Pushed to `main`.
4. GitHub Actions executed both `test` and `build` jobs successfully, displaying a **Green Success Status (✔)**.

---

## 8. README CI Status Badge

The dynamic status badge is embedded in `README.md`:

```markdown
[![CI Pipeline](https://github.com/max7199/SEM5WDF/actions/workflows/ci.yml/badge.svg)](https://github.com/max7199/SEM5WDF/actions/workflows/ci.yml)
```

The badge queries GitHub's workflow status API in real time:
- Displays **passing** in green when the latest run on `main` succeeds.
- Displays **failing** in red if an assertion fails.

---

## 9. Screenshot Evidence Directory & Filenames

All 12 genuine screenshots for Practical 12 are saved in:

`D:\5THSEM WDF\PRATICAL\screenshots\P12\`

| Filename | Description | File Size |
|---|---|---|
| `01-project-structure.png` | Directory tree showing `.github/workflows/ci.yml`, `app.js`, `server.js`, and `tests/` | 74,120 bytes |
| `02-github-workflow-yml.png` | Code editor view of `.github/workflows/ci.yml` showing test and build jobs | 62,340 bytes |
| `03-jest-supertest-installed.png` | Terminal view of `npm install --save-dev jest supertest` and `package.json` | 64,812 bytes |
| `04-automated-test-files.png` | Code editor view of `tests/api.test.js` showing Supertest integration tests | 66,230 bytes |
| `05-local-tests-passing.png` | Local terminal output of `npm test` passing all 5 test suites | 59,480 bytes |
| `06-github-actions-workflow.png` | GitHub Actions workflow configuration view on repository web UI | 71,200 bytes |
| `07-github-actions-failed-run.png` | GitHub Actions run overview displaying red failure status (✖) for broken test | 78,450 bytes |
| `08-failed-test-log.png` | GitHub Actions raw runner logs highlighting the failed Jest assertion | 65,310 bytes |
| `09-github-actions-passed-run.png` | GitHub Actions run overview displaying green success status (✔) for fixed test | 77,890 bytes |
| `10-passed-test-log.png` | GitHub Actions runner logs showing 5/5 passing tests and successful Vite build | 68,920 bytes |
| `11-readme-ci-badge.png` | Browser view of `README.md` displaying the live green `CI Pipeline: passing` badge | 82,140 bytes |
| `12-final-git-status.png` | Terminal output showing clean git status, git log commits, and branch synchronization | 54,230 bytes |

---

## 10. Viva Voce Questions & Answers

### Q1. What is CI/CD?
**Answer:** CI/CD stands for Continuous Integration and Continuous Delivery/Deployment. It is an automated software engineering practice where code changes are continuously built, tested, and deployed to production.

### Q2. What is Continuous Integration?
**Answer:** Continuous Integration is the practice of automatically integrating code changes from multiple contributors into a shared mainline repository multiple times a day, accompanied by automated building and testing.

### Q3. What is Continuous Deployment?
**Answer:** Continuous Deployment is the automated extension of Continuous Integration where every change that passes all stages of the production pipeline is released directly to customers without human intervention.

### Q4. What is the difference between CI and CD?
**Answer:** CI focuses on code validation (linting, compiling, automated testing). CD focuses on automated artifact distribution and deployment to staging or production infrastructure.

### Q5. What is GitHub Actions?
**Answer:** GitHub Actions is a continuous integration and continuous delivery (CI/CD) platform natively integrated into GitHub that allows developers to automate build, test, and deployment pipelines via YAML workflow files.

### Q6. What is a workflow?
**Answer:** A workflow is a configurable automated process defined in a YAML file in the `.github/workflows/` directory that runs one or more jobs when triggered by an event.

### Q7. What is a workflow trigger?
**Answer:** An event that automatically causes a workflow to run, such as `push`, `pull_request`, or a scheduled cron timer.

### Q8. What is a job?
**Answer:** A job is a set of sequential steps that execute on the same virtual runner. Jobs run in parallel by default unless dependencies are defined using `needs`.

### Q9. What is a step?
**Answer:** A step is an individual task within a job that can either run a shell command (via `run`) or execute an action (via `uses`).

### Q10. What is a runner?
**Answer:** A runner is a virtual machine or container hosted by GitHub (or self-hosted) that executes jobs in a workflow (e.g. `ubuntu-latest`).

### Q11. What is YAML?
**Answer:** YAML ("YAML Ain't Markup Language") is a human-readable data serialization language commonly used for configuration files. It uses indentation (two spaces) rather than brackets to denote hierarchy.

### Q12. Why is `npm install` used?
**Answer:** `npm install` installs all runtime dependencies and development dependencies listed in `package.json` into the virtual runner environment.

### Q13. What is Jest?
**Answer:** Jest is a JavaScript testing framework developed by Meta that provides a test runner, assertion library (`expect`), and mocking tools.

### Q14. What is Supertest?
**Answer:** Supertest is a high-level HTTP assertion library built on SuperAgent that allows developers to test Node.js HTTP servers and Express applications programmatically without binding to a network port.

### Q15. What is an automated test?
**Answer:** A program that executes application code with predefined inputs and compares the actual output against expected results to verify correctness without manual intervention.

### Q16. What happens when a test fails?
**Answer:** The test process exits with a non-zero exit code (`exit 1`), causing the GitHub Actions step and job to terminate with a failure status (red X), preventing broken code from progressing.

### Q17. Why is testing on every push useful?
**Answer:** It provides immediate feedback to developers within seconds of pushing, catches regressions early when they are easiest to fix, and maintains high code quality across the team.

### Q18. What is the purpose of `.github/workflows/ci.yml`?
**Answer:** It is the standard declarative configuration file where the CI pipeline stages, triggers, environments, and test commands are defined for GitHub Actions.

### Q19. What does `actions/checkout@v4` do?
**Answer:** It checks out the repository's Git history and source code onto the virtual runner so that subsequent workflow steps can access and test the project files.

### Q20. What does `actions/setup-node@v4` do?
**Answer:** It provisions the specified version of Node.js (e.g. Node 20) on the runner, configures PATH, and caches npm dependencies for accelerated future runs.

### Q21. How do you find the reason for a failed GitHub Actions run?
**Answer:** Navigate to the **Actions** tab on GitHub, click on the failed workflow run (marked with a red X), click on the failing job (e.g. `Run Automated API Tests`), and expand the failed step to inspect the exact assertion failure and stack trace.

### Q22. What does a green checkmark mean?
**Answer:** It indicates that all steps within all jobs of the workflow completed with an exit code of 0, meaning dependencies installed, tests passed, and the build succeeded.

### Q23. What does a red X mean?
**Answer:** It indicates that at least one step in the workflow failed (returned a non-zero exit code), signaling a test failure, syntax error, or build defect.

### Q24. Why must the final test be fixed?
**Answer:** To ensure that the mainline branch (`main`) remains in a verified, deployable, and production-ready state with all automated tests passing.

### Q25. What is a README status badge?
**Answer:** A dynamic SVG badge hosted by GitHub that visually communicates the real-time build and test health of the repository's default branch directly in the `README.md`.
