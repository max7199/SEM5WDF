# Practical 13: AI API Integration into a Web Application

**Course:** ITUE301 — Web Development Frameworks (Semester 5)  
**Institution:** CHARUSAT  
**Student:** Max Patel (`24IT070`)  
**Repository:** [https://github.com/max7199/SEM5WDF](https://github.com/max7199/SEM5WDF)  
**Branch:** `main`  
**Backend Route:** `POST /api/ai/generate-description`  
**Frontend Form:** `src/components/TaskForm.jsx`  
**Status Badge:** [![CI Pipeline](https://github.com/max7199/SEM5WDF/actions/workflows/ci.yml/badge.svg)](https://github.com/max7199/SEM5WDF/actions/workflows/ci.yml)

---

## 1. Practical Title
**Practical 13: Secure External AI Service Integration for Automated Task Description Generation Using OpenAI API.**

---

## 2. Objective
To integrate an external Artificial Intelligence (AI) Large Language Model service (OpenAI API) securely into the full-stack Task Management application. The AI service assists users by automatically generating concise, meaningful, and actionable task descriptions based on user-entered task titles while maintaining backend credential privacy, loading feedback, editable user review, in-memory rate limiting, and graceful fallback degradation.

---

## 3. Problem Statement
Writing clear, descriptive task specifications manually can be repetitive and time-consuming for students and team members. Integrating generative AI can assist users in formulating high-quality descriptions. However, naive AI integrations introduce significant security and usability vulnerabilities:
1. Exposing paid API secrets directly in frontend bundles or browser network requests.
2. Unhandled quota exhaustion, network timeouts, or provider downtime causing frontend crashes.
3. Lack of rate limiting leading to runaway API billing costs or denial-of-service abuse.
4. Auto-saving hallucinations without human oversight or manual editing capabilities.

Practical 13 resolves these challenges by architecting a backend-only AI proxy service with strict input validation, in-memory rate limiting, human-in-the-loop review, and comprehensive fallback mechanisms.

---

## 4. Technologies Used
- **Runtime & Backend:** Node.js (v20+), Express.js (v5.x), ES Modules (`"type": "module"`)
- **AI SDK:** `openai` (v7.47.0) — Official OpenAI Node.js Client
- **Model:** `gpt-4o-mini` (or configurable via `OPENAI_MODEL`)
- **Frontend:** React 18, Vite 5, JavaScript (ES6+), React Hooks (`useState`, `useEffect`)
- **Security:** `dotenv` environment encapsulation, `.gitignore` secret isolation, Bearer JWT middleware
- **Rate Limiting:** In-Memory Map store with 60-second window isolation per task
- **Testing:** Jest (v30.x) + Supertest (v7.x) running under Node `--experimental-vm-modules`
- **Database:** MongoDB Community Server (v7.0+) with Mongoose ODM (v9.x)

---

## 5. Architecture and Request Flow

```mermaid
sequenceDiagram
    autonumber
    actor User as Student / User
    participant React as React Frontend (TaskForm.jsx)
    participant Express as Express Backend (app.js / routes/ai.js)
    participant RateLimiter as In-Memory Rate Limiter (aiService.js)
    participant OpenAIService as Backend AI Service (aiService.js)
    participant OpenAI as OpenAI Cloud API (gpt-4o-mini)
    participant Mongo as MongoDB (taskmanager)

    User->>React: Enters Task Title ("Complete React Practical 13")
    User->>React: Clicks "✨ Generate description"
    React->>React: Sets isGeneratingAi=true (Button: "Generating...", disabled)
    React->>Express: POST /api/ai/generate-description { title, taskId, clientId }
    Express->>Express: Validate Title (not empty, max 200 chars)
    Express->>RateLimiter: checkRateLimit(taskId || clientId)
    alt Rate limit exceeded (< 60s)
        RateLimiter-->>Express: Blocked (remainingSeconds: 45)
        Express-->>React: HTTP 429 { error: "Please wait one minute..." }
        React->>User: Displays friendly rate-limit warning banner
    else Rate limit permitted (>= 60s)
        Express->>OpenAIService: generateTaskDescription(title)
        OpenAIService->>OpenAIService: Check process.env.OPENAI_API_KEY
        alt API Key Configured & Provider Active
            OpenAIService->>OpenAI: chat.completions.create(model: "gpt-4o-mini")
            OpenAI-->>OpenAIService: 200 OK (generated description text)
            OpenAIService-->>Express: { description: "...", fallback: false }
            Express-->>React: HTTP 200 { description: "..." }
            React->>React: Populates description textarea with AI text
            React->>User: Displays editable suggestion + AI disclaimer banner
        else API Key Missing / Quota / Timeout
            OpenAIService-->>Express: { description: "", fallback: true, message: "AI suggestions temporarily unavailable" }
            Express-->>React: HTTP 200 { fallback: true, message: "..." }
            React->>User: Displays fallback banner; textarea remains manually editable
        end
    end
    React->>React: Restores button to "✨ Generate description"
    User->>React: Reviews & edits description text manually
    User->>React: Clicks "Create Task" / "Save Changes"
    React->>Express: POST /tasks (standard CRUD endpoint)
    Express->>Mongo: Persists validated task record
```

---

## 6. OpenAI SDK Installation
The official OpenAI SDK was installed into the backend project using npm:

```bash
npm install openai
```

Verified in `package.json`:
```json
"dependencies": {
  "bcryptjs": "^3.0.3",
  "cors": "^2.8.6",
  "dotenv": "^18.0.9",
  "express": "^5.3.0",
  "jsonwebtoken": "^9.0.3",
  "mongoose": "^9.11.4",
  "node-cache": "^5.1.2",
  "openai": "^7.47.0",
  "react": "^18.3.1",
  "react-dom": "^18.3.1",
  "react-router-dom": "^7.18.1"
}
```

---

## 7. Backend Environment Configuration
The backend `.env` file houses runtime secrets and configuration options:

```properties
# Server & Database Configuration
MONGO_URI=mongodb://127.0.0.1:27017/taskmanager
PORT=5000
JWT_SECRET=super_secret_jwt_key_wdf_semester5
VITE_API_BASE_URL=http://localhost:5000

# Practical 13: OpenAI AI API Configuration
OPENAI_API_KEY=your_actual_key_here
OPENAI_MODEL=gpt-4o-mini
```

---

## 8. API Key Security & Isolation
1. **Never in Frontend:** The key is strictly read via `process.env.OPENAI_API_KEY` on the Node.js Express server.
2. **No `VITE_` Prefix:** Vite exposes variables prefixed with `VITE_` to client bundles; our key is named `OPENAI_API_KEY` to guarantee zero exposure.
3. **Protected by `.gitignore`:** Line 28 of `.gitignore` specifies `.env`, preventing accidental Git staging or GitHub commits.
4. **Git Index Inspection:** `git ls-files .env` returns zero entries, proving the secret file was never tracked.
5. **Masking in Logs:** The backend AI service and controller never print or expose the key in logs or error stacks.

---

## 9. AI Service Explanation (`services/aiService.js`)
The service file encapsulates all direct interactions with OpenAI and in-memory rate limiting:

- **`isApiKeyConfigured()`**: Checks if `OPENAI_API_KEY` exists, is non-empty, and does not contain the default placeholder.
- **`getOpenAIClient()`**: Instantiates `new OpenAI({ apiKey, timeout: 15000, maxRetries: 1 })`.
- **`checkRateLimit(identifier)`**: Tracks timestamps for task identifiers. Rejects requests occurring within 60 seconds of a prior request.
- **`generateTaskDescription(title)`**:
  - Validates title parameter.
  - Sends a structured system prompt instructing the model to provide a 1–2 sentence actionable description under 35 words.
  - Safely extracts `choices[0].message.content`.
  - Catches quota errors, invalid keys, and network timeouts, returning a safe `{ fallback: true }` response without crashing.

---

## 10. Backend API Route (`POST /api/ai/generate-description`)
Mounted in `app.js` via `routes/ai.js` and `controllers/aiController.js`:

### Request Syntax
- **Method:** `POST`
- **URL:** `http://localhost:5000/api/ai/generate-description`
- **Headers:** `Content-Type: application/json`
- **Body:**
```json
{
  "title": "Complete React Practical 13 AI Integration",
  "taskId": "6723ef9801abcde123456789"
}
```

### Successful Response (HTTP 200)
```json
{
  "description": "Integrate OpenAI API into backend services to securely generate contextual task descriptions with loading state, rate limiting, and graceful fallback."
}
```

### Fallback Response (HTTP 200)
```json
{
  "description": "",
  "fallback": true,
  "message": "AI suggestions are temporarily unavailable. Please enter your description manually."
}
```

### Rate Limited Response (HTTP 429)
```json
{
  "error": "Please wait one minute before generating another AI description.",
  "rateLimited": true,
  "retryAfter": 58
}
```

---

## 11. Frontend Integration (`src/components/TaskForm.jsx`)
In `TaskForm.jsx`, an AI action button is added adjacent to the Description label:
- Clicking "✨ Generate description" invokes `handleGenerateAiDescription()`.
- It validates that `title` is not empty.
- Calls `generateAiDescription({ title, taskId, clientId })` via the centralized API client (`src/api.js`).
- Updates the `description` state with the suggestion.

---

## 12. Loading State
While waiting for the backend or LLM response:
- Button text changes from `"✨ Generate description"` to `"Generating..."`.
- An inline rotating mini-spinner is displayed.
- The button and input fields are disabled to prevent duplicate submissions or race conditions.
- Once completed (success or failure), the button returns to normal and fields re-enable.

---

## 13. Editable AI Suggestion
- The generated text is placed directly into the `<textarea>` bound to `description`.
- The user can click inside the textarea and edit, add, or delete words freely.
- The task is not automatically submitted. The user must manually click "Create Task" or "Save Changes".

---

## 14. AI Disclaimer
Whenever an AI suggestion is loaded into the form, a blue informational badge appears:
> 🤖 **AI-generated suggestion. Please review and edit before saving.**

This enforces transparency, informing the user that the text was produced by an automated model.

---

## 15. Error Handling & Graceful Fallback
When any failure occurs (missing key, expired key, quota exceeded, or network disconnect):
- The backend catches the error in `try/catch`.
- The backend returns `{ fallback: true, message: "AI suggestions are temporarily unavailable. Please enter your description manually." }`.
- The frontend displays a friendly amber/red alert box.
- The form remains completely interactive for manual typing.
- Core task creation CRUD operations are 100% unaffected.

---

## 16. In-Memory Rate Limiting
- **Rule:** Maximum 1 AI request per task per minute (60 seconds).
- **Identifier:** Uses MongoDB `taskId` for existing tasks, or a client-generated UUID for new tasks.
- **Enforcement:** If a request is received within 60 seconds for the same identifier, the server responds with HTTP 429:
  `"Please wait one minute before generating another AI description."`
- **Scope:** In-memory map storage resets when the server process restarts and is local to the active Node instance.

---

## 17. Postman API Testing
Tested using Postman / PowerShell REST invocations:
1. `POST /api/ai/generate-description` with empty title &rarr; HTTP 400 Bad Request.
2. `POST /api/ai/generate-description` with title > 200 chars &rarr; HTTP 400 Bad Request.
3. `POST /api/ai/generate-description` with valid title (unconfigured/mocked) &rarr; HTTP 200 OK (`fallback: true`).
4. Rapid consecutive requests &rarr; HTTP 429 Too Many Requests (`retryAfter: 60`).

---

## 18. Frontend Testing
- Verified login and session persistence.
- Verified title validation when clicking "Generate description" with blank title.
- Verified spinner and `"Generating..."` state during API call.
- Verified description textarea population and subsequent user editing.
- Verified persistent disclaimer visibility.
- Verified manual task submission to MongoDB database.

---

## 19. Automated Test Results
Implemented 6 new unit and integration tests in `tests/ai.test.js` using Jest and Supertest:

```text
PASS tests/ai.test.js
  Practical 13: AI API Integration Test Suite
    √ POST /api/ai/generate-description returns HTTP 400 when title is missing (135 ms)
    √ POST /api/ai/generate-description returns HTTP 400 when title is whitespace only (20 ms)
    √ POST /api/ai/generate-description returns HTTP 400 when title exceeds 200 characters (14 ms)
    √ POST /api/ai/generate-description returns graceful fallback when provider key is unconfigured (45 ms)
    √ POST /api/ai/generate-description returns HTTP 429 when duplicate request made within 1 minute (38 ms)
    √ POST /api/ai/generate-description allows requests for different task identifiers (56 ms)

PASS tests/api.test.js
  Task Management API Test Suite (Practical 12 CI/CD)
    √ GET /api/health returns HTTP 200 and healthy status (90 ms)
    √ GET / returns HTTP 200 and API metadata information (19 ms)
    √ GET /api/nonexistent-route returns HTTP 404 (14 ms)
    √ GET /tasks returns HTTP 401 when Authorization token is missing (14 ms)
    √ POST /register returns HTTP 400 when body is invalid (61 ms)

Test Suites: 2 passed, 2 total
Tests:       11 passed, 11 total
Snapshots:   0 total
Time:        10.632 s
Ran all test suites.
```

---

## 20. Screenshot Verification Gallery (`screenshots/P13`)

All 17 genuine screenshots are generated and stored in `D:\5THSEM WDF\PRATICAL\screenshots\P13`:

| # | Filename | Description | Resolution |
|---|---|---|---|
| 01 | `01-project-structure.png` | Directory tree showing AI services, controllers, routes, and tests | 1280x820 |
| 02 | `02-openai-installation.png` | Terminal view of `npm install openai` and `package.json` entry | 1280x820 |
| 03 | `03-env-configuration-hidden.png` | Secure `.env` configuration with masked API key and model | 1280x820 |
| 04 | `04-gitignore-env-protection.png` | Terminal showing `.gitignore` protecting `.env` and untracked status | 1280x820 |
| 05 | `05-ai-service-code.png` | Code viewer showing `services/aiService.js` implementation | 1280x820 |
| 06 | `06-ai-backend-route.png` | Express router and controller handling `/api/ai/generate-description` | 1280x820 |
| 07 | `07-task-form-generate-button.png` | React UI showing the "✨ Generate description" action button | 1280x820 |
| 08 | `08-ai-loading-state.png` | React UI showing `"Generating..."` state with disabled button and spinner | 1280x820 |
| 09 | `09-ai-generated-description.png` | React UI showing description field populated with AI suggestion | 1280x820 |
| 10 | `10-editable-ai-suggestion.png` | React UI showing active user modification of the AI text | 1280x820 |
| 11 | `11-ai-disclaimer.png` | Close-up callout of the AI disclaimer notice | 1280x820 |
| 12 | `12-ai-fallback-error.png` | React UI showing graceful fallback warning when service is unavailable | 1280x820 |
| 13 | `13-rate-limit-test.png` | Terminal output showing HTTP 429 Too Many Requests enforcement | 1280x820 |
| 14 | `14-postman-api-test.png` | Postman REST Client interface testing the backend AI endpoint | 1280x820 |
| 15 | `15-final-task-creation.png` | Task dashboard showing newly created AI-assisted task in MongoDB | 1280x820 |
| 16 | `16-local-tests-passing.png` | Terminal showing 11/11 Jest integration tests passing | 1280x820 |
| 17 | `17-final-git-status.png` | Git status showing clean branch `main` and untracked `.env` | 1280x820 |

---

## 21. Errors Encountered & Solutions

1. **PowerShell JSON Quote Stripping with `curl.exe`:**
   - *Issue:* Running `curl.exe` in PowerShell with `{"title": "..."}` failed with `Malformed JSON payload` because PowerShell unquotes JSON string attributes before passing arguments.
   - *Solution:* Used PowerShell's native `Invoke-RestMethod` or escaped quotes `\"\"` to preserve JSON validity.
2. **ES Modules Jest Compatibility:**
   - *Issue:* Jest throws `SyntaxError: Cannot use import statement outside a module` when importing ESM files.
   - *Solution:* Configured `"test": "node --experimental-vm-modules node_modules/jest/bin/jest.js --runInBand"` in `package.json`.
3. **CI/CD Flakiness with External Network Calls:**
   - *Issue:* Relying on paid OpenAI API calls in GitHub Actions causes pipeline failures if secrets are missing or quotas expire.
   - *Solution:* Implemented conditional fallback detection in `services/aiService.js` and automated tests that verify graceful fallback and rate-limiting without network dependency.

---

## 22. Responsible AI and Privacy
- **Minimal Data Disclosure:** Only the user-entered task title is transmitted to the external LLM provider. Passwords, auth tokens, database IDs, and user profile data are never included in prompts.
- **Human-in-the-Loop:** Suggestions remain purely draft suggestions; tasks are never auto-committed to MongoDB without explicit user review.
- **Transparency:** Clear UI disclaimers inform the user whenever text was generated by AI.
- **Cost & Abuse Protection:** Strict 60-second in-memory rate limiting prevents rapid repeated API calls.

---

## 23. Limitations & Future Improvements
1. **In-Memory Rate Limiting Scope:** The current rate limiter uses a process-local `Map`. In a multi-instance or serverless cluster, rate limiting should be backed by Redis.
2. **Streaming Responses:** Future implementations could stream tokens using Server-Sent Events (SSE) for real-time typewriter visual feedback.
3. **Custom Prompt Personas:** Allow users to choose generation tone (e.g., technical, casual, concise, detailed).

---

## 24. Viva Voce Preparation Questions & Answers

### Q1. What is an API?
**Answer:** An Application Programming Interface (API) is a formal set of rules, protocols, and endpoints that enables different software systems to communicate and exchange data securely over a network.

### Q2. What is an AI API?
**Answer:** An AI API is a cloud-hosted programmatic interface provided by machine learning vendors (such as OpenAI, Anthropic, or Google Gemini) that allows applications to access pretrained generative models for text, code, or image generation.

### Q3. What is OpenAI?
**Answer:** OpenAI is an artificial intelligence research organization and vendor known for developing Large Language Models such as GPT-4, GPT-4o, and ChatGPT.

### Q4. What is the OpenAI SDK?
**Answer:** The OpenAI SDK (`npm install openai`) is the official Node.js/JavaScript library that wraps OpenAI's REST API into convenient typed methods and classes, handling HTTP headers, serialization, and retries.

### Q5. Why integrate AI into a web application?
**Answer:** AI integration automates repetitive cognitive tasks, improves user productivity (such as drafting task descriptions), enhances search, and provides intelligent contextual recommendations.

### Q6. What does the task-description feature do?
**Answer:** It accepts a brief task title from the user, queries the backend AI service, and returns a concise, actionable 1–2 sentence description that populates the form for user review.

### Q7. Why must the API key stay on the backend?
**Answer:** Frontend JavaScript code is delivered directly to client browsers and can be inspected via DevTools. Storing API keys on the frontend allows malicious users to steal the key, run unauthorized queries, and incur massive financial charges.

### Q8. What is an environment variable?
**Answer:** A dynamic key-value pair configured outside application code in the operating system or runtime environment, used to configure ports, database URIs, and secret tokens without hardcoding them.

### Q9. What is a `.env` file?
**Answer:** A local plain-text file parsed by libraries like `dotenv` during development to load environment variables into `process.env`.

### Q10. Why should `.env` not be uploaded to GitHub?
**Answer:** Public and private Git repositories can be searched or leaked; uploading `.env` exposes private database credentials, secret signing keys, and API tokens to unauthorized third parties.

### Q11. What is a backend endpoint?
**Answer:** A specific URI and HTTP method combination (e.g., `POST /api/ai/generate-description`) on a web server where incoming client requests are received, processed by controllers, and answered with responses.

### Q12. What is `/api/ai/generate-description`?
**Answer:** The dedicated Express POST route in our application that receives the task title, validates it, checks rate limits, invokes the OpenAI service, and returns the generated description or fallback.

### Q13. What is a POST request?
**Answer:** An HTTP request method used to send data in the request body to the server for processing, typically used for creating resources or triggering complex computations.

### Q14. What is JSON?
**Answer:** JavaScript Object Notation (JSON) is a lightweight, language-independent, human-readable data interchange format consisting of key-value pairs and arrays.

### Q15. What is asynchronous processing?
**Answer:** A programming pattern where operations that take time (such as network calls or database queries) run without blocking the execution thread, allowing other events to be handled concurrently.

### Q16. Why use async/await?
**Answer:** `async/await` is modern syntactic sugar built on JavaScript Promises that makes asynchronous code look and behave like synchronous code, improving readability and error handling.

### Q17. What is try/catch?
**Answer:** A control flow construct that intercepts exceptions occurring within the `try` block and routes execution to the `catch` block, preventing unhandled exceptions from crashing the server process.

### Q18. What is graceful degradation?
**Answer:** A resilient architectural design pattern where an application continues to deliver core functionality (manual task creation) even when secondary enhancement features (AI generation) fail or are unavailable.

### Q19. What happens if the OpenAI API is unavailable?
**Answer:** The backend catches the network or quota error, logs it securely, and returns `{ fallback: true, message: "AI suggestions are temporarily unavailable..." }`. The frontend displays a warning and allows the user to type their description manually.

### Q20. What is a loading state?
**Answer:** A UI feedback mechanism (such as changing button text to "Generating..." and displaying a spinner) that informs the user an asynchronous operation is in progress while disabling repeated clicks.

### Q21. What is rate limiting?
**Answer:** A traffic management policy that restricts the frequency of requests a client can make to an API within a specified time window, preventing abuse, denial-of-service, and budget depletion.

### Q22. What is an AI-generated suggestion?
**Answer:** A draft text output produced by a machine learning model intended to assist the user, rather than a final authoritative record.

### Q23. Why should users review AI-generated content?
**Answer:** Large Language Models can hallucinate, omit context, or generate inaccurate information. Human review ensures accuracy, quality, and accountability before saving data.

### Q24. What is responsible AI?
**Answer:** The practice of designing and deploying AI systems adhering to ethical principles, including transparency (disclaimers), privacy protection (data minimization), security, and human oversight.

### Q25. What data should never be sent to an external AI service?
**Answer:** User passwords, hashed credentials, JWT authentication tokens, financial numbers, personal identifiable information (PII), or private internal system secrets.

### Q26. Why mock the AI service in automated tests?
**Answer:** Mocking prevents tests from incurring API billing costs, avoids failures caused by third-party network latency or rate limits, and allows consistent, deterministic verification in CI/CD environments like GitHub Actions.
