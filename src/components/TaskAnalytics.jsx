// =============================================================================
// Practical 8: Performance Optimization and Lazy Loading in React
// File: src/components/TaskAnalytics.jsx
// Description: Heavy analytical and metric visualization component lazy-loaded
//              via React.lazy() and Suspense inside the Tasks management dashboard.
//              Optimized with React.memo to eliminate avoidable re-renders.
// =============================================================================

import React, { memo } from 'react';

function TaskAnalytics({ tasks = [] }) {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.completed).length;
  const pendingTasks = totalTasks - completedTasks;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const highPriority = tasks.filter((t) => (t.priority || '').toLowerCase() === 'high').length;
  const mediumPriority = tasks.filter((t) => (t.priority || '').toLowerCase() === 'medium').length;
  const lowPriority = tasks.filter((t) => (t.priority || '').toLowerCase() === 'low').length;

  const highPercent = totalTasks > 0 ? Math.round((highPriority / totalTasks) * 100) : 0;
  const mediumPercent = totalTasks > 0 ? Math.round((mediumPriority / totalTasks) * 100) : 0;
  const lowPercent = totalTasks > 0 ? Math.round((lowPriority / totalTasks) * 100) : 0;

  let productivityStatus = 'Getting Started';
  let statusBadgeClass = 'status-neutral';
  if (completionRate >= 80) {
    productivityStatus = 'Outstanding Velocity';
    statusBadgeClass = 'status-high';
  } else if (completionRate >= 50) {
    productivityStatus = 'Healthy Progress';
    statusBadgeClass = 'status-medium';
  } else if (totalTasks > 0) {
    productivityStatus = 'Action Required';
    statusBadgeClass = 'status-low';
  }

  return (
    <div className="task-analytics-card" aria-label="Task Analytics and Performance Metrics">
      <div className="analytics-header">
        <div className="analytics-title-group">
          <span className="analytics-icon" aria-hidden="true">📊</span>
          <div>
            <h3 className="analytics-heading">Task Analytics &amp; Productivity Insights</h3>
            <p className="analytics-caption">
              Practical 8 Lazy-Loaded Heavy Component &bull; Computed on-demand from MongoDB tasks
            </p>
          </div>
        </div>
        <div className={`analytics-badge ${statusBadgeClass}`}>
          {productivityStatus} ({completionRate}%)
        </div>
      </div>

      {/* KPI Metrics Cards */}
      <div className="analytics-kpi-grid">
        <div className="kpi-item">
          <span className="kpi-label">Total Assigned</span>
          <span className="kpi-value text-blue">{totalTasks}</span>
          <span className="kpi-sub">Total database records</span>
        </div>
        <div className="kpi-item">
          <span className="kpi-label">Completed</span>
          <span className="kpi-value text-green">{completedTasks}</span>
          <span className="kpi-sub">{completionRate}% fulfillment</span>
        </div>
        <div className="kpi-item">
          <span className="kpi-label">Incomplete</span>
          <span className="kpi-value text-amber">{pendingTasks}</span>
          <span className="kpi-sub">Pending user action</span>
        </div>
        <div className="kpi-item">
          <span className="kpi-label">Urgent Priority</span>
          <span className="kpi-value text-red">{highPriority}</span>
          <span className="kpi-sub">{highPercent}% of total volume</span>
        </div>
      </div>

      {/* Progress & Distribution Bars */}
      <div className="analytics-bars-section">
        <div className="bar-group">
          <div className="bar-label-row">
            <span>Overall Task Completion Rate</span>
            <strong>{completionRate}%</strong>
          </div>
          <div className="progress-track" role="progressbar" aria-valuenow={completionRate} aria-valuemin="0" aria-valuemax="100">
            <div
              className="progress-fill progress-green"
              style={{ width: `${completionRate}%` }}
            ></div>
          </div>
        </div>

        <div className="priority-distribution-block">
          <span className="distribution-title">Priority Breakdown:</span>
          <div className="distribution-chips">
            <span className="dist-chip chip-high">
              🔴 High: {highPriority} ({highPercent}%)
            </span>
            <span className="dist-chip chip-medium">
              🟡 Medium: {mediumPriority} ({mediumPercent}%)
            </span>
            <span className="dist-chip chip-low">
              🟢 Low: {lowPriority} ({lowPercent}%)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// React.memo optimization: Prevents unnecessary re-renders when parent states
// (e.g. search input, delete modal) change without altering task data.
export default memo(TaskAnalytics);
