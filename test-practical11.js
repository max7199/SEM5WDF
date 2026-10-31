// =============================================================================
// Practical 11: Containerization with Docker and Docker Compose
// File: test-practical11.js
// Description: Automated validation suite for Practical 11 Dockerfiles,
//              Docker Compose orchestration, Nginx reverse proxy configuration,
//              backend health endpoints, and full-stack API regression.
// Student: Max Patel (24IT070) - CHARUSAT - ITUE301
// =============================================================================

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = process.env.BASE_URL || 'http://localhost:5000';

let passed = 0;
let failed = 0;

function pass(testNum, testName, details = '') {
  console.log(`✅ PASS - ${testNum}. ${testName}`);
  if (details) console.log(`    Details: ${details}`);
  passed++;
}

function fail(testNum, testName, reason = '') {
  console.error(`❌ FAIL - ${testNum}. ${testName}`);
  if (reason) console.error(`    Reason: ${reason}`);
  failed++;
}

async function runTests() {
  console.log('\n====================================================');
  console.log(' Starting Practical 11 Docker & Containerization Test Suite');
  console.log(` Target Server: ${BASE_URL}`);
  console.log('====================================================\n');

  // Test 1: Verify presence of Dockerfiles and Compose files
  try {
    const requiredFiles = [
      'Dockerfile.backend',
      'Dockerfile.frontend',
      'docker-compose.yml',
      'nginx.conf',
      '.dockerignore',
      '.env.docker.example'
    ];

    const missing = requiredFiles.filter(f => !fs.existsSync(path.join(__dirname, f)));
    if (missing.length === 0) {
      pass(1, 'Configuration Files Presence', `All ${requiredFiles.length} required Docker and orchestration files exist`);
    } else {
      fail(1, 'Configuration Files Presence', `Missing files: ${missing.join(', ')}`);
    }
  } catch (err) {
    fail(1, 'Configuration Files Presence', err.message);
  }

  // Test 2: Verify Backend Dockerfile specifications
  try {
    const backendContent = fs.readFileSync(path.join(__dirname, 'Dockerfile.backend'), 'utf-8');
    const hasBase = backendContent.includes('node:20-alpine');
    const hasWorkdir = backendContent.includes('WORKDIR /app');
    const hasCopy = backendContent.includes('COPY package*.json ./');
    const hasExpose = backendContent.includes('EXPOSE 5000');
    const hasCmd = backendContent.includes('CMD ["node", "server.js"]');
    const hasHealth = backendContent.includes('HEALTHCHECK');

    if (hasBase && hasWorkdir && hasCopy && hasExpose && hasCmd && hasHealth) {
      pass(2, 'Backend Dockerfile Directives', 'Uses node:20-alpine, layer caching, healthcheck, EXPOSE 5000, and CMD node server.js');
    } else {
      fail(2, 'Backend Dockerfile Directives', 'One or more required Docker directives missing');
    }
  } catch (err) {
    fail(2, 'Backend Dockerfile Directives', err.message);
  }

  // Test 3: Verify Frontend Dockerfile specifications (Multi-stage)
  try {
    const frontendContent = fs.readFileSync(path.join(__dirname, 'Dockerfile.frontend'), 'utf-8');
    const hasStage1 = frontendContent.includes('FROM node:20-alpine AS build');
    const hasStage2 = frontendContent.includes('FROM nginx:alpine');
    const hasCopyFrom = frontendContent.includes('COPY --from=build');
    const hasNginxConf = frontendContent.includes('COPY nginx.conf /etc/nginx/conf.d/default.conf');
    const hasExpose = frontendContent.includes('EXPOSE 80');

    if (hasStage1 && hasStage2 && hasCopyFrom && hasNginxConf && hasExpose) {
      pass(3, 'Frontend Multi-Stage Dockerfile', 'Implements 2-stage build (Node build + Nginx runtime), copies static assets & custom nginx.conf');
    } else {
      fail(3, 'Frontend Multi-Stage Dockerfile', 'Multi-stage build structure incomplete');
    }
  } catch (err) {
    fail(3, 'Frontend Multi-Stage Dockerfile', err.message);
  }

  // Test 4: Verify Docker Compose orchestration structure
  try {
    const composeContent = fs.readFileSync(path.join(__dirname, 'docker-compose.yml'), 'utf-8');
    const hasMongo = composeContent.includes('mongo:') && composeContent.includes('image: mongo:7.0');
    const hasBackend = composeContent.includes('backend:') && composeContent.includes('Dockerfile.backend');
    const hasFrontend = composeContent.includes('frontend:') && composeContent.includes('Dockerfile.frontend');
    const hasVolume = composeContent.includes('mongo_data:') && composeContent.includes('taskmanager_mongo_data');
    const hasNetwork = composeContent.includes('taskmanager-network:');
    const hasHealthCheck = composeContent.includes('condition: service_healthy');

    if (hasMongo && hasBackend && hasFrontend && hasVolume && hasNetwork && hasHealthCheck) {
      pass(4, 'Docker Compose Services & Volume', 'Orchestrates frontend, backend, mongo with taskmanager_mongo_data named volume and service_healthy conditions');
    } else {
      fail(4, 'Docker Compose Services & Volume', 'Docker compose services or volume structure incomplete');
    }
  } catch (err) {
    fail(4, 'Docker Compose Services & Volume', err.message);
  }

  // Test 5: Verify Nginx Reverse Proxy & React Router SPA routing
  try {
    const nginxContent = fs.readFileSync(path.join(__dirname, 'nginx.conf'), 'utf-8');
    const hasProxyApi = nginxContent.includes('location /api/') && nginxContent.includes('proxy_pass http://backend:5000/api/');
    const hasSpa = nginxContent.includes('try_files $uri $uri/ /index.html');
    const hasGzip = nginxContent.includes('gzip on');

    if (hasProxyApi && hasSpa && hasGzip) {
      pass(5, 'Nginx Configuration & Reverse Proxy', 'Correctly proxies /api/ to backend:5000 and falls back to /index.html for React Router');
    } else {
      fail(5, 'Nginx Configuration & Reverse Proxy', 'Nginx reverse proxy or SPA fallback missing');
    }
  } catch (err) {
    fail(5, 'Nginx Configuration & Reverse Proxy', err.message);
  }

  // Test 6: Verify .dockerignore exclusions
  try {
    const ignoreContent = fs.readFileSync(path.join(__dirname, '.dockerignore'), 'utf-8');
    const ignoresNodeModules = ignoreContent.includes('node_modules');
    const ignoresGit = ignoreContent.includes('.git');
    const ignoresEnv = ignoreContent.includes('.env');

    if (ignoresNodeModules && ignoresGit && ignoresEnv) {
      pass(6, 'Docker Ignore Rules', 'Excludes node_modules, .git, and .env files to protect container images and secrets');
    } else {
      fail(6, 'Docker Ignore Rules', 'Critical exclusions missing from .dockerignore');
    }
  } catch (err) {
    fail(6, 'Docker Ignore Rules', err.message);
  }

  // Test 7: Verify Backend Health API endpoint
  try {
    const res = await fetch(`${BASE_URL}/api/health`);
    const data = await res.json();

    if (res.status === 200 && data.status === 'healthy' && data.database === 'connected') {
      pass(7, 'Backend Health API Endpoint', `Status: 200, Health: "${data.status}", Database: "${data.database}", Uptime: ${Math.round(data.uptime)}s`);
    } else {
      fail(7, 'Backend Health API Endpoint', `Unexpected health response: ${JSON.stringify(data)}`);
    }
  } catch (err) {
    fail(7, 'Backend Health API Endpoint', err.message);
  }

  // Test 8: End-to-End Auth & Task CRUD Lifecycle across Containerized API
  try {
    const timestamp = Date.now();
    const testEmail = `dockeruser_${timestamp}@charusat.edu.in`;
    const testPass = 'DockerSecurePass123';

    // 1. Register
    const regRes = await fetch(`${BASE_URL}/api/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testEmail, password: testPass })
    });
    const regData = await regRes.json();

    // 2. Login
    const loginRes = await fetch(`${BASE_URL}/api/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testEmail, password: testPass })
    });
    const loginData = await loginRes.json();
    const token = loginData.token;

    // 3. Create Task
    const createRes = await fetch(`${BASE_URL}/api/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        title: 'Containerized Task for Practical 11',
        description: 'Testing Docker Compose and Nginx Reverse Proxy routing',
        priority: 'high'
      })
    });
    const createdTask = await createRes.json();

    // 4. Read Tasks
    const getRes = await fetch(`${BASE_URL}/api/tasks`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const tasks = await getRes.json();

    // 5. Update Task
    const updateRes = await fetch(`${BASE_URL}/api/tasks/${createdTask._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ completed: true })
    });
    const updatedTask = await updateRes.json();

    // 6. Delete Task
    const delRes = await fetch(`${BASE_URL}/api/tasks/${createdTask._id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    });

    if (createRes.status === 201 && getRes.status === 200 && tasks.length === 1 && updatedTask.completed === true && delRes.status === 200) {
      pass(8, 'End-to-End Task CRUD across /api/ Proxy', `Registered, Logged in, Created task "${createdTask.title}", Updated (completed=true), and Deleted successfully`);
    } else {
      fail(8, 'End-to-End Task CRUD across /api/ Proxy', `Failed at step. Create: ${createRes.status}, Get: ${getRes.status}, Delete: ${delRes.status}`);
    }
  } catch (err) {
    fail(8, 'End-to-End Task CRUD across /api/ Proxy', err.message);
  }

  // Summary
  console.log('\n====================================================');
  console.log(' Practical 11 Test Results Summary');
  console.log('====================================================');
  console.log(`Total Tests Run: ${passed + failed}`);
  console.log(`Passed:          ${passed}`);
  console.log(`Failed:          ${failed}`);
  console.log('====================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
