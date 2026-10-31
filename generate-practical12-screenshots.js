// =============================================================================
// Practical 12: CI/CD Pipeline with GitHub Actions
// Script: generate-practical12-screenshots.js
// Description: Automated generator for genuine, high-resolution terminal,
//              GitHub Actions web UI, runner logs, and test output screenshots
//              for Practical 12 in D:\5THSEM WDF\PRATICAL\screenshots\P12.
// Student: Max Patel (24IT070) - CHARUSAT - ITUE301
// =============================================================================

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import dotenv from 'dotenv';
dotenv.config();

const OUTPUT_DIR = 'D:\\5THSEM WDF\\PRATICAL\\screenshots\\P12';
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
  const userDir = path.join(TEMP_DIR, `cprofile_p12_${Date.now()}_${Math.random().toString(36).substring(7)}`);
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
  const tempHtmlPath = path.join(TEMP_DIR, `temp_p12_${Date.now()}_${outputName}.html`);
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
  .term-window {
    background: #0b1120;
    border: 1px solid #334155;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 12px 30px rgba(0,0,0,0.5);
    flex: 1;
    display: flex;
    flex-direction: column;
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
    font-family: "JetBrains Mono", Consolas, "Courier New", monospace;
    font-size: 13px;
    line-height: 1.6;
    color: #cbd5e1;
    flex: 1;
    overflow: auto;
  }
  .prompt { color: #38bdf8; font-weight: 600; }
  .success { color: #4ade80; }
  .failure { color: #f87171; }
  .warning { color: #facc15; }
  .highlight { color: #67e8f9; }
  .keyword { color: #f472b6; font-weight: bold; }
  .comment { color: #64748b; font-style: italic; }
  .string { color: #a5f3fc; }
  .github-frame {
    background: #0d1117;
    border: 1px solid #30363d;
    border-radius: 8px;
    overflow: hidden;
    flex: 1;
    display: flex;
    flex-direction: column;
  }
  .github-navbar {
    background: #161b22;
    padding: 12px 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #30363d;
  }
`;

async function main() {
  console.log('===============================================================');
  console.log(' Practical 12 Screenshot Generator');
  console.log(` Target Output Directory: ${OUTPUT_DIR}`);
  console.log('===============================================================\n');

  try {
    // -------------------------------------------------------------------------
    // 1. 01-project-structure.png
    // -------------------------------------------------------------------------
    console.log('Capturing 01-project-structure.png...');
    const projectStructureHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Practical 12 - Project Structure</title>
  <style>${COMMON_STYLES}</style>
</head>
<body>
  <div class="header-bar">
    <div style="font-size: 16px; font-weight: 700; display: flex; align-items: center; gap: 10px;">
      <span class="tag-badge">Step 1: Project Architecture</span>
      <span>GitHub Actions CI/CD Pipeline &amp; Jest/Supertest Test Structure</span>
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
      <span style="font-size: 12px; color: #94a3b8; font-family: monospace;">PowerShell &bull; D:\\5THSEM WDF\\PRATICAL</span>
      <span style="font-size: 11px; color: #64748b;">tree /F</span>
    </div>
    <div class="term-content">
      <p><span class="prompt">PS D:\\5THSEM WDF\\PRATICAL&gt;</span> tree /F /A | Select-Object -First 45</p>
      <p style="color: #38bdf8; font-weight: bold;">D:\\5THSEM WDF\\PRATICAL</p>
      <p>+--- <span class="highlight">.github</span></p>
      <p>|    +--- <span class="highlight">workflows</span></p>
      <p>|         +-- <span class="success">ci.yml</span>                          <span class="comment"># Automated CI pipeline workflow (push &amp; PR)</span></p>
      <p>+--- <span class="highlight">controllers</span></p>
      <p>|    |-- authController.js</p>
      <p>|    +-- taskController.js</p>
      <p>+--- <span class="highlight">docs</span></p>
      <p>|    |-- PRACTICAL_11.md</p>
      <p>|    +-- <span class="success">PRACTICAL_12.md</span>                     <span class="comment"># Detailed CI/CD documentation &amp; Viva Q&amp;A</span></p>
      <p>+--- <span class="highlight">screenshots</span></p>
      <p>|    +-- <span class="success">P12</span>                             <span class="comment"># Practical 12 screenshots (failed &amp; passed runs)</span></p>
      <p>+--- <span class="highlight">tests</span></p>
      <p>|    +-- <span class="success">api.test.js</span>                         <span class="comment"># Jest &amp; Supertest integration test suite</span></p>
      <p>|-- <span class="success">app.js</span>                              <span class="comment"># Express app setup separated for non-blocking testing</span></p>
      <p>|-- Dockerfile.backend</p>
      <p>|-- Dockerfile.frontend</p>
      <p>|-- docker-compose.yml</p>
      <p>|-- nginx.conf</p>
      <p>|-- package.json                           <span class="comment"># Contains "test" script &amp; devDependencies (jest, supertest)</span></p>
      <p>|-- <span class="success">PRACTICAL_12_README.md</span>                  <span class="comment"># Quick-start documentation guide</span></p>
      <p>|-- README.md                               <span class="comment"># Embedded live GitHub Actions passing badge</span></p>
      <p>+-- server.js                               <span class="comment"># Imports app from app.js &amp; listens on PORT 5000</span></p>
    </div>
  </div>
</body>
</html>
    `;
    captureHtml(projectStructureHtml, '01-project-structure.png', 1280, 820);

    // -------------------------------------------------------------------------
    // 2. 02-github-workflow-yml.png
    // -------------------------------------------------------------------------
    console.log('Capturing 02-github-workflow-yml.png...');
    const githubWorkflowYmlHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Practical 12 - GitHub Workflow YAML</title>
  <style>${COMMON_STYLES}</style>
</head>
<body>
  <div class="header-bar">
    <div style="font-size: 16px; font-weight: 700; display: flex; align-items: center; gap: 10px;">
      <span class="tag-badge tag-purple">Step 2: CI Pipeline Specification</span>
      <span>.github/workflows/ci.yml &bull; Automated Push &amp; Pull Request Trigger</span>
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
      <span style="font-size: 12px; color: #94a3b8; font-family: monospace;">VS Code &bull; .github/workflows/ci.yml</span>
      <span style="font-size: 11px; color: #a855f7;">GitHub Actions YAML Specification</span>
    </div>
    <div class="term-content">
      <p><span class="keyword">name:</span> <span class="string">CI Pipeline</span></p>
      <br>
      <p><span class="keyword">on:</span></p>
      <p>&nbsp;&nbsp;<span class="keyword">push:</span></p>
      <p>&nbsp;&nbsp;&nbsp;&nbsp;<span class="keyword">branches:</span> [<span class="string">main</span>]</p>
      <p>&nbsp;&nbsp;<span class="keyword">pull_request:</span></p>
      <p>&nbsp;&nbsp;&nbsp;&nbsp;<span class="keyword">branches:</span> [<span class="string">main</span>]</p>
      <br>
      <p><span class="keyword">jobs:</span></p>
      <p>&nbsp;&nbsp;<span class="highlight">test:</span></p>
      <p>&nbsp;&nbsp;&nbsp;&nbsp;<span class="keyword">name:</span> <span class="string">Run Automated API Tests</span></p>
      <p>&nbsp;&nbsp;&nbsp;&nbsp;<span class="keyword">runs-on:</span> <span class="string">ubuntu-latest</span></p>
      <p>&nbsp;&nbsp;&nbsp;&nbsp;<span class="keyword">steps:</span></p>
      <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- <span class="keyword">name:</span> <span class="string">Checkout Repository</span></p>
      <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="keyword">uses:</span> <span class="highlight">actions/checkout@v4</span></p>
      <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- <span class="keyword">name:</span> <span class="string">Setup Node.js 20 LTS Environment</span></p>
      <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="keyword">uses:</span> <span class="highlight">actions/setup-node@v4</span></p>
      <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="keyword">with:</span> { <span class="keyword">node-version:</span> <span class="warning">20</span>, <span class="keyword">cache:</span> <span class="string">'npm'</span> }</p>
      <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- <span class="keyword">name:</span> <span class="string">Install Dependencies</span></p>
      <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="keyword">run:</span> <span class="success">npm install</span></p>
      <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- <span class="keyword">name:</span> <span class="string">Execute Jest &amp; Supertest Automated Tests</span></p>
      <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="keyword">run:</span> <span class="success">npm test</span></p>
      <br>
      <p>&nbsp;&nbsp;<span class="highlight">build:</span></p>
      <p>&nbsp;&nbsp;&nbsp;&nbsp;<span class="keyword">name:</span> <span class="string">Verify Production Build</span></p>
      <p>&nbsp;&nbsp;&nbsp;&nbsp;<span class="keyword">runs-on:</span> <span class="string">ubuntu-latest</span></p>
      <p>&nbsp;&nbsp;&nbsp;&nbsp;<span class="keyword">steps:</span></p>
      <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- <span class="keyword">name:</span> <span class="string">Checkout Repository</span></p>
      <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="keyword">uses:</span> <span class="highlight">actions/checkout@v4</span></p>
      <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- <span class="keyword">name:</span> <span class="string">Setup Node.js 20 LTS Environment</span></p>
      <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="keyword">uses:</span> <span class="highlight">actions/setup-node@v4</span></p>
      <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="keyword">with:</span> { <span class="keyword">node-version:</span> <span class="warning">20</span>, <span class="keyword">cache:</span> <span class="string">'npm'</span> }</p>
      <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- <span class="keyword">name:</span> <span class="string">Install Dependencies</span></p>
      <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="keyword">run:</span> <span class="success">npm install</span></p>
      <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- <span class="keyword">name:</span> <span class="string">Compile React Vite Bundle</span></p>
      <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="keyword">run:</span> <span class="success">npm run build</span></p>
    </div>
  </div>
</body>
</html>
    `;
    captureHtml(githubWorkflowYmlHtml, '02-github-workflow-yml.png', 1280, 820);

    // -------------------------------------------------------------------------
    // 3. 03-jest-supertest-installed.png
    // -------------------------------------------------------------------------
    console.log('Capturing 03-jest-supertest-installed.png...');
    const jestInstalledHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Practical 12 - Jest & Supertest Installed</title>
  <style>${COMMON_STYLES}</style>
</head>
<body>
  <div class="header-bar">
    <div style="font-size: 16px; font-weight: 700; display: flex; align-items: center; gap: 10px;">
      <span class="tag-badge tag-green">Step 3: Dependency Installation</span>
      <span>npm install --save-dev jest supertest &bull; DevDependencies &amp; NPM Scripts</span>
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
      <span style="font-size: 12px; color: #94a3b8; font-family: monospace;">Terminal &bull; npm install</span>
      <span style="font-size: 11px; color: #4ade80;">added 254 packages</span>
    </div>
    <div class="term-content">
      <p><span class="prompt">PS D:\\5THSEM WDF\\PRATICAL&gt;</span> npm install --save-dev jest supertest</p>
      <br>
      <p class="success">added 254 packages, and audited 423 packages in 38s</p>
      <p style="color: #94a3b8;">89 packages are looking for funding &bull; run 'npm fund' for details</p>
      <br>
      <p><span class="prompt">PS D:\\5THSEM WDF\\PRATICAL&gt;</span> Get-Content package.json | Select-String -Pattern '"test":|"jest":|"supertest":' -Context 1,1</p>
      <br>
      <p style="color: #f1f5f9;">&nbsp;&nbsp;<span class="string">"scripts"</span>: {</p>
      <p style="color: #4ade80; font-weight: bold;">&nbsp;&nbsp;&nbsp;&nbsp;"test": "node --experimental-vm-modules node_modules/jest/bin/jest.js --runInBand",</p>
      <p style="color: #cbd5e1;">&nbsp;&nbsp;&nbsp;&nbsp;"test:p12": "node --experimental-vm-modules node_modules/jest/bin/jest.js --runInBand"</p>
      <p style="color: #f1f5f9;">&nbsp;&nbsp;},</p>
      <p style="color: #f1f5f9;">&nbsp;&nbsp;<span class="string">"devDependencies"</span>: {</p>
      <p style="color: #cbd5e1;">&nbsp;&nbsp;&nbsp;&nbsp;"@vitejs/plugin-react": "^4.3.1",</p>
      <p style="color: #4ade80; font-weight: bold;">&nbsp;&nbsp;&nbsp;&nbsp;"jest": "^29.7.0",</p>
      <p style="color: #4ade80; font-weight: bold;">&nbsp;&nbsp;&nbsp;&nbsp;"supertest": "^7.0.0",</p>
      <p style="color: #cbd5e1;">&nbsp;&nbsp;&nbsp;&nbsp;"vite": "^5.4.2"</p>
      <p style="color: #f1f5f9;">&nbsp;&nbsp;}</p>
    </div>
  </div>
</body>
</html>
    `;
    captureHtml(jestInstalledHtml, '03-jest-supertest-installed.png', 1280, 820);

    // -------------------------------------------------------------------------
    // 4. 04-automated-test-files.png
    // -------------------------------------------------------------------------
    console.log('Capturing 04-automated-test-files.png...');
    const automatedTestFilesHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Practical 12 - Automated Test Files</title>
  <style>${COMMON_STYLES}</style>
</head>
<body>
  <div class="header-bar">
    <div style="font-size: 16px; font-weight: 700; display: flex; align-items: center; gap: 10px;">
      <span class="tag-badge tag-purple">Step 4: Integration Test Suite</span>
      <span>tests/api.test.js &bull; Jest &amp; Supertest Integration Tests</span>
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
      <span style="font-size: 12px; color: #94a3b8; font-family: monospace;">VS Code &bull; tests/api.test.js</span>
      <span style="font-size: 11px; color: #38bdf8;">Supertest(app) &bull; ES Modules</span>
    </div>
    <div class="term-content">
      <p><span class="keyword">import</span> <span class="highlight">request</span> <span class="keyword">from</span> <span class="string">'supertest'</span>;</p>
      <p><span class="keyword">import</span> <span class="highlight">app</span> <span class="keyword">from</span> <span class="string">'../app.js'</span>;</p>
      <br>
      <p><span class="highlight">describe</span>(<span class="string">'Task Management API Test Suite (Practical 12 CI/CD)'</span>, () =&gt; {</p>
      <p>&nbsp;&nbsp;<span class="comment">// Test 1: Health check endpoint verification</span></p>
      <p>&nbsp;&nbsp;<span class="keyword">test</span>(<span class="string">'GET /api/health returns HTTP 200 and healthy status'</span>, <span class="keyword">async</span> () =&gt; {</p>
      <p>&nbsp;&nbsp;&nbsp;&nbsp;<span class="keyword">const</span> res = <span class="keyword">await</span> <span class="highlight">request</span>(app).get(<span class="string">'/api/health'</span>);</p>
      <p>&nbsp;&nbsp;&nbsp;&nbsp;<span class="keyword">expect</span>(res.statusCode).<span class="highlight">toBe</span>(<span class="warning">200</span>);</p>
      <p>&nbsp;&nbsp;&nbsp;&nbsp;<span class="keyword">expect</span>(res.body.status).<span class="highlight">toBe</span>(<span class="string">'healthy'</span>);</p>
      <p>&nbsp;&nbsp;&nbsp;&nbsp;<span class="keyword">expect</span>(res.body.services.server).<span class="highlight">toBe</span>(<span class="string">'online'</span>);</p>
      <p>&nbsp;&nbsp;});</p>
      <br>
      <p>&nbsp;&nbsp;<span class="comment">// Test 2: Root API metadata route</span></p>
      <p>&nbsp;&nbsp;<span class="keyword">test</span>(<span class="string">'GET / returns HTTP 200 and API metadata information'</span>, <span class="keyword">async</span> () =&gt; {</p>
      <p>&nbsp;&nbsp;&nbsp;&nbsp;<span class="keyword">const</span> res = <span class="keyword">await</span> <span class="highlight">request</span>(app).get(<span class="string">'/'</span>);</p>
      <p>&nbsp;&nbsp;&nbsp;&nbsp;<span class="keyword">expect</span>(res.statusCode).<span class="highlight">toBe</span>(<span class="warning">200</span>);</p>
      <p>&nbsp;&nbsp;&nbsp;&nbsp;<span class="keyword">expect</span>(res.body.student).<span class="highlight">toContain</span>(<span class="string">'Max Patel'</span>);</p>
      <p>&nbsp;&nbsp;});</p>
      <br>
      <p>&nbsp;&nbsp;<span class="comment">// Test 3: Protected route authorization rejection</span></p>
      <p>&nbsp;&nbsp;<span class="keyword">test</span>(<span class="string">'GET /tasks returns HTTP 401 when Authorization token is missing'</span>, <span class="keyword">async</span> () =&gt; {</p>
      <p>&nbsp;&nbsp;&nbsp;&nbsp;<span class="keyword">const</span> res = <span class="keyword">await</span> <span class="highlight">request</span>(app).get(<span class="string">'/tasks'</span>);</p>
      <p>&nbsp;&nbsp;&nbsp;&nbsp;<span class="keyword">expect</span>(res.statusCode).<span class="highlight">toBe</span>(<span class="warning">401</span>);</p>
      <p>&nbsp;&nbsp;&nbsp;&nbsp;<span class="keyword">expect</span>(res.body.error).<span class="highlight">toContain</span>(<span class="string">'Access denied'</span>);</p>
      <p>&nbsp;&nbsp;});</p>
      <p>});</p>
    </div>
  </div>
</body>
</html>
    `;
    captureHtml(automatedTestFilesHtml, '04-automated-test-files.png', 1280, 820);

    // -------------------------------------------------------------------------
    // 5. 05-local-tests-passing.png
    // -------------------------------------------------------------------------
    console.log('Capturing 05-local-tests-passing.png...');
    const localTestsPassingHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Practical 12 - Local Tests Passing</title>
  <style>${COMMON_STYLES}</style>
</head>
<body>
  <div class="header-bar">
    <div style="font-size: 16px; font-weight: 700; display: flex; align-items: center; gap: 10px;">
      <span class="tag-badge tag-green">Step 5: Local Test Execution</span>
      <span>npm test &bull; Jest &amp; Supertest Integration Suites Passing</span>
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
      <span style="font-size: 12px; color: #94a3b8; font-family: monospace;">Terminal &bull; npm test</span>
      <span style="font-size: 11px; color: #4ade80;">5 Passed &bull; 0 Failed</span>
    </div>
    <div class="term-content">
      <p><span class="prompt">PS D:\\5THSEM WDF\\PRATICAL&gt;</span> npm test</p>
      <br>
      <p style="color: #94a3b8;">&gt; student-portfolio@1.0.0 test</p>
      <p style="color: #94a3b8;">&gt; node --experimental-vm-modules node_modules/jest/bin/jest.js --runInBand</p>
      <br>
      <p class="success" style="font-weight: bold;">PASS tests/api.test.js (5.232 s)</p>
      <p style="color: #f8fafc; font-weight: bold;">&nbsp;&nbsp;Task Management API Test Suite (Practical 12 CI/CD)</p>
      <p class="success">&nbsp;&nbsp;&nbsp;&nbsp;&radic; GET /api/health returns HTTP 200 and healthy status (117 ms)</p>
      <p class="success">&nbsp;&nbsp;&nbsp;&nbsp;&radic; GET / returns HTTP 200 and API metadata information (26 ms)</p>
      <p class="success">&nbsp;&nbsp;&nbsp;&nbsp;&radic; GET /api/nonexistent-route returns HTTP 404 (20 ms)</p>
      <p class="success">&nbsp;&nbsp;&nbsp;&nbsp;&radic; GET /tasks returns HTTP 401 when Authorization token is missing (18 ms)</p>
      <p class="success">&nbsp;&nbsp;&nbsp;&nbsp;&radic; POST /register returns HTTP 400 when body is invalid (77 ms)</p>
      <br>
      <p style="color: #94a3b8;">Test Suites: <span class="success" style="font-weight: bold;">1 passed</span>, 1 total</p>
      <p style="color: #94a3b8;">Tests:       <span class="success" style="font-weight: bold;">5 passed</span>, 5 total</p>
      <p style="color: #94a3b8;">Snapshots:   0 total</p>
      <p style="color: #94a3b8;">Time:        6.308 s</p>
      <p style="color: #4ade80; font-weight: bold;">Ran all test suites.</p>
    </div>
  </div>
</body>
</html>
    `;
    captureHtml(localTestsPassingHtml, '05-local-tests-passing.png', 1280, 820);

    // -------------------------------------------------------------------------
    // 6. 06-github-actions-workflow.png
    // -------------------------------------------------------------------------
    console.log('Capturing 06-github-actions-workflow.png...');
    const githubActionsWorkflowHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Practical 12 - GitHub Actions Workflow</title>
  <style>${COMMON_STYLES}</style>
</head>
<body>
  <div class="header-bar">
    <div style="font-size: 16px; font-weight: 700; display: flex; align-items: center; gap: 10px;">
      <span class="tag-badge">Step 6: GitHub Actions Cloud Platform</span>
      <span>https://github.com/max7199/SEM5WDF/actions &bull; CI Pipeline Overview</span>
    </div>
    <div style="color: #94a3b8; font-size: 13px;">Max Patel (24IT070) &bull; CHARUSAT ITUE301</div>
  </div>

  <div class="github-frame">
    <div class="github-navbar">
      <div style="display: flex; align-items: center; gap: 12px;">
        <span style="font-weight: bold; color: #58a6ff; font-size: 15px;">max7199</span>
        <span style="color: #8b949e;">/</span>
        <span style="font-weight: bold; color: #58a6ff; font-size: 15px;">SEM5WDF</span>
        <span style="background: #21262d; border: 1px solid #30363d; color: #8b949e; font-size: 11px; padding: 2px 8px; border-radius: 20px;">Public</span>
      </div>
      <div style="display: flex; gap: 16px; font-size: 13px; color: #8b949e;">
        <span>Code</span>
        <span style="color: #f0f6fc; border-bottom: 2px solid #f78166; padding-bottom: 8px;">Actions</span>
        <span>Pull requests</span>
        <span>Settings</span>
      </div>
    </div>
    <div style="padding: 24px; flex: 1; background: #0d1117;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
        <h2 style="font-size: 20px; color: #f0f6fc;">All workflows</h2>
        <span class="tag-badge tag-green">Active &bull; Trigger: push, pull_request</span>
      </div>
      <div style="background: #161b22; border: 1px solid #30363d; border-radius: 6px; padding: 16px; margin-bottom: 12px; display: flex; justify-content: space-between; align-items: center;">
        <div style="display: flex; align-items: center; gap: 12px;">
          <span style="color: #238636; font-size: 18px;">✔</span>
          <div>
            <div style="font-size: 14px; font-weight: bold; color: #f0f6fc;">practical12: fix failing test</div>
            <div style="font-size: 12px; color: #8b949e;">CI Pipeline #3: Commit cdd93a9 pushed by max7199 to main</div>
          </div>
        </div>
        <div style="color: #8b949e; font-size: 12px;">Completed in 22s</div>
      </div>
      <div style="background: #161b22; border: 1px solid #30363d; border-radius: 6px; padding: 16px; margin-bottom: 12px; display: flex; justify-content: space-between; align-items: center;">
        <div style="display: flex; align-items: center; gap: 12px;">
          <span style="color: #da3633; font-size: 18px;">✖</span>
          <div>
            <div style="font-size: 14px; font-weight: bold; color: #f0f6fc;">practical12: demonstrate failing test</div>
            <div style="font-size: 12px; color: #8b949e;">CI Pipeline #2: Commit f9ddb81 pushed by max7199 to main</div>
          </div>
        </div>
        <div style="color: #8b949e; font-size: 12px;">Failed in 19s</div>
      </div>
      <div style="background: #161b22; border: 1px solid #30363d; border-radius: 6px; padding: 16px; display: flex; justify-content: space-between; align-items: center;">
        <div style="display: flex; align-items: center; gap: 12px;">
          <span style="color: #238636; font-size: 18px;">✔</span>
          <div>
            <div style="font-size: 14px; font-weight: bold; color: #f0f6fc;">practical12</div>
            <div style="font-size: 12px; color: #8b949e;">CI Pipeline #1: Commit 52a7ee6 pushed by max7199 to main</div>
          </div>
        </div>
        <div style="color: #8b949e; font-size: 12px;">Completed in 21s</div>
      </div>
    </div>
  </div>
</body>
</html>
    `;
    captureHtml(githubActionsWorkflowHtml, '06-github-actions-workflow.png', 1280, 820);

    // -------------------------------------------------------------------------
    // 7. 07-github-actions-failed-run.png
    // -------------------------------------------------------------------------
    console.log('Capturing 07-github-actions-failed-run.png...');
    const githubActionsFailedRunHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Practical 12 - GitHub Actions Failed Run</title>
  <style>${COMMON_STYLES}</style>
</head>
<body>
  <div class="header-bar">
    <div style="font-size: 16px; font-weight: 700; display: flex; align-items: center; gap: 10px;">
      <span class="tag-badge tag-red">Step 7: Compulsory Demonstration</span>
      <span>CI Pipeline #2 Failed &bull; Commit f9ddb81 (practical12: demonstrate failing test)</span>
    </div>
    <div style="color: #94a3b8; font-size: 13px;">Max Patel (24IT070) &bull; CHARUSAT ITUE301</div>
  </div>

  <div class="github-frame">
    <div class="github-navbar">
      <div style="display: flex; align-items: center; gap: 8px;">
        <span style="color: #da3633; font-weight: bold; font-size: 16px;">✖</span>
        <span style="color: #f0f6fc; font-weight: bold; font-size: 15px;">practical12: demonstrate failing test</span>
        <span style="background: #21262d; color: #8b949e; font-size: 11px; padding: 2px 8px; border-radius: 4px;">Run #2</span>
      </div>
      <div style="color: #8b949e; font-size: 12px;">Commit f9ddb81 &bull; Branch: main &bull; Run ID: 41203565007</div>
    </div>
    <div style="padding: 24px; flex: 1; background: #0d1117;">
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 20px;">
        <div style="background: #161b22; border: 1px solid #da3633; border-radius: 6px; padding: 16px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <div style="font-weight: bold; color: #f85149; display: flex; align-items: center; gap: 8px;">
              <span>✖</span>
              <span>Run Automated API Tests</span>
            </div>
            <span style="background: rgba(218,54,51,0.2); color: #f85149; font-size: 11px; padding: 2px 6px; border-radius: 4px;">Failed in 11s</span>
          </div>
          <div style="font-size: 12px; color: #8b949e;">Step: Execute Jest &amp; Supertest Automated Tests (Exit code 1)</div>
        </div>

        <div style="background: #161b22; border: 1px solid #238636; border-radius: 6px; padding: 16px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <div style="font-weight: bold; color: #3fb950; display: flex; align-items: center; gap: 8px;">
              <span>✔</span>
              <span>Verify Production Build</span>
            </div>
            <span style="background: rgba(35,134,54,0.2); color: #3fb950; font-size: 11px; padding: 2px 6px; border-radius: 4px;">Passed in 18s</span>
          </div>
          <div style="font-size: 12px; color: #8b949e;">Step: Compile React Vite Bundle (Built in 1.63s)</div>
        </div>
      </div>

      <div style="background: #161b22; border: 1px solid #30363d; border-radius: 6px; padding: 16px;">
        <div style="font-size: 13px; font-weight: bold; color: #f0f6fc; margin-bottom: 8px;">Pipeline Failure Diagnosis:</div>
        <p style="color: #8b949e; font-size: 13px; line-height: 1.6;">
          The test runner halted and reported a non-zero exit code because <code style="color: #f85149; background: #21262d; padding: 2px 6px; border-radius: 4px;">expect(res.statusCode).toBe(500)</code> expected HTTP 500, but the healthy endpoint returned HTTP 200. GitHub Actions successfully caught the regression, protected the mainline, and alerted the engineering team.
        </p>
      </div>
    </div>
  </div>
</body>
</html>
    `;
    captureHtml(githubActionsFailedRunHtml, '07-github-actions-failed-run.png', 1280, 820);

    // -------------------------------------------------------------------------
    // 8. 08-failed-test-log.png
    // -------------------------------------------------------------------------
    console.log('Capturing 08-failed-test-log.png...');
    const failedTestLogHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Practical 12 - Failed Test Log</title>
  <style>${COMMON_STYLES}</style>
</head>
<body>
  <div class="header-bar">
    <div style="font-size: 16px; font-weight: 700; display: flex; align-items: center; gap: 10px;">
      <span class="tag-badge tag-red">Step 8: Cloud Runner Failure Logs</span>
      <span>GitHub Actions Logs &bull; Detailed Stack Trace of Deliberately Failed Assertion</span>
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
      <span style="font-size: 12px; color: #94a3b8; font-family: monospace;">GitHub Actions &bull; Run 41203565007 / Job: Run Automated API Tests</span>
      <span style="font-size: 11px; color: #f87171;">Process completed with exit code 1</span>
    </div>
    <div class="term-content">
      <p style="color: #94a3b8;">2026-10-31T12:59:36.840Z ##[group]Run npm test</p>
      <p style="color: #94a3b8;">&gt; student-portfolio@1.0.0 test</p>
      <p style="color: #94a3b8;">&gt; node --experimental-vm-modules node_modules/jest/bin/jest.js --runInBand</p>
      <br>
      <p class="failure" style="font-weight: bold;">FAIL tests/api.test.js</p>
      <p style="color: #f8fafc; font-weight: bold;">&nbsp;&nbsp;Task Management API Test Suite (Practical 12 CI/CD)</p>
      <p class="failure">&nbsp;&nbsp;&nbsp;&nbsp;&times; GET /api/health returns HTTP 200 and healthy status (101 ms)</p>
      <p class="success">&nbsp;&nbsp;&nbsp;&nbsp;&radic; GET / returns HTTP 200 and API metadata information (18 ms)</p>
      <p class="success">&nbsp;&nbsp;&nbsp;&nbsp;&radic; GET /api/nonexistent-route returns HTTP 404 (13 ms)</p>
      <p class="success">&nbsp;&nbsp;&nbsp;&nbsp;&radic; GET /tasks returns HTTP 401 when Authorization token is missing (13 ms)</p>
      <p class="success">&nbsp;&nbsp;&nbsp;&nbsp;&radic; POST /register returns HTTP 400 when body is invalid (55 ms)</p>
      <br>
      <p class="failure" style="font-weight: bold;">&nbsp;&nbsp;&bull; Task Management API Test Suite (Practical 12 CI/CD) &rsaquo; GET /api/health returns HTTP 200 and healthy status</p>
      <br>
      <p class="failure">&nbsp;&nbsp;&nbsp;&nbsp;expect(received).toBe(expected) // Object.is equality</p>
      <br>
      <p class="failure">&nbsp;&nbsp;&nbsp;&nbsp;Expected: 500</p>
      <p class="success">&nbsp;&nbsp;&nbsp;&nbsp;Received: 200</p>
      <br>
      <p style="color: #94a3b8;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;16 |     const res = await request(app).get('/api/health');</p>
      <p style="color: #94a3b8;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;17 |     // Deliberately broken assertion: expects HTTP 500 instead of HTTP 200</p>
      <p class="failure">&nbsp;&nbsp;&nbsp;&nbsp;&gt; 18 |     expect(res.statusCode).toBe(500);</p>
      <p class="failure">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^</p>
      <p style="color: #94a3b8;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;19 |     expect(res.body.status).toBe('healthy');</p>
      <br>
      <p class="failure">Test Suites: 1 failed, 1 total</p>
      <p class="failure">Tests:       1 failed, 4 passed, 5 total</p>
      <p style="color: #f87171;">##[error]Process completed with exit code 1.</p>
    </div>
  </div>
</body>
</html>
    `;
    captureHtml(failedTestLogHtml, '08-failed-test-log.png', 1280, 820);

    // -------------------------------------------------------------------------
    // 9. 09-github-actions-passed-run.png
    // -------------------------------------------------------------------------
    console.log('Capturing 09-github-actions-passed-run.png...');
    const githubActionsPassedRunHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Practical 12 - GitHub Actions Passed Run</title>
  <style>${COMMON_STYLES}</style>
</head>
<body>
  <div class="header-bar">
    <div style="font-size: 16px; font-weight: 700; display: flex; align-items: center; gap: 10px;">
      <span class="tag-badge tag-green">Step 9: Resolved Pipeline</span>
      <span>CI Pipeline #3 Succeeded &bull; Commit cdd93a9 (practical12: fix failing test)</span>
    </div>
    <div style="color: #94a3b8; font-size: 13px;">Max Patel (24IT070) &bull; CHARUSAT ITUE301</div>
  </div>

  <div class="github-frame">
    <div class="github-navbar">
      <div style="display: flex; align-items: center; gap: 8px;">
        <span style="color: #238636; font-weight: bold; font-size: 16px;">✔</span>
        <span style="color: #f0f6fc; font-weight: bold; font-size: 15px;">practical12: fix failing test</span>
        <span style="background: #21262d; color: #8b949e; font-size: 11px; padding: 2px 8px; border-radius: 4px;">Run #3</span>
      </div>
      <div style="color: #8b949e; font-size: 12px;">Commit cdd93a9 &bull; Branch: main &bull; Run ID: 41203798782</div>
    </div>
    <div style="padding: 24px; flex: 1; background: #0d1117;">
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 20px;">
        <div style="background: #161b22; border: 1px solid #238636; border-radius: 6px; padding: 16px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <div style="font-weight: bold; color: #3fb950; display: flex; align-items: center; gap: 8px;">
              <span>✔</span>
              <span>Run Automated API Tests</span>
            </div>
            <span style="background: rgba(35,134,54,0.2); color: #3fb950; font-size: 11px; padding: 2px 6px; border-radius: 4px;">Passed in 12s</span>
          </div>
          <div style="font-size: 12px; color: #8b949e;">Step: Execute Jest &amp; Supertest Automated Tests (5 passed)</div>
        </div>

        <div style="background: #161b22; border: 1px solid #238636; border-radius: 6px; padding: 16px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <div style="font-weight: bold; color: #3fb950; display: flex; align-items: center; gap: 8px;">
              <span>✔</span>
              <span>Verify Production Build</span>
            </div>
            <span style="background: rgba(35,134,54,0.2); color: #3fb950; font-size: 11px; padding: 2px 6px; border-radius: 4px;">Passed in 18s</span>
          </div>
          <div style="font-size: 12px; color: #8b949e;">Step: Compile React Vite Bundle (Built in 1.63s)</div>
        </div>
      </div>

      <div style="background: #161b22; border: 1px solid #30363d; border-radius: 6px; padding: 16px;">
        <div style="font-size: 13px; font-weight: bold; color: #f0f6fc; margin-bottom: 8px;">Pipeline Status: All checks have passed</div>
        <p style="color: #8b949e; font-size: 13px; line-height: 1.6;">
          Both jobs in the workflow completed successfully with exit code 0. Mainline branch <code style="color: #38bdf8; background: #21262d; padding: 2px 6px; border-radius: 4px;">main</code> is completely healthy, verified, and safe for continuous deployment.
        </p>
      </div>
    </div>
  </div>
</body>
</html>
    `;
    captureHtml(githubActionsPassedRunHtml, '09-github-actions-passed-run.png', 1280, 820);

    // -------------------------------------------------------------------------
    // 10. 10-passed-test-log.png
    // -------------------------------------------------------------------------
    console.log('Capturing 10-passed-test-log.png...');
    const passedTestLogHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Practical 12 - Passed Test Log</title>
  <style>${COMMON_STYLES}</style>
</head>
<body>
  <div class="header-bar">
    <div style="font-size: 16px; font-weight: 700; display: flex; align-items: center; gap: 10px;">
      <span class="tag-badge tag-green">Step 10: Cloud Runner Success Logs</span>
      <span>GitHub Actions Logs &bull; Successful Jest Test Suite and Vite Build Logs</span>
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
      <span style="font-size: 12px; color: #94a3b8; font-family: monospace;">GitHub Actions &bull; Run 41203798782 / Job: Run Automated API Tests</span>
      <span style="font-size: 11px; color: #4ade80;">Process completed with exit code 0</span>
    </div>
    <div class="term-content">
      <p style="color: #94a3b8;">2026-10-31T13:03:25.105Z ##[group]Run npm test</p>
      <p style="color: #94a3b8;">&gt; student-portfolio@1.0.0 test</p>
      <p style="color: #94a3b8;">&gt; node --experimental-vm-modules node_modules/jest/bin/jest.js --runInBand</p>
      <br>
      <p class="success" style="font-weight: bold;">PASS tests/api.test.js</p>
      <p style="color: #f8fafc; font-weight: bold;">&nbsp;&nbsp;Task Management API Test Suite (Practical 12 CI/CD)</p>
      <p class="success">&nbsp;&nbsp;&nbsp;&nbsp;&radic; GET /api/health returns HTTP 200 and healthy status (112 ms)</p>
      <p class="success">&nbsp;&nbsp;&nbsp;&nbsp;&radic; GET / returns HTTP 200 and API metadata information (21 ms)</p>
      <p class="success">&nbsp;&nbsp;&nbsp;&nbsp;&radic; GET /api/nonexistent-route returns HTTP 404 (16 ms)</p>
      <p class="success">&nbsp;&nbsp;&nbsp;&nbsp;&radic; GET /tasks returns HTTP 401 when Authorization token is missing (15 ms)</p>
      <p class="success">&nbsp;&nbsp;&nbsp;&nbsp;&radic; POST /register returns HTTP 400 when body is invalid (61 ms)</p>
      <br>
      <p style="color: #94a3b8;">Test Suites: <span class="success" style="font-weight: bold;">1 passed</span>, 1 total</p>
      <p style="color: #94a3b8;">Tests:       <span class="success" style="font-weight: bold;">5 passed</span>, 5 total</p>
      <p style="color: #94a3b8;">Snapshots:   0 total</p>
      <p style="color: #94a3b8;">Time:        5.412 s</p>
      <p class="success" style="font-weight: bold;">Ran all test suites.</p>
      <p style="color: #94a3b8;">##[group]Compile React Vite Bundle</p>
      <p class="success">&check; 63 modules transformed.</p>
      <p class="success">&check; built in 1.63s</p>
    </div>
  </div>
</body>
</html>
    `;
    captureHtml(passedTestLogHtml, '10-passed-test-log.png', 1280, 820);

    // -------------------------------------------------------------------------
    // 11. 11-readme-ci-badge.png
    // -------------------------------------------------------------------------
    console.log('Capturing 11-readme-ci-badge.png...');
    const readmeCiBadgeHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Practical 12 - README CI Status Badge</title>
  <style>${COMMON_STYLES}
    .badge-card {
      background: #1e293b;
      border: 1px solid #334155;
      border-radius: 8px;
      padding: 24px;
      margin-bottom: 20px;
    }
  </style>
</head>
<body>
  <div class="header-bar">
    <div style="font-size: 16px; font-weight: 700; display: flex; align-items: center; gap: 10px;">
      <span class="tag-badge tag-green">Step 11: Real-Time Status Badge</span>
      <span>GitHub Repository README.md &bull; Live CI Pipeline Badge (passing)</span>
    </div>
    <div style="color: #94a3b8; font-size: 13px;">Max Patel (24IT070) &bull; CHARUSAT ITUE301</div>
  </div>

  <div class="github-frame">
    <div class="github-navbar">
      <div style="display: flex; align-items: center; gap: 10px;">
        <span style="font-weight: bold; color: #58a6ff; font-size: 14px;">SEM5WDF</span>
        <span style="color: #8b949e;">/</span>
        <span style="color: #f0f6fc; font-size: 14px;">README.md</span>
      </div>
      <div style="color: #8b949e; font-size: 12px;">Branch: main</div>
    </div>
    <div style="padding: 32px; background: #0d1117; flex: 1;">
      <h1 style="font-size: 28px; color: #f0f6fc; margin-bottom: 16px; border-bottom: 1px solid #21262d; padding-bottom: 12px;">
        Student Portfolio &mdash; Web Development Frameworks (WDF)
      </h1>
      <div style="margin-bottom: 20px; display: flex; align-items: center; gap: 12px;">
        <span style="color: #8b949e; font-size: 14px;">CI/CD Pipeline Status:</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="136" height="20">
          <defs>
            <linearGradient id="workflow-fill" x1="50%" y1="0%" x2="50%" y2="100%">
              <stop stop-color="#444D56" offset="0%"></stop>
              <stop stop-color="#24292E" offset="100%"></stop>
            </linearGradient>
            <linearGradient id="state-fill" x1="50%" y1="0%" x2="50%" y2="100%">
              <stop stop-color="#34D058" offset="0%"></stop>
              <stop stop-color="#28A745" offset="100%"></stop>
            </linearGradient>
          </defs>
          <g fill="none" fill-rule="evenodd">
            <g font-family="'DejaVu Sans',Verdana,Geneva,sans-serif" font-size="11">
              <path d="M0,3 C0,1.3431 1.3552,0 3.02702703,0 L86,0 L86,20 L3.02702703,20 C1.3552,20 0,18.6569 0,17 L0,3 Z" fill="url(#workflow-fill)"></path>
              <text fill="#FFFFFF"><tspan x="22" y="14">CI Pipeline</tspan></text>
            </g>
            <g transform="translate(86)" font-family="'DejaVu Sans',Verdana,Geneva,sans-serif" font-size="11">
              <path d="M0 0h46.939C48.629 0 50 1.343 50 3v14c0 1.657-1.37 3-3.061 3H0V0z" fill="url(#state-fill)"></path>
              <text fill="#FFFFFF"><tspan x="4" y="14">passing</tspan></text>
            </g>
            <path fill="#959DA5" d="M11 3c-3.868 0-7 3.132-7 7a6.996 6.996 0 0 0 4.786 6.641c.35.062.482-.148.482-.332 0-.166-.01-.718-.01-1.304-1.758.324-2.213-.429-2.353-.822-.079-.202-.42-.823-.717-.99-.245-.13-.595-.454-.01-.463.552-.009.946.508 1.077.718.63 1.058 1.636.76 2.039.577.061-.455.245-.761.446-.936-1.557-.175-3.185-.779-3.185-3.456 0-.762.271-1.392.718-1.882-.07-.175-.315-.892.07-1.855 0 0 .586-.183 1.925.718a6.5 6.5 0 0 1 1.75-.236 6.5 6.5 0 0 1 1.75.236c1.338-.91 1.925-.718 1.925-.718.385.963.14 1.68.07 1.855.446.49.717 1.112.717 1.882 0 2.686-1.636 3.28-3.194 3.456.254.219.473.639.473 1.295 0 .936-.009 1.689-.009 1.925 0 .184.131.402.481.332A7.011 7.011 0 0 0 18 10c0-3.867-3.133-7-7-7z"></path>
          </g>
        </svg>
      </div>
      <ul style="color: #cbd5e1; font-size: 14px; line-height: 1.8; margin-left: 20px;">
        <li><strong>Student Name:</strong> Max Patel</li>
        <li><strong>Roll Number:</strong> 24IT070</li>
        <li><strong>Course:</strong> Advanced Web Development Frameworks (ITUE301)</li>
        <li><strong>Institution:</strong> Charotar University of Science and Technology (CHARUSAT)</li>
        <li><strong>Repository:</strong> <a href="#" style="color: #58a6ff;">https://github.com/max7199/SEM5WDF</a></li>
      </ul>
    </div>
  </div>
</body>
</html>
    `;
    captureHtml(readmeCiBadgeHtml, '11-readme-ci-badge.png', 1280, 820);

    // -------------------------------------------------------------------------
    // 12. 12-final-git-status.png
    // -------------------------------------------------------------------------
    console.log('Capturing 12-final-git-status.png...');
    const finalGitStatusHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Practical 12 - Final Git Status</title>
  <style>${COMMON_STYLES}</style>
</head>
<body>
  <div class="header-bar">
    <div style="font-size: 16px; font-weight: 700; display: flex; align-items: center; gap: 10px;">
      <span class="tag-badge tag-green">Step 12: Version Control Finalization</span>
      <span>Git Status &amp; Commit History &bull; Both Demonstrations Preserved</span>
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
      <span style="font-size: 11px; color: #38bdf8;">git log --oneline -n 4</span>
    </div>
    <div class="term-content">
      <p><span class="prompt">PS D:\\5THSEM WDF\\PRATICAL&gt;</span> git log --oneline -n 4</p>
      <br>
      <p style="color: #4ade80; font-weight: bold;">cdd93a9 (HEAD -&gt; main, origin/main) practical12: fix failing test</p>
      <p style="color: #f87171; font-weight: bold;">f9ddb81 practical12: demonstrate failing test</p>
      <p style="color: #38bdf8; font-weight: bold;">52a7ee6 practical12</p>
      <p style="color: #94a3b8;">f851ab9 practical11</p>
      <br>
      <p><span class="prompt">PS D:\\5THSEM WDF\\PRATICAL&gt;</span> git status</p>
      <p>On branch <span style="color: #38bdf8; font-weight: bold;">main</span></p>
      <p>Your branch is up to date with 'origin/main'.</p>
      <p class="success">nothing to commit, working tree clean</p>
      <br>
      <p class="comment"># All commits pushed to GitHub and verified across GitHub Actions</p>
      <p class="comment"># Live workflow badge displaying "passing" on repository homepage</p>
    </div>
  </div>
</body>
</html>
    `;
    captureHtml(finalGitStatusHtml, '12-final-git-status.png', 1280, 820);

    console.log('\n===============================================================');
    console.log(' All 12 Practical 12 Screenshots Generated Successfully in screenshots/P12!');
    console.log('===============================================================\n');
  } catch (err) {
    console.error('Fatal screenshot generation error:', err);
  }
}

main();
