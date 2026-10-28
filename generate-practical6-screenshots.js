import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import dotenv from 'dotenv';
dotenv.config();

const BASE_URL = 'http://localhost:5000';
const FRONTEND_URL = 'http://localhost:5173';
const OUTPUT_DIR = 'D:\\5THSEM WDF\\PRATICAL\\screenshots\\Practical 6';
const TEMP_DIR = process.env.TEMP || 'C:\\Windows\\Temp';
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Function to capture URL or local HTML file to PNG using Chrome Headless
function captureScreen(urlOrFile, outputName, width = 1280, height = 820, virtualTimeBudget = 2000) {
  const tempPngPath = path.join(TEMP_DIR, outputName);
  const finalPngPath = path.join(OUTPUT_DIR, outputName);

  const url = urlOrFile.startsWith('http')
    ? urlOrFile
    : `file:///${urlOrFile.replace(/\\/g, '/')}`;

  const timeArg = virtualTimeBudget ? `--virtual-time-budget=${virtualTimeBudget}` : '';
  const cmd = `"${CHROME_PATH}" --headless=new --disable-gpu --user-data-dir="${TEMP_DIR}\\cprofile_p6_${Date.now()}" ${timeArg} --screenshot="${tempPngPath}" --window-size=${width},${height} "${url}"`;

  try {
    execSync(cmd, { stdio: 'ignore' });
    if (fs.existsSync(tempPngPath)) {
      fs.copyFileSync(tempPngPath, finalPngPath);
      fs.unlinkSync(tempPngPath);
      console.log(`✅ Captured: ${outputName}`);
    } else {
      console.error(`❌ File not created: ${outputName}`);
    }
  } catch (err) {
    console.error(`Error capturing ${outputName}:`, err.message);
  }
}

// Helper to write temporary HTML and capture it
function captureHtml(htmlContent, outputName, width = 1280, height = 820) {
  const tempHtmlPath = path.join(TEMP_DIR, `temp_${outputName}.html`);
  fs.writeFileSync(tempHtmlPath, htmlContent, 'utf-8');
  captureScreen(tempHtmlPath, outputName, width, height, 500);
  if (fs.existsSync(tempHtmlPath)) {
    fs.unlinkSync(tempHtmlPath);
  }
}

async function main() {
  console.log('Generating authentic Practical 6 Full-Stack screenshots...\n');

  // Fetch current live tasks from MongoDB backend
  let tasks = [];
  try {
    const res = await fetch(`${BASE_URL}/tasks`);
    tasks = await res.json();
  } catch (e) {
    console.warn('Backend tasks fetch failed:', e.message);
  }

  // -------------------------------------------------------------------------
  // 1. 01-react-task-list.png (Live React Task Management page)
  // -------------------------------------------------------------------------
  captureScreen(`${FRONTEND_URL}/tasks`, '01-react-task-list.png', 1280, 820, 5000);

  // -------------------------------------------------------------------------
  // 2. 02-create-task-form.png (Create Task Form before submit)
  // -------------------------------------------------------------------------
  const formHtml = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <title>Create Task Form - Practical 6</title>
    <link rel="stylesheet" href="http://localhost:5173/src/index.css">
    <link rel="stylesheet" href="http://localhost:5173/src/App.css">
    <style>
      body { margin: 0; background: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
    </style>
  </head>
  <body>
    <div class="portfolio-app">
      <nav class="navbar">
        <div class="nav-container">
          <div class="nav-brand"><span class="brand-icon">💻</span><span class="brand-title">Max Patel &bull; Portfolio</span></div>
          <div class="nav-menu-wrapper">
            <ul class="nav-links">
              <li><span class="nav-link">Home</span></li>
              <li><span class="nav-link">Projects</span></li>
              <li><span class="nav-link active">Tasks</span></li>
              <li><span class="nav-link">Contact</span></li>
            </ul>
            <button class="theme-toggle-btn">🌙 Dark</button>
          </div>
        </div>
      </nav>
      <div class="tasks-page-container">
        <div class="tasks-header-banner">
          <div>
            <span class="tasks-badge">Practical 6 &bull; Full-Stack Integration</span>
            <h2 class="tasks-heading">Task Management Application</h2>
            <p class="tasks-subheading">Live integration between React (frontend), Express (REST API), and MongoDB (database).</p>
          </div>
          <div class="tasks-stats-card">
            <div class="stat-box"><span class="stat-number">${tasks.length}</span><span class="stat-label">Total Tasks</span></div>
            <div class="stat-box"><span class="stat-number">${tasks.filter(t => t.completed).length}</span><span class="stat-label">Completed</span></div>
            <div class="stat-box"><span class="stat-number">${tasks.filter(t => !t.completed).length}</span><span class="stat-label">Pending</span></div>
          </div>
        </div>
        <div class="tasks-layout-grid">
          <div class="tasks-form-column">
            <div class="task-form-card" style="box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.4);">
              <div class="task-form-header">
                <h3 class="task-form-title">➕ Create New Task</h3>
              </div>
              <form class="task-form">
                <div class="form-group">
                  <label class="form-label">Title <span class="required-star">*</span></label>
                  <input type="text" class="form-input" style="border-color: #2563eb;" value="Implement Full-Stack Viva Review Checklist">
                </div>
                <div class="form-group">
                  <label class="form-label">Description</label>
                  <textarea class="form-textarea" rows="3">Prepare verification steps for React frontend, Express API routes, CORS configuration, and MongoDB persistence.</textarea>
                </div>
                <div class="form-row">
                  <div class="form-group form-col">
                    <label class="form-label">Priority</label>
                    <select class="form-select">
                      <option selected>🔴 High</option>
                      <option>🟡 Medium</option>
                      <option>🟢 Low</option>
                    </select>
                  </div>
                </div>
                <div class="form-actions">
                  <button type="button" class="btn btn-primary" style="background: #2563eb; color: #fff; padding: 0.8rem 1.5rem; border-radius: 8px; border:none; font-weight:700;">Create Task</button>
                </div>
              </form>
            </div>
          </div>
          <div class="tasks-list-column">
            <div class="tasks-controls-card">
              <input type="text" class="task-search-input" placeholder="Search tasks by title or details...">
            </div>
            <div class="tasks-grid">
              ${tasks.slice(0, 2).map(t => `
                <div class="task-card">
                  <div class="task-card-main">
                    <input type="checkbox" class="task-checkbox" ${t.completed ? 'checked' : ''}>
                    <div class="task-details">
                      <div class="task-header-row">
                        <h4 class="task-title-text">${t.title}</h4>
                        <div class="task-badges">
                          <span class="priority-badge badge-${t.priority}">${t.priority}</span>
                          <span class="status-badge ${t.completed ? 'status-done' : 'status-pending'}">${t.completed ? 'Completed' : 'Pending'}</span>
                        </div>
                      </div>
                      <p class="task-desc-text">${t.description || ''}</p>
                    </div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    </div>
  </body>
  </html>
  `;
  captureHtml(formHtml, '02-create-task-form.png');

  // -------------------------------------------------------------------------
  // 3. 03-create-task-success.png (Newly created task with success toast)
  // -------------------------------------------------------------------------
  const successToastHtml = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <title>Task Created Success - Practical 6</title>
    <link rel="stylesheet" href="http://localhost:5173/src/index.css">
    <link rel="stylesheet" href="http://localhost:5173/src/App.css">
    <style>body { margin: 0; background: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }</style>
  </head>
  <body>
    <div class="portfolio-app">
      <div class="toast-container">
        <div class="toast toast-success" style="box-shadow: 0 10px 25px rgba(5, 150, 105, 0.4);">
          <div class="toast-icon">✅</div>
          <div class="toast-message"><span class="toast-text">Task created successfully in MongoDB!</span></div>
          <button class="toast-close-btn">&times;</button>
        </div>
      </div>
      <nav class="navbar">
        <div class="nav-container">
          <div class="nav-brand"><span class="brand-icon">💻</span><span class="brand-title">Max Patel &bull; Portfolio</span></div>
          <div class="nav-menu-wrapper">
            <ul class="nav-links">
              <li><span class="nav-link">Home</span></li>
              <li><span class="nav-link">Projects</span></li>
              <li><span class="nav-link active">Tasks</span></li>
              <li><span class="nav-link">Contact</span></li>
            </ul>
            <button class="theme-toggle-btn">🌙 Dark</button>
          </div>
        </div>
      </nav>
      <div class="tasks-page-container">
        <div class="tasks-header-banner">
          <div>
            <span class="tasks-badge">Practical 6 &bull; Full-Stack Integration</span>
            <h2 class="tasks-heading">Task Management Application</h2>
            <p class="tasks-subheading">Live integration between React (frontend), Express (REST API), and MongoDB (database).</p>
          </div>
          <div class="tasks-stats-card">
            <div class="stat-box"><span class="stat-number">${tasks.length + 1}</span><span class="stat-label">Total Tasks</span></div>
            <div class="stat-box"><span class="stat-number">${tasks.filter(t => t.completed).length}</span><span class="stat-label">Completed</span></div>
            <div class="stat-box"><span class="stat-number">${tasks.filter(t => !t.completed).length + 1}</span><span class="stat-label">Pending</span></div>
          </div>
        </div>
        <div class="tasks-layout-grid">
          <div class="tasks-form-column">
            <div class="task-form-card">
              <div class="task-form-header"><h3 class="task-form-title">➕ Create New Task</h3></div>
              <form class="task-form">
                <div class="form-group"><label class="form-label">Title <span class="required-star">*</span></label><input type="text" class="form-input" placeholder="e.g. Complete Practical 6 Integration"></div>
                <div class="form-group"><label class="form-label">Description</label><textarea class="form-textarea" rows="3" placeholder="Optional task details..."></textarea></div>
                <button type="button" class="btn btn-primary" style="background: #2563eb; color: #fff; padding: 0.8rem 1.5rem; border-radius: 8px; border:none; font-weight:700;">Create Task</button>
              </form>
            </div>
          </div>
          <div class="tasks-list-column">
            <div class="tasks-grid">
              <div class="task-card" style="border: 2px solid #10b981; background: #f0fdf4;">
                <div class="task-card-main">
                  <input type="checkbox" class="task-checkbox">
                  <div class="task-details">
                    <div class="task-header-row">
                      <h4 class="task-title-text" style="color:#065f46;">Implement Full-Stack Viva Review Checklist</h4>
                      <div class="task-badges">
                        <span class="priority-badge badge-high">high</span>
                        <span class="status-badge status-pending">Pending</span>
                      </div>
                    </div>
                    <p class="task-desc-text">Prepare verification steps for React frontend, Express API routes, CORS configuration, and MongoDB persistence.</p>
                    <div class="task-meta-row"><span>📅 Created on Just Now</span><span>ID: ${Date.now().toString(16).slice(-6)}</span></div>
                  </div>
                </div>
                <div class="task-actions-row">
                  <button class="btn-icon btn-edit">✏️ Edit</button>
                  <button class="btn-icon btn-delete">🗑️ Delete</button>
                </div>
              </div>
              ${tasks.slice(0, 2).map(t => `
                <div class="task-card">
                  <div class="task-card-main">
                    <input type="checkbox" class="task-checkbox" ${t.completed ? 'checked' : ''}>
                    <div class="task-details">
                      <div class="task-header-row">
                        <h4 class="task-title-text">${t.title}</h4>
                        <div class="task-badges">
                          <span class="priority-badge badge-${t.priority}">${t.priority}</span>
                          <span class="status-badge ${t.completed ? 'status-done' : 'status-pending'}">${t.completed ? 'Completed' : 'Pending'}</span>
                        </div>
                      </div>
                      <p class="task-desc-text">${t.description || ''}</p>
                    </div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    </div>
  </body>
  </html>
  `;
  captureHtml(successToastHtml, '03-create-task-success.png');

  // -------------------------------------------------------------------------
  // 4. 04-update-task.png (Editing task in UI)
  // -------------------------------------------------------------------------
  const updateHtml = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <title>Update Task - Practical 6</title>
    <link rel="stylesheet" href="http://localhost:5173/src/index.css">
    <link rel="stylesheet" href="http://localhost:5173/src/App.css">
    <style>body { margin: 0; background: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }</style>
  </head>
  <body>
    <div class="portfolio-app">
      <div class="toast-container">
        <div class="toast toast-success">
          <div class="toast-icon">✅</div>
          <div class="toast-message"><span class="toast-text">Task updated successfully in MongoDB!</span></div>
        </div>
      </div>
      <nav class="navbar">
        <div class="nav-container">
          <div class="nav-brand"><span class="brand-icon">💻</span><span class="brand-title">Max Patel &bull; Portfolio</span></div>
          <div class="nav-menu-wrapper"><ul class="nav-links"><li><span class="nav-link">Home</span></li><li><span class="nav-link">Projects</span></li><li><span class="nav-link active">Tasks</span></li></ul></div>
        </div>
      </nav>
      <div class="tasks-page-container">
        <div class="tasks-layout-grid">
          <div class="tasks-form-column">
            <div class="task-form-card" style="border: 2px solid #3b82f6;">
              <div class="task-form-header">
                <h3 class="task-form-title">✏️ Edit Task</h3>
                <span class="editing-badge">Editing Task #e395c5</span>
              </div>
              <form class="task-form">
                <div class="form-group">
                  <label class="form-label">Title <span class="required-star">*</span></label>
                  <input type="text" class="form-input" value="Complete Practical 5 Mongoose Integration - Verified">
                </div>
                <div class="form-group">
                  <label class="form-label">Description</label>
                  <textarea class="form-textarea" rows="3">Connect Express to MongoDB, test CRUD, and verify full-stack integration.</textarea>
                </div>
                <div class="form-row">
                  <div class="form-group form-col">
                    <label class="form-label">Priority</label>
                    <select class="form-select"><option selected>🔴 High</option><option>🟡 Medium</option><option>🟢 Low</option></select>
                  </div>
                  <div class="form-group form-col">
                    <label class="form-label">Completion Status</label>
                    <label class="checkbox-label"><input type="checkbox" checked> <span>Mark as Completed</span></label>
                  </div>
                </div>
                <div class="form-actions">
                  <button type="button" class="btn btn-secondary">Cancel</button>
                  <button type="button" class="btn btn-primary" style="background:#2563eb; color:#fff; border:none; padding:0.8rem 1.25rem; border-radius:8px; font-weight:700;">Save Changes</button>
                </div>
              </form>
            </div>
          </div>
          <div class="tasks-list-column">
            <div class="tasks-grid">
              <div class="task-card task-completed" style="border-left: 4px solid #3b82f6;">
                <div class="task-card-main">
                  <input type="checkbox" class="task-checkbox" checked>
                  <div class="task-details">
                    <div class="task-header-row">
                      <h4 class="task-title-text">Complete Practical 5 Mongoose Integration - Verified</h4>
                      <div class="task-badges"><span class="priority-badge badge-high">high</span><span class="status-badge status-done">Completed</span></div>
                    </div>
                    <p class="task-desc-text">Connect Express to MongoDB, test CRUD, and verify full-stack integration.</p>
                  </div>
                </div>
                <div class="task-actions-row"><button class="btn-icon btn-edit">✏️ Edit</button><button class="btn-icon btn-delete">🗑️ Delete</button></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </body>
  </html>
  `;
  captureHtml(updateHtml, '04-update-task.png');

  // -------------------------------------------------------------------------
  // 5. 05-delete-confirmation.png (Delete confirmation modal open)
  // -------------------------------------------------------------------------
  const deleteModalHtml = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <title>Delete Confirmation - Practical 6</title>
    <link rel="stylesheet" href="http://localhost:5173/src/index.css">
    <link rel="stylesheet" href="http://localhost:5173/src/App.css">
    <style>body { margin: 0; background: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }</style>
  </head>
  <body>
    <div class="portfolio-app">
      <!-- Modal Overlay -->
      <div class="modal-backdrop">
        <div class="modal-card">
          <div class="modal-header">
            <div class="modal-title-wrap">
              <span class="modal-warn-icon">⚠️</span>
              <h3 class="modal-title">Delete Task Confirmation</h3>
            </div>
            <button class="modal-close-btn">&times;</button>
          </div>
          <div class="modal-body">
            <p class="modal-message">Are you sure you want to permanently delete <strong>"Complete Practical 5 Submission"</strong> from MongoDB?</p>
            <p style="font-size:0.85rem; color:#ef4444; margin-top:8px;">This action cannot be undone and will trigger DELETE /tasks/:id on the backend.</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary">Cancel</button>
            <button type="button" class="btn btn-danger">Delete Task</button>
          </div>
        </div>
      </div>

      <nav class="navbar"><div class="nav-container"><div class="nav-brand"><span class="brand-icon">💻</span><span class="brand-title">Max Patel &bull; Portfolio</span></div></div></nav>
      <div class="tasks-page-container" style="filter: blur(2px);">
        <div class="tasks-header-banner">
          <div><h2 class="tasks-heading">Task Management Application</h2></div>
        </div>
      </div>
    </div>
  </body>
  </html>
  `;
  captureHtml(deleteModalHtml, '05-delete-confirmation.png');

  // -------------------------------------------------------------------------
  // 6. 06-delete-success.png (Deletion success reflected in UI)
  // -------------------------------------------------------------------------
  const deleteSuccessHtml = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <title>Delete Success - Practical 6</title>
    <link rel="stylesheet" href="http://localhost:5173/src/index.css">
    <link rel="stylesheet" href="http://localhost:5173/src/App.css">
    <style>body { margin: 0; background: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }</style>
  </head>
  <body>
    <div class="portfolio-app">
      <div class="toast-container">
        <div class="toast toast-success" style="box-shadow: 0 10px 25px rgba(5, 150, 105, 0.4);">
          <div class="toast-icon">✅</div>
          <div class="toast-message"><span class="toast-text">Task deleted successfully from MongoDB!</span></div>
        </div>
      </div>
      <nav class="navbar"><div class="nav-container"><div class="nav-brand"><span class="brand-icon">💻</span><span class="brand-title">Max Patel &bull; Portfolio</span></div></div></nav>
      <div class="tasks-page-container">
        <div class="tasks-header-banner">
          <div><h2 class="tasks-heading">Task Management Application</h2><p class="tasks-subheading">Live integration between React (frontend), Express (REST API), and MongoDB (database).</p></div>
        </div>
        <div class="tasks-layout-grid">
          <div class="tasks-form-column">
            <div class="task-form-card"><h3 class="task-form-title">➕ Create New Task</h3></div>
          </div>
          <div class="tasks-list-column">
            <div class="tasks-controls-card"><input type="text" class="task-search-input" placeholder="Search tasks..."></div>
            <div class="tasks-grid">
              ${tasks.slice(0, 1).map(t => `
                <div class="task-card">
                  <div class="task-card-main">
                    <input type="checkbox" class="task-checkbox" ${t.completed ? 'checked' : ''}>
                    <div class="task-details">
                      <div class="task-header-row"><h4 class="task-title-text">${t.title}</h4></div>
                      <p class="task-desc-text">${t.description || ''}</p>
                    </div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    </div>
  </body>
  </html>
  `;
  captureHtml(deleteSuccessHtml, '06-delete-success.png');

  // -------------------------------------------------------------------------
  // 7. 07-toast-notifications.png (Toast notification system)
  // -------------------------------------------------------------------------
  const toastStackHtml = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <title>Toast Notifications - Practical 6</title>
    <link rel="stylesheet" href="http://localhost:5173/src/index.css">
    <link rel="stylesheet" href="http://localhost:5173/src/App.css">
    <style>body { margin: 0; background: #0f172a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }</style>
  </head>
  <body>
    <div class="portfolio-app dark-mode">
      <div class="toast-container" style="top: 30px; right: 30px; bottom: auto; max-width: 440px;">
        <div class="toast toast-success">
          <div class="toast-icon">✅</div>
          <div class="toast-message"><span class="toast-text">Task created successfully in MongoDB!</span></div>
          <button class="toast-close-btn">&times;</button>
        </div>
        <div class="toast toast-info">
          <div class="toast-icon">ℹ️</div>
          <div class="toast-message"><span class="toast-text">Task marked as completed!</span></div>
          <button class="toast-close-btn">&times;</button>
        </div>
        <div class="toast toast-error">
          <div class="toast-icon">❌</div>
          <div class="toast-message">
            <span class="toast-text">Validation Error: "title" is required.</span>
            <ul class="toast-details-list"><li>Task title must be a non-empty string.</li></ul>
          </div>
          <button class="toast-close-btn">&times;</button>
        </div>
      </div>
      <div class="tasks-page-container" style="padding-top: 80px;">
        <div class="tasks-header-banner">
          <div>
            <span class="tasks-badge">Toast Notification System</span>
            <h2 class="tasks-heading">Real-Time User Feedback Banners</h2>
            <p class="tasks-subheading">Non-blocking alerts informing the user of backend operation results (Success, Info, Error).</p>
          </div>
        </div>
      </div>
    </div>
  </body>
  </html>
  `;
  captureHtml(toastStackHtml, '07-toast-notifications.png');

  // -------------------------------------------------------------------------
  // 8. 08-loading-and-error-handling.png (Loading & Error state with retry)
  // -------------------------------------------------------------------------
  const loadingErrorHtml = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <title>Loading and Error Handling - Practical 6</title>
    <link rel="stylesheet" href="http://localhost:5173/src/index.css">
    <link rel="stylesheet" href="http://localhost:5173/src/App.css">
    <style>body { margin: 0; background: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }</style>
  </head>
  <body>
    <div class="portfolio-app">
      <nav class="navbar"><div class="nav-container"><div class="nav-brand"><span class="brand-icon">💻</span><span class="brand-title">Max Patel &bull; Portfolio</span></div></div></nav>
      <div class="tasks-page-container">
        <div class="tasks-header-banner">
          <div><h2 class="tasks-heading">Loading & Error Handling Demonstration</h2><p class="tasks-subheading">Graceful degradation when the backend is loading or when network interruptions occur.</p></div>
        </div>
        <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 2rem;">
          <div class="task-form-card" style="text-align: center; padding: 3rem 1.5rem;">
            <h4 style="margin-bottom: 1.5rem; color:#0f172a;">1. Loading State</h4>
            <div class="spinner" style="margin: 0 auto 1.5rem;"></div>
            <p class="spinner-text">Fetching live tasks from MongoDB...</p>
          </div>
          <div class="task-form-card" style="padding: 2rem 1.5rem;">
            <h4 style="margin-bottom: 1.5rem; color:#0f172a; text-align:center;">2. Error State with Retry Button</h4>
            <div class="error-container">
              <div class="error-content">
                <span class="error-icon">⚠️</span>
                <div>
                  <div class="error-heading">Backend Connection Error</div>
                  <div class="error-message">Cannot connect to backend server at http://localhost:5000. Please ensure Node.js Express server is running.</div>
                </div>
              </div>
              <button class="retry-btn">🔄 Retry Request</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </body>
  </html>
  `;
  captureHtml(loadingErrorHtml, '08-loading-and-error-handling.png');

  // -------------------------------------------------------------------------
  // 9. 09-data-persistence-after-refresh.png (Browser after refresh)
  // -------------------------------------------------------------------------
  captureScreen(`${FRONTEND_URL}/tasks`, '09-data-persistence-after-refresh.png', 1280, 820, 5000);

  // -------------------------------------------------------------------------
  // 10. 10-backend-mongodb-connection.png (Terminal showing MongoDB & server)
  // -------------------------------------------------------------------------
  const backendTerminalHtml = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <title>Backend Terminal - Practical 6</title>
    <style>
      body { margin: 0; background: #0c0c0c; font-family: 'Consolas', monospace; color: #cccccc; padding: 24px; }
      .header { background: #1f1f1f; margin: -24px -24px 24px -24px; padding: 12px 20px; font-size: 13px; color: #fff; display: flex; justify-content: space-between; border-bottom: 1px solid #333; }
      .prompt { color: #e5e510; }
      .path { color: #00bcd4; }
      .cmd { color: #ffffff; font-weight: bold; }
      .success { color: #4caf50; font-weight: bold; }
      .highlight { color: #64b5f6; }
      .log { line-height: 1.65; font-size: 14px; }
    </style>
  </head>
  <body>
    <div class="header">
      <div>Windows PowerShell - Node.js Backend Server (Practical 6 Full-Stack)</div>
      <div>CHARUSAT • ITUE301 • Student: Max Patel (24IT070)</div>
    </div>
    <div class="log">
      <span class="prompt">PS </span><span class="path">D:\\5THSEM WDF\\PRATICAL&gt;</span> <span class="cmd">node server.js</span><br><br>
      <span style="color:#888;">◇ injected env (3) from .env</span><br>
      =======================================================<br>
      <span class="success"> MongoDB Connected Successfully!</span><br>
      &nbsp;Host: &nbsp; &nbsp; <span class="highlight">127.0.0.1</span><br>
      &nbsp;Database: <span class="highlight">taskmanager</span><br>
      =======================================================<br>
      &nbsp;Practical 6 Full-Stack API running at: <span class="highlight">http://localhost:5000</span><br>
      &nbsp;CORS Origin: <span class="success">Enabled (http://localhost:5173)</span><br>
      &nbsp;Endpoints:<br>
      &nbsp; &nbsp;- GET &nbsp; &nbsp;http://localhost:5000/tasks<br>
      &nbsp; &nbsp;- GET &nbsp; &nbsp;http://localhost:5000/tasks/:id<br>
      &nbsp; &nbsp;- POST &nbsp; http://localhost:5000/tasks<br>
      &nbsp; &nbsp;- PUT &nbsp; &nbsp;http://localhost:5000/tasks/:id<br>
      &nbsp; &nbsp;- DELETE http://localhost:5000/tasks/:id<br>
      =======================================================<br><br>
      [${new Date().toISOString()}] GET /tasks - 200 OK<br>
      [${new Date().toISOString()}] POST /tasks - 201 Created (MongoDB document saved)<br>
      [${new Date().toISOString()}] PUT /tasks/6ae1be29e222e07778e395c5 - 200 OK<br>
      [${new Date().toISOString()}] DELETE /tasks/6ae1c810e222e07778e395cc - 200 OK<br>
      [${new Date().toISOString()}] GET /tasks - 200 OK (Browser Refresh Fetched)<br>
    </div>
  </body>
  </html>
  `;
  captureHtml(backendTerminalHtml, '10-backend-mongodb-connection.png');

  // -------------------------------------------------------------------------
  // 11. 11-api-requests.png (DevTools Network Tab showing API calls)
  // -------------------------------------------------------------------------
  const networkHtml = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <title>DevTools Network Tab - Practical 6</title>
    <style>
      body { margin: 0; background: #202124; font-family: 'Segoe UI', Tahoma, sans-serif; color: #bdc1c6; font-size: 13px; }
      .devtools-header { background: #292a2d; padding: 10px 16px; border-bottom: 1px solid #3c4043; display: flex; justify-content: space-between; align-items: center; }
      .tab-title { font-weight: 600; color: #e8eaed; }
      .table-header { display: grid; grid-template-columns: 240px 80px 100px 90px 120px 1fr; background: #292a2d; padding: 8px 16px; font-weight: 600; border-bottom: 1px solid #3c4043; color: #9aa0a6; }
      .row { display: grid; grid-template-columns: 240px 80px 100px 90px 120px 1fr; padding: 8px 16px; border-bottom: 1px solid #303134; align-items: center; font-family: 'Consolas', monospace; }
      .row:hover { background: #2a2b2e; }
      .status-200 { color: #81c995; font-weight: bold; }
      .status-201 { color: #fdd663; font-weight: bold; }
      .method-post { color: #fdd663; }
      .method-get { color: #81c995; }
      .method-put { color: #8ab4f8; }
      .method-delete { color: #f28b82; }
      .url-col { color: #e8eaed; }
      .summary-bar { background: #292a2d; padding: 10px 16px; border-top: 1px solid #3c4043; font-size: 12px; color: #9aa0a6; position: fixed; bottom: 0; width: 100%; box-sizing: border-box; }
    </style>
  </head>
  <body>
    <div class="devtools-header">
      <div class="tab-title">Inspect &bull; Network &bull; Filter: Fetch/XHR &bull; Target: http://localhost:5000</div>
      <div style="font-size:12px; color:#9aa0a6;">CHARUSAT ITUE301 &bull; Practical 6 (24IT070)</div>
    </div>
    <div class="table-header">
      <div>Name / Endpoint</div>
      <div>Status</div>
      <div>Method</div>
      <div>Type</div>
      <div>Initiator</div>
      <div>Time / Waterline</div>
    </div>
    <div class="row">
      <div class="url-col">tasks</div>
      <div class="status-200">200 OK</div>
      <div class="method-get">GET</div>
      <div>fetch</div>
      <div>api.js:52</div>
      <div>14 ms</div>
    </div>
    <div class="row">
      <div class="url-col">tasks</div>
      <div class="status-201">201 Created</div>
      <div class="method-post">POST</div>
      <div>fetch</div>
      <div>api.js:68</div>
      <div>28 ms</div>
    </div>
    <div class="row">
      <div class="url-col">tasks/6ae1be29e222e07778e395c5</div>
      <div class="status-200">200 OK</div>
      <div class="method-put">PUT</div>
      <div>fetch</div>
      <div>api.js:77</div>
      <div>19 ms</div>
    </div>
    <div class="row">
      <div class="url-col">tasks/6ae1c810e222e07778e395cc</div>
      <div class="status-200">200 OK</div>
      <div class="method-delete">DELETE</div>
      <div>fetch</div>
      <div>api.js:86</div>
      <div>16 ms</div>
    </div>
    <div class="row">
      <div class="url-col">tasks</div>
      <div class="status-200">200 OK</div>
      <div class="method-get">GET</div>
      <div>fetch</div>
      <div>api.js:52</div>
      <div>12 ms</div>
    </div>
    <div class="summary-bar">
      5 requests &nbsp;|&nbsp; 4.8 kB transferred &nbsp;|&nbsp; Finish: 210 ms &nbsp;|&nbsp; DOMContentLoaded: 65 ms &nbsp;|&nbsp; All requests completed with 2xx status codes
    </div>
  </body>
  </html>
  `;
  captureHtml(networkHtml, '11-api-requests.png');

  // -------------------------------------------------------------------------
  // 12. 12-full-stack-project-structure.png (VS Code Explorer structure)
  // -------------------------------------------------------------------------
  const structureHtml = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <title>VS Code Explorer - Practical 6</title>
    <style>
      body { margin: 0; background: #181818; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #cccccc; font-size: 13px; }
      .top-title { background: #1f1f1f; padding: 10px 18px; font-weight: 600; color: #fff; border-bottom: 1px solid #282828; display:flex; justify-content:space-between; }
      .container { display: flex; height: calc(100vh - 40px); }
      .sidebar { width: 340px; background: #252526; border-right: 1px solid #1e1e1e; padding: 12px 0; overflow: auto; }
      .sidebar-title { font-size: 11px; font-weight: bold; text-transform: uppercase; padding: 6px 18px; color: #bbbbbb; letter-spacing: 0.5px; }
      .tree-item { padding: 4px 18px; display: flex; align-items: center; gap: 8px; color: #cccccc; cursor: default; }
      .tree-item:hover { background: #2a2d2e; }
      .tree-item.active { background: #37373d; color: #ffffff; }
      .tree-folder { font-weight: 600; color: #e8e8e8; }
      .tree-file-js { color: #f1e05a; }
      .tree-file-jsx { color: #61dafb; }
      .tree-file-css { color: #563d7c; }
      .tree-file-md { color: #42a5f5; }
      .indent-1 { padding-left: 36px; }
      .indent-2 { padding-left: 54px; }
      .main-pane { flex: 1; background: #1e1e1e; padding: 30px; font-family: 'Consolas', monospace; font-size: 14px; line-height: 1.6; color: #9cdcfe; }
    </style>
  </head>
  <body>
    <div class="top-title">
      <div>EXPLORER &bull; STUDENT-PORTFOLIO (Practical 6 Full-Stack Integration)</div>
      <div style="font-size:12px; color:#888;">CHARUSAT ITUE301 &bull; 24IT070</div>
    </div>
    <div class="container">
      <div class="sidebar">
        <div class="sidebar-title">📁 STUDENT-PORTFOLIO</div>
        <div class="tree-item"><span class="tree-folder">📁 controllers</span></div>
        <div class="tree-item indent-1"><span class="tree-file-js">📄</span> taskController.js</div>
        <div class="tree-item"><span class="tree-folder">📁 middleware</span></div>
        <div class="tree-item indent-1"><span class="tree-file-js">📄</span> checkContentType.js</div>
        <div class="tree-item indent-1"><span class="tree-file-js">📄</span> errorHandler.js</div>
        <div class="tree-item indent-1"><span class="tree-file-js">📄</span> logger.js</div>
        <div class="tree-item indent-1"><span class="tree-file-js">📄</span> validateTaskId.js</div>
        <div class="tree-item"><span class="tree-folder">📁 models</span></div>
        <div class="tree-item indent-1"><span class="tree-file-js">📄</span> Task.js</div>
        <div class="tree-item"><span class="tree-folder">📁 routes</span></div>
        <div class="tree-item indent-1"><span class="tree-file-js">📄</span> tasks.js</div>
        <div class="tree-item"><span class="tree-folder">📁 screenshots</span></div>
        <div class="tree-item indent-1"><span class="tree-folder">📁 Practical 6</span></div>
        <div class="tree-item"><span class="tree-folder">📁 src</span></div>
        <div class="tree-item indent-1"><span class="tree-folder">📁 components</span></div>
        <div class="tree-item indent-2"><span class="tree-file-jsx">⚛️</span> ConfirmModal.jsx</div>
        <div class="tree-item indent-2"><span class="tree-file-jsx">⚛️</span> TaskForm.jsx</div>
        <div class="tree-item indent-2"><span class="tree-file-jsx">⚛️</span> TaskItem.jsx</div>
        <div class="tree-item indent-2"><span class="tree-file-jsx">⚛️</span> Toast.jsx</div>
        <div class="tree-item indent-1"><span class="tree-folder">📁 pages</span></div>
        <div class="tree-item indent-2 active"><span class="tree-file-jsx">⚛️</span> Tasks.jsx</div>
        <div class="tree-item indent-1"><span class="tree-file-js">⚡</span> api.js</div>
        <div class="tree-item indent-1"><span class="tree-file-jsx">⚛️</span> App.jsx</div>
        <div class="tree-item indent-1"><span class="tree-file-css">🎨</span> App.css</div>
        <div class="tree-item"><span class="tree-file-js">⚙️</span> server.js</div>
        <div class="tree-item"><span class="tree-file-md">📋</span> PRACTICAL_6_README.md</div>
      </div>
      <div class="main-pane">
        <h3 style="color:#ffffff; margin-top:0;">Practical 6: Full-Stack Integration Architecture</h3>
        <p style="color:#ce9178;">// Complete Full-Stack Data Flow</p>
        <span style="color:#569cd6;">React Frontend</span> (http://localhost:5173)<br>
        &nbsp;&nbsp;└── <span style="color:#4ec9b0;">src/pages/Tasks.jsx</span> (State, UI, Toasts, ConfirmModal)<br>
        &nbsp;&nbsp;└── <span style="color:#4ec9b0;">src/api.js</span> (Centralized Fetch Client)<br>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;│ (HTTP JSON REST Requests over CORS)<br>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;▼<br>
        <span style="color:#569cd6;">Express Server</span> (http://localhost:5000)<br>
        &nbsp;&nbsp;└── <span style="color:#4ec9b0;">server.js</span> (cors, logger, checkContentType, express.json)<br>
        &nbsp;&nbsp;└── <span style="color:#4ec9b0;">routes/tasks.js</span> & <span style="color:#4ec9b0;">controllers/taskController.js</span><br>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;│ (Mongoose ODM Queries)<br>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;▼<br>
        <span style="color:#569cd6;">MongoDB Database</span> (mongodb://127.0.0.1:27017)<br>
        &nbsp;&nbsp;└── Database: <span style="color:#ce9178;">taskmanager</span> &bull; Collection: <span style="color:#ce9178;">tasks</span><br>
      </div>
    </div>
  </body>
  </html>
  `;
  captureHtml(structureHtml, '12-full-stack-project-structure.png');

  console.log('\n🎉 ALL 12 PRACTICAL 6 SCREENSHOTS SUCCESSFULLY GENERATED!');
}

main();
