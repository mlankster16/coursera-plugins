// Netlify serverless function — proxies requests to the Claude API.
// The API key is stored in Netlify's environment variables as CLAUDE_API_KEY.
// It never appears in source code or the GitHub repo.

exports.handler = async (event) => {
  // Only accept POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  // Check the API key is configured in Netlify environment variables
  const apiKey = process.env.CLAUDE_API_KEY;
  if (!apiKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'CLAUDE_API_KEY environment variable is not set. Add it in Netlify → Site settings → Environment variables.' })
    };
  }

  // Parse the request body
  let body;
  try {
    body = JSON.parse(event.body);
  } catch {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Invalid JSON in request body' })
    };
  }

  const { userInput, forcedType, systemPrompt } = body;

  if (!userInput || !systemPrompt) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing required fields: userInput and systemPrompt' })
    };
  }

  // Build the user message — append override instruction if a type was forced
  let messageContent = userInput;
  if (forcedType) {
    messageContent += `\n\n[OVERRIDE: Generate this interaction as a ${forcedType} type. Keep all the same content but restructure it for this interaction format.]`;
  }

  // Call the Claude API with prompt caching enabled.
  // The system prompt is long and identical on every request — marking it
  // ephemeral caches it on Anthropic's servers for ~5 minutes, cutting
  // several seconds off every subsequent call within that window.
  const claudeResponse = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-beta': 'prompt-caching-2024-07-31',
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5',
      max_tokens: 8192,
      system: [{ type: 'text', text: systemPrompt, cache_control: { type: 'ephemeral' } }],
      messages: [{ role: 'user', content: messageContent }]
    })
  });

  if (!claudeResponse.ok) {
    const errText = await claudeResponse.text();
    return {
      statusCode: claudeResponse.status,
      body: JSON.stringify({ error: `Claude API error: ${errText}` })
    };
  }

  const claudeData = await claudeResponse.json();
  const text = claudeData.content[0].text;

  // Return just the text — the client handles JSON parsing and fence stripping
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text })
  };
};
