# LX Interaction Design Workflow Tool

A workflow tool for Duke Learning Innovation to support LX interaction design processes.

## Local Use

Open `index.html` directly in a browser — no server or build step required.

## Using a Real Claude API Key

At the top of the `<script>` block in `index.html`, find these two variables:

```js
const USE_MOCK_API = true;
const CLAUDE_API_KEY = "your-api-key-here";
```

Set `USE_MOCK_API` to `false` and replace the placeholder with your Anthropic API key.

**Note on CORS:** The tool calls the Claude API directly from the browser using the `anthropic-dangerous-direct-browser-access` header. This is appropriate for internal team use but should not be used for public-facing deployments, as the API key would be exposed to anyone who views the page source.

## Deploying to Netlify

1. Push this repository to GitHub.
2. In the Netlify dashboard, create a new site and connect the GitHub repo.
3. Set the publish directory to `workflow-tool`.
4. Deploy — Netlify will pick up the `netlify.toml` configuration automatically.
