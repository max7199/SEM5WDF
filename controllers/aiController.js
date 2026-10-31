// =============================================================================
// Practical 13: AI API Integration into a Web Application
// File: controllers/aiController.js
// Description: Controller handling AI task description generation requests.
//              Enforces validation, per-task rate limiting (1/min), and returns
//              graceful fallback responses on upstream provider failures.
// Student: Max Patel (24IT070) - CHARUSAT - ITUE301
// =============================================================================

import { generateTaskDescription, checkRateLimit } from '../services/aiService.js';

/**
 * POST /api/ai/generate-description
 * Generates an AI-suggested task description based on the provided task title.
 */
export async function generateDescription(req, res, next) {
  try {
    const { title, taskId, clientId } = req.body || {};

    // 1. Validation: Reject missing or empty title
    if (!title || typeof title !== 'string' || title.trim() === '') {
      return res.status(400).json({
        error: 'Task title is required to generate an AI description.',
        details: 'Field "title" cannot be empty.'
      });
    }

    const cleanTitle = title.trim();

    // 2. Validation: Reject excessively long title
    if (cleanTitle.length > 200) {
      return res.status(400).json({
        error: 'Task title is too long.',
        details: 'Maximum length is 200 characters.'
      });
    }

    // 3. Supplementary Requirement: In-Memory Rate Limiting
    // Maximum one AI generation request per task per minute (60 seconds)
    const identifier = taskId || clientId || `${req.ip || 'client'}_${cleanTitle.toLowerCase().slice(0, 40)}`;
    const rateCheck = checkRateLimit(identifier);

    if (!rateCheck.allowed) {
      return res.status(429).json({
        error: rateCheck.message,
        rateLimited: true,
        retryAfter: rateCheck.remainingSeconds
      });
    }

    // 4. Delegate to AI Service
    const aiResult = await generateTaskDescription(cleanTitle);

    // 5. Handle Graceful Fallback if AI provider is unavailable, unconfigured, or throws
    if (aiResult.fallback) {
      return res.status(200).json({
        description: '',
        fallback: true,
        message: aiResult.message || 'AI suggestions are temporarily unavailable. Please enter your description manually.'
      });
    }

    // 6. Return successful generated description
    return res.status(200).json({
      description: aiResult.description
    });
  } catch (error) {
    // Handle input validation errors explicitly
    if (error.status === 400) {
      return res.status(400).json({
        error: error.message
      });
    }

    // Log safely without revealing secrets
    console.error('[AI Controller] Uncaught error during AI generation:', error.message);

    // Ensure frontend does not break - return resilient fallback
    return res.status(200).json({
      description: '',
      fallback: true,
      message: 'AI suggestions are temporarily unavailable. Please enter your description manually.'
    });
  }
}

export default {
  generateDescription
};
