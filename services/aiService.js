// =============================================================================
// Practical 13: AI API Integration into a Web Application
// File: services/aiService.js
// Description: Secure backend OpenAI SDK integration for AI task-description generation.
//              Handles API initialization, prompt orchestration, rate limiting,
//              and resilient error handling with graceful fallback.
// Student: Max Patel (24IT070) - CHARUSAT - ITUE301
// =============================================================================

import OpenAI from 'openai';
import dotenv from 'dotenv';
dotenv.config();

// In-memory rate limiting store: identifier -> last request timestamp (ms)
// Requirement: Maximum one AI generation request per task per minute (60s).
const rateLimitStore = new Map();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 60 seconds

/**
 * Checks whether an OpenAI API key is genuinely configured (not empty or default placeholder)
 * @returns {boolean}
 */
export function isApiKeyConfigured() {
  const key = process.env.OPENAI_API_KEY;
  if (!key || typeof key !== 'string') return false;
  const trimmed = key.trim();
  if (trimmed === '' || trimmed === 'your_actual_key_here' || trimmed.startsWith('your_actual_key')) {
    return false;
  }
  return true;
}

/**
 * Returns an initialized OpenAI client instance or null if unconfigured
 * @returns {OpenAI|null}
 */
export function getOpenAIClient() {
  if (!isApiKeyConfigured()) {
    return null;
  }
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY.trim(),
    timeout: 15000, // 15 second request timeout
    maxRetries: 1   // Maximum 1 retry to avoid prolonged UI blocking
  });
}

/**
 * Validates in-memory rate limit for a given task or client identifier.
 * Maximum 1 request per task per minute.
 * 
 * @param {string} identifier - Stable task ID or client-generated request ID
 * @returns {{ allowed: boolean, remainingSeconds?: number, message?: string }}
 */
export function checkRateLimit(identifier) {
  if (!identifier) {
    identifier = 'anonymous-default-task';
  }

  const now = Date.now();
  const lastRequest = rateLimitStore.get(identifier);

  if (lastRequest && (now - lastRequest) < RATE_LIMIT_WINDOW_MS) {
    const remainingSeconds = Math.ceil((RATE_LIMIT_WINDOW_MS - (now - lastRequest)) / 1000);
    return {
      allowed: false,
      remainingSeconds,
      message: 'Please wait one minute before generating another AI description.'
    };
  }

  // Update request timestamp
  rateLimitStore.set(identifier, now);

  // Periodic cleanup of expired entries to prevent memory growth
  if (rateLimitStore.size > 2000) {
    for (const [key, timestamp] of rateLimitStore.entries()) {
      if (now - timestamp > RATE_LIMIT_WINDOW_MS) {
        rateLimitStore.delete(key);
      }
    }
  }

  return { allowed: true };
}

/**
 * Helper to clear rate limit store (useful for unit testing)
 */
export function clearRateLimitStore() {
  rateLimitStore.clear();
}

/**
 * Generates a concise, actionable task description from a given task title using OpenAI API.
 * 
 * @param {string} title - The task title
 * @returns {Promise<{ description: string, fallback?: boolean, message?: string, provider?: string }>}
 */
export async function generateTaskDescription(title) {
  // 1. Input Validation
  if (!title || typeof title !== 'string' || title.trim() === '') {
    const err = new Error('Task title is required to generate an AI description.');
    err.status = 400;
    throw err;
  }

  const cleanTitle = title.trim();

  if (cleanTitle.length > 200) {
    const err = new Error('Task title is too long. Maximum length is 200 characters.');
    err.status = 400;
    throw err;
  }

  // 2. Check for OpenAI API Key Configuration
  if (!isApiKeyConfigured()) {
    console.warn('[AI Service] OpenAI API key is missing or unconfigured. Returning graceful fallback.');
    return {
      description: '',
      fallback: true,
      message: 'AI suggestions are temporarily unavailable. Please enter your description manually.'
    };
  }

  // 3. Call OpenAI Chat Completions API
  try {
    const client = getOpenAIClient();
    const model = process.env.OPENAI_MODEL || 'gpt-4o-mini';

    const response = await client.chat.completions.create({
      model,
      messages: [
        {
          role: 'system',
          content: 'You are an AI assistant integrated into a student Task Management application. Given a task title, write a concise, actionable, and meaningful task description in 1 to 2 sentences (maximum 35 words). Do not include quotes, markdown headings, or any conversational filler.'
        },
        {
          role: 'user',
          content: `Task Title: "${cleanTitle}"`
        }
      ],
      max_tokens: 80,
      temperature: 0.7
    });

    const description = response.choices?.[0]?.message?.content?.trim() || '';

    if (!description) {
      return {
        description: '',
        fallback: true,
        message: 'AI suggestions are temporarily unavailable. Please enter your description manually.'
      };
    }

    return {
      description,
      fallback: false,
      model
    };
  } catch (error) {
    // Log error safely without exposing secret keys or full credentials
    const errorStatus = error.status || error.statusCode;
    const errorCode = error.code || 'UNKNOWN_ERROR';
    console.error(`[AI Service Error] ${errorCode} (${errorStatus || 'No status'}):`, error.message);

    // Return safe graceful fallback response without crashing or exposing stack trace
    return {
      description: '',
      fallback: true,
      message: 'AI suggestions are temporarily unavailable. Please enter your description manually.'
    };
  }
}

export default {
  isApiKeyConfigured,
  getOpenAIClient,
  checkRateLimit,
  clearRateLimitStore,
  generateTaskDescription
};
