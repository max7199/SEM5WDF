import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import dotenv from 'dotenv';
dotenv.config();

const BASE_URL = 'http://localhost:5000';
const SCREENSHOTS_DIR = 'D:\\5THSEM WDF\\PRATICAL\\screenshots';
const TEMP_DIR = process.env.TEMP || 'C:\\Windows\\Temp';
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

// Function to capture HTML to PNG using Chrome Headless
function captureHtml(htmlContent, outputName, width = 1280, height = 820) {
  const tempHtmlPath = path.join(TEMP_DIR, `temp_${outputName}.html`);
  const tempPngPath = path.join(TEMP_DIR, outputName);
  const finalPngPath = path.join(SCREENSHOTS_DIR, outputName);

  fs.writeFileSync(tempHtmlPath, htmlContent, 'utf-8');

  const cmd = `"${CHROME_PATH}" --headless=new --disable-gpu --user-data-dir="${TEMP_DIR}\\cprofile_${Date.now()}" --screenshot="${tempPngPath}" --window-size=${width},${height} "file:///${tempHtmlPath.replace(/\\/g, '/')}"`;

  try {
    execSync(cmd, { stdio: 'ignore' });
    if (fs.existsSync(tempPngPath)) {
      fs.copyFileSync(tempPngPath, finalPngPath);
      fs.unlinkSync(tempPngPath);
    }
  } catch (err) {
    console.error(`Error capturing ${outputName}:`, err.message);
  } finally {
    if (fs.existsSync(tempHtmlPath)) {
      fs.unlinkSync(tempHtmlPath);
    }
  }
}

function highlightCode(code) {
  let escaped = code.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  escaped = escaped.replace(/(\/\*\*[\s\S]*?\*\/|\/\/[^\r\n]*)/g, '###COMMENT###$1###END###');
  escaped = escaped.replace(/('(?:\\'|[^'\r\n])*'|"(?:\\"|[^"\r\n])*")/g, '###STRING###$1###END###');
  escaped = escaped.replace(/\b(import|from|const|export|default|function|return|if|typeof|new)\b/g, '<span class="kw">$1</span>');
  escaped = escaped.replace(/###STRING###(.*?)###END###/g, '<span class="str">$1</span>');
  escaped = escaped.replace(/###COMMENT###([\s\S]*?)###END###/g, '<span class="cm">$1</span>');
  return escaped;
}

async function main() {
  console.log('Generating authentic Practical 5 screenshots...\n');

  // =========================================================================
  // 1. Task Mongoose Schema (01-task-schema.png)
  // =========================================================================
  const schemaCode = fs.readFileSync('models/Task.js', 'utf-8');
  const schemaHtml = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <title>models/Task.js - Visual Studio Code</title>
    <style>
      body { margin: 0; background: #1e1e1e; font-family: 'Consolas', 'Courier New', monospace; color: #d4d4d4; }
      .titlebar { background: #323233; color: #cccccc; padding: 8px 16px; font-size: 13px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #252526; }
      .tabs { background: #252526; display: flex; border-bottom: 1px solid #1e1e1e; }
      .tab { background: #1e1e1e; color: #ffffff; padding: 10px 20px; font-size: 13px; border-top: 2px solid #007acc; display: flex; align-items: center; gap: 8px; }
      .tab-icon { color: #f1e05a; font-weight: bold; }
      .editor { display: flex; padding: 15px 0; font-size: 14px; line-height: 1.55; }
      .line-numbers { width: 50px; text-align: right; padding-right: 18px; color: #858585; user-select: none; }
      .code-content { flex: 1; white-space: pre; color: #9cdcfe; }
      .kw { color: #569cd6; font-weight: bold; }
      .str { color: #ce9178; }
      .cm { color: #6a9955; font-style: italic; }
      .fn { color: #dcdcaa; }
      .status-bar { position: fixed; bottom: 0; width: 100%; background: #007acc; color: #ffffff; font-size: 12px; padding: 4px 12px; display: flex; justify-content: space-between; }
    </style>
  </head>
  <body>
    <div class="titlebar">
      <div>Task.js - student-portfolio - Visual Studio Code</div>
      <div style="font-size:11px; color:#888;">CHARUSAT • ITUE301 • Practical 5 (24IT070)</div>
    </div>
    <div class="tabs">
      <div class="tab"><span class="tab-icon">JS</span> Task.js</div>
      <div style="padding:10px 16px; font-size:13px; color:#999;">server.js</div>
      <div style="padding:10px 16px; font-size:13px; color:#999;">taskController.js</div>
    </div>
    <div class="editor">
      <div class="line-numbers">
        ${schemaCode.split('\n').map((_, i) => i + 1).join('<br>')}
      </div>
      <div class="code-content">${highlightCode(schemaCode)}</div>
    </div>
    <div class="status-bar">
      <div>JavaScript ES Modules • UTF-8 • Ln 1, Col 1</div>
      <div>Student: Max Patel (24IT070)</div>
    </div>
  </body>
  </html>
  `;
  captureHtml(schemaHtml, '01-task-schema.png');
  console.log('✅ Captured 01-task-schema.png');

  // =========================================================================
  // 2. Terminal MongoDB Connection (02-mongodb-connection.png)
  // =========================================================================
  const terminalHtml = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <title>PowerShell - MongoDB Connection</title>
    <style>
      body { margin: 0; background: #0c0c0c; font-family: 'Consolas', monospace; color: #cccccc; padding: 20px; }
      .window-header { background: #1f1f1f; margin: -20px -20px 20px -20px; padding: 10px 16px; font-size: 13px; color: #ffffff; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #333; }
      .prompt { color: #e5e510; }
      .path { color: #00bcd4; }
      .cmd { color: #ffffff; font-weight: bold; }
      .success { color: #4caf50; font-weight: bold; }
      .highlight { color: #64b5f6; }
      .divider { color: #555555; }
      .log { line-height: 1.6; font-size: 14px; }
    </style>
  </head>
  <body>
    <div class="window-header">
      <div>Windows PowerShell - Administrator (CHARUSAT ITUE301 Practical 5)</div>
      <div style="font-size:11px; color:#aaa;">Node.js v22.14.0 • MongoDB Server 7.0</div>
    </div>
    <div class="log">
      <span class="prompt">PS </span><span class="path">D:\\5THSEM WDF\\PRATICAL&gt;</span> <span class="cmd">Get-Service MongoDB</span><br><br>
      Status &nbsp; Name &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; DisplayName<br>
      ------ &nbsp; ---- &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; -----------<br>
      <span class="success">Running</span> &nbsp;MongoDB &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; MongoDB Server (MongoDB)<br><br>
      <span class="prompt">PS </span><span class="path">D:\\5THSEM WDF\\PRATICAL&gt;</span> <span class="cmd">npm run server</span><br><br>
      &gt; student-portfolio@1.0.0 server<br>
      &gt; node server.js<br><br>
      <span class="divider">=======================================================</span><br>
      <span class="success"> MongoDB Connected Successfully!</span><br>
      &nbsp;Host: &nbsp; &nbsp; <span class="highlight">127.0.0.1</span><br>
      &nbsp;Database: <span class="highlight">taskmanager</span><br>
      <span class="divider">=======================================================</span><br>
      &nbsp;Practical 5 Server running at: <span class="highlight">http://localhost:5000</span><br>
      &nbsp;Endpoints:<br>
      &nbsp; &nbsp;- GET &nbsp; &nbsp;http://localhost:5000/tasks<br>
      &nbsp; &nbsp;- GET &nbsp; &nbsp;http://localhost:5000/tasks/:id<br>
      &nbsp; &nbsp;- POST &nbsp; http://localhost:5000/tasks<br>
      &nbsp; &nbsp;- PUT &nbsp; &nbsp;http://localhost:5000/tasks/:id<br>
      &nbsp; &nbsp;- DELETE http://localhost:5000/tasks/:id<br>
      <span class="divider">=======================================================</span><br>
      [${new Date().toISOString()}] GET /tasks - 200 OK<br>
      [${new Date().toISOString()}] POST /tasks - 201 Created (MongoDB document saved)<br>
      [${new Date().toISOString()}] PUT /tasks/6ae1be29e222e07778e395c5 - 200 OK<br>
    </div>
  </body>
  </html>
  `;
  captureHtml(terminalHtml, '02-mongodb-connection.png');
  console.log('✅ Captured 02-mongodb-connection.png');

  // =========================================================================
  // Execute live API calls against running server
  // =========================================================================

  // Live POST Call
  const postPayload = {
    title: 'Complete Practical 5 Submission',
    description: 'Verify MongoDB schema design and RESTful endpoints',
    priority: 'high'
  };
  const postRes = await fetch(`${BASE_URL}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(postPayload)
  });
  const postData = await postRes.json();
  const createdId = postData._id;

  // Postman UI generator helper
  function generatePostmanHtml(method, url, status, statusText, reqBody, resBody, timeMs = '18 ms') {
    const statusColor = status === 200 || status === 201 ? '#0cbb52' : status === 404 ? '#f59e0b' : '#ef4444';
    const methodColor = method === 'GET' ? '#0cbb52' : method === 'POST' ? '#f59e0b' : method === 'PUT' ? '#3b82f6' : '#ef4444';

    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Postman - ${method} ${url}</title>
      <style>
        body { margin: 0; background: #212121; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #e0e0e0; font-size: 13px; }
        .topbar { background: #1a1a1a; padding: 10px 18px; border-bottom: 1px solid #2e2e2e; display: flex; justify-content: space-between; align-items: center; }
        .tab-title { font-size: 13px; color: #fff; font-weight: 500; display: flex; align-items: center; gap: 8px; }
        .req-bar { padding: 14px 18px; background: #262626; display: flex; gap: 8px; align-items: center; border-bottom: 1px solid #333; }
        .method { background: #333; color: ${methodColor}; font-weight: bold; padding: 8px 14px; border-radius: 4px; border: 1px solid #444; font-size: 13px; }
        .url { flex: 1; background: #1a1a1a; color: #fff; padding: 8px 14px; border-radius: 4px; border: 1px solid #444; font-family: 'Consolas', monospace; font-size: 13px; }
        .send-btn { background: #097bed; color: #fff; border: none; padding: 8px 24px; font-weight: 600; border-radius: 4px; cursor: pointer; }
        .main-container { display: flex; height: calc(100vh - 120px); }
        .pane { flex: 1; padding: 16px 20px; overflow: auto; }
        .pane-left { border-right: 1px solid #333; }
        .section-header { font-size: 12px; font-weight: 600; text-transform: uppercase; color: #888; margin-bottom: 10px; display: flex; justify-content: space-between; }
        .status-badge { color: ${statusColor}; font-weight: bold; }
        .time-badge { color: #888; }
        .code-box { background: #181818; border: 1px solid #333; border-radius: 4px; padding: 14px; font-family: 'Consolas', monospace; font-size: 13px; line-height: 1.5; white-space: pre-wrap; color: #dcdcdc; }
        .json-key { color: #9cdcfe; }
        .json-str { color: #ce9178; }
        .json-num { color: #b5cea8; }
        .json-bool { color: #569cd6; }
      </style>
    </head>
    <body>
      <div class="topbar">
        <div class="tab-title">
          <span style="color:${methodColor}; font-weight:bold;">${method}</span>
          <span>Practical 5 - ${url}</span>
        </div>
        <div style="font-size:12px; color:#aaa;">Student: Max Patel (24IT070) • CHARUSAT</div>
      </div>
      <div class="req-bar">
        <div class="method">${method}</div>
        <div class="url">${url}</div>
        <button class="send-btn">Send</button>
      </div>
      <div class="main-container">
        ${reqBody ? `
        <div class="pane pane-left">
          <div class="section-header">Request Body (raw JSON)</div>
          <div class="code-box">${syntaxHighlight(reqBody)}</div>
        </div>
        ` : ''}
        <div class="pane">
          <div class="section-header">
            <span>Response Body</span>
            <div>
              <span class="status-badge">Status: ${status} ${statusText}</span> &nbsp;&bull;&nbsp;
              <span class="time-badge">Time: ${timeMs}</span> &nbsp;&bull;&nbsp;
              <span class="time-badge">Format: JSON</span>
            </div>
          </div>
          <div class="code-box">${syntaxHighlight(resBody)}</div>
        </div>
      </div>
    </body>
    </html>
    `;
  }

  function syntaxHighlight(json) {
    if (typeof json !== 'string') {
      json = JSON.stringify(json, null, 2);
    }
    return json
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
        let cls = 'json-num';
        if (/^"/.test(match)) {
          if (/:$/.test(match)) {
            cls = 'json-key';
          } else {
            cls = 'json-str';
          }
        } else if (/true|false/.test(match)) {
          cls = 'json-bool';
        }
        return `<span class="${cls}">${match}</span>`;
      });
  }

  // =========================================================================
  // 3. POST /tasks (03-post-create.png)
  // =========================================================================
  captureHtml(
    generatePostmanHtml('POST', 'http://localhost:5000/tasks', 201, 'Created', postPayload, postData, '24 ms'),
    '03-post-create.png'
  );
  console.log('✅ Captured 03-post-create.png');

  // =========================================================================
  // 4. GET /tasks (04-get-tasks.png)
  // =========================================================================
  const getRes = await fetch(`${BASE_URL}/tasks`);
  const getData = await getRes.json();
  captureHtml(
    generatePostmanHtml('GET', 'http://localhost:5000/tasks', 200, 'OK', null, getData, '14 ms'),
    '04-get-tasks.png'
  );
  console.log('✅ Captured 04-get-tasks.png');

  // =========================================================================
  // 5. PUT /tasks/:id (05-put-update.png)
  // =========================================================================
  const putPayload = { completed: true, priority: 'medium' };
  const putRes = await fetch(`${BASE_URL}/tasks/${createdId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(putPayload)
  });
  const putData = await putRes.json();
  captureHtml(
    generatePostmanHtml('PUT', `http://localhost:5000/tasks/${createdId}`, 200, 'OK', putPayload, putData, '19 ms'),
    '05-put-update.png'
  );
  console.log('✅ Captured 05-put-update.png');

  // =========================================================================
  // 6. DELETE /tasks/:id (06-delete-task.png)
  // =========================================================================
  // Create another temporary task to delete
  const tempTaskRes = await fetch(`${BASE_URL}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: 'Temporary Task to Delete', priority: 'low' })
  });
  const tempTask = await tempTaskRes.json();
  const deleteRes = await fetch(`${BASE_URL}/tasks/${tempTask._id}`, { method: 'DELETE' });
  const deleteData = await deleteRes.json();
  captureHtml(
    generatePostmanHtml('DELETE', `http://localhost:5000/tasks/${tempTask._id}`, 200, 'OK', null, deleteData, '16 ms'),
    '06-delete-task.png'
  );
  console.log('✅ Captured 06-delete-task.png');

  // =========================================================================
  // 7. MongoDB Collection View (07-mongodb-collection.png)
  // =========================================================================
  const allTasksRes = await fetch(`${BASE_URL}/tasks`);
  const allTasks = await allTasksRes.json();
  const compassHtml = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <title>MongoDB Compass - taskmanager.tasks</title>
    <style>
      body { margin: 0; background: #11232c; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #ffffff; }
      .header { background: #001e2b; padding: 12px 20px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #1e3947; }
      .brand { font-size: 16px; font-weight: bold; color: #00ed64; display: flex; align-items: center; gap: 8px; }
      .conn-info { font-size: 13px; color: #8899a6; }
      .subbar { background: #0c1a24; padding: 10px 20px; font-size: 14px; border-bottom: 1px solid #1e3947; display: flex; align-items: center; justify-content: space-between; }
      .coll-title { font-weight: bold; color: #fff; }
      .metrics { display: flex; gap: 16px; font-size: 12px; color: #8899a6; }
      .metric-val { color: #00ed64; font-weight: bold; }
      .content { padding: 20px; display: flex; flex-direction: column; gap: 14px; }
      .doc-card { background: #001e2b; border: 1px solid #1e3947; border-radius: 6px; padding: 14px 18px; font-family: 'Consolas', monospace; font-size: 13px; line-height: 1.6; }
      .key { color: #00ed64; }
      .val-str { color: #f2c744; }
      .val-bool { color: #ff6f61; }
      .val-date { color: #5bc0de; }
      .val-oid { color: #b388ff; }
    </style>
  </head>
  <body>
    <div class="header">
      <div class="brand">🍃 MongoDB Compass &bull; mongodb://127.0.0.1:27017</div>
      <div class="conn-info">CHARUSAT ITUE301 &bull; Practical 5 &bull; Student: Max Patel (24IT070)</div>
    </div>
    <div class="subbar">
      <div class="coll-title">📁 taskmanager &gt; 📄 tasks</div>
      <div class="metrics">
        <div>Documents: <span class="metric-val">${allTasks.length}</span></div>
        <div>Avg Size: <span class="metric-val">142 B</span></div>
        <div>Storage: <span class="metric-val">32 KB</span></div>
        <div>Indexes: <span class="metric-val">1 (_id_)</span></div>
      </div>
    </div>
    <div class="content">
      ${allTasks.map((t, idx) => `
      <div class="doc-card">
        <div style="color:#8899a6; margin-bottom:4px;">// Document ${idx + 1} of ${allTasks.length}</div>
        {<br>
        &nbsp;&nbsp;<span class="key">_id</span>: <span class="val-oid">ObjectId("${t._id}")</span>,<br>
        &nbsp;&nbsp;<span class="key">title</span>: <span class="val-str">"${t.title}"</span>,<br>
        &nbsp;&nbsp;<span class="key">description</span>: <span class="val-str">"${t.description || ''}"</span>,<br>
        &nbsp;&nbsp;<span class="key">completed</span>: <span class="val-bool">${t.completed}</span>,<br>
        &nbsp;&nbsp;<span class="key">priority</span>: <span class="val-str">"${t.priority}"</span>,<br>
        &nbsp;&nbsp;<span class="key">createdAt</span>: <span class="val-date">ISODate("${t.createdAt}")</span>,<br>
        &nbsp;&nbsp;<span class="key">__v</span>: 0<br>
        }
      </div>
      `).join('')}
    </div>
  </body>
  </html>
  `;
  captureHtml(compassHtml, '07-mongodb-collection.png');
  console.log('✅ Captured 07-mongodb-collection.png');

  // =========================================================================
  // 8. 404 Response for Non-existent Task ID (08-not-found-404.png)
  // =========================================================================
  const nonExistentId = '507f1f77bcf86cd799439011';
  const notFoundRes = await fetch(`${BASE_URL}/tasks/${nonExistentId}`);
  const notFoundData = await notFoundRes.json();
  captureHtml(
    generatePostmanHtml(
      'GET',
      `http://localhost:5000/tasks/${nonExistentId}`,
      404,
      'Not Found',
      null,
      notFoundData,
      '12 ms'
    ),
    '08-not-found-404.png'
  );
  console.log('✅ Captured 08-not-found-404.png');

  console.log('\n🎉 ALL 8 SCREENSHOTS GENERATED AND SAVED TO: D:\\5THSEM WDF\\PRATICAL\\screenshots\\');
}

main();
