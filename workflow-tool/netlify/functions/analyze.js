// Netlify Functions v2 — streams the Anthropic SSE response directly to the
// client so tokens arrive continuously and the connection never goes idle.
// The API key lives in Netlify environment variables only — never in source code.
// The system prompt lives server-side in system-prompt.js — the client never sends it.

import { SYSTEM_PROMPT } from './system-prompt.js';

export default async (req) => {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method Not Allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const apiKey = process.env.CLAUDE_API_KEY;
  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: 'CLAUDE_API_KEY environment variable is not set. Add it in Netlify → Site settings → Environment variables.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON in request body' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const { userInput, forcedType } = body;

  if (!userInput) {
    return new Response(
      JSON.stringify({ error: 'Missing required field: userInput' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // Build the user message — append override instruction if a type was forced
  let messageContent = userInput;
  if (forcedType) {
    messageContent += `\n\n[OVERRIDE: Generate this interaction as a ${forcedType} type. Keep all the same content but restructure it for this interaction format.]`;
  }

  // Call the Claude API with streaming enabled.
  // stream: true makes Anthropic send tokens as SSE events as they are generated.
  // We pipe that stream directly to the client so data is always flowing —
  // eliminating the inactivity timeout that killed non-streaming responses.
  const claudeResponse = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-beta': 'prompt-caching-2024-07-31',
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-5',
      max_tokens: 16384,
      stream: true,
      system: [{ type: 'text', text: SYSTEM_PROMPT, cache_control: { type: 'ephemeral' } }],
      messages: [{ role: 'user', content: messageContent }]
    })
  });

  if (!claudeResponse.ok) {
    const errText = await claudeResponse.text();
    return new Response(
      JSON.stringify({ error: `Claude API error: ${errText}` }),
      { status: claudeResponse.status, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // Pipe the Anthropic SSE stream straight through to the browser.
  // The client reads the events, extracts text deltas, and assembles the full
  // JSON response once the stream ends.
  return new Response(claudeResponse.body, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'X-Accel-Buffering': 'no'
    }
  });
};
