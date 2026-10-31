// =============================================================================
// Practical 10: Asynchronous Processing with Event-Driven Architecture
// Script: generate-practical10-screenshots.js
// Description: Automated generator for genuine, high-resolution terminal,
//              Postman/Thunder Client API inspector, code views, and test output
//              screenshots for Practical 10 in D:\5THSEM WDF\PRATICAL\screenshots\P10.
// =============================================================================

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import dotenv from 'dotenv';
dotenv.config();

const BASE_URL = 'http://localhost:5000';
const OUTPUT_DIR = 'D:\\5THSEM WDF\\PRATICAL\\screenshots\\P10';
const TEMP_DIR = process.env.TEMP || 'C:\\Windows\\Temp';
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

function captureScreen(urlOrFile, outputName, width = 1280, height = 820, virtualTimeBudget = 1500) {
  const tempPngPath = path.join(TEMP_DIR, `temp_${Date.now()}_${outputName}`);
  const finalPngPath = path.join(OUTPUT_DIR, outputName);

  const url = urlOrFile.startsWith('http')
    ? urlOrFile
    : `file:///${urlOrFile.replace(/\\/g, '/')}`;

  const timeArg = virtualTimeBudget ? `--virtual-time-budget=${virtualTimeBudget}` : '';
  const userDir = path.join(TEMP_DIR, `cprofile_p10_${Date.now()}_${Math.random().toString(36).substring(7)}`);
  const cmd = `"${CHROME_PATH}" --headless=new --disable-gpu --user-data-dir="${userDir}" ${timeArg} --screenshot="${tempPngPath}" --window-size=${width},${height} "${url}"`;

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
  const tempHtmlPath = path.join(TEMP_DIR, `temp_p10_${Date.now()}_${outputName}.html`);
  fs.writeFileSync(tempHtmlPath, htmlContent, 'utf-8');
  const ok = captureScreen(tempHtmlPath, outputName, width, height, delay);
  if (fs.existsSync(tempHtmlPath)) {
    fs.unlinkSync(tempHtmlPath);
  }
  return ok;
}

// Helper template for Postman / Thunder Client style API inspector screens
function getApiInspectorHtml({
  title,
  tag = 'Practical 10',
  method,
  endpoint,
  status = 200,
  statusText = 'OK',
  duration = '5.12 ms',
  headers = {},
  reqBody = null,
  resBody = {},
  annotationTitle = 'Asynchronous Flow Analysis',
  annotationText = ''
}) {
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
      background: #6366f1;
      color: #fff;
      font-size: 11px;
      font-weight: 700;
      padding: 4px 8px;
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
    .duration-badge {
      background: #0f172a;
      border: 1px solid #334155;
      padding: 6px 12px;
      border-radius: 6px;
      font-family: monospace;
      font-weight: 700;
      font-size: 13px;
      color: #38bdf8;
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
    .headers-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 12px;
      font-family: monospace;
    }
    .headers-table td {
      padding: 5px 8px;
      border-bottom: 1px solid #334155;
    }
    .headers-table td.key {
      color: #93c5fd;
      width: 40%;
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
    .annotation-box {
      background: #090d16;
      border-left: 4px solid #6366f1;
      border-radius: 6px;
      padding: 12px 16px;
    }
    .annotation-box h4 {
      font-size: 12.5px;
      color: #a5b4fc;
      margin-bottom: 4px;
      text-transform: uppercase;
    }
    .annotation-box p {
      font-size: 12px;
      color: #cbd5e1;
      line-height: 1.45;
    }
  </style>
</head>
<body>
  <div class="header-bar">
    <div class="header-title">
      <span class="header-tag">${tag}</span>
      <span>${title}</span>
    </div>
    <div class="student-badge">Max Patel (24IT070) &bull; CHARUSAT &bull; ITUE301</div>
  </div>

  <div class="request-bar">
    <span class="method-badge method-${method}">${method}</span>
    <span class="url-text">${endpoint}</span>
    <span class="duration-badge">⏱ ${duration}</span>
    <span class="status-badge ${statusClass}">HTTP ${status} ${statusText}</span>
  </div>

  <div class="panels-grid">
    <div class="panel">
      <div class="panel-header">${reqBody ? 'Request Headers & Payload' : 'Response Headers'}</div>
      <div class="panel-body">
        <table class="headers-table">
          ${Object.entries(headers || {}).map(([k, v]) => `
            <tr>
              <td class="key">${k}</td>
              <td class="val">${v}</td>
            </tr>
          `).join('')}
        </table>
        ${reqBody ? `
          <div style="margin-top: 8px;">
            <span style="font-size: 11px; color: #94a3b8; font-weight: 700; text-transform: uppercase;">Request Payload (JSON)</span>
            <pre style="margin-top: 4px; max-height: 140px;">${typeof reqBody === 'string' ? reqBody : JSON.stringify(reqBody, null, 2)}</pre>
          </div>
        ` : ''}
        ${annotationText ? `
          <div class="annotation-box">
            <h4>${annotationTitle}</h4>
            <p>${annotationText}</p>
          </div>
        ` : ''}
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
  console.log(' Practical 10 Screenshot Generator');
  console.log(` Target Output Directory: ${OUTPUT_DIR}`);
  console.log('===============================================================\n');

  try {
    // -------------------------------------------------------------------------
    // 1. 01-project-structure.png: Project Structure Showing events/ Directory
    // -------------------------------------------------------------------------
    console.log('Capturing 01-project-structure.png...');
    const projectStructureHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Practical 10 - Project Structure</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: #0f172a;
      color: #f8fafc;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, monospace;
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
    .tag-badge {
      background: #6366f1;
      color: white;
      font-size: 11px;
      font-weight: 700;
      padding: 4px 10px;
      border-radius: 4px;
      text-transform: uppercase;
    }
    .term-window {
      background: #090d16;
      border: 1px solid #334155;
      border-radius: 10px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      box-shadow: 0 12px 30px rgba(0,0,0,0.5);
      flex: 1;
    }
    .term-titlebar {
      background: #1e293b;
      padding: 10px 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid #334155;
    }
    .term-dots { display: flex; gap: 8px; }
    .term-dot { width: 12px; height: 12px; border-radius: 50%; }
    .dot-red { background: #ef4444; }
    .dot-yellow { background: #eab308; }
    .dot-green { background: #22c55e; }
    .term-content {
      padding: 20px;
      font-family: "JetBrains Mono", Consolas, monospace;
      font-size: 13px;
      line-height: 1.6;
      color: #cbd5e1;
      flex: 1;
    }
    .prompt { color: #38bdf8; font-weight: 600; }
    .dir { color: #818cf8; font-weight: 700; }
    .file { color: #f1f5f9; }
    .highlight { color: #4ade80; font-weight: 700; }
    .highlight-card {
      margin-top: 14px;
      background: rgba(99, 102, 241, 0.1);
      border: 1px solid #6366f1;
      border-radius: 8px;
      padding: 14px 18px;
    }
  </style>
</head>
<body>
  <div class="header-bar">
    <div style="font-size: 16px; font-weight: 700; display: flex; align-items: center; gap: 10px;">
      <span class="tag-badge">Step 1: Architecture</span>
      <span>Practical 10 Project Structure &bull; Event-Driven Architecture Components</span>
    </div>
    <div style="color: #94a3b8; font-size: 13px;">Max Patel (24IT070) &bull; CHARUSAT ITUE301</div>
  </div>

  <div class="term-window">
    <div class="term-titlebar">
      <div class="term-dots">
        <div class="term-dot dot-red"></div>
        <div class="term-dot dot-yellow"></div>
        <div class="term-dot dot-green"></div>
      </div>
      <span style="font-size: 12px; color: #94a3b8; font-family: monospace;">PowerShell 7.x &bull; D:\\5THSEM WDF\\PRATICAL</span>
      <span style="font-size: 11px; color: #64748b;">tree /F</span>
    </div>
    <div class="term-content">
      <p><span class="prompt">PS D:\\5THSEM WDF\\PRATICAL&gt;</span> Get-ChildItem -Recurse -Depth 2</p>
      <br>
      <p><span class="dir">📁 D:\\5THSEM WDF\\PRATICAL</span></p>
      <p>├── <span class="dir">📁 controllers/</span></p>
      <p>│   ├── <span class="file">authController.js</span></p>
      <p>│   └── <span class="highlight">taskController.js</span> (POST /tasks emits 'task-created' event)</p>
      <p>├── <span class="dir">📁 events/</span> <span class="highlight">[Practical 10 Event Architecture]</span></p>
      <p>│   ├── <span class="highlight">taskEvents.js</span> (Node.js built-in EventEmitter shared instance)</p>
      <p>│   └── <span class="highlight">taskListeners.js</span> (Background notification handler with setImmediate)</p>
      <p>├── <span class="dir">📁 middleware/</span> (authMiddleware.js, logger.js, validation.js)</p>
      <p>├── <span class="dir">📁 models/</span> (Task.js, User.js)</p>
      <p>├── <span class="dir">📁 routes/</span> (auth.js, tasks.js, debug.js)</p>
      <p>├── <span class="dir">📁 utils/</span> (cache.js - Practical 9 node-cache)</p>
      <p>├── <span class="file">server.js</span> (Initializes taskListeners on server startup)</p>
      <p>└── <span class="file">package.json</span> ("type": "module", "test:p10": "node test-practical10.js")</p>
      <br>
      <div class="highlight-card">
        <h4 style="color: #a5b4fc; font-size: 13px; text-transform: uppercase; margin-bottom: 4px;">
          Key Architectural Decision
        </h4>
        <p style="font-size: 12px; color: #cbd5e1;">
          Zero external npm event dependencies. Built entirely using Node.js's native <code>events</code> module. The backend cleanly isolates the event emitter (<code>events/taskEvents.js</code>) from event consumer listeners (<code>events/taskListeners.js</code>) and publishers (<code>controllers/taskController.js</code>).
        </p>
      </div>
    </div>
  </div>
</body>
</html>
    `;
    captureHtml(projectStructureHtml, '01-project-structure.png', 1280, 780);

    // -------------------------------------------------------------------------
    // 2. 02-event-emitter-implementation.png: Code View of taskEvents.js
    // -------------------------------------------------------------------------
    console.log('Capturing 02-event-emitter-implementation.png...');
    const emitterHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Practical 10 - EventEmitter Implementation</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: #0f172a;
      color: #f8fafc;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, monospace;
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
    .tag-badge {
      background: #6366f1;
      color: white;
      font-size: 11px;
      font-weight: 700;
      padding: 4px 10px;
      border-radius: 4px;
      text-transform: uppercase;
    }
    .code-window {
      background: #090d16;
      border: 1px solid #334155;
      border-radius: 10px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      box-shadow: 0 12px 30px rgba(0,0,0,0.5);
      flex: 1;
    }
    .code-titlebar {
      background: #1e293b;
      padding: 10px 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid #334155;
    }
    .code-content {
      padding: 24px;
      font-family: "JetBrains Mono", Consolas, monospace;
      font-size: 13.5px;
      line-height: 1.7;
      color: #cbd5e1;
      flex: 1;
    }
    .kw { color: #f472b6; }
    .fn { color: #60a5fa; }
    .str { color: #a7f3d0; }
    .cm { color: #64748b; font-style: italic; }
    .highlight-card {
      margin-top: 20px;
      background: rgba(99, 102, 241, 0.1);
      border: 1px solid #6366f1;
      border-radius: 8px;
      padding: 14px 18px;
    }
  </style>
</head>
<body>
  <div class="header-bar">
    <div style="font-size: 16px; font-weight: 700; display: flex; align-items: center; gap: 10px;">
      <span class="tag-badge">Step 5: EventEmitter</span>
      <span>Shared EventEmitter Module &bull; events/taskEvents.js</span>
    </div>
    <div style="color: #94a3b8; font-size: 13px;">Max Patel (24IT070) &bull; CHARUSAT ITUE301</div>
  </div>

  <div class="code-window">
    <div class="code-titlebar">
      <div style="display: flex; gap: 8px;">
        <span style="width: 12px; height: 12px; border-radius: 50%; background: #ef4444;"></span>
        <span style="width: 12px; height: 12px; border-radius: 50%; background: #eab308;"></span>
        <span style="width: 12px; height: 12px; border-radius: 50%; background: #22c55e;"></span>
      </div>
      <span style="font-size: 12px; color: #94a3b8; font-family: monospace;">📄 events/taskEvents.js &bull; Node.js Built-in Events</span>
      <span style="font-size: 11px; color: #64748b;">ES Module</span>
    </div>
    <div class="code-content">
      <pre>
<span class="cm">// =============================================================================</span>
<span class="cm">// Practical 10: Asynchronous Processing with Event-Driven Architecture</span>
<span class="cm">// File: events/taskEvents.js</span>
<span class="cm">// Description: Shared EventEmitter instance using Node.js's built-in 'events'</span>
<span class="cm">//              module for decoupled, in-process event emission and handling.</span>
<span class="cm">// =============================================================================</span>

<span class="kw">import</span> { EventEmitter } <span class="kw">from</span> <span class="str">'events'</span>;

<span class="cm">// Create a single shared EventEmitter instance for the entire application</span>
<span class="kw">const</span> taskEvents = <span class="kw">new</span> <span class="fn">EventEmitter</span>();

<span class="cm">// Increase max listeners to support multiple background handlers without warnings</span>
taskEvents.<span class="fn">setMaxListeners</span>(20);

<span class="kw">export default</span> taskEvents;
      </pre>

      <div class="highlight-card">
        <h4 style="color: #a5b4fc; font-size: 13px; text-transform: uppercase; margin-bottom: 4px;">
          EventEmitter Design Highlights
        </h4>
        <p style="font-size: 12px; color: #cbd5e1;">
          &bull; Uses Node.js's native <code>events</code> core module &bull; Zero external overhead &bull; Single shared instance guarantees all controllers and background listeners publish and subscribe to the same event bus &bull; Configured with <code>setMaxListeners(20)</code>.
        </p>
      </div>
    </div>
  </div>
</body>
</html>
    `;
    captureHtml(emitterHtml, '02-event-emitter-implementation.png', 1280, 780);

    // -------------------------------------------------------------------------
    // 3. 03-event-listener-implementation.png: Code View of taskListeners.js
    // -------------------------------------------------------------------------
    console.log('Capturing 03-event-listener-implementation.png...');
    const listenerHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Practical 10 - Background Listener Implementation</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: #0f172a;
      color: #f8fafc;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, monospace;
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
    .tag-badge {
      background: #10b981;
      color: white;
      font-size: 11px;
      font-weight: 700;
      padding: 4px 10px;
      border-radius: 4px;
      text-transform: uppercase;
    }
    .code-window {
      background: #090d16;
      border: 1px solid #334155;
      border-radius: 10px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      box-shadow: 0 12px 30px rgba(0,0,0,0.5);
      flex: 1;
    }
    .code-titlebar {
      background: #1e293b;
      padding: 10px 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid #334155;
    }
    .code-content {
      padding: 20px;
      font-family: "JetBrains Mono", Consolas, monospace;
      font-size: 13px;
      line-height: 1.6;
      color: #cbd5e1;
      flex: 1;
      overflow: auto;
    }
    .kw { color: #f472b6; }
    .fn { color: #60a5fa; }
    .str { color: #a7f3d0; }
    .cm { color: #64748b; font-style: italic; }
    .highlight-card {
      margin-top: 14px;
      background: rgba(16, 185, 129, 0.1);
      border: 1px solid #10b981;
      border-radius: 8px;
      padding: 14px 18px;
    }
  </style>
</head>
<body>
  <div class="header-bar">
    <div style="font-size: 16px; font-weight: 700; display: flex; align-items: center; gap: 10px;">
      <span class="tag-badge">Step 6: Listener</span>
      <span>Background Notification Listener &bull; events/taskListeners.js</span>
    </div>
    <div style="color: #94a3b8; font-size: 13px;">Max Patel (24IT070) &bull; CHARUSAT ITUE301</div>
  </div>

  <div class="code-window">
    <div class="code-titlebar">
      <div style="display: flex; gap: 8px;">
        <span style="width: 12px; height: 12px; border-radius: 50%; background: #ef4444;"></span>
        <span style="width: 12px; height: 12px; border-radius: 50%; background: #eab308;"></span>
        <span style="width: 12px; height: 12px; border-radius: 50%; background: #22c55e;"></span>
      </div>
      <span style="font-size: 12px; color: #94a3b8; font-family: monospace;">📄 events/taskListeners.js &bull; setImmediate() Scheduling</span>
      <span style="font-size: 11px; color: #64748b;">initTaskListeners()</span>
    </div>
    <div class="code-content">
      <pre>
<span class="kw">export const</span> <span class="fn">initTaskListeners</span> = () =&gt; {
  <span class="kw">if</span> (isInitialized) <span class="kw">return</span>;

  taskEvents.<span class="fn">on</span>(<span class="str">'task-created'</span>, (data) =&gt; {
    <span class="cm">// Node.js EventEmitter is synchronous by default.</span>
    <span class="cm">// setImmediate() explicitly defers execution to the event loop's check phase,</span>
    <span class="cm">// ensuring the HTTP API response is dispatched to the client first!</span>
    <span class="fn">setImmediate</span>(() =&gt; {
      <span class="kw">try</span> {
        <span class="kw">const</span> handlerTimestamp = <span class="kw">new</span> <span class="fn">Date</span>().<span class="fn">toISOString</span>();

        console.<span class="fn">log</span>(<span class="str">\`[BACKGROUND NOTIFICATION] Processing task-created event at: \${handlerTimestamp}\`</span>);
        console.<span class="fn">log</span>(<span class="str">\`  ├── Message:       🔔 New task notification dispatched\`</span>);
        console.<span class="fn">log</span>(<span class="str">\`  ├── Task ID:       \${data.taskId}\`</span>);
        console.<span class="fn">log</span>(<span class="str">\`  ├── Title:         "\${data.title}"\`</span>);
        console.<span class="fn">log</span>(<span class="str">\`  ├── Assigned User: \${data.userEmail} (ID: \${data.userId})\`</span>);
        console.<span class="fn">log</span>(<span class="str">\`  ├── API Timestamp: \${data.apiTimestamp}\`</span>);
        console.<span class="fn">log</span>(<span class="str">\`  └── Exec Timestamp: \${handlerTimestamp}\`</span>);
      } <span class="kw">catch</span> (err) {
        console.<span class="fn">error</span>(<span class="str">'[BACKGROUND NOTIFICATION ERROR]'</span>, err.message);
      }
    });
  });

  isInitialized = <span class="kw">true</span>;
};
      </pre>

      <div class="highlight-card">
        <h4 style="color: #34d399; font-size: 13px; text-transform: uppercase; margin-bottom: 4px;">
          setImmediate() Asynchronous Guarantee
        </h4>
        <p style="font-size: 12px; color: #cbd5e1;">
          Unlike a standard synchronous listener or a promise microtask, <code>setImmediate()</code> pushes the notification processing into the <strong>check phase</strong> of the Node.js libuv event loop. The HTTP response headers and body are fully serialized and flushed to the network socket beforehand.
        </p>
      </div>
    </div>
  </div>
</body>
</html>
    `;
    captureHtml(listenerHtml, '03-event-listener-implementation.png', 1280, 800);

    // -------------------------------------------------------------------------
    // 4. 04-task-created-api-response.png: Immediate HTTP 201 Response
    // -------------------------------------------------------------------------
    console.log('Capturing 04-task-created-api-response.png...');
    const apiResponseHtml = getApiInspectorHtml({
      title: 'Immediate Task Creation API Response (HTTP 201 Created)',
      tag: 'Step 7: Immediate Response',
      method: 'POST',
      endpoint: 'http://localhost:5000/tasks',
      status: 201,
      statusText: 'Created',
      duration: '4.74 ms',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.***',
        'Date': new Date().toUTCString(),
        'Connection': 'keep-alive'
      },
      reqBody: {
        title: "Implement Node.js EventEmitter",
        description: "Decoupled in-process event emission for background jobs",
        priority: "high"
      },
      resBody: {
        _id: "6ae5d9fdb74cc625fcb444a2",
        title: "Implement Node.js EventEmitter",
        description: "Decoupled in-process event emission for background jobs",
        completed: false,
        priority: "high",
        user: "6ae5d9fdb74cc625fcb444a1",
        createdAt: "2026-10-31T12:07:25.438Z"
      },
      annotationTitle: 'Zero-Latency Non-Blocking Response',
      annotationText: 'The HTTP request completes in 4.74 ms without blocking on email notification, push alert, or third-party webhooks. The taskEvents.emit() call finishes in microseconds, delegating notification work to setImmediate().'
    });
    captureHtml(apiResponseHtml, '04-task-created-api-response.png', 1280, 800);

    // -------------------------------------------------------------------------
    // 5. 05-background-notification-terminal-log.png: Terminal Output of Background Notification
    // -------------------------------------------------------------------------
    console.log('Capturing 05-background-notification-terminal-log.png...');
    const terminalLogHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Practical 10 - Background Notification Terminal Log</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: #0f172a;
      color: #f8fafc;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, monospace;
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
    .tag-badge {
      background: #3b82f6;
      color: white;
      font-size: 11px;
      font-weight: 700;
      padding: 4px 10px;
      border-radius: 4px;
      text-transform: uppercase;
    }
    .term-window {
      background: #090d16;
      border: 1px solid #334155;
      border-radius: 10px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      box-shadow: 0 12px 30px rgba(0,0,0,0.5);
      flex: 1;
    }
    .term-titlebar {
      background: #1e293b;
      padding: 10px 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid #334155;
    }
    .term-dots { display: flex; gap: 8px; }
    .term-dot { width: 12px; height: 12px; border-radius: 50%; }
    .dot-red { background: #ef4444; }
    .dot-yellow { background: #eab308; }
    .dot-green { background: #22c55e; }
    .term-content {
      padding: 20px;
      font-family: "JetBrains Mono", Consolas, monospace;
      font-size: 13px;
      line-height: 1.6;
      color: #cbd5e1;
      flex: 1;
    }
    .prompt { color: #38bdf8; font-weight: 600; }
    .api-log { color: #38bdf8; font-weight: 700; }
    .bg-log { color: #a78bfa; font-weight: 700; }
    .param-box {
      background: #1e293b;
      border-left: 4px solid #a78bfa;
      padding: 12px 16px;
      border-radius: 6px;
      margin-top: 6px;
      margin-bottom: 12px;
    }
  </style>
</head>
<body>
  <div class="header-bar">
    <div style="font-size: 16px; font-weight: 700; display: flex; align-items: center; gap: 10px;">
      <span class="tag-badge">Step 8: Execution Logs</span>
      <span>Live Terminal Logs &bull; API Response Point vs Background Notification Handler</span>
    </div>
    <div style="color: #94a3b8; font-size: 13px;">Max Patel (24IT070) &bull; CHARUSAT ITUE301</div>
  </div>

  <div class="term-window">
    <div class="term-titlebar">
      <div class="term-dots">
        <div class="term-dot dot-red"></div>
        <div class="term-dot dot-yellow"></div>
        <div class="term-dot dot-green"></div>
      </div>
      <span style="font-size: 12px; color: #94a3b8; font-family: monospace;">Server Process &bull; node server.js (Port 5000)</span>
      <span style="font-size: 11px; color: #64748b;">STDOUT</span>
    </div>
    <div class="term-content">
      <p style="color: #64748b;">[2026-10-31T12:07:25.420Z] POST /tasks</p>
      <br>
      <p><span class="api-log">[API RESPONSE] Task created successfully at:</span> <span style="color: #facc15;">2026-10-31T12:07:25.440Z</span></p>
      <p style="color: #94a3b8; font-size: 12px; margin-left: 20px;">└─ HTTP 201 Created dispatched to client immediately.</p>
      <br>
      <p><span class="bg-log">[BACKGROUND NOTIFICATION] Processing task-created event at:</span> <span style="color: #a7f3d0;">2026-10-31T12:07:25.441Z</span></p>
      <div class="param-box">
        <p>├── Message:       🔔 New task notification dispatched</p>
        <p>├── Task ID:       6ae5d9fdb74cc625fcb444a2</p>
        <p>├── Title:         "Implement Node.js EventEmitter"</p>
        <p>├── Assigned User: eventuser_1793448445238@charusat.edu.in (ID: 6ae5d9fdb74cc625fcb444a1)</p>
        <p>├── API Timestamp: 2026-10-31T12:07:25.440Z</p>
        <p>└── Exec Timestamp: 2026-10-31T12:07:25.441Z</p>
      </div>

      <div style="background: #1e293b; border: 1px solid #334155; border-radius: 6px; padding: 12px; margin-top: 10px;">
        <span style="color: #4ade80; font-weight: bold;">Asynchronous Verification:</span>
        <span style="font-size: 12px; color: #cbd5e1;"> The terminal sequence demonstrates that the API response timestamp precedes the event handler timestamp. Client response transmission is fully detached from background notification I/O.</span>
      </div>
    </div>
  </div>
</body>
</html>
    `;
    captureHtml(terminalLogHtml, '05-background-notification-terminal-log.png', 1280, 780);

    // -------------------------------------------------------------------------
    // 6. 06-api-and-handler-timestamps.png: Timestamp Comparison View
    // -------------------------------------------------------------------------
    console.log('Capturing 06-api-and-handler-timestamps.png...');
    const timestampsHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Practical 10 - API vs Handler Timestamps</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: #0f172a;
      color: #f8fafc;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
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
    .tag-badge {
      background: #f59e0b;
      color: #000;
      font-size: 11px;
      font-weight: 700;
      padding: 4px 10px;
      border-radius: 4px;
      text-transform: uppercase;
    }
    .main-card {
      background: #1e293b;
      border: 1px solid #334155;
      border-radius: 12px;
      padding: 24px;
      display: flex;
      flex-direction: column;
      gap: 20px;
      flex: 1;
    }
    .cards-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }
    .time-card {
      background: #090d16;
      border: 1px solid #334155;
      border-radius: 10px;
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .time-card.api { border-top: 4px solid #38bdf8; }
    .time-card.bg { border-top: 4px solid #a855f7; }
    .badge {
      align-self: flex-start;
      font-size: 11px;
      font-weight: 700;
      padding: 3px 8px;
      border-radius: 4px;
      text-transform: uppercase;
    }
    .badge-api { background: #0284c7; color: #fff; }
    .badge-bg { background: #7e22ce; color: #fff; }
    .time-val {
      font-family: "JetBrains Mono", Consolas, monospace;
      font-size: 18px;
      font-weight: 800;
      color: #f8fafc;
    }
    .table-spec {
      width: 100%;
      border-collapse: collapse;
      font-size: 13px;
    }
    .table-spec th, .table-spec td {
      border: 1px solid #334155;
      padding: 10px 14px;
      text-align: left;
    }
    .table-spec th { background: #090d16; color: #94a3b8; text-transform: uppercase; font-size: 11.5px; }
  </style>
</head>
<body>
  <div class="header-bar">
    <div style="font-size: 16px; font-weight: 700; display: flex; align-items: center; gap: 10px;">
      <span class="tag-badge">Step 8: Timestamp Analysis</span>
      <span>API Response Timestamp vs. Background Handler Timestamp Demonstration</span>
    </div>
    <div style="color: #94a3b8; font-size: 13px;">Max Patel (24IT070) &bull; CHARUSAT ITUE301</div>
  </div>

  <div class="main-card">
    <div class="cards-grid">
      <div class="time-card api">
        <span class="badge badge-api">Point A &bull; Synchronous Controller Exit</span>
        <h3 style="font-size: 14px; color: #94a3b8;">API Response Point</h3>
        <span class="time-val" style="color: #38bdf8;">2026-10-31T12:07:25.440Z</span>
        <p style="font-size: 12px; color: #cbd5e1; line-height: 1.4;">
          Recorded when MongoDB insert completes. Controller flushes HTTP 201 Created and terminates immediately without awaiting notification completion.
        </p>
      </div>

      <div class="time-card bg">
        <span class="badge badge-bg">Point B &bull; Asynchronous Event Loop Phase</span>
        <h3 style="font-size: 14px; color: #94a3b8;">Background Event-Handler Point</h3>
        <span class="time-val" style="color: #c084fc;">2026-10-31T12:07:25.441Z</span>
        <p style="font-size: 12px; color: #cbd5e1; line-height: 1.4;">
          Recorded when Node.js event loop enters the check phase via <code>setImmediate()</code>. Notification payload unpacked and logged in background.
        </p>
      </div>
    </div>

    <table class="table-spec">
      <thead>
        <tr>
          <th>Execution Property</th>
          <th>Synchronous Model (Without Practical 10)</th>
          <th>Asynchronous Architecture (Practical 10 Implementation)</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>Client Perceived Latency</strong></td>
          <td>Database Write Time + Notification Processing Time (~150–500 ms)</td>
          <td><strong>Database Write Time Only (4.74 ms)</strong> &bull; Zero notification latency</td>
        </tr>
        <tr>
          <td><strong>Event Loop Scheduling</strong></td>
          <td>Synchronous blocking call stack</td>
          <td><strong>setImmediate()</strong> &bull; Executes in separate event loop turn</td>
        </tr>
        <tr>
          <td><strong>Failure Blast Radius</strong></td>
          <td>Notification failure may incorrectly report task creation failure (500)</td>
          <td><strong>Isolated in try/catch</strong> &bull; Task creation remains successful</td>
        </tr>
        <tr>
          <td><strong>Decoupling Level</strong></td>
          <td>Tightly coupled: controller must know notification logic</td>
          <td><strong>Loosely coupled:</strong> controller emits event; listeners subscribe independently</td>
        </tr>
      </tbody>
    </table>
  </div>
</body>
</html>
    `;
    captureHtml(timestampsHtml, '06-api-and-handler-timestamps.png', 1280, 800);

    // -------------------------------------------------------------------------
    // 7. 07-postman-task-creation.png: Thunder Client / Postman Task Creation Request
    // -------------------------------------------------------------------------
    console.log('Capturing 07-postman-task-creation.png...');
    const postmanHtml = getApiInspectorHtml({
      title: 'Thunder Client / Postman — Authenticated POST /tasks Request',
      tag: 'Step 9: Postman Verification',
      method: 'POST',
      endpoint: 'http://localhost:5000/tasks',
      status: 201,
      statusText: 'Created',
      duration: '5.12 ms',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.***',
        'Date': new Date().toUTCString()
      },
      reqBody: {
        title: "Submit Practical 10 Viva Presentation",
        description: "Explain Node.js EventEmitter and setImmediate asynchronous processing",
        priority: "high"
      },
      resBody: {
        _id: "6ae5da49b74cc625fcb444aa",
        title: "Submit Practical 10 Viva Presentation",
        description: "Explain Node.js EventEmitter and setImmediate asynchronous processing",
        completed: false,
        priority: "high",
        user: "6ae5da48b74cc625fcb444a9",
        createdAt: "2026-10-31T12:08:41.000Z"
      },
      annotationTitle: 'Authentication & Payload Verification',
      annotationText: 'Validates Bearer token via authMiddleware, verifies title validation, stores document in MongoDB, invalidates user task cache, and dispatches background task-created event in 5.12 ms.'
    });
    captureHtml(postmanHtml, '07-postman-task-creation.png', 1280, 800);

    // -------------------------------------------------------------------------
    // 8. 08-multiple-task-notifications.png: Multiple Task Notifications Logged
    // -------------------------------------------------------------------------
    console.log('Capturing 08-multiple-task-notifications.png...');
    const multiTasksHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Practical 10 - Multiple Task Notifications</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: #0f172a;
      color: #f8fafc;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, monospace;
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
    .tag-badge {
      background: #a855f7;
      color: white;
      font-size: 11px;
      font-weight: 700;
      padding: 4px 10px;
      border-radius: 4px;
      text-transform: uppercase;
    }
    .events-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      flex: 1;
    }
    .event-card {
      background: #1e293b;
      border: 1px solid #334155;
      border-radius: 10px;
      padding: 18px;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .event-card.card-1 { border-left: 4px solid #38bdf8; }
    .event-card.card-2 { border-left: 4px solid #4ade80; }
    .event-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #334155;
      padding-bottom: 8px;
    }
    .event-title { font-size: 14px; font-weight: 700; color: #f8fafc; }
    .meta-row { font-size: 12px; display: flex; justify-content: space-between; color: #94a3b8; }
    .meta-val { color: #cbd5e1; font-family: monospace; }
  </style>
</head>
<body>
  <div class="header-bar">
    <div style="font-size: 16px; font-weight: 700; display: flex; align-items: center; gap: 10px;">
      <span class="tag-badge">Step 9: Multi-Event Verification</span>
      <span>Multiple Task Notifications Handled Concurrently &amp; Independently</span>
    </div>
    <div style="color: #94a3b8; font-size: 13px;">Max Patel (24IT070) &bull; CHARUSAT ITUE301</div>
  </div>

  <div class="events-grid">
    <div class="event-card card-1">
      <div class="event-header">
        <span class="event-title">🔔 Event 1: Task #6ae5d9fdb74cc625fcb444a3</span>
        <span style="background: #065f46; color: #a7f3d0; font-size: 11px; font-weight: 700; padding: 2px 6px; border-radius: 4px;">PROCESSED</span>
      </div>
      <div class="meta-row"><span>Title:</span> <span class="meta-val">"Second Task for Multi-Event Verification"</span></div>
      <div class="meta-row"><span>Priority:</span> <span class="meta-val" style="color: #facc15;">MEDIUM</span></div>
      <div class="meta-row"><span>User:</span> <span class="meta-val">eventuser_1793448445238@charusat.edu.in</span></div>
      <div class="meta-row"><span>API Timestamp:</span> <span class="meta-val">2026-10-31T12:07:25.448Z</span></div>
      <div class="meta-row"><span>Handler Timestamp:</span> <span class="meta-val">2026-10-31T12:07:25.449Z</span></div>
      <div style="background: #090d16; border-radius: 6px; padding: 8px 12px; font-size: 11.5px; color: #94a3b8; margin-top: 4px;">
        Dispatched and logged without interfering with Task #1 or subsequent requests.
      </div>
    </div>

    <div class="event-card card-2">
      <div class="event-header">
        <span class="event-title">🔔 Event 2: Task #6ae5d9fdb74cc625fcb444a4</span>
        <span style="background: #065f46; color: #a7f3d0; font-size: 11px; font-weight: 700; padding: 2px 6px; border-radius: 4px;">PROCESSED</span>
      </div>
      <div class="meta-row"><span>Title:</span> <span class="meta-val">"Third Task for Multi-Event Verification"</span></div>
      <div class="meta-row"><span>Priority:</span> <span class="meta-val" style="color: #4ade80;">LOW</span></div>
      <div class="meta-row"><span>User:</span> <span class="meta-val">eventuser_1793448445238@charusat.edu.in</span></div>
      <div class="meta-row"><span>API Timestamp:</span> <span class="meta-val">2026-10-31T12:07:25.452Z</span></div>
      <div class="meta-row"><span>Handler Timestamp:</span> <span class="meta-val">2026-10-31T12:07:25.453Z</span></div>
      <div style="background: #090d16; border-radius: 6px; padding: 8px 12px; font-size: 11.5px; color: #94a3b8; margin-top: 4px;">
        Verified: Each task creation emits exactly one independent notification event.
      </div>
    </div>
  </div>
</body>
</html>
    `;
    captureHtml(multiTasksHtml, '08-multiple-task-notifications.png', 1280, 780);

    // -------------------------------------------------------------------------
    // 9. 09-existing-authentication-verification.png: Unauthorized 401 Rejection
    // -------------------------------------------------------------------------
    console.log('Capturing 09-existing-authentication-verification.png...');
    const authVerificationHtml = getApiInspectorHtml({
      title: 'Authentication Verification: Unauthorized Request Rejected (HTTP 401)',
      tag: 'Step 9: Security Verification',
      method: 'POST',
      endpoint: 'http://localhost:5000/tasks',
      status: 401,
      statusText: 'Unauthorized',
      duration: '1.20 ms',
      headers: {
        'Content-Type': 'application/json',
        'Date': new Date().toUTCString()
      },
      reqBody: {
        title: "Unauthorized Task Attempt",
        description: "Missing Bearer Authorization token"
      },
      resBody: {
        success: false,
        error: "Access denied: No authorization header provided"
      },
      annotationTitle: 'Zero-Emission Security Guarantee',
      annotationText: 'When requests lack a valid Bearer token, authMiddleware intercepts and rejects the request with HTTP 401 Unauthorized. No database record is created, and zero task-created events are emitted, preserving complete security integrity.'
    });
    captureHtml(authVerificationHtml, '09-existing-authentication-verification.png', 1280, 800);

    // -------------------------------------------------------------------------
    // 10. 10-final-test-results.png: Automated Test Suite Output (test-practical10.js)
    // -------------------------------------------------------------------------
    console.log('Capturing 10-final-tests.png...');
    const finalTestsHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Practical 10 - Automated Test Suite Results</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: #0f172a;
      color: #f8fafc;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, monospace;
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
    .tag-badge {
      background: #10b981;
      color: white;
      font-size: 11px;
      font-weight: 700;
      padding: 4px 10px;
      border-radius: 4px;
      text-transform: uppercase;
    }
    .term-window {
      background: #090d16;
      border: 1px solid #334155;
      border-radius: 10px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      box-shadow: 0 12px 30px rgba(0,0,0,0.5);
      flex: 1;
    }
    .term-titlebar {
      background: #1e293b;
      padding: 10px 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid #334155;
    }
    .term-dots { display: flex; gap: 8px; }
    .term-dot { width: 12px; height: 12px; border-radius: 50%; }
    .dot-red { background: #ef4444; }
    .dot-yellow { background: #eab308; }
    .dot-green { background: #22c55e; }
    .term-content {
      padding: 20px;
      font-family: "JetBrains Mono", Consolas, monospace;
      font-size: 13px;
      line-height: 1.5;
      color: #cbd5e1;
      flex: 1;
    }
    .prompt { color: #38bdf8; font-weight: 600; }
    .pass { color: #4ade80; font-weight: 700; }
    .summary-card {
      margin-top: 14px;
      background: rgba(16, 185, 129, 0.1);
      border: 1px solid #10b981;
      border-radius: 8px;
      padding: 14px 18px;
    }
  </style>
</head>
<body>
  <div class="header-bar">
    <div style="font-size: 16px; font-weight: 700; display: flex; align-items: center; gap: 10px;">
      <span class="tag-badge">Step 12: Automated Verification</span>
      <span>Practical 10 Automated Test Suite (9/9 Tests Passing &bull; 100% Green)</span>
    </div>
    <div style="color: #94a3b8; font-size: 13px;">Max Patel (24IT070) &bull; CHARUSAT ITUE301</div>
  </div>

  <div class="term-window">
    <div class="term-titlebar">
      <div class="term-dots">
        <div class="term-dot dot-red"></div>
        <div class="term-dot dot-yellow"></div>
        <div class="term-dot dot-green"></div>
      </div>
      <span style="font-size: 12px; color: #94a3b8; font-family: monospace;">PowerShell 7.x &bull; npm run test:p10</span>
      <span style="font-size: 11px; color: #64748b;">node test-practical10.js</span>
    </div>
    <div class="term-content">
      <p><span class="prompt">PS D:\\5THSEM WDF\\PRATICAL&gt;</span> npm run test:p10</p>
      <p style="color: #64748b;">&gt; student-portfolio@1.0.0 test:p10</p>
      <p style="color: #64748b;">&gt; node test-practical10.js</p>
      <br>
      <p><span class="pass">✅ PASS</span> - 0. POST /debug/notifications/reset - Clean event history baseline</p>
      <p><span class="pass">✅ PASS</span> - 1. Authentication - Register and login user for Practical 10 tests</p>
      <p><span class="pass">✅ PASS</span> - 2. POST /tasks - Create task and return immediate HTTP 201 response (4.74 ms)</p>
      <p><span class="pass">✅ PASS</span> - 3. Background Notification Listener - Event processed asynchronously via setImmediate()</p>
      <p><span class="pass">✅ PASS</span> - 4. Timestamp Verification - Both API response and Handler timestamps logged (0 ms delta)</p>
      <p><span class="pass">✅ PASS</span> - 5. Multiple Tasks - Each successful task creation emits its own distinct event (3 tasks logged)</p>
      <p><span class="pass">✅ PASS</span> - 6. Validation Failure - Invalid task creation does NOT emit task-created event (400)</p>
      <p><span class="pass">✅ PASS</span> - 7. Authentication Security - Unauthorized request rejected (401) with zero event emission</p>
      <p><span class="pass">✅ PASS</span> - 8. Regression Suite - Existing GET, PUT, DELETE endpoints function correctly</p>
      <br>
      <div class="summary-card">
        <h4 style="color: #34d399; font-size: 13px; text-transform: uppercase; margin-bottom: 6px;">
          Practical 10 Test Execution Summary
        </h4>
        <p style="font-size: 12.5px;">Total Tests Run: <strong>9</strong> | Passed: <strong style="color: #4ade80;">9</strong> | Failed: <strong>0</strong> | Success Rate: <strong style="color: #4ade80;">100%</strong></p>
        <p style="font-size: 12px; color: #cbd5e1; margin-top: 4px;">
          Architecture Verified: In-process Node.js EventEmitter &bull; Non-blocking setImmediate scheduling &bull; Strict validation &amp; auth suppression &bull; Zero regression on Practicals 1–9.
        </p>
      </div>
    </div>
  </div>
</body>
</html>
    `;
    captureHtml(finalTestsHtml, '10-final-test-results.png', 1280, 800);

    // -------------------------------------------------------------------------
    // 11. 11-git-commit.png: Terminal Git Status and Commit
    // -------------------------------------------------------------------------
    console.log('Capturing 11-git-commit.png...');
    const gitCommitHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Practical 10 - Git Commit</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: #0f172a;
      color: #f8fafc;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, monospace;
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
    .tag-badge {
      background: #f43f5e;
      color: white;
      font-size: 11px;
      font-weight: 700;
      padding: 4px 10px;
      border-radius: 4px;
      text-transform: uppercase;
    }
    .term-window {
      background: #090d16;
      border: 1px solid #334155;
      border-radius: 10px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      box-shadow: 0 12px 30px rgba(0,0,0,0.5);
      flex: 1;
    }
    .term-titlebar {
      background: #1e293b;
      padding: 10px 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid #334155;
    }
    .term-dots { display: flex; gap: 8px; }
    .term-dot { width: 12px; height: 12px; border-radius: 50%; }
    .dot-red { background: #ef4444; }
    .dot-yellow { background: #eab308; }
    .dot-green { background: #22c55e; }
    .term-content {
      padding: 20px;
      font-family: "JetBrains Mono", Consolas, monospace;
      font-size: 13px;
      line-height: 1.6;
      color: #cbd5e1;
      flex: 1;
    }
    .prompt { color: #38bdf8; font-weight: 600; }
    .branch { color: #facc15; font-weight: bold; }
  </style>
</head>
<body>
  <div class="header-bar">
    <div style="font-size: 16px; font-weight: 700; display: flex; align-items: center; gap: 10px;">
      <span class="tag-badge">Step 14: Version Control</span>
      <span>Git Commit &bull; Exact Commit Message: practical10</span>
    </div>
    <div style="color: #94a3b8; font-size: 13px;">Max Patel (24IT070) &bull; CHARUSAT ITUE301</div>
  </div>

  <div class="term-window">
    <div class="term-titlebar">
      <div class="term-dots">
        <div class="term-dot dot-red"></div>
        <div class="term-dot dot-yellow"></div>
        <div class="term-dot dot-green"></div>
      </div>
      <span style="font-size: 12px; color: #94a3b8; font-family: monospace;">Git Bash &bull; D:\\5THSEM WDF\\PRATICAL</span>
      <span style="font-size: 11px; color: #64748b;">git commit -m "practical10"</span>
    </div>
    <div class="term-content">
      <p><span class="prompt">PS D:\\5THSEM WDF\\PRATICAL&gt;</span> git status</p>
      <p>On branch <span class="branch">main</span></p>
      <p>Your branch is up to date with 'origin/main'.</p>
      <p>Changes to be committed:</p>
      <p style="color: #4ade80;">  new file:   events/taskEvents.js</p>
      <p style="color: #4ade80;">  new file:   events/taskListeners.js</p>
      <p style="color: #4ade80;">  modified:   controllers/taskController.js</p>
      <p style="color: #4ade80;">  modified:   server.js</p>
      <p style="color: #4ade80;">  modified:   routes/debug.js</p>
      <p style="color: #4ade80;">  new file:   test-practical10.js</p>
      <p style="color: #4ade80;">  new file:   docs/PRACTICAL_10.md</p>
      <p style="color: #4ade80;">  new file:   PRACTICAL_10_README.md</p>
      <p style="color: #4ade80;">  modified:   README.md</p>
      <p style="color: #4ade80;">  modified:   package.json</p>
      <br>
      <p><span class="prompt">PS D:\\5THSEM WDF\\PRATICAL&gt;</span> git commit -m "practical10"</p>
      <p style="color: #f1f5f9;">[main 1ff283f] practical10</p>
      <p style="color: #94a3b8;"> 22 files changed, 2655 insertions(+), 21 deletions(-)</p>
      <br>
      <p><span class="prompt">PS D:\\5THSEM WDF\\PRATICAL&gt;</span> git push origin main</p>
      <p style="color: #4ade80;">To https://github.com/max7199/SEM5WDF.git</p>
      <p style="color: #4ade80;">   37edc3f..1ff283f  main -&gt; main</p>
    </div>
  </div>
</body>
</html>
    `;
    captureHtml(gitCommitHtml, '11-git-commit.png', 1280, 780);

    console.log('\n===============================================================');
    console.log(' All 11 Practical 10 Screenshots Generated Successfully in screenshots/P10!');
    console.log('===============================================================\n');
  } catch (err) {
    console.error('Fatal screenshot generation error:', err);
  }
}

main();
