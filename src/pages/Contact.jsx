// =============================================================================
// Practical 2: React State Management and Multi-Page Navigation
// File: src/pages/Contact.jsx
// Description: Contact page route (/contact) demonstrating React state management
//              with useState: controlled input, live message preview,
//              character counter, clear action, and visibility toggle for help message.
// =============================================================================

import { useState } from 'react';

function Contact() {
  // State 1: Controlled input for user message
  const [message, setMessage] = useState('');

  // State 2: Visibility toggle for help instructions box
  const [showHelp, setShowHelp] = useState(false);

  // Optional contact details for complete form presentation
  const [senderName, setSenderName] = useState('');
  const [senderEmail, setSenderEmail] = useState('');

  // Handle form submission
  function handleSubmit(e) {
    e.preventDefault();
    if (!message.trim()) {
      alert('Please enter a message before submitting.');
      return;
    }
    alert(`Thank you, ${senderName || 'Student'}! Your message has been submitted.`);
    setMessage('');
    setSenderName('');
    setSenderEmail('');
  }

  // Handle clear button click
  function handleClear() {
    setMessage('');
  }

  return (
    <div className="page-container contact-page">
      <div className="page-header">
        <div className="page-badge">Practical 2 &bull; React State Management</div>
        <h1 className="page-title">Contact Me</h1>
        <p className="page-subtitle">
          Have a question or feedback? Type a message using this interactive React controlled form.
        </p>
      </div>

      {/* State 2 Demo: Help button toggles showHelp boolean */}
      <div className="help-toggle-wrapper">
        <button
          type="button"
          className="btn-help"
          onClick={() => setShowHelp(!showHelp)}
        >
          {showHelp ? '❌ Hide Help Guidelines' : '💡 Show Help Guidelines'}
        </button>

        {showHelp && (
          <div className="help-box" role="region" aria-label="Help Instructions">
            <h4 className="help-heading">Form Usage Instructions:</h4>
            <ul className="help-list">
              <li>This form demonstrates <strong>controlled inputs</strong> using React's <code>useState</code> hook.</li>
              <li>Every character you type triggers an <code>onChange</code> event, immediately updating the component state.</li>
              <li>Notice the <strong>live character count</strong> and <strong>live preview</strong> dynamically updating below.</li>
              <li>Click the <strong>Clear Message</strong> button to reset the message state to an empty string.</li>
            </ul>
          </div>
        )}
      </div>

      <div className="contact-layout">
        {/* Contact Form with Controlled Input */}
        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="sender-name" className="form-label">Your Name</label>
            <input
              id="sender-name"
              type="text"
              className="form-input"
              placeholder="e.g. Max Patel"
              value={senderName}
              onChange={(e) => setSenderName(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="sender-email" className="form-label">Your College Email</label>
            <input
              id="sender-email"
              type="email"
              className="form-input"
              placeholder="e.g. 24it070@charusat.edu.in"
              value={senderEmail}
              onChange={(e) => setSenderEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <div className="label-with-counter">
              <label htmlFor="message-input" className="form-label">Your Message *</label>
              <span className="char-count-badge">
                Character Count: <strong>{message.length}</strong>
              </span>
            </div>

            {/* Main Controlled Input */}
            <textarea
              id="message-input"
              className="form-textarea"
              rows="5"
              placeholder="Enter your message here... Type to see the live preview below!"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-submit">
              Submit Message
            </button>
            <button
              type="button"
              className="btn-clear"
              onClick={handleClear}
              disabled={message.length === 0}
            >
              Clear Message
            </button>
          </div>
        </form>

        {/* Live Display of Entered Message Requirement */}
        <div className="live-preview-panel">
          <div className="preview-header">
            <h3 className="preview-title">🔴 Live Message Preview</h3>
            <span className="badge-live">Real-Time State</span>
          </div>

          <div className="preview-content">
            {message.trim() ? (
              <p className="preview-text">{message}</p>
            ) : (
              <p className="preview-placeholder">
                Your message will appear here in real time as you type above...
              </p>
            )}
          </div>

          <div className="preview-footer">
            <span>Characters: <strong>{message.length}</strong></span>
            <span>Words: <strong>{message.trim() ? message.trim().split(/\s+/).length : 0}</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;
