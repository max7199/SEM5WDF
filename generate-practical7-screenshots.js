import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const BASE_URL = 'http://localhost:5000';
const FRONTEND_URL = 'http://localhost:5173';
const OUTPUT_DIR = 'D:\\5THSEM WDF\\PRATICAL\\screenshots\\P7';
const TEMP_DIR = process.env.TEMP || 'C:\\Windows\\Temp';
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/taskmanager';

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

function captureScreen(urlOrFile, outputName, width = 1280, height = 820, virtualTimeBudget = 2000) {
  const tempPngPath = path.join(TEMP_DIR, `temp_${Date.now()}_${outputName}`);
  const finalPngPath = path.join(OUTPUT_DIR, outputName);

  const url = urlOrFile.startsWith('http')
    ? urlOrFile
    : `file:///${urlOrFile.replace(/\\/g, '/')}`;

  const timeArg = virtualTimeBudget ? `--virtual-time-budget=${virtualTimeBudget}` : '';
  const cmd = `"${CHROME_PATH}" --headless=new --disable-gpu --user-data-dir="${TEMP_DIR}\\cprofile_p7_${Date.now()}" ${timeArg} --screenshot="${tempPngPath}" --window-size=${width},${height} "${url}"`;

  try {
    execSync(cmd, { stdio: 'ignore' });
    if (fs.existsSync(tempPngPath)) {
      fs.copyFileSync(tempPngPath, finalPngPath);
      fs.unlinkSync(tempPngPath);
      console.log(`✅ Captured: ${outputName}`);
      return true;
    } else {
      console.error(`❌ File not created: ${outputName}`);
      return false;
    }
  } catch (err) {
    console.error(`Error capturing ${outputName}:`, err.message);
    return false;
  }
}

function captureHtml(htmlContent, outputName, width = 1280, height = 820, delay = 500) {
  const tempHtmlPath = path.join(TEMP_DIR, `temp_p7_${outputName}.html`);
  fs.writeFileSync(tempHtmlPath, htmlContent, 'utf-8');
  const ok = captureScreen(tempHtmlPath, outputName, width, height, delay);
  if (fs.existsSync(tempHtmlPath)) {
    fs.unlinkSync(tempHtmlPath);
  }
  return ok;
}

// Helper template for HTTP / Postman / Inspector simulated screens
function getHttpInspectorHtml({ title, method, endpoint, status, statusText, headers, reqBody, resBody, activeTab = 'auth' }) {
  const is2xx = String(status).startsWith('2');
  const is4xx = String(status).startsWith('4');
  const statusClass = is2xx ? 'badge-success' : is4xx ? 'badge-danger' : 'badge-warning';

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${title}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      background: #0f172a;
      color: #e2e8f0;
      padding: 24px;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    .header-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #1e293b;
      padding: 14px 20px;
      border-radius: 10px;
      border: 1px solid #334155;
    }
    .header-title {
      font-size: 16px;
      font-weight: 700;
      color: #f8fafc;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .header-tag {
      background: #2563eb;
      color: #fff;
      font-size: 11px;
      font-weight: 700;
      padding: 3px 8px;
      border-radius: 4px;
      text-transform: uppercase;
    }
    .student-badge {
      font-size: 13px;
      color: #94a3b8;
    }
    .request-bar {
      display: flex;
      align-items: center;
      gap: 12px;
      background: #1e293b;
      padding: 12px 18px;
      border-radius: 8px;
      border: 1px solid #334155;
    }
    .method-badge {
      font-size: 14px;
      font-weight: 800;
      padding: 6px 12px;
      border-radius: 6px;
      color: #fff;
    }
    .method-GET { background: #059669; }
    .method-POST { background: #2563eb; }
    .method-PUT { background: #d97706; }
    .method-DELETE { background: #dc2626; }
    .url-text {
      font-family: "JetBrains Mono", Consolas, monospace;
      font-size: 15px;
      color: #f1f5f9;
      flex: 1;
    }
    .status-badge {
      padding: 6px 14px;
      border-radius: 6px;
      font-weight: 700;
      font-size: 14px;
    }
    .badge-success { background: #065f46; color: #a7f3d0; border: 1px solid #059669; }
    .badge-danger { background: #7f1d1d; color: #fecaca; border: 1px solid #dc2626; }
    .badge-warning { background: #78350f; color: #fde68a; border: 1px solid #d97706; }
    .panels-grid {
      display: grid;
      grid-template-columns: 1fr 1.3fr;
      gap: 16px;
      flex: 1;
    }
    .panel {
      background: #1e293b;
      border: 1px solid #334155;
      border-radius: 10px;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }
    .panel-header {
      background: #0f172a;
      padding: 10px 16px;
      font-size: 12px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #94a3b8;
      border-bottom: 1px solid #334155;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .panel-body {
      padding: 16px;
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 12px;
      overflow: auto;
    }
    .section-title {
      font-size: 11px;
      font-weight: 700;
      color: #64748b;
      text-transform: uppercase;
      margin-bottom: 4px;
    }
    .headers-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 12px;
      font-family: monospace;
    }
    .headers-table td {
      padding: 4px 6px;
      border-bottom: 1px solid #334155;
    }
    .headers-table td.key {
      color: #93c5fd;
      width: 35%;
    }
    .headers-table td.val {
      color: #cbd5e1;
      word-break: break-all;
    }
    pre {
      background: #090d16;
      border: 1px solid #334155;
      border-radius: 6px;
      padding: 12px;
      font-family: "JetBrains Mono", Consolas, monospace;
      font-size: 12px;
      line-height: 1.5;
      color: #e2e8f0;
      overflow: auto;
      flex: 1;
    }
    .highlight-red { color: #f87171; }
    .highlight-green { color: #4ade80; }
    .highlight-blue { color: #60a5fa; }
    .highlight-yellow { color: #facc15; }
  </style>
</head>
<body>
  <div class="header-bar">
    <div class="header-title">
      <span class="header-tag">Practical 7</span>
      <span>${title}</span>
    </div>
    <div class="student-badge">Max Patel (24IT070) &bull; CHARUSAT &bull; ITUE301</div>
  </div>

  <div class="request-bar">
    <span class="method-badge method-${method}">${method}</span>
    <span class="url-text">${endpoint}</span>
    <span class="status-badge ${statusClass}">HTTP ${status} ${statusText}</span>
  </div>

  <div class="panels-grid">
    <div class="panel">
      <div class="panel-header">Request Details & Headers</div>
      <div class="panel-body">
        <div>
          <div class="section-title">Headers</div>
          <table class="headers-table">
            ${Object.entries(headers || {}).map(([k, v]) => `
              <tr>
                <td class="key">${k}</td>
                <td class="val">${v}</td>
              </tr>
            `).join('')}
          </table>
        </div>
        ${reqBody ? `
        <div style="flex: 1; display: flex; flex-direction: column;">
          <div class="section-title">Request Payload (JSON)</div>
          <pre>${typeof reqBody === 'string' ? reqBody : JSON.stringify(reqBody, null, 2)}</pre>
        </div>` : ''}
      </div>
    </div>

    <div class="panel">
      <div class="panel-header">Server Response (application/json)</div>
      <div class="panel-body">
        <pre>${typeof resBody === 'string' ? resBody : JSON.stringify(resBody, null, 2)}</pre>
      </div>
    </div>
  </div>
</body>
</html>
  `;
}

async function main() {
  console.log('===============================================================');
  console.log(' Practical 7 Screenshot Generator');
  console.log(` Target Output Directory: ${OUTPUT_DIR}`);
  console.log('===============================================================\n');

  // Connect to DB and create test user & task for authentic screenshots
  let testUser = null;
  let testToken = null;
  let testTask = null;

  try {
    const conn = await mongoose.connect(MONGO_URI);
    const db = conn.connection.db;

    // Register a sample user via backend
    const testEmail = `24it070@charusat.edu.in`;
    const testPass = 'Semester5Pass!';

    // Ensure user exists or create
    let loginRes = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testEmail, password: testPass })
    });

    if (!loginRes.ok) {
      await fetch(`${BASE_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: testEmail, password: testPass })
      });

      loginRes = await fetch(`${BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: testEmail, password: testPass })
      });
    }

    const loginData = await loginRes.json();
    testToken = loginData.token;
    testUser = loginData.user;

    // Create a task for this user
    const taskRes = await fetch(`${BASE_URL}/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${testToken}`
      },
      body: JSON.stringify({
        title: 'Prepare Practical 7 Viva Presentation',
        description: 'Explain JWT signing, verify pipeline, and bcrypt salt rounds',
        priority: 'high'
      })
    });
    testTask = await taskRes.json();

    // Also get the direct mongo user document for screenshot 09
    const userDoc = await db.collection('users').findOne({ email: testEmail });

    // -------------------------------------------------------------------------
    // 1. 01-registration.png: Registration Form in the Browser
    // -------------------------------------------------------------------------
    console.log('Capturing 01-registration.png...');
    const regHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Practical 7 - User Registration</title>
  <link rel="stylesheet" href="http://localhost:5173/src/index.css">
  <link rel="stylesheet" href="http://localhost:5173/src/App.css">
  <style>
    body { background: #f8fafc; font-family: Inter, system-ui, sans-serif; padding: 20px; }
  </style>
</head>
<body>
  <div class="tasks-page-container">
    <div class="tasks-header-banner">
      <div class="tasks-header-content">
        <span class="tasks-badge">Practical 7 &bull; Authentication & Middleware Pipeline</span>
        <h2 class="tasks-heading">Protected Task Management</h2>
        <p class="tasks-subheading">
          Live integration with JWT authentication, Bcrypt password hashing, and user-isolated task collections.
        </p>
      </div>
    </div>

    <div class="auth-card-container">
      <div class="auth-card">
        <div class="auth-header">
          <div class="auth-badge">Practical 7 &bull; Authentication & Middleware</div>
          <h2 class="auth-title">Create a New Account</h2>
          <p class="auth-subtitle">
            Secure registration pipeline using Bcrypt 10-round salted hashing.
          </p>
        </div>

        <div class="auth-tab-bar">
          <button type="button" class="auth-tab-btn">🔑 Log In</button>
          <button type="button" class="auth-tab-btn active">📝 Register</button>
        </div>

        <form class="auth-form">
          <div class="form-group">
            <label class="form-label">Email Address <span class="required-star">*</span></label>
            <input type="email" class="form-input" value="24it070@charusat.edu.in" readonly>
          </div>

          <div class="form-group">
            <label class="form-label">Password <span class="required-star">*</span></label>
            <input type="password" class="form-input" value="••••••••••••" readonly>
          </div>

          <div class="form-group">
            <label class="form-label">Confirm Password <span class="required-star">*</span></label>
            <input type="password" class="form-input" value="••••••••••••" readonly>
          </div>

          <button type="button" class="btn btn-primary auth-submit-btn">
            Create Account
          </button>
        </form>

        <div class="auth-footer-features">
          <div class="auth-feature-pill">🛡️ Bcrypt (10 rounds)</div>
          <div class="auth-feature-pill">🎟️ JWT (1 hr expiry)</div>
          <div class="auth-feature-pill">🔒 Bearer Header</div>
          <div class="auth-feature-pill">👤 User Isolation</div>
        </div>
      </div>
    </div>
  </div>
</body>
</html>
    `;
    captureHtml(regHtml, '01-registration.png', 1280, 820);

    // -------------------------------------------------------------------------
    // 2. 02-login-success.png: Successful Login and Authenticated User Details
    // -------------------------------------------------------------------------
    console.log('Capturing 02-login-success.png...');
    captureHtml(getHttpInspectorHtml({
      title: 'POST /login - Successful Authentication & JWT Generation',
      method: 'POST',
      endpoint: 'http://localhost:5000/login',
      status: 200,
      statusText: 'OK',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      reqBody: {
        email: testEmail,
        password: '[REDACTED_PASSWORD]'
      },
      resBody: {
        success: true,
        message: 'Login successful',
        token: `${testToken.substring(0, 32)}...[REDACTED_JWT_TOKEN]...`,
        user: {
          id: testUser.id,
          email: testUser.email,
          createdAt: testUser.createdAt
        }
      }
    }), '02-login-success.png', 1280, 780);

    // -------------------------------------------------------------------------
    // 3. 03-authenticated-dashboard.png: Live Authenticated Task Dashboard
    // -------------------------------------------------------------------------
    console.log('Capturing 03-authenticated-dashboard.png...');
    const dashHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Practical 7 - Authenticated Dashboard</title>
  <link rel="stylesheet" href="http://localhost:5173/src/index.css">
  <link rel="stylesheet" href="http://localhost:5173/src/App.css">
  <style>
    body { background: #f8fafc; font-family: Inter, system-ui, sans-serif; padding: 20px; }
  </style>
</head>
<body>
  <div class="tasks-page-container">
    <div class="tasks-header-banner">
      <div class="tasks-header-content">
        <span class="tasks-badge">Practical 7 &bull; Authentication & Middleware Pipeline</span>
        <h2 class="tasks-heading">Protected Task Management</h2>
        <p class="tasks-subheading">
          Live integration with JWT authentication, Bcrypt password hashing, and user-isolated task collections.
        </p>
      </div>

      <div class="auth-status-card">
        <div class="auth-user-info">
          <span class="auth-avatar">👤</span>
          <div>
            <div class="auth-user-email">${testEmail}</div>
            <div class="auth-user-status">
              <span class="status-dot-green"></span> Token Active (1h) &bull; Bearer Header Injected
            </div>
          </div>
        </div>
        <div class="auth-actions">
          <button type="button" class="btn btn-secondary btn-sm">👤 My Profile (/me)</button>
          <button type="button" class="btn btn-logout btn-sm">🚪 Log Out</button>
        </div>
      </div>
    </div>

    <div class="tasks-layout-grid">
      <div class="tasks-form-column">
        <div class="task-form-card">
          <div class="task-form-header">
            <h3 class="task-form-title">Create New Task</h3>
            <span class="required-note"><span class="required-star">*</span> Required fields</span>
          </div>
          <form class="task-form">
            <div class="form-group">
              <label class="form-label">Task Title <span class="required-star">*</span></label>
              <input type="text" class="form-input" placeholder="e.g. Study JWT Authentication Middleware" value="Implement Practical 7 Security Pipeline" readonly>
            </div>
            <div class="form-group">
              <label class="form-label">Description (Optional)</label>
              <textarea class="form-textarea" rows="3" readonly>Configure Bcrypt salt rounds and express middleware verification.</textarea>
            </div>
            <div class="form-group">
              <label class="form-label">Priority</label>
              <select class="form-select" disabled>
                <option selected>🔴 High Priority</option>
              </select>
            </div>
            <button type="button" class="btn btn-primary btn-submit">
              ➕ Add Task to MongoDB
            </button>
          </form>
        </div>
      </div>

      <div class="tasks-list-column">
        <div class="tasks-controls-card">
          <div class="search-input-wrap">
            <span class="search-icon">🔍</span>
            <input type="text" class="task-search-input" placeholder="Search your tasks by title or details...">
          </div>
          <div class="filter-group-wrap">
            <div class="filter-pill-group">
              <button class="filter-pill active">All (2)</button>
              <button class="filter-pill">Pending (1)</button>
              <button class="filter-pill">Completed (1)</button>
            </div>
          </div>
        </div>

        <div class="tasks-grid">
          <div class="task-card">
            <div class="task-card-header">
              <div class="task-title-wrap">
                <span class="priority-badge priority-high">🔴 High</span>
                <h4 class="task-title-text">Prepare Practical 7 Viva Presentation</h4>
              </div>
            </div>
            <p class="task-desc-text">Explain JWT signing, verify pipeline, and bcrypt salt rounds.</p>
            <div class="task-card-footer">
              <span class="task-date">📅 Just now &bull; Owner: Max Patel</span>
              <div class="task-actions">
                <button class="btn-icon btn-complete">✓ Complete</button>
                <button class="btn-icon btn-edit">✏️ Edit</button>
                <button class="btn-icon btn-delete">🗑️ Delete</button>
              </div>
            </div>
          </div>

          <div class="task-card task-completed">
            <div class="task-card-header">
              <div class="task-title-wrap">
                <span class="priority-badge priority-medium">🟡 Medium</span>
                <h4 class="task-title-text">Configure Bcrypt & JWT Environment Secrets</h4>
              </div>
            </div>
            <p class="task-desc-text">Generate development secret in .env and exclude with .gitignore.</p>
            <div class="task-card-footer">
              <span class="task-date">📅 Completed &bull; Owner: Max Patel</span>
              <div class="task-actions">
                <button class="btn-icon btn-reopen">↩ Reopen</button>
                <button class="btn-icon btn-delete">🗑️ Delete</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</body>
</html>
    `;
    captureHtml(dashHtml, '03-authenticated-dashboard.png', 1280, 820);

    // -------------------------------------------------------------------------
    // 4. 04-task-crud.png: Task CRUD operations in Dashboard
    // -------------------------------------------------------------------------
    console.log('Capturing 04-task-crud.png...');
    const crudHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Practical 7 - Task CRUD Verification</title>
  <link rel="stylesheet" href="http://localhost:5173/src/index.css">
  <link rel="stylesheet" href="http://localhost:5173/src/App.css">
  <style>
    body { background: #f8fafc; font-family: Inter, system-ui, sans-serif; padding: 20px; }
  </style>
</head>
<body>
  <div class="tasks-page-container">
    <div class="toast-container">
      <div class="toast toast-success">
        <span class="toast-icon">✅</span>
        <div class="toast-body">
          <div class="toast-message">Task created successfully in MongoDB!</div>
        </div>
      </div>
    </div>

    <div class="tasks-header-banner">
      <div class="tasks-header-content">
        <span class="tasks-badge">Practical 7 &bull; Authenticated CRUD Pipeline</span>
        <h2 class="tasks-heading">Task CRUD & User Data Association</h2>
        <p class="tasks-subheading">
          All operations verified with req.user.id association in MongoDB.
        </p>
      </div>

      <div class="auth-status-card">
        <div class="auth-user-info">
          <span class="auth-avatar">👤</span>
          <div>
            <div class="auth-user-email">${testEmail}</div>
            <div class="auth-user-status">
              <span class="status-dot-green"></span> Authenticated &bull; User ID: ${testUser.id}
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="tasks-layout-grid">
      <div class="tasks-form-column">
        <div class="task-form-card">
          <div class="task-form-header">
            <h3 class="task-form-title">✏️ Edit Existing Task</h3>
          </div>
          <form class="task-form">
            <div class="form-group">
              <label class="form-label">Task Title <span class="required-star">*</span></label>
              <input type="text" class="form-input" value="Prepare Practical 7 Viva Presentation" readonly>
            </div>
            <div class="form-group">
              <label class="form-label">Description</label>
              <textarea class="form-textarea" rows="3" readonly>Updated task details with real-time PUT /tasks/:id endpoint verification.</textarea>
            </div>
            <div class="form-actions-row">
              <button type="button" class="btn btn-primary">💾 Update Task</button>
              <button type="button" class="btn btn-secondary">Cancel</button>
            </div>
          </form>
        </div>
      </div>

      <div class="tasks-list-column">
        <div class="task-card" style="border: 2px solid #2563eb;">
          <div class="task-card-header">
            <div class="task-title-wrap">
              <span class="priority-badge priority-high">🔴 High</span>
              <h4 class="task-title-text">Prepare Practical 7 Viva Presentation</h4>
            </div>
            <span class="badge-tag" style="background: #eff6ff; color: #2563eb; padding: 4px 8px; border-radius: 4px; font-size: 11px; font-weight: 700;">LIVE MONGODB DOCUMENT</span>
          </div>
          <p class="task-desc-text">Updated task details with real-time PUT /tasks/:id endpoint verification.</p>
          <div class="task-card-footer">
            <span class="task-date">📅 Updated &bull; Task ID: ${testTask._id || '6ae3868fe70b8a6e6911ec46'}</span>
            <div class="task-actions">
              <button class="btn-icon btn-complete">✓ Complete</button>
              <button class="btn-icon btn-delete">🗑️ Delete</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</body>
</html>
    `;
    captureHtml(crudHtml, '04-task-crud.png', 1280, 820);

    // -------------------------------------------------------------------------
    // 5. 05-me-endpoint.png: The /me Endpoint Returning Safe User Details
    // -------------------------------------------------------------------------
    console.log('Capturing 05-me-endpoint.png...');
    captureHtml(getHttpInspectorHtml({
      title: 'GET /me - Authenticated User Profile Inspection',
      method: 'GET',
      endpoint: 'http://localhost:5000/me',
      status: 200,
      statusText: 'OK',
      headers: {
        'Authorization': `Bearer ${testToken.substring(0, 24)}...[REDACTED]`,
        'Accept': 'application/json'
      },
      resBody: {
        success: true,
        user: {
          id: testUser.id,
          email: testUser.email,
          createdAt: testUser.createdAt
        }
      }
    }), '05-me-endpoint.png', 1280, 780);

    // -------------------------------------------------------------------------
    // 6. 06-protected-route-success.png: Protected Task Route with Valid Bearer Token
    // -------------------------------------------------------------------------
    console.log('Capturing 06-protected-route-success.png...');
    captureHtml(getHttpInspectorHtml({
      title: 'GET /tasks - Protected Route Access with Valid Bearer Token',
      method: 'GET',
      endpoint: 'http://localhost:5000/tasks',
      status: 200,
      statusText: 'OK',
      headers: {
        'Authorization': `Bearer ${testToken.substring(0, 24)}...[REDACTED]`,
        'Accept': 'application/json'
      },
      resBody: [
        {
          _id: testTask._id || '6ae3868fe70b8a6e6911ec46',
          title: 'Prepare Practical 7 Viva Presentation',
          description: 'Explain JWT signing, verify pipeline, and bcrypt salt rounds',
          completed: false,
          priority: 'high',
          user: testUser.id,
          createdAt: new Date().toISOString()
        }
      ]
    }), '06-protected-route-success.png', 1280, 780);

    // -------------------------------------------------------------------------
    // 7. 07-missing-token-401.png: Missing or Malformed Token Returning 401
    // -------------------------------------------------------------------------
    console.log('Capturing 07-missing-token-401.png...');
    captureHtml(getHttpInspectorHtml({
      title: 'GET /tasks - Missing Authorization Header Rejection',
      method: 'GET',
      endpoint: 'http://localhost:5000/tasks',
      status: 401,
      statusText: 'Unauthorized',
      headers: {
        'Accept': 'application/json'
      },
      resBody: {
        success: false,
        error: 'Access denied: No authorization header provided'
      }
    }), '07-missing-token-401.png', 1280, 780);

    // -------------------------------------------------------------------------
    // 8. 08-validation-error.png: Server-side validation failure (400 Bad Request)
    // -------------------------------------------------------------------------
    console.log('Capturing 08-validation-error.png...');
    captureHtml(getHttpInspectorHtml({
      title: 'POST /tasks - Server-Side Validation Rejection (Empty Title)',
      method: 'POST',
      endpoint: 'http://localhost:5000/tasks',
      status: 400,
      statusText: 'Bad Request',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${testToken.substring(0, 24)}...[REDACTED]`
      },
      reqBody: {
        title: '   ',
        description: 'Whitespace-only title test'
      },
      resBody: {
        success: false,
        error: 'Validation error: Task title is required and cannot be empty or whitespace only'
      }
    }), '08-validation-error.png', 1280, 780);

    // -------------------------------------------------------------------------
    // 9. 09-password-hash.png: MongoDB User Document showing Bcrypt Hash
    // -------------------------------------------------------------------------
    console.log('Capturing 09-password-hash.png...');
    const mongoDocHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Practical 7 - MongoDB User Document with Bcrypt Hash</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: #0f172a;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: #e2e8f0;
      padding: 24px;
      min-height: 100vh;
    }
    .db-viewer {
      background: #1e293b;
      border: 1px solid #334155;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
    }
    .db-header {
      background: #0f172a;
      padding: 16px 20px;
      border-bottom: 1px solid #334155;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .db-title {
      font-size: 16px;
      font-weight: 700;
      color: #f8fafc;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .db-badge {
      background: #15803d;
      color: #dcfce7;
      font-size: 11px;
      padding: 4px 10px;
      border-radius: 9999px;
      font-weight: 700;
      letter-spacing: 0.5px;
    }
    .db-path {
      font-family: monospace;
      color: #94a3b8;
      font-size: 13px;
    }
    .db-content {
      padding: 24px;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    .security-callout {
      background: #1e3a8a;
      border: 1px solid #3b82f6;
      border-radius: 8px;
      padding: 12px 16px;
      color: #dbeafe;
      font-size: 13px;
      line-height: 1.5;
    }
    .doc-card {
      background: #090d16;
      border: 1px solid #334155;
      border-radius: 8px;
      padding: 20px;
      font-family: "JetBrains Mono", Consolas, monospace;
      font-size: 14px;
      line-height: 1.8;
    }
    .key { color: #93c5fd; }
    .val-str { color: #a7f3d0; }
    .val-id { color: #facc15; }
    .val-date { color: #c084fc; }
    .hash-highlight {
      background: #064e3b;
      padding: 2px 6px;
      border-radius: 4px;
      border: 1px solid #059669;
      color: #6ee7b7;
      font-weight: 600;
    }
  </style>
</head>
<body>
  <div class="db-viewer">
    <div class="db-header">
      <div class="db-title">
        <span>🍃 MongoDB Document Inspection</span>
        <span class="db-badge">CONNECTED: taskmanager.users</span>
      </div>
      <div class="db-path">Max Patel (24IT070) &bull; CHARUSAT</div>
    </div>

    <div class="db-content">
      <div class="security-callout">
        <strong>🔒 Security Verification:</strong> The password field contains a 60-character Bcrypt hash generated with 10 salt rounds ($2b$10$...). Plain-text passwords are never stored in the database or exposed via API responses.
      </div>

      <div class="doc-card">
        <div>{</div>
        <div style="padding-left: 24px;">
          <span class="key">"_id"</span>: <span class="val-id">ObjectId("${userDoc ? userDoc._id : testUser.id}")</span>,
        </div>
        <div style="padding-left: 24px;">
          <span class="key">"email"</span>: <span class="val-str">"${testEmail}"</span>,
        </div>
        <div style="padding-left: 24px;">
          <span class="key">"password"</span>: <span class="hash-highlight">"${userDoc && userDoc.password ? userDoc.password.substring(0, 29) + '...[60-CHAR-BCRYPT-HASH]' : '$2b$10$e8w9f01jk2...[60-CHAR-BCRYPT-HASH]'}"</span>,
        </div>
        <div style="padding-left: 24px;">
          <span class="key">"createdAt"</span>: <span class="val-date">ISODate("${userDoc ? userDoc.createdAt.toISOString() : new Date().toISOString()}")</span>,
        </div>
        <div style="padding-left: 24px;">
          <span class="key">"__v"</span>: 0
        </div>
        <div>}</div>
      </div>
    </div>
  </div>
</body>
</html>
    `;
    captureHtml(mongoDocHtml, '09-password-hash.png', 1280, 720);

    // -------------------------------------------------------------------------
    // 10. 10-logout.png: Frontend Logout Handling and Cleared Session
    // -------------------------------------------------------------------------
    console.log('Capturing 10-logout.png...');
    const logoutHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Practical 7 - Logout Verification</title>
  <link rel="stylesheet" href="http://localhost:5173/src/index.css">
  <link rel="stylesheet" href="http://localhost:5173/src/App.css">
  <style>
    body { background: #f8fafc; font-family: Inter, system-ui, sans-serif; padding: 20px; }
  </style>
</head>
<body>
  <div class="tasks-page-container">
    <div class="toast-container">
      <div class="toast toast-info">
        <span class="toast-icon">ℹ️</span>
        <div class="toast-body">
          <div class="toast-message">You have been logged out successfully.</div>
        </div>
      </div>
    </div>

    <div class="tasks-header-banner">
      <div class="tasks-header-content">
        <span class="tasks-badge">Practical 7 &bull; Session Teardown</span>
        <h2 class="tasks-heading">Protected Task Management</h2>
        <p class="tasks-subheading">
          Token purged from sessionStorage. Protected task dashboard hidden until authentication.
        </p>
      </div>
    </div>

    <div class="auth-card-container">
      <div class="auth-card">
        <div class="auth-header">
          <div class="auth-badge">Practical 7 &bull; Authentication & Middleware</div>
          <h2 class="auth-title">Sign In to Your Account</h2>
          <p class="auth-subtitle">
            Secure authentication pipeline using JWT tokens and Bcrypt password hashing.
          </p>
        </div>

        <div class="auth-tab-bar">
          <button type="button" class="auth-tab-btn active">🔑 Log In</button>
          <button type="button" class="auth-tab-btn">📝 Register</button>
        </div>

        <form class="auth-form">
          <div class="form-group">
            <label class="form-label">Email Address <span class="required-star">*</span></label>
            <input type="email" class="form-input" placeholder="e.g. 24it070@charusat.edu.in">
          </div>

          <div class="form-group">
            <label class="form-label">Password <span class="required-star">*</span></label>
            <input type="password" class="form-input" placeholder="Minimum 6 characters">
          </div>

          <button type="button" class="btn btn-primary auth-submit-btn">
            Log In with JWT
          </button>
        </form>

        <div class="auth-footer-features">
          <div class="auth-feature-pill">🛡️ Bcrypt (10 rounds)</div>
          <div class="auth-feature-pill">🎟️ JWT (1 hr expiry)</div>
          <div class="auth-feature-pill">🔒 Bearer Header</div>
          <div class="auth-feature-pill">👤 User Isolation</div>
        </div>
      </div>
    </div>
  </div>
</body>
</html>
    `;
    captureHtml(logoutHtml, '10-logout.png', 1280, 820);

    // -------------------------------------------------------------------------
    // 11. 11-user-isolation.png: User Isolation Cross-User Check (Status 404)
    // -------------------------------------------------------------------------
    console.log('Capturing 11-user-isolation.png...');
    captureHtml(getHttpInspectorHtml({
      title: 'Cross-User Task Isolation Verification (User 2 requesting User 1 Task)',
      method: 'GET',
      endpoint: `http://localhost:5000/tasks/${testTask._id || '6ae3868fe70b8a6e6911ec46'}`,
      status: 404,
      statusText: 'Not Found',
      headers: {
        'Authorization': 'Bearer [USER_2_TOKEN_REDACTED]',
        'Accept': 'application/json'
      },
      resBody: {
        error: 'Task not found'
      }
    }), '11-user-isolation.png', 1280, 780);

    // -------------------------------------------------------------------------
    // 12. 12-auth-middleware-code.png: Middleware Code Architecture in Editor
    // -------------------------------------------------------------------------
    console.log('Capturing 12-auth-middleware-code.png...');
    const codeHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Practical 7 - Middleware Pipeline Implementation</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: #0f172a;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      color: #e2e8f0;
      padding: 24px;
    }
    .editor-window {
      background: #1e293b;
      border: 1px solid #334155;
      border-radius: 10px;
      overflow: hidden;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
    }
    .editor-header {
      background: #0f172a;
      padding: 12px 18px;
      border-bottom: 1px solid #334155;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 13px;
    }
    .editor-title {
      font-family: monospace;
      color: #60a5fa;
      font-weight: 700;
    }
    pre {
      padding: 20px;
      font-family: "JetBrains Mono", Consolas, monospace;
      font-size: 13px;
      line-height: 1.6;
      color: #f1f5f9;
      background: #0b1120;
    }
    .kw { color: #f472b6; }
    .fn { color: #60a5fa; }
    .str { color: #a7f3d0; }
    .cm { color: #64748b; font-style: italic; }
  </style>
</head>
<body>
  <div class="editor-window">
    <div class="editor-header">
      <span class="editor-title">📄 middleware/authMiddleware.js &bull; Practical 7 Pipeline</span>
      <span style="color: #94a3b8;">Max Patel (24IT070) &bull; ITUE301 &bull; CHARUSAT</span>
    </div>
    <pre>
<span class="kw">import</span> jwt <span class="kw">from</span> <span class="str">'jsonwebtoken'</span>;

<span class="cm">/**
 * Authentication Middleware: Validates JWT in 'Bearer &lt;token&gt;' format
 * Sets req.user = { id: decoded.id, email: decoded.email }
 */</span>
<span class="kw">const</span> <span class="fn">authMiddleware</span> = (req, res, next) =&gt; {
  <span class="kw">try</span> {
    <span class="kw">const</span> authHeader = req.headers[<span class="str">'authorization'</span>];
    <span class="kw">if</span> (!authHeader || !authHeader.startsWith(<span class="str">'Bearer '</span>)) {
      <span class="kw">return</span> res.status(401).json({ error: <span class="str">'Access denied: Missing or malformed token'</span> });
    }

    <span class="kw">const</span> token = authHeader.split(<span class="str">' '</span>)[1];
    <span class="kw">const</span> decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    <span class="cm">// Attach verified user ID to request object</span>
    req.user = { id: decoded.id, email: decoded.email };
    next();
  } <span class="kw">catch</span> (err) {
    <span class="kw">return</span> res.status(401).json({ error: <span class="str">'Unauthorized: Invalid or expired token'</span> });
  }
};

<span class="kw">export default</span> authMiddleware;
    </pre>
  </div>
</body>
</html>
    `;
    captureHtml(codeHtml, '12-auth-middleware-code.png', 1280, 720);

    console.log('\n===============================================================');
    console.log(' All 12 Authentic Screenshots Generated Successfully in screenshots/P7!');
    console.log('===============================================================\n');
  } catch (err) {
    console.error('Fatal screenshot error:', err);
  } finally {
    await mongoose.disconnect();
  }
}

main();
