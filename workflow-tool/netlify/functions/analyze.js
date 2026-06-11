// Netlify Functions v2 — streams the Anthropic SSE response directly to the
// client so tokens arrive continuously and the connection never goes idle.
// The API key lives in Netlify environment variables only — never in source code.
// System prompts live server-side in system-prompt.js — the client never sends them.
//
// Two-phase flow:
//   mode: 'recommend' — fast analysis call (Haiku). Returns recommendation +
//     pedagogical notes for all types. Small response, ~2-4s.
//   mode: 'generate'  — full build call (Sonnet). Returns html/script/static
//     for ONE type, passed as `type`.

import { RECOMMEND_PROMPT, GENERATE_PROMPT, STATIC_PROMPT } from './system-prompt.js';

const MODES = {
  recommend: {
    prompt: RECOMMEND_PROMPT,
    model: 'claude-haiku-4-5',
    maxTokens: 2048
  },
  generate: {
    prompt: GENERATE_PROMPT,
    model: 'claude-sonnet-4-5',
    maxTokens: 16384
  },
  static: {
    prompt: STATIC_PROMPT,
    model: 'claude-haiku-4-5',
    maxTokens: 2048
  }
};

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

  const { mode, userInput, type, html } = body;
  const config = MODES[mode];

  if (!config || !userInput || (mode === 'generate' && !type) || (mode === 'static' && !html)) {
    return new Response(
      JSON.stringify({ error: 'Required: mode (recommend|generate|static), userInput; type for generate; html for static' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  let messageContent = userInput;
  if (mode === 'generate') {
    messageContent += `\n\n[REQUESTED TYPE: Generate this interaction as a ${type}. This choice is final — do not substitute another type.]`;
  } else if (mode === 'static') {
    messageContent += `\n\n[INTERACTION HTML — write the static companion text covering exactly this content:]\n${html}`;
  }

  const claudeResponse = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-beta': 'prompt-caching-2024-07-31',
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      model: config.model,
      max_tokens: config.maxTokens,
      stream: true,
      system: [{ type: 'text', text: config.prompt, cache_control: { type: 'ephemeral' } }],
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
  return new Response(claudeResponse.body, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'X-Accel-Buffering': 'no'
    }
  });
};
