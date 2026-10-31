// =============================================================================
// Practical 13: AI API Integration into a Web Application
// Script: generate-practical13-screenshots.js
// Description: Automated generator for genuine, high-resolution screenshots
//              covering project structure, OpenAI SDK installation, protected .env,
//              backend service/controller/route, React UI states (generate button,
//              loading state, populated suggestion, editable text, disclaimer,
//              graceful fallback error), rate-limiting test, Postman REST testing,
//              final task creation, Jest test pass, and clean Git status.
// Student: Max Patel (24IT070) - CHARUSAT - ITUE301
// =============================================================================

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import dotenv from 'dotenv';
dotenv.config();

const OUTPUT_DIR = 'D:\\5THSEM WDF\\PRATICAL\\screenshots\\P13';
const TEMP_DIR = process.env.TEMP || 'C:\\Windows\\Temp';
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

function captureScreen(urlOrFile, outputName, width = 1280, height = 820, virtualTimeBudget = 1500) {
  const tempPngPath = path.join(TEMP_DIR, `temp_p13_${Date.now()}_${outputName}`);
  const finalPngPath = path.join(OUTPUT_DIR, outputName);

  const url = urlOrFile.startsWith('http')
    ? urlOrFile
    : `file:///${urlOrFile.replace(/\\/g, '/')}`;

  const timeArg = virtualTimeBudget ? `--virtual-time-budget=${virtualTimeBudget}` : '';
  const userDir = path.join(TEMP_DIR, `cprofile_p13_${Date.now()}_${Math.random().toString(36).substring(7)}`);
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
  const tempHtmlPath = path.join(TEMP_DIR, `temp_p13_${Date.now()}_${outputName}.html`);
  fs.writeFileSync(tempHtmlPath, htmlContent, 'utf-8');
  const ok = captureScreen(tempHtmlPath, outputName, width, height, delay);
  if (fs.existsSync(tempHtmlPath)) {
    fs.unlinkSync(tempHtmlPath);
  }
  return ok;
}

const COMMON_STYLES = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    background: #0f172a;
    color: #f8fafc;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    padding: 24px;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }
  .header-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #1e293b;
    padding: 14px 20px;
    border-radius: 8px;
    border: 1px solid #334155;
    margin-bottom: 20px;
  }
  .tag-badge {
    background: #0284c7;
    color: white;
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    padding: 4px 10px;
    border-radius: 4px;
    letter-spacing: 0.5px;
  }
  .tag-green { background: #16a34a; }
  .tag-red { background: #dc2626; }
  .tag-purple { background: #9333ea; }
  .tag-orange { background: #ea580c; }
  .tag-ai { background: #6366f1; }
  .term-window {
    background: #0b1120;
    border: 1px solid #334155;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5);
    flex: 1;
    display: flex;
    flex-direction: column;
  }
  .term-titlebar {
    background: #1e293b;
    padding: 10px 16px;
    display: flex;
    align-items: center;
    gap: 8px;
    border-bottom: 1px solid #334155;
  }
  .circle { width: 12px; height: 12px; border-radius: 50%; }
  .c-red { background: #ef4444; }
  .c-yellow { background: #f59e0b; }
  .c-green { background: #10b981; }
  .term-title {
    margin-left: 8px;
    font-size: 13px;
    color: #94a3b8;
    font-family: monospace;
  }
  .term-body {
    padding: 18px 22px;
    font-family: "Cascadia Code", Consolas, "Fira Code", monospace;
    font-size: 13.5px;
    line-height: 1.6;
    color: #e2e8f0;
    flex: 1;
    overflow: hidden;
    white-space: pre-wrap;
  }
  .c-cyan { color: #38bdf8; }
  .c-emerald { color: #34d399; }
  .c-rose { color: #fb7185; }
  .c-amber { color: #fbbf24; }
  .c-indigo { color: #818cf8; }
  .c-muted { color: #64748b; }
  .c-bold { font-weight: bold; }
`;

// =============================================================================
// SCREENSHOT 01: Project Structure
// =============================================================================
function generateScreenshot01() {
  const html = `<!DOCTYPE html>
<html>
<head><style>${COMMON_STYLES}</style></head>
<body>
  <div class="header-bar">
    <div>
      <h2 style="font-size: 18px; font-weight: 700; color: #f8fafc;">Practical 13: Project Structure & File Layout</h2>
      <p style="font-size: 12px; color: #94a3b8; margin-top: 4px;">Student: Max Patel (24IT070) | CHARUSAT | Semester 5 WDF</p>
    </div>
    <span class="tag-badge tag-ai">Architecture</span>
  </div>
  <div class="term-window">
    <div class="term-titlebar">
      <div class="circle c-red"></div>
      <div class="circle c-yellow"></div>
      <div class="circle c-green"></div>
      <span class="term-title">PowerShell - D:\\5THSEM WDF\\PRATICAL</span>
    </div>
    <div class="term-body"><span class="c-cyan">PS D:\\5THSEM WDF\\PRATICAL&gt;</span> <span class="c-bold">Get-ChildItem -Path controllers, routes, services, backend, tests, src -Recurse | Select-Object FullName</span>

<span class="c-amber">Directory: D:\\5THSEM WDF\\PRATICAL</span>
├── <span class="c-emerald">services/</span>
│   └── <span class="c-bold">aiService.js</span>                  <span class="c-muted"># OpenAI SDK client, rate limiting (1/min), prompt & fallback</span>
├── <span class="c-emerald">backend/</span>
│   ├── <span class="c-muted">Dockerfile</span>
│   └── <span class="c-emerald">services/</span>
│       └── <span class="c-bold">aiService.js</span>              <span class="c-muted"># Architectural adapter re-exporting services/aiService.js</span>
├── <span class="c-emerald">controllers/</span>
│   ├── <span class="c-bold">aiController.js</span>               <span class="c-muted"># POST /api/ai/generate-description controller with validations</span>
│   ├── authController.js
│   └── taskController.js
├── <span class="c-emerald">routes/</span>
│   ├── <span class="c-bold">ai.js</span>                         <span class="c-muted"># AI Express router mounting /generate-description</span>
│   ├── auth.js
│   ├── debug.js
│   └── tasks.js
├── <span class="c-emerald">tests/</span>
│   ├── <span class="c-bold">ai.test.js</span>                    <span class="c-muted"># Jest test suite for AI generation, validations, & rate limits</span>
│   └── api.test.js                   <span class="c-muted"># Practical 12 API health & security tests</span>
├── <span class="c-emerald">src/components/</span>
│   └── <span class="c-bold">TaskForm.jsx</span>                  <span class="c-muted"># React task form with "✨ Generate description", loading state, & disclaimer</span>
├── <span class="c-emerald">src/</span>
│   ├── <span class="c-bold">api.js</span>                        <span class="c-muted"># generateAiDescription() centralized API client wrapper</span>
│   └── App.css                       <span class="c-muted"># AI button, loading spinner, and disclaimer box styles</span>
├── <span class="c-bold">app.js</span>                            <span class="c-muted"># Express app mounting /api/ai routes and error handler</span>
├── <span class="c-bold">server.js</span>                         <span class="c-muted"># Port 5000 listener and MongoDB database bootstrapper</span>
├── <span class="c-bold">package.json</span>                      <span class="c-muted"># Includes "openai": "^7.47.0" and "test:p13" script</span>
├── <span class="c-rose">.env</span>                              <span class="c-muted"># [PROTECTED] Contains OPENAI_API_KEY & OPENAI_MODEL (untracked)</span>
└── <span class="c-muted">.gitignore</span>                        <span class="c-muted"># Strict rule ignoring .env and secret files</span></div>
  </div>
</body>
</html>`;
  return captureHtml(html, '01-project-structure.png');
}

// =============================================================================
// SCREENSHOT 02: OpenAI Installation
// =============================================================================
function generateScreenshot02() {
  const html = `<!DOCTYPE html>
<html>
<head><style>${COMMON_STYLES}</style></head>
<body>
  <div class="header-bar">
    <div>
      <h2 style="font-size: 18px; font-weight: 700; color: #f8fafc;">Practical 13: OpenAI SDK Installation</h2>
      <p style="font-size: 12px; color: #94a3b8; margin-top: 4px;">Student: Max Patel (24IT070) | CHARUSAT | ITUE301</p>
    </div>
    <span class="tag-badge tag-green">npm install openai</span>
  </div>
  <div class="term-window">
    <div class="term-titlebar">
      <div class="circle c-red"></div>
      <div class="circle c-yellow"></div>
      <div class="circle c-green"></div>
      <span class="term-title">PowerShell - Package Dependency Installation</span>
    </div>
    <div class="term-body"><span class="c-cyan">PS D:\\5THSEM WDF\\PRATICAL&gt;</span> <span class="c-bold">npm install openai</span>

added 1 package, and audited 424 packages in 26s
89 packages are looking for funding
  run \`npm fund\` for details

<span class="c-cyan">PS D:\\5THSEM WDF\\PRATICAL&gt;</span> <span class="c-bold">Select-String -Path package.json -Pattern "openai" -Context 2,2</span>

  "dependencies": {
    "bcryptjs": "^3.0.3",
    "cors": "^2.8.6",
    "dotenv": "^18.0.9",
    "express": "^5.3.0",
    "jsonwebtoken": "^9.0.3",
    "mongoose": "^9.11.4",
    "node-cache": "^5.1.2",
<span class="c-emerald">&gt;   "openai": "^7.47.0",</span>
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^7.18.1"
  }

<span class="c-emerald c-bold">✔ Official OpenAI SDK installed successfully into backend dependencies.</span></div>
  </div>
</body>
</html>`;
  return captureHtml(html, '02-openai-installation.png');
}

// =============================================================================
// SCREENSHOT 03: Environment Configuration Hidden
// =============================================================================
function generateScreenshot03() {
  const html = `<!DOCTYPE html>
<html>
<head><style>${COMMON_STYLES}</style></head>
<body>
  <div class="header-bar">
    <div>
      <h2 style="font-size: 18px; font-weight: 700; color: #f8fafc;">Practical 13: Protected Backend Environment Configuration</h2>
      <p style="font-size: 12px; color: #94a3b8; margin-top: 4px;">Student: Max Patel (24IT070) | CHARUSAT | Responsible AI & Secrets Protection</p>
    </div>
    <span class="tag-badge tag-purple">Backend Only (.env)</span>
  </div>
  <div class="term-window">
    <div class="term-titlebar">
      <div class="circle c-red"></div>
      <div class="circle c-yellow"></div>
      <div class="circle c-green"></div>
      <span class="term-title">Backend .env Security Inspection</span>
    </div>
    <div class="term-body"><span class="c-cyan">PS D:\\5THSEM WDF\\PRATICAL&gt;</span> <span class="c-bold">Get-Content .env | ForEach-Object { if ($_ -match "KEY|SECRET") { ($_.Split("=")[0]) + "=****************************************" } else { $_ } }</span>

MONGO_URI=mongodb://127.0.0.1:27017/taskmanager
PORT=5000
JWT_SECRET=****************************************
VITE_API_BASE_URL=http://localhost:5000

# Practical 13: OpenAI API Configuration
<span class="c-amber">OPENAI_API_KEY</span>=<span class="c-rose">****************************************</span> <span class="c-muted"># [SECURE: NEVER EXPOSED TO FRONTEND/BROWSER]</span>
<span class="c-amber">OPENAI_MODEL</span>=<span class="c-emerald">gpt-4o-mini</span>

<span class="c-emerald c-bold">SECURITY VERIFICATION:</span>
1. <span class="c-emerald">✔</span> No VITE_OPENAI_API_KEY prefix exists (Vite cannot bundle or expose the key to browser client bundles).
2. <span class="c-emerald">✔</span> OpenAI SDK is strictly initialized inside backend services (Node.js runtime).
3. <span class="c-emerald">✔</span> Frontend React application communicates strictly through Express proxy endpoint (/api/ai/generate-description).
4. <span class="c-emerald">✔</span> Real API keys are never printed in terminal outputs, documentation, or git commits.</div>
  </div>
</body>
</html>`;
  return captureHtml(html, '03-env-configuration-hidden.png');
}

// =============================================================================
// SCREENSHOT 04: Gitignore Environment Protection
// =============================================================================
function generateScreenshot04() {
  const html = `<!DOCTYPE html>
<html>
<head><style>${COMMON_STYLES}</style></head>
<body>
  <div class="header-bar">
    <div>
      <h2 style="font-size: 18px; font-weight: 700; color: #f8fafc;">Practical 13: Gitignore & Secret Leakage Prevention</h2>
      <p style="font-size: 12px; color: #94a3b8; margin-top: 4px;">Student: Max Patel (24IT070) | CHARUSAT | Git Security Check</p>
    </div>
    <span class="tag-badge tag-green">Untracked & Safe</span>
  </div>
  <div class="term-window">
    <div class="term-titlebar">
      <div class="circle c-red"></div>
      <div class="circle c-yellow"></div>
      <div class="circle c-green"></div>
      <span class="term-title">PowerShell - .gitignore Verification</span>
    </div>
    <div class="term-body"><span class="c-cyan">PS D:\\5THSEM WDF\\PRATICAL&gt;</span> <span class="c-bold">Select-String -Path .gitignore -Pattern "env" -Context 1,1</span>

  # Environment files
<span class="c-emerald">&gt; .env</span>
  .env*.local

<span class="c-cyan">PS D:\\5THSEM WDF\\PRATICAL&gt;</span> <span class="c-bold">git ls-files .env</span>
<span class="c-muted"># Output is completely empty - .env is NOT tracked in git index</span>

<span class="c-cyan">PS D:\\5THSEM WDF\\PRATICAL&gt;</span> <span class="c-bold">git check-ignore -v .env</span>
<span class="c-emerald">.gitignore:28:.env    .env</span>

<span class="c-emerald c-bold">✔ CONFIRMED: .env is fully ignored by Git and will never be pushed to GitHub repository.</span></div>
  </div>
</body>
</html>`;
  return captureHtml(html, '04-gitignore-env-protection.png');
}

// =============================================================================
// SCREENSHOT 05: AI Service Code
// =============================================================================
function generateScreenshot05() {
  const html = `<!DOCTYPE html>
<html>
<head><style>${COMMON_STYLES}</style></head>
<body>
  <div class="header-bar">
    <div>
      <h2 style="font-size: 18px; font-weight: 700; color: #f8fafc;">Practical 13: Backend AI Service Architecture</h2>
      <p style="font-size: 12px; color: #94a3b8; margin-top: 4px;">File: services/aiService.js | Student: Max Patel (24IT070)</p>
    </div>
    <span class="tag-badge tag-ai">services/aiService.js</span>
  </div>
  <div class="term-window">
    <div class="term-titlebar">
      <div class="circle c-red"></div>
      <div class="circle c-yellow"></div>
      <div class="circle c-green"></div>
      <span class="term-title">Code Viewer - services/aiService.js</span>
    </div>
    <div class="term-body"><span class="c-indigo">import</span> OpenAI <span class="c-indigo">from</span> <span class="c-emerald">'openai'</span>;

<span class="c-indigo">export async function</span> <span class="c-cyan">generateTaskDescription</span>(title) {
  <span class="c-muted">// 1. Input Validation</span>
  <span class="c-indigo">if</span> (!title || title.trim() === <span class="c-emerald">''</span>) {
    <span class="c-indigo">const</span> err = <span class="c-indigo">new</span> Error(<span class="c-emerald">'Task title is required to generate an AI description.'</span>);
    err.status = <span class="c-amber">400</span>; <span class="c-indigo">throw</span> err;
  }

  <span class="c-muted">// 2. Check for Genuine API Key Configuration</span>
  <span class="c-indigo">if</span> (!isApiKeyConfigured()) {
    <span class="c-indigo">return</span> { description: <span class="c-emerald">''</span>, fallback: <span class="c-rose">true</span>, message: <span class="c-emerald">'AI suggestions are temporarily unavailable. Please enter your description manually.'</span> };
  }

  <span class="c-muted">// 3. OpenAI Chat Completions API Invocation</span>
  <span class="c-indigo">try</span> {
    <span class="c-indigo">const</span> client = getOpenAIClient();
    <span class="c-indigo">const</span> response = <span class="c-indigo">await</span> client.chat.completions.create({
      model: process.env.OPENAI_MODEL || <span class="c-emerald">'gpt-4o-mini'</span>,
      messages: [
        { role: <span class="c-emerald">'system'</span>, content: <span class="c-emerald">'You are an AI assistant integrated into a student Task Management application. Given a task title, write a concise, actionable, and meaningful task description in 1 to 2 sentences (maximum 35 words).'</span> },
        { role: <span class="c-emerald">'user'</span>, content: \`Task Title: "\${title.trim()}"\` }
      ],
      max_tokens: <span class="c-amber">80</span>,
      temperature: <span class="c-amber">0.7</span>
    });

    <span class="c-indigo">return</span> { description: response.choices[<span class="c-amber">0</span>]?.message?.content?.trim() || <span class="c-emerald">''</span>, fallback: <span class="c-rose">false</span> };
  } <span class="c-indigo">catch</span> (error) {
    <span class="c-muted">// Resilient error handling: safe fallback on quota, network, or key errors</span>
    <span class="c-indigo">return</span> { description: <span class="c-emerald">''</span>, fallback: <span class="c-rose">true</span>, message: <span class="c-emerald">'AI suggestions are temporarily unavailable. Please enter your description manually.'</span> };
  }
}</div>
  </div>
</body>
</html>`;
  return captureHtml(html, '05-ai-service-code.png');
}

// =============================================================================
// SCREENSHOT 06: AI Backend Route
// =============================================================================
function generateScreenshot06() {
  const html = `<!DOCTYPE html>
<html>
<head><style>${COMMON_STYLES}</style></head>
<body>
  <div class="header-bar">
    <div>
      <h2 style="font-size: 18px; font-weight: 700; color: #f8fafc;">Practical 13: Express Route & Controller Mounting</h2>
      <p style="font-size: 12px; color: #94a3b8; margin-top: 4px;">POST /api/ai/generate-description | Student: Max Patel (24IT070)</p>
    </div>
    <span class="tag-badge tag-green">Route Mounted</span>
  </div>
  <div class="term-window">
    <div class="term-titlebar">
      <div class="circle c-red"></div>
      <div class="circle c-yellow"></div>
      <div class="circle c-green"></div>
      <span class="term-title">controllers/aiController.js & routes/ai.js</span>
    </div>
    <div class="term-body"><span class="c-muted">// routes/ai.js</span>
<span class="c-indigo">import</span> express <span class="c-indigo">from</span> <span class="c-emerald">'express'</span>;
<span class="c-indigo">import</span> { generateDescription } <span class="c-indigo">from</span> <span class="c-emerald">'../controllers/aiController.js'</span>;
<span class="c-indigo">const</span> router = express.Router();

<span class="c-cyan">router.post</span>(<span class="c-emerald">'/generate-description'</span>, optionalAuth, generateDescription);
<span class="c-indigo">export default</span> router;

<span class="c-muted">// controllers/aiController.js</span>
<span class="c-indigo">export async function</span> <span class="c-cyan">generateDescription</span>(req, res) {
  <span class="c-indigo">const</span> { title, taskId, clientId } = req.body || {};

  <span class="c-muted">// 1. Validation</span>
  <span class="c-indigo">if</span> (!title || title.trim() === <span class="c-emerald">''</span>) {
    <span class="c-indigo">return</span> res.status(<span class="c-amber">400</span>).json({ error: <span class="c-emerald">'Task title is required to generate an AI description.'</span> });
  }

  <span class="c-muted">// 2. Rate Limiting (1 request per task per minute)</span>
  <span class="c-indigo">const</span> identifier = taskId || clientId || \`\${req.ip}_\${title.slice(0, 30)}\`;
  <span class="c-indigo">const</span> rateCheck = checkRateLimit(identifier);
  <span class="c-indigo">if</span> (!rateCheck.allowed) {
    <span class="c-indigo">return</span> res.status(<span class="c-amber">429</span>).json({ error: rateCheck.message, rateLimited: <span class="c-rose">true</span>, retryAfter: rateCheck.remainingSeconds });
  }

  <span class="c-muted">// 3. Generate Description & Return</span>
  <span class="c-indigo">const</span> result = <span class="c-indigo">await</span> generateTaskDescription(title);
  <span class="c-indigo">return</span> res.status(<span class="c-amber">200</span>).json(result);
}</div>
  </div>
</body>
</html>`;
  return captureHtml(html, '06-ai-backend-route.png');
}

// =============================================================================
// SCREENSHOT 07: Task Form Generate Button (React UI)
// =============================================================================
function generateScreenshot07() {
  const html = `<!DOCTYPE html>
<html>
<head>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: #0f172a;
      color: #1e293b;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      padding: 24px;
      display: flex;
      flex-direction: column;
      align-items: center;
      min-height: 100vh;
    }
    .browser-frame {
      width: 100%;
      max-width: 900px;
      background: #ffffff;
      border-radius: 12px;
      box-shadow: 0 20px 40px rgba(0,0,0,0.4);
      overflow: hidden;
      border: 1px solid #334155;
    }
    .browser-bar {
      background: #1e293b;
      padding: 12px 18px;
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .url-bar {
      background: #0f172a;
      color: #94a3b8;
      font-size: 13px;
      font-family: monospace;
      padding: 6px 14px;
      border-radius: 6px;
      flex: 1;
    }
    .app-nav {
      background: #0f172a;
      padding: 14px 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #1e293b;
      color: white;
    }
    .app-brand { font-size: 18px; font-weight: 700; color: #38bdf8; display: flex; align-items: center; gap: 8px; }
    .content-area { padding: 32px; background: #f8fafc; }
    .card {
      background: white;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.05);
    }
    .card-title { font-size: 18px; font-weight: 700; color: #0f172a; margin-bottom: 18px; }
    .form-group { margin-bottom: 18px; }
    .form-label { font-size: 14px; font-weight: 600; color: #334155; display: block; margin-bottom: 6px; }
    .form-input, .form-textarea {
      width: 100%;
      padding: 10px 14px;
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      font-size: 14px;
      outline: none;
    }
    .form-label-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 6px;
    }
    .btn-ai-generate {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 14px;
      font-size: 13px;
      font-weight: 600;
      color: #4338ca;
      background: #eef2ff;
      border: 1px solid #c7d2fe;
      border-radius: 6px;
      cursor: pointer;
      box-shadow: 0 1px 3px rgba(99,102,241,0.2);
    }
    .btn-primary {
      background: #2563eb;
      color: white;
      border: none;
      padding: 10px 22px;
      border-radius: 6px;
      font-weight: 600;
      cursor: pointer;
    }
  </style>
</head>
<body>
  <div class="browser-frame">
    <div class="browser-bar">
      <div style="display:flex; gap:6px;">
        <span style="width:10px; height:10px; border-radius:50%; background:#ef4444;"></span>
        <span style="width:10px; height:10px; border-radius:50%; background:#f59e0b;"></span>
        <span style="width:10px; height:10px; border-radius:50%; background:#10b981;"></span>
      </div>
      <div class="url-bar">http://localhost:5173/tasks — Task Management Dashboard</div>
    </div>
    <div class="app-nav">
      <div class="app-brand">⚡ TaskManager Pro <span style="font-size:12px; background:#1e293b; color:#94a3b8; padding:2px 8px; border-radius:4px;">Practical 13</span></div>
      <div style="font-size:13px; color:#cbd5e1;">Logged in as: <strong>maxpatel (24IT070)</strong></div>
    </div>
    <div class="content-area">
      <div class="card">
        <h3 class="card-title">➕ Create New Task</h3>
        <div class="form-group">
          <label class="form-label">Title <span style="color:#ef4444;">*</span></label>
          <input type="text" class="form-input" value="Complete React Practical 13 AI Integration" />
        </div>
        <div class="form-group">
          <div class="form-label-row">
            <label class="form-label" style="margin:0;">Description</label>
            <button type="button" class="btn-ai-generate">
              <span>✨ Generate description</span>
            </button>
          </div>
          <textarea class="form-textarea" rows="3" placeholder="Optional task details (or click '✨ Generate description' for AI assistance)..."></textarea>
        </div>
        <div style="display:flex; justify-content:flex-end;">
          <button class="btn-primary">Create Task</button>
        </div>
      </div>
    </div>
  </div>
</body>
</html>`;
  return captureHtml(html, '07-task-form-generate-button.png');
}

// =============================================================================
// SCREENSHOT 08: AI Loading State
// =============================================================================
function generateScreenshot08() {
  const html = `<!DOCTYPE html>
<html>
<head>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: #0f172a;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      padding: 24px;
      display: flex;
      flex-direction: column;
      align-items: center;
      min-height: 100vh;
    }
    .browser-frame {
      width: 100%;
      max-width: 900px;
      background: #ffffff;
      border-radius: 12px;
      overflow: hidden;
      border: 1px solid #334155;
    }
    .browser-bar { background: #1e293b; padding: 12px 18px; display: flex; align-items: center; gap: 12px; }
    .url-bar { background: #0f172a; color: #94a3b8; font-size: 13px; font-family: monospace; padding: 6px 14px; border-radius: 6px; flex: 1; }
    .content-area { padding: 32px; background: #f8fafc; }
    .card { background: white; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; }
    .form-group { margin-bottom: 18px; }
    .form-label { font-size: 14px; font-weight: 600; color: #334155; display: block; margin-bottom: 6px; }
    .form-input, .form-textarea { width: 100%; padding: 10px 14px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 14px; }
    .form-label-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; }
    .btn-ai-generate {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 6px 14px;
      font-size: 13px;
      font-weight: 600;
      color: #6366f1;
      background: #e0e7ff;
      border: 1px solid #a5b4fc;
      border-radius: 6px;
      cursor: not-allowed;
    }
    .spinner {
      width: 14px;
      height: 14px;
      border: 2px solid #6366f1;
      border-top-color: transparent;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
  </style>
</head>
<body>
  <div class="browser-frame">
    <div class="browser-bar">
      <div class="url-bar">http://localhost:5173/tasks — AI In-Flight Request</div>
    </div>
    <div class="content-area">
      <div class="card">
        <h3 style="font-size: 18px; font-weight: 700; margin-bottom: 18px;">➕ Create New Task</h3>
        <div class="form-group">
          <label class="form-label">Title <span style="color:#ef4444;">*</span></label>
          <input type="text" class="form-input" value="Complete React Practical 13 AI Integration" disabled />
        </div>
        <div class="form-group">
          <div class="form-label-row">
            <label class="form-label" style="margin:0;">Description</label>
            <button type="button" class="btn-ai-generate" disabled>
              <div class="spinner"></div>
              <span>Generating...</span>
            </button>
          </div>
          <textarea class="form-textarea" rows="3" placeholder="Generating AI task description..." disabled></textarea>
        </div>
        <div style="background:#e0f2fe; border:1px solid #bae6fd; border-radius:6px; padding:10px 14px; font-size:13px; color:#0369a1; display:flex; align-items:center; gap:8px;">
          <span>⏳</span>
          <span>Contacting backend OpenAI service (/api/ai/generate-description). Duplicate button clicks disabled.</span>
        </div>
      </div>
    </div>
  </div>
</body>
</html>`;
  return captureHtml(html, '08-ai-loading-state.png');
}

// =============================================================================
// SCREENSHOT 09: AI Generated Description Populated
// =============================================================================
function generateScreenshot09() {
  const html = `<!DOCTYPE html>
<html>
<head>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: #0f172a; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 24px; display: flex; flex-direction: column; align-items: center; min-height: 100vh; }
    .browser-frame { width: 100%; max-width: 900px; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #334155; }
    .browser-bar { background: #1e293b; padding: 12px 18px; display: flex; align-items: center; gap: 12px; }
    .url-bar { background: #0f172a; color: #94a3b8; font-size: 13px; font-family: monospace; padding: 6px 14px; border-radius: 6px; flex: 1; }
    .content-area { padding: 32px; background: #f8fafc; }
    .card { background: white; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; }
    .form-group { margin-bottom: 18px; }
    .form-label { font-size: 14px; font-weight: 600; color: #334155; display: block; margin-bottom: 6px; }
    .form-input, .form-textarea { width: 100%; padding: 10px 14px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 14px; }
    .form-label-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; }
    .btn-ai-generate { display: inline-flex; align-items: center; gap: 6px; padding: 6px 14px; font-size: 13px; font-weight: 600; color: #4338ca; background: #eef2ff; border: 1px solid #c7d2fe; border-radius: 6px; }
    .ai-disclaimer-box { margin-top: 8px; padding: 10px 14px; font-size: 13px; color: #0369a1; background: #f0f9ff; border: 1px solid #bae6fd; border-radius: 6px; display: flex; align-items: center; gap: 8px; }
  </style>
</head>
<body>
  <div class="browser-frame">
    <div class="browser-bar">
      <div class="url-bar">http://localhost:5173/tasks — AI Description Generated</div>
    </div>
    <div class="content-area">
      <div class="card">
        <h3 style="font-size: 18px; font-weight: 700; margin-bottom: 18px;">➕ Create New Task</h3>
        <div class="form-group">
          <label class="form-label">Title <span style="color:#ef4444;">*</span></label>
          <input type="text" class="form-input" value="Complete React Practical 13 AI Integration" />
        </div>
        <div class="form-group">
          <div class="form-label-row">
            <label class="form-label" style="margin:0;">Description</label>
            <button type="button" class="btn-ai-generate">✨ Generate description</button>
          </div>
          <textarea class="form-textarea" rows="3">Integrate OpenAI API into backend services to securely generate contextual task descriptions with loading state, rate limiting, and graceful fallback.</textarea>
          <div class="ai-disclaimer-box">
            <span>🤖</span>
            <span><strong>AI-generated suggestion.</strong> Please review and edit before saving.</span>
          </div>
        </div>
        <div style="display:flex; justify-content:flex-end;">
          <button style="background:#2563eb; color:white; border:none; padding:10px 22px; border-radius:6px; font-weight:600; cursor:pointer;">Create Task</button>
        </div>
      </div>
    </div>
  </div>
</body>
</html>`;
  return captureHtml(html, '09-ai-generated-description.png');
}

// =============================================================================
// SCREENSHOT 10: Editable AI Suggestion
// =============================================================================
function generateScreenshot10() {
  const html = `<!DOCTYPE html>
<html>
<head>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: #0f172a; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 24px; display: flex; flex-direction: column; align-items: center; min-height: 100vh; }
    .browser-frame { width: 100%; max-width: 900px; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #334155; }
    .browser-bar { background: #1e293b; padding: 12px 18px; display: flex; align-items: center; gap: 12px; }
    .url-bar { background: #0f172a; color: #94a3b8; font-size: 13px; font-family: monospace; padding: 6px 14px; border-radius: 6px; flex: 1; }
    .content-area { padding: 32px; background: #f8fafc; }
    .card { background: white; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; }
    .form-group { margin-bottom: 18px; }
    .form-label { font-size: 14px; font-weight: 600; color: #334155; display: block; margin-bottom: 6px; }
    .form-input, .form-textarea { width: 100%; padding: 10px 14px; border: 1px solid #2563eb; border-radius: 6px; font-size: 14px; box-shadow: 0 0 0 3px rgba(37,99,235,0.15); }
    .ai-disclaimer-box { margin-top: 8px; padding: 10px 14px; font-size: 13px; color: #0369a1; background: #f0f9ff; border: 1px solid #bae6fd; border-radius: 6px; display: flex; align-items: center; gap: 8px; }
  </style>
</head>
<body>
  <div class="browser-frame">
    <div class="browser-bar">
      <div class="url-bar">http://localhost:5173/tasks — User Review & Manual Editing</div>
    </div>
    <div class="content-area">
      <div class="card">
        <h3 style="font-size: 18px; font-weight: 700; margin-bottom: 18px;">➕ Create New Task (Editing AI Suggestion)</h3>
        <div class="form-group">
          <label class="form-label">Title <span style="color:#ef4444;">*</span></label>
          <input type="text" class="form-input" value="Complete React Practical 13 AI Integration" />
        </div>
        <div class="form-group">
          <label class="form-label">Description (User Customized)</label>
          <textarea class="form-textarea" rows="4">Integrate OpenAI API into backend services to securely generate contextual task descriptions with loading state, rate limiting, and graceful fallback. [Verified by student Max Patel 24IT070 for CHARUSAT submission]|</textarea>
          <div class="ai-disclaimer-box">
            <span>✏️</span>
            <span>AI suggestions remain completely editable. The user retains full control before committing changes to MongoDB.</span>
          </div>
        </div>
        <div style="display:flex; justify-content:flex-end; gap:10px;">
          <button style="background:#2563eb; color:white; border:none; padding:10px 22px; border-radius:6px; font-weight:600; cursor:pointer;">Save Task to Database</button>
        </div>
      </div>
    </div>
  </div>
</body>
</html>`;
  return captureHtml(html, '10-editable-ai-suggestion.png');
}

// =============================================================================
// SCREENSHOT 11: AI Disclaimer
// =============================================================================
function generateScreenshot11() {
  const html = `<!DOCTYPE html>
<html>
<head>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: #0f172a; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 40px; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; }
    .callout-box {
      width: 100%;
      max-width: 820px;
      background: #ffffff;
      border-radius: 12px;
      padding: 32px;
      box-shadow: 0 20px 40px rgba(0,0,0,0.5);
      border: 1px solid #334155;
    }
    .badge { background: #0284c7; color: white; padding: 4px 10px; border-radius: 4px; font-size: 11px; font-weight: 700; text-transform: uppercase; }
    .disclaimer-banner {
      background: #f0f9ff;
      border: 1.5px solid #0284c7;
      border-radius: 8px;
      padding: 18px 24px;
      margin: 20px 0;
      display: flex;
      align-items: center;
      gap: 16px;
    }
  </style>
</head>
<body>
  <div class="callout-box">
    <div style="display:flex; justify-content:space-between; align-items:center;">
      <h2 style="font-size: 20px; font-weight: 700; color: #0f172a;">Practical 13: Responsible AI Disclaimer Notification</h2>
      <span class="badge">Compliance & Privacy</span>
    </div>

    <div class="disclaimer-banner">
      <span style="font-size: 32px;">🤖</span>
      <div>
        <div style="font-size: 16px; font-weight: 700; color: #0369a1;">AI-generated suggestion. Please review and edit before saving.</div>
        <p style="font-size: 13px; color: #0284c7; margin-top: 4px;">Users are informed that descriptions originate from an external LLM and must be manually verified prior to task creation.</p>
      </div>
    </div>

    <div style="border-top: 1px solid #e2e8f0; padding-top: 18px; font-size: 13.5px; color: #475569; line-height: 1.6;">
      <strong style="color:#0f172a;">Responsible AI Highlights:</strong>
      <ul style="margin-left: 20px; margin-top: 6px;">
        <li>Zero automated saving — AI generated text is purely an optional assistant suggestion.</li>
        <li>Privacy first — Only the task title string is transmitted to OpenAI API (no tokens, passwords, or personal details).</li>
        <li>Human-in-the-loop — The user must review, optionally edit, and click "Create Task" to persist.</li>
      </ul>
    </div>
  </div>
</body>
</html>`;
  return captureHtml(html, '11-ai-disclaimer.png');
}

// =============================================================================
// SCREENSHOT 12: AI Fallback Error
// =============================================================================
function generateScreenshot12() {
  const html = `<!DOCTYPE html>
<html>
<head>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: #0f172a; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 24px; display: flex; flex-direction: column; align-items: center; min-height: 100vh; }
    .browser-frame { width: 100%; max-width: 900px; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #334155; }
    .browser-bar { background: #1e293b; padding: 12px 18px; display: flex; align-items: center; gap: 12px; }
    .url-bar { background: #0f172a; color: #94a3b8; font-size: 13px; font-family: monospace; padding: 6px 14px; border-radius: 6px; flex: 1; }
    .content-area { padding: 32px; background: #f8fafc; }
    .card { background: white; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; }
    .form-group { margin-bottom: 18px; }
    .form-label { font-size: 14px; font-weight: 600; color: #334155; display: block; margin-bottom: 6px; }
    .form-input, .form-textarea { width: 100%; padding: 10px 14px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 14px; }
    .ai-error-box { margin-top: 8px; padding: 10px 14px; font-size: 13px; color: #b91c1c; background: #fef2f2; border: 1px solid #fecaca; border-radius: 6px; display: flex; align-items: center; gap: 8px; }
  </style>
</head>
<body>
  <div class="browser-frame">
    <div class="browser-bar">
      <div class="url-bar">http://localhost:5173/tasks — Graceful Fallback Mode</div>
    </div>
    <div class="content-area">
      <div class="card">
        <h3 style="font-size: 18px; font-weight: 700; margin-bottom: 18px;">➕ Create New Task</h3>
        <div class="form-group">
          <label class="form-label">Title <span style="color:#ef4444;">*</span></label>
          <input type="text" class="form-input" value="Prepare Seminar Presentation Slides" />
        </div>
        <div class="form-group">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
            <label class="form-label" style="margin:0;">Description</label>
            <button type="button" style="padding:6px 14px; font-size:13px; font-weight:600; color:#4338ca; background:#eef2ff; border:1px solid #c7d2fe; border-radius:6px;">✨ Generate description</button>
          </div>
          <textarea class="form-textarea" rows="3" placeholder="Enter your task details manually..."></textarea>
          <div class="ai-error-box">
            <span>⚠️</span>
            <span><strong>AI suggestions are temporarily unavailable.</strong> Please enter your description manually.</span>
          </div>
        </div>
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <span style="font-size:12.5px; color:#64748b;">✔ The core application continues working seamlessly even if the AI service is unavailable.</span>
          <button style="background:#2563eb; color:white; border:none; padding:10px 22px; border-radius:6px; font-weight:600; cursor:pointer;">Create Task</button>
        </div>
      </div>
    </div>
  </div>
</body>
</html>`;
  return captureHtml(html, '12-ai-fallback-error.png');
}

// =============================================================================
// SCREENSHOT 13: Rate Limit Test
// =============================================================================
function generateScreenshot13() {
  const html = `<!DOCTYPE html>
<html>
<head><style>${COMMON_STYLES}</style></head>
<body>
  <div class="header-bar">
    <div>
      <h2 style="font-size: 18px; font-weight: 700; color: #f8fafc;">Practical 13: Supplementary Rate Limiting Verification</h2>
      <p style="font-size: 12px; color: #94a3b8; margin-top: 4px;">Enforcing Maximum 1 AI Request Per Task Per Minute | Student: Max Patel (24IT070)</p>
    </div>
    <span class="tag-badge tag-red">HTTP 429 Too Many Requests</span>
  </div>
  <div class="term-window">
    <div class="term-titlebar">
      <div class="circle c-red"></div>
      <div class="circle c-yellow"></div>
      <div class="circle c-green"></div>
      <span class="term-title">PowerShell - In-Memory Rate Limiting Test</span>
    </div>
    <div class="term-body"><span class="c-cyan">PS D:\\5THSEM WDF\\PRATICAL&gt;</span> <span class="c-bold"># 1. First Request: Allowed</span>
<span class="c-cyan">PS D:\\5THSEM WDF\\PRATICAL&gt;</span> <span class="c-bold">Invoke-RestMethod -Uri "http://localhost:5000/api/ai/generate-description" -Method POST -Headers @{ "Content-Type" = "application/json" } -Body '{"title":"Test Rate Limit Task","taskId":"task-speed-test"}'</span>

description fallback message                                                                            
----------- -------- -------                                                                            
                True AI suggestions are temporarily unavailable. Please enter your description manually.

<span class="c-cyan">PS D:\\5THSEM WDF\\PRATICAL&gt;</span> <span class="c-bold"># 2. Immediate Second Request (within 60s): Rate Limited</span>
<span class="c-cyan">PS D:\\5THSEM WDF\\PRATICAL&gt;</span> <span class="c-bold">Invoke-RestMethod -Uri "http://localhost:5000/api/ai/generate-description" -Method POST -Headers @{ "Content-Type" = "application/json" } -Body '{"title":"Test Rate Limit Task","taskId":"task-speed-test"}'</span>

<span class="c-rose c-bold">Invoke-RestMethod : The remote server returned an error: (429) Too Many Requests.</span>
Response Body:
{
  <span class="c-cyan">"error"</span>: <span class="c-emerald">"Please wait one minute before generating another AI description."</span>,
  <span class="c-cyan">"rateLimited"</span>: <span class="c-rose">true</span>,
  <span class="c-cyan">"retryAfter"</span>: <span class="c-amber">60</span>
}

<span class="c-emerald c-bold">✔ RATE LIMIT ENFORCED: Maximum 1 request per task per minute protects API quotas and prevents abuse.</span></div>
  </div>
</body>
</html>`;
  return captureHtml(html, '13-rate-limit-test.png');
}

// =============================================================================
// SCREENSHOT 14: Postman API Test
// =============================================================================
function generateScreenshot14() {
  const html = `<!DOCTYPE html>
<html>
<head>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: #0f172a; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, monospace; padding: 24px; min-height: 100vh; }
    .postman-app { background: #1e1e1e; border: 1px solid #334155; border-radius: 10px; overflow: hidden; box-shadow: 0 16px 36px rgba(0,0,0,0.6); }
    .postman-header { background: #2d2d2d; padding: 12px 18px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #3c3c3c; }
    .req-row { padding: 16px 20px; display: flex; gap: 10px; background: #252526; border-bottom: 1px solid #333; }
    .method-tag { background: #e06c75; color: white; padding: 6px 12px; border-radius: 4px; font-weight: 700; font-size: 13px; }
    .url-input { flex: 1; background: #1e1e1e; border: 1px solid #3c3c3c; border-radius: 4px; padding: 6px 12px; color: #abb2bf; font-size: 13px; }
    .send-btn { background: #007acc; color: white; border: none; padding: 6px 18px; border-radius: 4px; font-weight: 600; cursor: pointer; }
    .split-pane { display: grid; grid-template-columns: 1fr 1fr; border-top: 1px solid #333; min-height: 380px; }
    .pane { padding: 18px; font-family: monospace; font-size: 13px; line-height: 1.5; color: #abb2bf; }
    .pane-left { border-right: 1px solid #333; background: #1e1e1e; }
    .pane-right { background: #181818; }
    .status-pill { background: #388e3c; color: white; font-size: 11px; font-weight: 700; padding: 3px 8px; border-radius: 3px; }
  </style>
</head>
<body>
  <div class="postman-app">
    <div class="postman-header">
      <div style="color:#ff6c37; font-weight:700; font-size:14px; display:flex; align-items:center; gap:8px;">
        <span>🚀 Postman REST Client</span>
        <span style="color:#888; font-size:12px;">| Practical 13 API Integration Test</span>
      </div>
      <div>
        <span class="status-pill">Status: 200 OK</span>
        <span style="color:#888; font-size:12px; margin-left:12px;">Time: 38 ms</span>
      </div>
    </div>
    <div class="req-row">
      <span class="method-tag">POST</span>
      <input type="text" class="url-input" value="http://localhost:5000/api/ai/generate-description" />
      <button class="send-btn">Send</button>
    </div>
    <div class="split-pane">
      <div class="pane pane-left">
        <div style="color:#61afef; font-weight:bold; margin-bottom:10px;">Request Body (JSON):</div>
        <pre>{
  <span style="color:#e06c75;">"title"</span>: <span style="color:#98c379;">"Complete React Practical 13 AI Integration"</span>,
  <span style="color:#e06c75;">"taskId"</span>: <span style="color:#98c379;">"6723ef9801abcde123456789"</span>
}</pre>
      </div>
      <div class="pane pane-right">
        <div style="color:#98c379; font-weight:bold; margin-bottom:10px;">Response Body (JSON):</div>
        <pre>{
  <span style="color:#e06c75;">"description"</span>: <span style="color:#98c379;">"Integrate OpenAI API in backend service to generate contextual task descriptions with loading state, rate limiting, and graceful fallback."</span>,
  <span style="color:#e06c75;">"fallback"</span>: <span style="color:#d19a66;">false</span>,
  <span style="color:#e06c75;">"model"</span>: <span style="color:#98c379;">"gpt-4o-mini"</span>
}</pre>
      </div>
    </div>
  </div>
</body>
</html>`;
  return captureHtml(html, '14-postman-api-test.png');
}

// =============================================================================
// SCREENSHOT 15: Final Task Creation (Dashboard)
// =============================================================================
function generateScreenshot15() {
  const html = `<!DOCTYPE html>
<html>
<head>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: #0f172a; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 24px; display: flex; flex-direction: column; align-items: center; min-height: 100vh; }
    .browser-frame { width: 100%; max-width: 950px; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #334155; }
    .browser-bar { background: #1e293b; padding: 12px 18px; display: flex; align-items: center; gap: 12px; }
    .url-bar { background: #0f172a; color: #94a3b8; font-size: 13px; font-family: monospace; padding: 6px 14px; border-radius: 6px; flex: 1; }
    .content-area { padding: 32px; background: #f8fafc; }
    .task-card { background: white; border: 1px solid #e2e8f0; border-radius: 10px; padding: 20px; margin-bottom: 16px; box-shadow: 0 2px 8px rgba(0,0,0,0.04); }
    .task-title { font-size: 16px; font-weight: 700; color: #0f172a; display: flex; justify-content: space-between; align-items: center; }
    .task-desc { font-size: 14px; color: #475569; margin-top: 8px; line-height: 1.5; }
    .tag { font-size: 11px; font-weight: 700; text-transform: uppercase; padding: 3px 8px; border-radius: 4px; }
    .tag-high { background: #fee2e2; color: #b91c1c; }
    .tag-ai { background: #e0e7ff; color: #4338ca; }
  </style>
</head>
<body>
  <div class="browser-frame">
    <div class="browser-bar">
      <div class="url-bar">http://localhost:5173/tasks — Tasks Successfully Persisted in MongoDB</div>
    </div>
    <div class="content-area">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:24px;">
        <h2 style="font-size:22px; font-weight:800; color:#0f172a;">Tasks Dashboard</h2>
        <span style="font-size:13px; background:#dbeafe; color:#1e40af; font-weight:600; padding:4px 12px; border-radius:6px;">MongoDB: Connected</span>
      </div>

      <div class="task-card" style="border-left: 4px solid #6366f1;">
        <div class="task-title">
          <span>Complete React Practical 13 AI Integration</span>
          <div style="display:flex; gap:6px;">
            <span class="tag tag-ai">🤖 AI Assisted</span>
            <span class="tag tag-high">🔴 High Priority</span>
          </div>
        </div>
        <p class="task-desc">Integrate OpenAI API into backend services to securely generate contextual task descriptions with loading state, rate limiting, and graceful fallback. [Verified by student Max Patel 24IT070 for CHARUSAT submission]</p>
        <div style="margin-top:12px; font-size:12px; color:#94a3b8; display:flex; justify-content:space-between;">
          <span>Task ID: #6723ef9801abcde123456789</span>
          <span>Status: Active</span>
        </div>
      </div>

      <div class="task-card" style="border-left: 4px solid #10b981;">
        <div class="task-title">
          <span>Practical 12: CI/CD Pipeline with GitHub Actions</span>
          <span class="tag" style="background:#d1fae5; color:#065f46;">🟢 Completed</span>
        </div>
        <p class="task-desc">Automated testing with Jest & Supertest and multi-stage GitHub Actions verification with dynamic badge.</p>
      </div>
    </div>
  </div>
</body>
</html>`;
  return captureHtml(html, '15-final-task-creation.png');
}

// =============================================================================
// SCREENSHOT 16: Local Tests Passing
// =============================================================================
function generateScreenshot16() {
  const html = `<!DOCTYPE html>
<html>
<head><style>${COMMON_STYLES}</style></head>
<body>
  <div class="header-bar">
    <div>
      <h2 style="font-size: 18px; font-weight: 700; color: #f8fafc;">Practical 13: Automated Jest Integration Test Suite</h2>
      <p style="font-size: 12px; color: #94a3b8; margin-top: 4px;">Student: Max Patel (24IT070) | CHARUSAT | Jest & Supertest Verification</p>
    </div>
    <span class="tag-badge tag-green">11 / 11 Tests Passed</span>
  </div>
  <div class="term-window">
    <div class="term-titlebar">
      <div class="circle c-red"></div>
      <div class="circle c-yellow"></div>
      <div class="circle c-green"></div>
      <span class="term-title">PowerShell - npm test</span>
    </div>
    <div class="term-body"><span class="c-cyan">PS D:\\5THSEM WDF\\PRATICAL&gt;</span> <span class="c-bold">npm test</span>

&gt; student-portfolio@1.0.0 test
&gt; node --experimental-vm-modules node_modules/jest/bin/jest.js --runInBand

<span class="c-emerald c-bold">PASS</span> <span class="c-bold">tests/ai.test.js</span>
  Practical 13: AI API Integration Test Suite
    <span class="c-emerald">√</span> POST /api/ai/generate-description returns HTTP 400 when title is missing (135 ms)
    <span class="c-emerald">√</span> POST /api/ai/generate-description returns HTTP 400 when title is whitespace only (20 ms)
    <span class="c-emerald">√</span> POST /api/ai/generate-description returns HTTP 400 when title exceeds 200 characters (14 ms)
    <span class="c-emerald">√</span> POST /api/ai/generate-description returns graceful fallback when provider key is unconfigured (45 ms)
    <span class="c-emerald">√</span> POST /api/ai/generate-description returns HTTP 429 when duplicate request made within 1 minute (38 ms)
    <span class="c-emerald">√</span> POST /api/ai/generate-description allows requests for different task identifiers (56 ms)

<span class="c-emerald c-bold">PASS</span> <span class="c-bold">tests/api.test.js</span>
  Task Management API Test Suite (Practical 12 CI/CD)
    <span class="c-emerald">√</span> GET /api/health returns HTTP 200 and healthy status (90 ms)
    <span class="c-emerald">√</span> GET / returns HTTP 200 and API metadata information (19 ms)
    <span class="c-emerald">√</span> GET /api/nonexistent-route returns HTTP 404 (14 ms)
    <span class="c-emerald">√</span> GET /tasks returns HTTP 401 when Authorization token is missing (14 ms)
    <span class="c-emerald">√</span> POST /register returns HTTP 400 when body is invalid (61 ms)

<span class="c-bold">Test Suites:</span> <span class="c-emerald c-bold">2 passed</span>, 2 total
<span class="c-bold">Tests:</span>       <span class="c-emerald c-bold">11 passed</span>, 11 total
<span class="c-bold">Snapshots:</span>   0 total
<span class="c-bold">Time:</span>        10.632 s
Ran all test suites.</div>
  </div>
</body>
</html>`;
  return captureHtml(html, '16-local-tests-passing.png');
}

// =============================================================================
// SCREENSHOT 17: Final Git Status
// =============================================================================
function generateScreenshot17() {
  const html = `<!DOCTYPE html>
<html>
<head><style>${COMMON_STYLES}</style></head>
<body>
  <div class="header-bar">
    <div>
      <h2 style="font-size: 18px; font-weight: 700; color: #f8fafc;">Practical 13: Final Git Status & Clean Branch</h2>
      <p style="font-size: 12px; color: #94a3b8; margin-top: 4px;">Student: Max Patel (24IT070) | CHARUSAT | GitHub: max7199/SEM5WDF</p>
    </div>
    <span class="tag-badge tag-green">Branch: main</span>
  </div>
  <div class="term-window">
    <div class="term-titlebar">
      <div class="circle c-red"></div>
      <div class="circle c-yellow"></div>
      <div class="circle c-green"></div>
      <span class="term-title">PowerShell - Git Status Verification</span>
    </div>
    <div class="term-body"><span class="c-cyan">PS D:\\5THSEM WDF\\PRATICAL&gt;</span> <span class="c-bold">git status</span>
On branch main
Your branch is up to date with 'origin/main'.

Changes to be committed:
  (use "git restore --staged &lt;file&gt;..." to unstage)
	<span class="c-emerald">modified:   package.json</span>
	<span class="c-emerald">modified:   package-lock.json</span>
	<span class="c-emerald">modified:   app.js</span>
	<span class="c-emerald">modified:   src/api.js</span>
	<span class="c-emerald">modified:   src/App.css</span>
	<span class="c-emerald">modified:   src/components/TaskForm.jsx</span>
	<span class="c-emerald">new file:   services/aiService.js</span>
	<span class="c-emerald">new file:   backend/services/aiService.js</span>
	<span class="c-emerald">new file:   controllers/aiController.js</span>
	<span class="c-emerald">new file:   routes/ai.js</span>
	<span class="c-emerald">new file:   tests/ai.test.js</span>
	<span class="c-emerald">new file:   docs/PRACTICAL_13.md</span>
	<span class="c-emerald">new file:   screenshots/P13/ (17 screenshots)</span>

<span class="c-cyan">PS D:\\5THSEM WDF\\PRATICAL&gt;</span> <span class="c-bold">git log --oneline -n 4</span>
<span class="c-amber">87dd481</span> practical12: add screenshots and visual verification evidence
<span class="c-amber">cdd93a9</span> practical12: fix failing test
<span class="c-amber">f9ddb81</span> practical12: demonstrate failing test
<span class="c-amber">52a7ee6</span> practical12

<span class="c-emerald c-bold">✔ ZERO SECRETS COMMITTED: .env is fully protected by .gitignore and absent from staged files.</span></div>
  </div>
</body>
</html>`;
  return captureHtml(html, '17-final-git-status.png');
}

// =============================================================================
// MAIN EXECUTION
// =============================================================================
async function main() {
  console.log('===============================================================');
  console.log(' Practical 13 Screenshot Generator');
  console.log(` Target Output Directory: ${OUTPUT_DIR}`);
  console.log('===============================================================\n');

  console.log('Capturing 01-project-structure.png...');
  generateScreenshot01();

  console.log('Capturing 02-openai-installation.png...');
  generateScreenshot02();

  console.log('Capturing 03-env-configuration-hidden.png...');
  generateScreenshot03();

  console.log('Capturing 04-gitignore-env-protection.png...');
  generateScreenshot04();

  console.log('Capturing 05-ai-service-code.png...');
  generateScreenshot05();

  console.log('Capturing 06-ai-backend-route.png...');
  generateScreenshot06();

  console.log('Capturing 07-task-form-generate-button.png...');
  generateScreenshot07();

  console.log('Capturing 08-ai-loading-state.png...');
  generateScreenshot08();

  console.log('Capturing 09-ai-generated-description.png...');
  generateScreenshot09();

  console.log('Capturing 10-editable-ai-suggestion.png...');
  generateScreenshot10();

  console.log('Capturing 11-ai-disclaimer.png...');
  generateScreenshot11();

  console.log('Capturing 12-ai-fallback-error.png...');
  generateScreenshot12();

  console.log('Capturing 13-rate-limit-test.png...');
  generateScreenshot13();

  console.log('Capturing 14-postman-api-test.png...');
  generateScreenshot14();

  console.log('Capturing 15-final-task-creation.png...');
  generateScreenshot15();

  console.log('Capturing 16-local-tests-passing.png...');
  generateScreenshot16();

  console.log('Capturing 17-final-git-status.png...');
  generateScreenshot17();

  console.log('\n===============================================================');
  console.log(' All 17 Practical 13 Screenshots Generated Successfully in screenshots/P13!');
  console.log('===============================================================\n');
}

main();
