// Raw text of the last response that failed to parse or arrived incomplete.
// Offered to the user as a downloadable diagnostic in the error box.
let lastUnparsedResponse = null;

// ── API CONFIG ───────────────────────────────────────────────────────────
// Set USE_MOCK_API = true to use built-in sample data (no key needed).
// Set USE_MOCK_API = false to call Claude via the Netlify serverless
// function. The API key lives in Netlify environment variables only —
// it never appears in this file or in the browser.
const USE_MOCK_API = false;

// Mock recommendation response — mirrors the two-phase API's 'recommend' shape
const MOCK_RECOMMEND = {
  "recommendation": {
    "type": "Tabbed Explorer",
    "rationale": "Five discrete frameworks of equal conceptual weight map naturally to tabs, giving learners side-by-side navigation that supports comparison. Tabs keep all options persistently visible while learners read one framework at a time."
  },
  "available_types": [
    { "type": "Tabbed Explorer", "learning_goal": "Parallel comprehension", "pedagogical_note": "All framework names stay visible while learners compare one at a time — the strongest fit for parallel concepts." },
    { "type": "Click-to-Reveal", "learning_goal": "Recall and retrieval", "pedagogical_note": "Prompts learners to retrieve each framework from its abbreviation — better for memorization than comprehension." },
    { "type": "Drag-to-Classify", "learning_goal": "Schema building", "pedagogical_note": "Sorting scenarios by framework builds application skill, but requires clear category boundaries." },
    { "type": "Sequencing", "learning_goal": "Procedural understanding", "pedagogical_note": "Only fits if step order within one framework is the goal — weaker for comparing five frameworks." },
    { "type": "Inline Quiz", "learning_goal": "Knowledge check", "pedagogical_note": "One scenario question checks application but covers only a sliver of the content." },
    { "type": "Annotated Text", "learning_goal": "Guided close reading", "pedagogical_note": "Works only if a real clinical passage is the learning object — none was provided here." }
  ]
};

const MOCK_RESPONSES = {
  "Tabbed Explorer": {
    "type": "Tabbed Explorer",
    "recommendation": {
      "type": "Tabbed Explorer",
      "rationale": "Five discrete frameworks of equal conceptual weight map naturally to five tabs, giving learners a side-by-side navigation experience without needing to scroll through a long page. Tabs allow focused reading of one framework at a time while keeping all other options persistently visible, which supports comparison and deliberate exploration. This format is well-suited when each item has parallel internal structure — full name, use context, and key components — as all five frameworks do."
    },
    "visual_theme": "Duke identity palette with Duke Navy (#012169) for active tab labels and selected underlines, Hatteras (#E2E6ED) for inactive tab backgrounds, and Eno green (#339898) as the accent color on component lists and in-tab headings to reinforce the clinical context.",
    "content": [
      { "label": "Title", "text": "Nursing Assessment Frameworks" },
      { "label": "SBAR — full name", "text": "Situation, Background, Assessment, Recommendation" },
      { "label": "SBAR — when to use", "text": "Use during patient handoffs, shift changes, and urgent physician notifications." }
    ],
    "json": {
      "html": "<div style=\"font-family: Arial, sans-serif; max-width: 760px; margin: 0 auto; padding: 24px; background: #F3F2F1;\"><h2 style=\"color: #012169; font-size: 1.2rem; margin-bottom: 16px;\">Nursing Assessment Frameworks</h2><div id=\"tab-nx-tablist\" role=\"tablist\" style=\"display: flex; border-bottom: 2px solid #012169; gap: 4px;\"></div><div id=\"tab-nx-panels\"></div></div>",
      "script": "var tabs = [{id:'sbar',label:'SBAR',full:'Situation, Background, Assessment, Recommendation',when:'Use during patient handoffs, shift changes, and urgent physician notifications.',steps:['Situation: State who you are, the patient, and the current concern.','Background: Provide relevant history, diagnosis, and recent changes.','Assessment: Share your clinical interpretation of what is happening.','Recommendation: State clearly what you need or suggest next.']},{id:'h2t',label:'HEAD-TO-TOE',full:'Head-to-Toe Assessment',when:'Use during admission assessments, routine shift assessments, and post-procedure evaluations.',steps:['Neurological: Level of consciousness, orientation, pupils.','Respiratory: Breath sounds, rate, effort, oxygen saturation.','Cardiovascular: Heart sounds, peripheral pulses, edema.','Abdomen: Bowel sounds, tenderness, distension.','Integumentary: Skin color, turgor, wounds, pressure areas.']},{id:'old',label:'OLDCARTS',full:'Onset, Location, Duration, Character, Alleviating factors, Relieving factors, Timing, Severity',when:'Use when a patient presents with a new or changing symptom requiring structured symptom analysis.',steps:['Onset: When did it start and what were you doing?','Location: Where is it? Does it radiate?','Duration: How long does it last each time?','Character: How would you describe it (sharp, dull, burning)?','Aggravating / Alleviating factors: What makes it worse or better?','Timing: Is it constant or intermittent?','Severity: Rate on a 0-10 scale.']},{id:'abc',label:'ABCDE',full:'Airway, Breathing, Circulation, Disability, Exposure',when:'Use during rapid response situations, trauma assessments, and any scenario of acute patient deterioration.',steps:['Airway: Is it patent? Any obstruction or stridor?','Breathing: Rate, depth, symmetry, oxygen saturation.','Circulation: Pulse rate and quality, blood pressure, skin perfusion.','Disability: AVPU scale or GCS, blood glucose.','Exposure: Expose the patient fully to identify injuries, rashes, or bleeding.']},{id:'ciwa',label:'CIWA-Ar',full:'Clinical Institute Withdrawal Assessment for Alcohol, Revised',when:'Use for patients with known or suspected alcohol use disorder who are at risk of withdrawal, typically within 24-72 hours of last drink.',steps:['Nausea and vomiting: Scored 0-7.','Tremor: Observe outstretched hands, scored 0-7.','Paroxysmal sweats: Observe for diaphoresis, scored 0-7.','Anxiety: Observe affect and patient report, scored 0-7.','Agitation: Observe behavior during assessment, scored 0-7.','Perceptual disturbances: Tactile, visual, auditory, scored 0-7 each.','Headache: Patient report, scored 0-7.','Orientation: Scored 0-4. Total score guides treatment.']}]; var tablist = document.getElementById('tab-nx-tablist'); var panels = document.getElementById('tab-nx-panels'); tabs.forEach(function(t, i) { var btn = document.createElement('button'); btn.id = 'tab-nx-btn-' + t.id; btn.setAttribute('role','tab'); btn.setAttribute('aria-selected', i === 0 ? 'true' : 'false'); btn.setAttribute('aria-controls','tab-nx-panel-' + t.id); btn.textContent = t.label; btn.style.cssText = 'padding: 10px 14px; border: none; cursor: pointer; font-size: 0.82rem; font-family: Courier New, monospace; font-weight: bold; border-radius: 4px 4px 0 0; transition: background 0.15s;'; btn.style.background = i === 0 ? '#012169' : '#E2E6ED'; btn.style.color = i === 0 ? 'white' : '#012169'; tablist.appendChild(btn); var panel = document.createElement('div'); panel.id = 'tab-nx-panel-' + t.id; panel.setAttribute('role','tabpanel'); panel.setAttribute('aria-labelledby','tab-nx-btn-' + t.id); panel.style.cssText = 'padding: 20px; background: white; border: 1px solid #E2E6ED; border-top: none; display: ' + (i === 0 ? 'block' : 'none') + ';'; panel.innerHTML = '<p style=\"color:#339898;font-size:0.8rem;text-transform:uppercase;letter-spacing:0.08em;margin:0 0 4px;\">Full Name</p><p style=\"color:#012169;font-size:1rem;font-weight:bold;margin:0 0 14px;\">' + t.full + '</p><p style=\"color:#339898;font-size:0.8rem;text-transform:uppercase;letter-spacing:0.08em;margin:0 0 4px;\">When to Use</p><p style=\"color:#262626;font-size:0.9rem;margin:0 0 14px;line-height:1.5;\">' + t.when + '</p><p style=\"color:#339898;font-size:0.8rem;text-transform:uppercase;letter-spacing:0.08em;margin:0 0 8px;\">Key Components</p><ul style=\"margin:0;padding-left:18px;\">' + t.steps.map(function(s){ return '<li style=\"color:#262626;font-size:0.88rem;line-height:1.6;margin-bottom:4px;\">' + s + '</li>'; }).join('') + '</ul>'; panels.appendChild(panel); btn.addEventListener('click', function() { tabs.forEach(function(tt, j) { var b = document.getElementById('tab-nx-btn-' + tt.id); var p = document.getElementById('tab-nx-panel-' + tt.id); if (j === i) { b.setAttribute('aria-selected','true'); b.style.background = '#012169'; b.style.color = 'white'; p.style.display = 'block'; } else { b.setAttribute('aria-selected','false'); b.style.background = '#E2E6ED'; b.style.color = '#012169'; p.style.display = 'none'; } }); }); });"
    },
    "static": "Five standardized frameworks guide nursing assessment across different clinical contexts. Rather than applying a single approach to every patient encounter, nurses select the appropriate framework based on the situation — a structured handoff, a routine head-to-toe examination, a symptom complaint, an emergency, or a withdrawal risk.\n\nSBAR provides a four-part script for clinical communication, ensuring that all essential information is conveyed in a predictable order during handoffs or escalations. HEAD-TO-TOE gives nurses a sequential examination structure that covers every body system, reducing the risk of overlooked findings. OLDCARTS structures the symptom history interview, capturing onset, location, duration, character, aggravating and relieving factors, timing, and severity.\n\nABCDE is the rapid primary survey used in acute deterioration and trauma scenarios. It prioritizes threats to life in the order most likely to cause rapid harm — airway obstruction first, then breathing failure, circulatory collapse, neurological disability, and finally full exposure to identify hidden injuries. CIWA-Ar is a specialized scoring tool used to monitor patients at risk for alcohol withdrawal, with individual items scored on structured scales that sum to a total guiding intervention decisions.\n\nLearning these five frameworks as a set — understanding the purpose each serves and the context in which each applies — prepares nursing students to respond appropriately across the full range of assessment situations they will encounter in clinical practice."
  },
  "Inline Quiz": {
    "type": "Inline Quiz",
    "recommendation": {
      "type": "Inline Quiz",
      "rationale": "An inline quiz activates retrieval practice at the point of learning, which research consistently shows improves long-term retention more than re-reading. This scenario-based question tests learners' ability to apply framework knowledge to a realistic clinical situation rather than simply recall a definition. The single-question format keeps cognitive load low while still creating a meaningful test of contextual understanding."
    },
    "visual_theme": "Clean clinical white cards with Eno green (#339898) for correct answer feedback and confirmation states, Duke Copper (#C84E00) for incorrect answer feedback, and Duke Navy (#012169) for question framing — creating an assessment interface that reads as authoritative and clinical rather than gamified.",
    "content": [
      { "label": "Question", "text": "You are a floor nurse who has just assessed a patient with new-onset shortness of breath. Your attending physician is not at the bedside. Which framework should guide the information you communicate when you call the physician?" },
      { "label": "Option B", "text": "SBAR — to structure the situation, background, assessment, and recommendation for the physician." }
    ],
    "json": {
      "html": "<div style=\"font-family: Arial, sans-serif; max-width: 680px; margin: 0 auto; padding: 28px; background: #F3F2F1;\"><div style=\"background: white; border-radius: 10px; padding: 24px; box-shadow: 0 1px 4px rgba(0,0,0,0.1);\"><p style=\"font-size: 0.78rem; color: #339898; text-transform: uppercase; letter-spacing: 0.1em; margin: 0 0 8px;\">Clinical Scenario</p><h2 style=\"color: #012169; font-size: 1rem; line-height: 1.5; margin: 0 0 20px;\">You are a floor nurse who has just assessed a patient with new-onset shortness of breath. Your attending physician is not at the bedside. Which framework should guide the information you communicate when you call the physician?</h2><div id=\"quiz-options\"></div><div id=\"quiz-feedback\" style=\"display:none; margin-top: 16px; padding: 14px; border-radius: 8px; font-size: 0.9rem; line-height: 1.6;\"></div></div></div>",
      "script": "var options = [{label:'A',text:'OLDCARTS — to systematically describe the symptom onset and character.',correct:false,rationale:'OLDCARTS is used to structure a symptom history from the patient, not to organize communication with a physician. It captures detailed symptom characteristics but does not provide the communication scaffolding needed for a clinical handoff.'},{label:'B',text:'SBAR — to structure the situation, background, assessment, and recommendation for the physician.',correct:true,rationale:'Correct. SBAR is specifically designed for structured clinical communication between care team members. It ensures the physician receives the situation (what is happening), background (relevant history), your assessment (clinical interpretation), and a clear recommendation or request — in a format they expect.'},{label:'C',text:'ABCDE — to present your findings in order of physiological priority.',correct:false,rationale:'ABCDE is a rapid primary survey framework used at the bedside to assess and address life threats in sequence. It guides your own assessment actions, but it is not a communication framework for relaying information to a colleague.'},{label:'D',text:'HEAD-TO-TOE — to report every body system finding to the physician.',correct:false,rationale:'HEAD-TO-TOE is a comprehensive physical assessment sequence useful for documentation and routine evaluation. Reporting every finding to a physician during an urgent call would not be efficient or appropriate — a focused, structured communication framework like SBAR is needed instead.'}]; var container = document.getElementById('quiz-options'); var feedback = document.getElementById('quiz-feedback'); var answered = false; options.forEach(function(opt) { var btn = document.createElement('button'); btn.style.cssText = 'display: block; width: 100%; text-align: left; margin-bottom: 10px; padding: 12px 16px; border: 1.5px solid #E2E6ED; border-radius: 8px; background: white; cursor: pointer; font-size: 0.88rem; color: #262626; line-height: 1.5; transition: border-color 0.15s;'; btn.innerHTML = '<strong style=\"color:#012169;\">' + opt.label + '.</strong> ' + opt.text; btn.addEventListener('mouseover', function() { if (!answered) btn.style.borderColor = '#339898'; }); btn.addEventListener('mouseout', function() { if (!answered) btn.style.borderColor = '#E2E6ED'; }); btn.addEventListener('click', function() { if (answered) return; answered = true; if (opt.correct) { btn.style.borderColor = '#339898'; btn.style.background = '#E8F5F5'; feedback.style.display = 'block'; feedback.style.background = '#E8F5F5'; feedback.style.border = '1.5px solid #339898'; feedback.style.color = '#1a6060'; feedback.innerHTML = '<strong style=\"color:#339898;\">Correct.</strong> ' + opt.rationale; } else { btn.style.borderColor = '#C84E00'; btn.style.background = '#FDF0EA'; feedback.style.display = 'block'; feedback.style.background = '#FDF0EA'; feedback.style.border = '1.5px solid #C84E00'; feedback.style.color = '#7a2e00'; feedback.innerHTML = '<strong style=\"color:#C84E00;\">Not quite.</strong> ' + opt.rationale; } }); container.appendChild(btn); });"
    },
    "static": "Clinical judgment in nursing depends not only on knowing what a framework contains, but on knowing which framework to reach for in a given moment. This question presents a scenario that a floor nurse will encounter routinely — a patient with a new symptom and the need to communicate urgently with a physician who is not present.\n\nThe correct answer is SBAR. When communicating across care team members, especially in urgent or time-sensitive situations, SBAR provides a shared structure that both the nurse and the physician expect. The physician can anticipate that they will first hear the situation, then the background context, then the nurse's assessment, and finally a specific recommendation or request.\n\nOLDCARTS, ABCDE, and HEAD-TO-TOE are all legitimate clinical frameworks but serve different purposes. OLDCARTS structures the nurse's own interview with the patient about a symptom. ABCDE guides the nurse's rapid bedside assessment of physiological status. HEAD-TO-TOE supports comprehensive documentation during routine assessment. None of these are designed to structure communication with another care team member.\n\nUnderstanding this distinction — between frameworks that structure your own thinking and assessment, versus frameworks that structure communication with colleagues — is a foundational competency for safe nursing practice."
  },
  "Click-to-Reveal": {
    "type": "Click-to-Reveal",
    "recommendation": {
      "type": "Click-to-Reveal",
      "rationale": "Click-to-reveal cards support active recall by prompting learners to retrieve the full name and meaning of each abbreviation before it is shown, which strengthens memory encoding compared to passive reading. Five frameworks of equal weight map cleanly to five cards in a grid, making the relationship between abbreviation and meaning visually explicit once revealed. This format works especially well here because all five frameworks are known primarily by their abbreviations in clinical settings."
    },
    "visual_theme": "Clinical card aesthetic with Duke Navy (#012169) abbreviation labels on card fronts against a clean Hatteras (#E2E6ED) background, flipping to reveal Eno green (#339898) full-name headers on a white card back — suggesting the transition from shorthand clinical notation to full clinical understanding.",
    "content": [
      { "label": "Title", "text": "Nursing Assessment Frameworks" },
      { "label": "Instructions", "text": "Click each card to reveal the full framework name and description." },
      { "label": "SBAR — description", "text": "A structured communication framework for patient handoffs and urgent clinical notifications between care team members." }
    ],
    "json": {
      "html": "<div style=\"font-family: Arial, sans-serif; max-width: 760px; margin: 0 auto; padding: 28px; background: #F3F2F1;\"><h2 style=\"color: #012169; font-size: 1.15rem; margin-bottom: 6px;\">Nursing Assessment Frameworks</h2><p style=\"color: #555; font-size: 0.88rem; margin-bottom: 20px;\">Click each card to reveal the full framework name and description.</p><div id=\"reveal-grid\" style=\"display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 16px;\"></div></div>",
      "script": "var cards = [{abbr:'SBAR',full:'Situation, Background, Assessment, Recommendation',desc:'A structured communication framework for patient handoffs and urgent clinical notifications between care team members.'},{abbr:'HEAD-TO-TOE',full:'Head-to-Toe Assessment',desc:'A systematic sequential physical assessment starting at the head and progressing downward through all body systems to ensure comprehensive coverage.'},{abbr:'OLDCARTS',full:'Onset, Location, Duration, Character, Alleviating/Relieving factors, Timing, Severity',desc:'A structured symptom history framework used to fully characterize a patient complaint during the clinical interview.'},{abbr:'ABCDE',full:'Airway, Breathing, Circulation, Disability, Exposure',desc:'A rapid primary survey framework used during acute deterioration and emergencies to identify and address life threats in priority order.'},{abbr:'CIWA-Ar',full:'Clinical Institute Withdrawal Assessment for Alcohol, Revised',desc:'A validated scoring tool for monitoring and managing alcohol withdrawal symptoms, with scored items guiding medication and intervention decisions.'}]; var grid = document.getElementById('reveal-grid'); cards.forEach(function(c) { var card = document.createElement('div'); card.style.cssText = 'background: #E2E6ED; border-radius: 10px; min-height: 160px; display: flex; flex-direction: column; justify-content: center; align-items: center; padding: 20px; cursor: pointer; border: 2px solid transparent; transition: box-shadow 0.2s;'; var front = document.createElement('div'); front.style.cssText = 'text-align: center;'; front.innerHTML = '<div style=\"font-family: Courier New, monospace; font-size: 1.3rem; font-weight: bold; color: #012169; margin-bottom: 8px;\">' + c.abbr + '</div><div style=\"font-size: 0.78rem; color: #555;\">Click to reveal</div>'; var back = document.createElement('div'); back.style.cssText = 'display: none; text-align: left;'; back.innerHTML = '<div style=\"font-size: 0.78rem; font-weight: bold; color: #339898; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 6px;\">' + c.abbr + '</div><div style=\"font-size: 0.85rem; font-weight: bold; color: #012169; margin-bottom: 8px; line-height: 1.4;\">' + c.full + '</div><div style=\"font-size: 0.82rem; color: #262626; line-height: 1.5;\">' + c.desc + '</div>'; card.appendChild(front); card.appendChild(back); var revealed = false; card.addEventListener('click', function() { if (!revealed) { revealed = true; front.style.display = 'none'; back.style.display = 'block'; card.style.background = 'white'; card.style.border = '2px solid #339898'; card.style.boxShadow = '0 2px 8px rgba(51,152,152,0.15)'; } else { revealed = false; back.style.display = 'none'; front.style.display = 'block'; card.style.background = '#E2E6ED'; card.style.border = '2px solid transparent'; card.style.boxShadow = 'none'; } }); grid.appendChild(card); });"
    },
    "static": "In clinical settings, nursing assessment frameworks are almost always referred to by their abbreviations. A nurse says 'I used SBAR' or 'I ran through ABCDE' — the full names are rarely spoken aloud. This creates a specific learning challenge: students must internalize both the abbreviation and the full conceptual structure it represents.\n\nClick-to-reveal cards address this directly. By showing only the abbreviation first, the format prompts learners to actively retrieve what they know before the answer is confirmed. This retrieval attempt — even when unsuccessful — strengthens the memory trace more effectively than reading a list of definitions.\n\nEach card in this set represents one framework. SBAR and ABCDE are the two most likely to be encountered early in clinical rotations, and most students will have some exposure to them. OLDCARTS and HEAD-TO-TOE are framework names that are less universally known before clinical placement. CIWA-Ar is the most specialized and is typically introduced in the context of medical-surgical or detox unit content.\n\nAfter working through all five cards, learners should be able to state the full name behind each abbreviation and identify the clinical context in which it is applied — the foundational level of framework knowledge required before applying them in simulated or real patient encounters."
  },
  "Sequencing": {
    "type": "Sequencing",
    "recommendation": { "type": "Sequencing", "rationale": "Mock sequencing response for sample content." },
    "available_types": [
      { "type": "Sequencing", "learning_goal": "Procedural understanding", "pedagogical_note": "Learners arrange steps in the correct order, which requires understanding why each step precedes the next — deeper processing than reading a numbered list." }
    ],
    "visual_theme": "Clean procedural layout using Duke Navy and Whisper Gray.",
    "json": { "html": "<div style=\"font-family:'Open Sans',Arial,sans-serif;padding:24px;background:#F3F2F1;\"><p style=\"color:#012169;font-weight:600;\">Sequencing interaction — replace with real API call</p></div>", "script": "(function(){ function init(){} if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',init);}else{init();} })()" },
    "static": "Sample sequencing static text."
  }
};

function detectAccentColor(themeText) {
  const t = themeText.toLowerCase();
  if (t.includes('#339898') || t.includes('eno')) return '#339898';
  if (t.includes('#c84e00') || t.includes('copper')) return '#C84E00';
  if (t.includes('#e89923') || t.includes('persimmon')) return '#E89923';
  if (t.includes('#005587') || t.includes('prussian')) return '#005587';
  if (t.includes('#993399') || t.includes('ironweed')) return '#993399';
  if (t.includes('#a1b70d') || t.includes('piedmont')) return '#A1B70D';
  if (t.includes('#0577b1') || t.includes('shale')) return '#0577B1';
  if (t.includes('#00539b') || t.includes('royal')) return '#00539B';
  return '#E89923';
}

// Serve a mock response matching the two-phase API shapes
async function mockApi({ mode, type }) {
  await new Promise(r => setTimeout(r, mode === 'generate' ? 1200 : 500));
  if (mode === 'recommend') return JSON.parse(JSON.stringify(MOCK_RECOMMEND));
  const key = Object.keys(MOCK_RESPONSES).find(k => k.toLowerCase() === String(type).toLowerCase());
  if (mode === 'static') {
    return { static: key ? MOCK_RESPONSES[key].static : 'Mock static companion text for ' + type + '.' };
  }
  if (key) {
    const m = MOCK_RESPONSES[key];
    return { type: key, rationale: m.recommendation.rationale, visual_theme: m.visual_theme, content: m.content, json: m.json };
  }
  return {
    type,
    rationale: 'Mock placeholder for ' + type + '.',
    visual_theme: 'Duke Navy on Whisper Gray placeholder theme.',
    content: [{ label: 'Heading', text: type + ' — mock placeholder' }],
    json: {
      html: '<div style="font-family:\'Open Sans\',Arial,sans-serif;padding:24px;background:#F3F2F1;color:#012169;font-weight:600;">' + type + ' — mock placeholder</div>',
      script: '(function(){ function init(){} if(document.readyState===\'loading\'){document.addEventListener(\'DOMContentLoaded\',init);}else{init();} })()'
    },
    static: 'Mock static companion text for ' + type + '.'
  };
}

// Call the Netlify serverless function. payload is either
//   { mode: 'recommend', userInput }                — fast analysis (Haiku)
//   { mode: 'generate',  userInput, type }          — full build (Sonnet)
// The API key lives in Netlify's environment variables — never in
// the browser or this file. No credentials needed on the client side.
async function callApi(payload, onProgress) {
  if (USE_MOCK_API) {
    if (onProgress) {
      // Simulate streaming progress so the loading bar is testable in mock mode
      for (let c = 800; c <= 7200; c += 800) setTimeout(() => onProgress(c), c / 8);
    }
    return mockApi(payload);
  }

  const response = await fetch('/.netlify/functions/analyze', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`API error ${response.status}: ${err}`);
  }

  // Read the SSE stream — Anthropic sends tokens as they are generated.
  // We accumulate text deltas here and parse the full JSON once the stream
  // ends. The connection stays alive throughout because data is always
  // flowing, which eliminates the Netlify inactivity timeout entirely.
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let raw = '';
  let sseBuffer = '';
  let stopReason = null;
  let streamError = null;

  const processLine = (line) => {
    if (!line.startsWith('data: ')) return;
    const payload = line.slice(6).trim();
    if (payload === '[DONE]') return;
    try {
      const evt = JSON.parse(payload);
      if (evt.type === 'content_block_delta' && evt.delta?.type === 'text_delta') {
        raw += evt.delta.text;
        if (onProgress) onProgress(raw.length);
      } else if (evt.type === 'message_delta' && evt.delta?.stop_reason) {
        stopReason = evt.delta.stop_reason;
      } else if (evt.type === 'error') {
        streamError = evt.error?.message || 'unknown stream error';
      }
    } catch { /* ignore malformed SSE lines */ }
  };

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    sseBuffer += decoder.decode(value, { stream: true });
    const lines = sseBuffer.split('\n');
    sseBuffer = lines.pop(); // keep any incomplete line for the next chunk
    lines.forEach(processLine);
  }

  // Flush anything left in the buffer after the stream closes
  if (sseBuffer.trim()) sseBuffer.split('\n').forEach(processLine);

  if (streamError) {
    throw new Error(`The AI stream reported an error: ${streamError}`);
  }
  if (stopReason === 'max_tokens') {
    throw new Error('The response was cut off before it finished (hit the length limit). Please try again.');
  }
  if (!stopReason) {
    // The stream ended without Anthropic's completion signal — the connection
    // was dropped mid-response (e.g. the serverless function hit its time
    // limit). The data is genuinely incomplete; parsing it would fail.
    lastUnparsedResponse = raw;
    throw new Error('The connection dropped before the response finished generating. Please try again — large interactions occasionally take longer than the server allows.');
  }

  // Isolate the JSON object: strip code fences, then slice from the first
  // '{' to the last '}' so any prose before or after the object is dropped.
  let cleaned = raw
    .replace(/^```json\n?/, '')
    .replace(/^```\n?/, '')
    .replace(/\n?```$/, '')
    .trim();
  const firstBrace = cleaned.indexOf('{');
  const lastBrace  = cleaned.lastIndexOf('}');
  if (firstBrace > -1 && lastBrace > firstBrace) {
    cleaned = cleaned.slice(firstBrace, lastBrace + 1);
  }

  // First attempt — direct parse
  try {
    return JSON.parse(cleaned);
  } catch (parseErr) {
    // Second attempt — character-level repair of the three failures Claude
    // actually produces: literal newlines/tabs inside strings, unescaped
    // inner quotes, and stray lone backslashes.
    try {
      return JSON.parse(repairJson(cleaned));
    } catch {
      console.error('Unparseable AI response:', raw);
      lastUnparsedResponse = raw;
      throw new Error(`The AI returned a response that could not be parsed. Please try again. (Detail: ${parseErr.message})`);
    }
  }
}

// Walk the JSON text character by character, tracking string state. Inside
// strings: escape raw newlines/tabs, escape backslashes that don't start a
// valid escape sequence, and treat a quote as the string's end only when the
// next meaningful character is structural (, } ] :) — otherwise it's an
// unescaped inner quote and gets escaped.
function repairJson(src) {
  let out = '';
  let inStr = false;
  for (let i = 0; i < src.length; i++) {
    const c = src[i];
    if (!inStr) {
      if (c === '"') { inStr = true; out += c; continue; }
      if (c === ',') {
        // Drop trailing commas: a comma whose next meaningful char closes
        // the object/array is invalid JSON
        let j = i + 1;
        while (j < src.length && ' \t\n\r'.includes(src[j])) j++;
        if (src[j] === '}' || src[j] === ']') continue;
      }
      out += c;
      continue;
    }
    if (c === '\\') {
      const n = src[i + 1];
      if (n !== undefined && '"\\/bfnrtu'.includes(n)) { out += c + n; i++; }
      else out += '\\\\'; // lone backslash — escape it
      continue;
    }
    if (c === '\n') { out += '\\n'; continue; }
    if (c === '\r') { out += '\\r'; continue; }
    if (c === '\t') { out += '\\t'; continue; }
    if (c === '"') {
      let j = i + 1;
      while (j < src.length && ' \t\n\r'.includes(src[j])) j++;
      const next = src[j];
      if (next === undefined || next === ',' || next === '}' || next === ']' || next === ':') {
        inStr = false;
        out += c;
      } else {
        out += '\\"'; // unescaped quote inside the string value
      }
      continue;
    }
    out += c;
  }
  return out;
}

let currentInput = '';
let recommendationData = null;  // { recommendation, available_types } from the recommend call
let currentType = null;         // display name of the type currently shown in the preview
let confirmedResult = null;
let viewToken = 0;              // guards against stale async preview updates
let analysisToken = 0;          // identifies the current analysis run
let directedType = null;        // set when the designer chose the type ("I know what I want")
const typeCache = {};           // keyOf(type) -> generation result for this session
const typePromises = {};        // keyOf(type) -> in-flight generation promise (dedupe)

// Cache keys are case-insensitive: the designer's chosen type string and the
// API's type names must hit the same entries regardless of casing.
const keyOf = t => String(t).toLowerCase();

// Progress handlers keyed by type — set by whichever UI is watching a
// generation. Read dynamically, so attaching a handler works even when the
// generation was already started in the background.
const progressHandlers = {};

// Route preview progress to exactly one type (clears any stale handlers)
function watchProgress(type, handler) {
  Object.keys(progressHandlers).forEach(k => delete progressHandlers[k]);
  progressHandlers[keyOf(type)] = handler;
}

// Fetch (or reuse) the generated interaction for a type. Background
// pre-generation and pill clicks share this — a type is never generated twice.
function fetchGeneration(type) {
  const k = keyOf(type);
  if (typeCache[k]) return Promise.resolve(typeCache[k]);
  if (!typePromises[k]) {
    typePromises[k] = callApi(
      { mode: 'generate', userInput: currentInput, type },
      chars => { if (progressHandlers[k]) progressHandlers[k](chars); }
    )
      .then(result => {
        typeCache[k] = result;
        markCached(type);
        return result;
      })
      .finally(() => { delete typePromises[k]; });
  }
  return typePromises[k];
}

// Static companion text is generated lazily — only when the designer confirms
// a type — so previews and background pre-generation never pay for it.
const staticCache = {};     // keyOf(type) -> static text
const staticPromises = {};  // keyOf(type) -> in-flight promise (dedupe)

function fetchStatic(type) {
  const k = keyOf(type);
  if (staticCache[k]) return Promise.resolve(staticCache[k]);
  if (!staticPromises[k]) {
    const gen = typeCache[k];
    staticPromises[k] = callApi({ mode: 'static', userInput: currentInput, type, html: gen.json.html })
      .then(result => {
        staticCache[k] = result.static;
        return result.static;
      })
      .finally(() => { delete staticPromises[k]; });
  }
  return staticPromises[k];
}

const steps = { 1: document.getElementById('step-1'), 2: document.getElementById('step-2'), 3: document.getElementById('step-3'), 4: document.getElementById('step-4') };
const stepLabel = document.getElementById('step-label');
const textarea    = document.getElementById('challenge-input');
const charCount   = document.getElementById('char-count-hint');
const analyzeBtn  = document.getElementById('analyze-btn');
const errorBox    = document.getElementById('error-box');
const exampleBtn  = document.getElementById('example-btn');

const EXAMPLE_CHALLENGE = `I'm building a module on nursing assessment frameworks for second-year nursing students. The reading lists five tools — SBAR, HEAD-TO-TOE, OLDCARTS, ABCDE, and CIWA-Ar — with a paragraph explaining each one. The problem is that learners are finishing the reading without a clear sense of when to use which framework or how they differ from each other. They can define the terms but struggle to apply them. Most students will already know SBAR and ABCDE from earlier modules, but HEAD-TO-TOE, OLDCARTS, and CIWA-Ar are new. I want something that helps them distinguish between the frameworks and understand the clinical context for each one, without just repeating the text.`;
const step2El = document.getElementById('step-2');
const s2RecommendBadge  = document.getElementById('s2-recommendation-badge');
const s2RationaleText   = document.getElementById('s2-rationale-text');
const s2OutOfScope      = document.getElementById('s2-out-of-scope');
const s2OutOfScopeDetail = document.getElementById('s2-out-of-scope-detail');
const previewIframe = document.getElementById('preview-iframe');
const previewShimmer = document.getElementById('preview-shimmer');
let s2TypeButtons = []; // populated dynamically when API response arrives
const s2TypeButtonsContainer = document.getElementById('s2-type-buttons');
const s2PedagogyPanel = document.getElementById('s2-pedagogy-panel');
const s2PedagogyGoal  = document.getElementById('s2-pedagogy-goal');
const s2PedagogyNote  = document.getElementById('s2-pedagogy-note');
const s2Regenerating  = document.getElementById('s2-regenerating');
const s2ConfirmBtn    = document.getElementById('s2-confirm-btn');
const s2StartOver = document.getElementById('s2-start-over');
const backToPreviewLink = document.getElementById('back-to-preview-link');
const s3GenerateBtn    = document.getElementById('s3-generate-btn');
const backToEditLink   = document.getElementById('back-to-edit-link');
const editHtml         = document.getElementById('edit-html');
const editScript       = document.getElementById('edit-script');
const editStatic       = document.getElementById('edit-static');
const s3TypeBadge      = document.getElementById('s3-type-badge');
const resultTheme = document.getElementById('result-theme');
const resultSwatch = document.getElementById('result-swatch');
const resultJsonCode = document.getElementById('result-json-code');
const resultStatic = document.getElementById('result-static');

function showStep(n) {
  Object.values(steps).forEach(s => s.classList.remove('active'));
  steps[n].classList.add('active');
  stepLabel.textContent = `Step ${n} of 4`;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Normalise a type name to the canonical form used in available_types
// (case-insensitive). Falls back to the raw value if no match found.
function canonicalType(typeName) {
  if (!typeName || !recommendationData) return typeName;
  const match = recommendationData.available_types.find(
    t => t.type.toLowerCase() === String(typeName).toLowerCase()
  );
  return match ? match.type : typeName;
}

// True when the recommendation flagged the challenge as out of scope
function isOutOfScopeRec() {
  if (!recommendationData) return false;
  const r = recommendationData.recommendation;
  return (r.rationale || '').trimStart().toUpperCase().startsWith('OUT OF SCOPE:') ||
         (r.type || '').trimStart().toUpperCase().startsWith('OUT OF SCOPE:');
}

// The canonical name of the recommended type, stripped of any stray prefix
function recommendedType() {
  if (!recommendationData) return null;
  const clean = recommendationData.recommendation.type.replace(/^out of scope:\s*/i, '').trim();
  return canonicalType(clean);
}

function showPedagogyNote(typeInfo) {
  s2PedagogyGoal.textContent = typeInfo.learning_goal || '';
  s2PedagogyNote.textContent = typeInfo.pedagogical_note || '';
  s2PedagogyPanel.classList.add('visible');
}

// Build type buttons from the initial API response — called once per analysis.
// Subsequent type switches only update active/cached state on existing buttons.
function renderTypeButtons(availableTypes, recommendedType) {
  s2TypeButtonsContainer.innerHTML = '';
  s2TypeButtons = [];
  availableTypes.forEach(typeInfo => {
    const btn = document.createElement('button');
    btn.className = 'type-pill';
    btn.dataset.type = typeInfo.type;
    btn.textContent = typeInfo.type;
    if (keyOf(typeInfo.type) === keyOf(recommendedType)) {
      btn.classList.add('active');
    } else if (typeCache[keyOf(typeInfo.type)]) {
      btn.classList.add('cached'); // already generated in this session
    }
    s2TypeButtonsContainer.appendChild(btn);
    s2TypeButtons.push(btn);

    // Show pedagogy note on hover / focus
    btn.addEventListener('mouseenter', () => showPedagogyNote(typeInfo));
    btn.addEventListener('focus',      () => showPedagogyNote(typeInfo));

    // Click to switch type — instant if cached or pre-generated
    btn.addEventListener('click', () => selectType(typeInfo.type));
  });

  // Show recommended type's note by default
  const rec = availableTypes.find(t => keyOf(t.type) === keyOf(recommendedType));
  if (rec) showPedagogyNote(rec);
}

const previewLoading     = document.getElementById('preview-loading');
const previewLoadingText = document.getElementById('preview-loading-text');
const previewLoadingFill = document.getElementById('preview-loading-fill');

// Show the loading overlay on the preview: shimmer + label + progress bar.
// Progress is real — streamed characters against a typical ~8k-char response.
function showPreviewLoading(type) {
  previewIframe.srcdoc = '';
  previewShimmer.classList.add('visible');
  previewLoadingText.textContent = 'Generating ' + type + '...';
  previewLoadingFill.style.width = '0%';
  previewLoading.classList.add('visible');
  watchProgress(type, chars => {
    previewLoadingFill.style.width = Math.min(95, Math.round(chars / 85)) + '%';
  });
}

function hidePreviewLoading() {
  previewLoading.classList.remove('visible');
  Object.keys(progressHandlers).forEach(k => delete progressHandlers[k]);
}

function setStep2Substate(state) {
  step2El.classList.remove('step-2--loading', 'step-2--preview');
  step2El.classList.add('step-2--' + state);
}

function buildSrcdoc(html, script) {
  return `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>*{box-sizing:border-box;}body{margin:0;padding:0;background:#ffffff;font-family:'Open Sans',Arial,sans-serif;}</style></head><body>${html}<script>${script}<\/script></body></html>`;
}

function setPreviewIframe(result) {
  previewShimmer.classList.add('visible');
  previewIframe.style.minHeight = '320px';
  previewIframe.srcdoc = buildSrcdoc(result.json.html, result.json.script);
  previewIframe.onload = () => {
    try {
      const bodyHeight = previewIframe.contentDocument.body.scrollHeight;
      if (bodyHeight > 0) {
        previewIframe.style.height = (bodyHeight + 32) + 'px';
        previewIframe.style.minHeight = '';
      }
    } catch(e) {}
    previewShimmer.classList.remove('visible');
  };
}

// Apply the recommend-phase response: badge, rationale, out-of-scope banner,
// and the full set of type pills. Returns the canonical recommended type name.
function applyRecommendation(rec) {
  recommendationData = rec;
  const typeName = recommendedType();
  const rationale = rec.recommendation.rationale || '';
  const outOfScope = isOutOfScopeRec();

  s2OutOfScope.style.display = outOfScope ? 'flex' : 'none';
  if (outOfScope) {
    s2OutOfScopeDetail.textContent = ' ' + rationale.replace(/^out of scope:\s*/i, '');
    s2RationaleText.style.display = 'none';
  } else {
    s2RationaleText.style.display = '';
  }

  s2RecommendBadge.textContent = (outOfScope ? 'Closest alternative: ' : 'Recommended: ') + typeName;
  s2RationaleText.textContent = rationale;

  renderTypeButtons(rec.available_types, typeName);
  return typeName;
}

// Mark a pill as cached (generated and ready for instant viewing)
function markCached(type) {
  const btn = s2TypeButtons.find(b => keyOf(b.dataset.type) === keyOf(type));
  if (btn && keyOf(type) !== keyOf(currentType)) btn.classList.add('cached');
}

// Show an already-generated type in the preview and update all Step 2 state.
// The "base type" is the designer's own choice in directed mode, or the
// recommendation otherwise — it keeps its special badge; others show "Viewing".
function showType(type) {
  const gen = typeCache[keyOf(type)];
  if (!gen) return;
  currentType = type;

  s2TypeButtons.forEach(btn => {
    const isCurrent = keyOf(btn.dataset.type) === keyOf(type);
    btn.classList.toggle('active', isCurrent);
    btn.classList.toggle('cached', !!typeCache[keyOf(btn.dataset.type)] && !isCurrent);
  });

  const baseType = directedType || recommendedType();
  const isBase = keyOf(type) === keyOf(baseType);
  const outOfScope = !directedType && isOutOfScopeRec();
  if (isBase && directedType) {
    s2RecommendBadge.textContent = 'Your choice: ' + type;
    s2RationaleText.textContent = gen.rationale || '';
    s2RationaleText.style.display = gen.rationale ? '' : 'none';
  } else if (isBase) {
    s2RecommendBadge.textContent = (outOfScope ? 'Closest alternative: ' : 'Recommended: ') + type;
    s2RationaleText.textContent = recommendationData.recommendation.rationale || '';
    s2RationaleText.style.display = outOfScope ? 'none' : '';
  } else {
    s2RecommendBadge.textContent = 'Viewing: ' + type;
    s2RationaleText.textContent = gen.rationale || '';
    s2RationaleText.style.display = gen.rationale ? '' : 'none';
  }

  s2Regenerating.classList.remove('visible');
  s2Regenerating.style.color = '';
  s2ConfirmBtn.disabled = false;
  hidePreviewLoading();
  setPreviewIframe(gen);
}

// Handle a type pill click: instant if cached, otherwise generate on demand.
// viewToken ensures that if the designer clicks around while generations are
// in flight, only the most recent choice updates the preview.
async function selectType(type) {
  if (keyOf(type) === keyOf(currentType)) return;
  const token = ++viewToken;
  if (typeCache[keyOf(type)]) { showType(type); return; }

  showPreviewLoading(type);

  try {
    await fetchGeneration(type);
    if (token !== viewToken) return; // designer moved on to another type
    showType(type);
  } catch (err) {
    if (token !== viewToken) return;
    hidePreviewLoading();
    previewShimmer.classList.remove('visible');
    s2Regenerating.textContent = 'Something went wrong generating ' + type + '. Click it again to retry.';
    s2Regenerating.style.color = '#C84E00';
    s2Regenerating.classList.add('visible');
  }
}

textarea.addEventListener('input', () => {
  const len = textarea.value.length;
  const meetsMin = len >= 50;
  charCount.textContent = `${len} / 10000${meetsMin ? '' : ' — 50 characters minimum to analyze'}`;
  charCount.classList.toggle('warn', !meetsMin && len > 0);
  analyzeBtn.disabled = !meetsMin;
  analyzeBtn.setAttribute('aria-disabled', String(!meetsMin));
  errorBox.style.display = 'none';
});

exampleBtn.addEventListener('click', () => {
  textarea.value = EXAMPLE_CHALLENGE;
  textarea.dispatchEvent(new Event('input')); // trigger char count + button enable
  textarea.focus();
  exampleBtn.textContent = 'Example loaded';
  exampleBtn.disabled = true;
  setTimeout(() => {
    exampleBtn.textContent = 'Try an example';
    exampleBtn.disabled = false;
  }, 2000);
});

// ── Mode toggle: "Recommend for me" vs "I know what I want" ────────────────
let appMode = 'recommend';
const modeRecommendBtn = document.getElementById('mode-recommend-btn');
const modeDirectedBtn  = document.getElementById('mode-directed-btn');
const directedControls = document.getElementById('directed-controls');
const directedTypeSelect = document.getElementById('directed-type');
const challengeLabel   = document.getElementById('challenge-label');

const DIRECTED_PLACEHOLDER = "Example: A click-to-reveal set on pharmacology abbreviations. Six cards: PRN, BID, TID, QID, PO, and NPO. Each card front shows the abbreviation; the reveal shows the full term, what it means in practice, and one example order. Keep the tone clinical and concise.";
let recommendPlaceholder = null; // captured from the HTML on first toggle

function setMode(mode) {
  appMode = mode;
  const directed = mode === 'directed';
  modeRecommendBtn.classList.toggle('active', !directed);
  modeDirectedBtn.classList.toggle('active', directed);
  modeRecommendBtn.setAttribute('aria-checked', String(!directed));
  modeDirectedBtn.setAttribute('aria-checked', String(directed));
  directedControls.style.display = directed ? 'block' : 'none';
  if (recommendPlaceholder === null) recommendPlaceholder = textarea.placeholder;
  challengeLabel.textContent = directed
    ? 'Describe your content and how you want it structured'
    : 'Describe your learning design challenge';
  textarea.placeholder = directed ? DIRECTED_PLACEHOLDER : recommendPlaceholder;
  analyzeBtn.lastChild.textContent = directed ? ' Generate Interaction' : ' Analyze Challenge';
}

modeRecommendBtn.addEventListener('click', () => setMode('recommend'));
modeDirectedBtn.addEventListener('click', () => setMode('directed'));

function resetAnalysisState() {
  s2TypeButtons = [];
  s2TypeButtonsContainer.innerHTML = '';
  Object.keys(typeCache).forEach(k => delete typeCache[k]);
  Object.keys(typePromises).forEach(k => delete typePromises[k]);
  Object.keys(staticCache).forEach(k => delete staticCache[k]);
  Object.keys(staticPromises).forEach(k => delete staticPromises[k]);
  recommendationData = null;
  currentType = null;
  directedType = null;
  viewToken++;
  analysisToken++;
  s2ConfirmBtn.disabled = true;
  s2PedagogyPanel.classList.remove('visible');
  s2OutOfScope.style.display = 'none';
  s2Regenerating.classList.remove('visible');
}

// "Recommend for me": recommend → generate → pre-generate alternatives
async function runRecommended(input) {
  // Phase 1 — fast recommendation call: Step 2 paints in seconds
  const rec = await callApi({ mode: 'recommend', userInput: input });
  const recType = applyRecommendation(rec);
  setStep2Substate('preview');

  // Phase 2 — generate the recommended interaction while the designer reads
  showPreviewLoading(recType);
  const token = ++viewToken;
  await fetchGeneration(recType);
  if (token === viewToken) showType(recType);

  // Phase 3 — quietly pre-generate the next two strongest fits so
  // exploring them is instant. Failures here are silent; clicking the
  // pill simply generates on demand instead.
  rec.available_types.slice(1, 3).forEach(t => {
    fetchGeneration(canonicalType(t.type)).catch(() => {});
  });
}

// "I know what I want": generate the chosen type immediately. The pills and
// pedagogy notes still load from a background recommend call, so the designer
// can compare alternatives — but nothing waits on it.
async function runDirected(input) {
  const chosen = directedTypeSelect.value;
  directedType = chosen;
  const analysis = analysisToken;

  s2RecommendBadge.textContent = 'Your choice: ' + chosen;
  s2RationaleText.textContent = '';
  s2RationaleText.style.display = 'none';
  showPreviewLoading(chosen);

  // Background: fetch pedagogy notes for the pill row (nice-to-have)
  callApi({ mode: 'recommend', userInput: input })
    .then(rec => {
      if (analysis !== analysisToken || s2TypeButtons.length > 0) return;
      recommendationData = rec;
      renderTypeButtons(rec.available_types, chosen);
    })
    .catch(() => {}); // pills simply don't appear; generation is unaffected

  const token = ++viewToken;
  await fetchGeneration(chosen);
  if (token === viewToken) showType(chosen);
}

analyzeBtn.addEventListener('click', async () => {
  const input = textarea.value.trim();
  if (input.length < 50) return;
  currentInput = input;
  errorBox.style.display = 'none';
  resetAnalysisState();
  // Directed mode skips the analysis spinner — Step 2 opens straight onto
  // the preview area with the loading overlay running.
  setStep2Substate(appMode === 'directed' ? 'preview' : 'loading');
  showStep(2);
  try {
    if (appMode === 'directed') await runDirected(input);
    else await runRecommended(input);
  } catch (err) {
    showStep(1);
    errorBox.textContent = `Something went wrong: ${err.message}`;
    if (lastUnparsedResponse) {
      const link = document.createElement('a');
      link.textContent = 'Download the raw AI response (for debugging — share this file when reporting the problem)';
      link.href = URL.createObjectURL(new Blob([lastUnparsedResponse], { type: 'text/plain' }));
      link.download = 'ai-response-debug.txt';
      link.style.cssText = 'display:block;margin-top:8px;color:#7a3300;font-weight:600;text-decoration:underline;';
      errorBox.appendChild(link);
      lastUnparsedResponse = null;
    }
    errorBox.style.display = 'block';
  }
});

// ── Text-only editing (Step 3) ─────────────────────────────────────────────
const editFields  = document.getElementById('edit-fields');
const codeToggle  = document.getElementById('code-toggle');
const codeCards   = document.getElementById('code-cards');

codeToggle.addEventListener('click', () => {
  const open = codeCards.style.display !== 'none';
  codeCards.style.display = open ? 'none' : 'block';
  codeToggle.setAttribute('aria-expanded', String(!open));
  codeToggle.lastChild.textContent = open ? ' Show code' : ' Hide code';
});

// Render one labeled text field per content entry. Each field remembers the
// original string so edits can be located and replaced in the html verbatim.
function renderEditFields(content) {
  editFields.innerHTML = '';
  if (!content || !content.length) {
    const note = document.createElement('p');
    note.className = 'edit-fields-empty';
    note.textContent = 'No editable text fields came back for this interaction — use "Show code" below to edit the HTML directly.';
    editFields.appendChild(note);
    codeCards.style.display = 'block';
    codeToggle.setAttribute('aria-expanded', 'true');
    codeToggle.lastChild.textContent = ' Hide code';
    return;
  }
  content.forEach((item, i) => {
    const wrap = document.createElement('div');
    wrap.className = 'edit-field';
    const label = document.createElement('label');
    label.className = 'edit-field-label';
    label.textContent = item.label || 'Text';
    label.htmlFor = 'edit-field-' + i;
    const ta = document.createElement('textarea');
    ta.id = 'edit-field-' + i;
    ta.className = 'edit-field-input';
    ta.value = item.text || '';
    ta.rows = Math.max(1, Math.min(6, Math.ceil((item.text || '').length / 80)));
    ta.dataset.original = item.text || '';
    wrap.appendChild(label);
    wrap.appendChild(ta);
    editFields.appendChild(wrap);
  });
}

// Apply field edits to the html/script by verbatim find-and-replace. Fields
// whose original text no longer exists (e.g. after manual code edits) are
// skipped — the code view always wins.
function applyContentEdits(html, script) {
  let h = html, s = script;
  editFields.querySelectorAll('textarea').forEach(f => {
    const orig = f.dataset.original;
    const edited = f.value;
    if (!orig || orig === edited) return;
    if (h.includes(orig)) h = h.replace(orig, edited);
    else if (s.includes(orig)) s = s.replace(orig, edited);
  });
  return { html: h, script: s };
}

let confirmToken = 0; // guards the async static fill if the user re-confirms

s2ConfirmBtn.addEventListener('click', async () => {
  const gen = currentType ? typeCache[keyOf(currentType)] : null;
  if (!gen) return; // nothing generated yet
  confirmedResult = {
    recommendation: {
      type: currentType,
      rationale: gen.rationale || (recommendationData ? recommendationData.recommendation.rationale : '')
    },
    visual_theme: gen.visual_theme,
    json: gen.json
  };
  // Populate the editor: text fields for content, raw code behind the toggle
  editHtml.value   = gen.json.html;
  editScript.value = gen.json.script;
  codeCards.style.display = 'none';
  codeToggle.setAttribute('aria-expanded', 'false');
  codeToggle.lastChild.textContent = ' Show code';
  renderEditFields(gen.content);
  showStep(3);

  // Static companion text is generated on demand, right now — the designer
  // can edit HTML/JS while it writes. Output stays disabled until it lands.
  const token = ++confirmToken;
  if (staticCache[keyOf(currentType)]) {
    editStatic.value = staticCache[keyOf(currentType)];
    editStatic.disabled = false;
    s3GenerateBtn.disabled = false;
    return;
  }
  editStatic.value = '';
  editStatic.placeholder = 'Writing the static companion text...';
  editStatic.disabled = true;
  s3GenerateBtn.disabled = true;
  try {
    const text = await fetchStatic(currentType);
    if (token !== confirmToken) return; // user went back and confirmed another type
    editStatic.value = text;
  } catch (err) {
    if (token !== confirmToken) return;
    editStatic.value = '';
    editStatic.placeholder = 'The static text could not be generated — you can write it here yourself, or go back and confirm again to retry.';
  } finally {
    if (token === confirmToken) {
      editStatic.disabled = false;
      s3GenerateBtn.disabled = false;
    }
  }
});

s2StartOver.addEventListener('click', (e) => {
  e.preventDefault();
  showStep(1);
  textarea.focus();
});

backToPreviewLink.addEventListener('click', (e) => {
  e.preventDefault();
  showStep(2);
});

s3GenerateBtn.addEventListener('click', () => {
  // Apply the text-field edits to the current code by verbatim replacement,
  // then build Step 4 from the result
  const patched = applyContentEdits(editHtml.value, editScript.value);
  const data = {
    recommendation: confirmedResult.recommendation,
    visual_theme:   confirmedResult.visual_theme,
    json: patched,
    static: editStatic.value
  };
  populateStep4(data);
  showStep(4);
});

backToEditLink.addEventListener('click', (e) => {
  e.preventDefault();
  showStep(3);
});

function populateStep4(data) {
  const typeName = data.recommendation ? data.recommendation.type : data.type;
  s3TypeBadge.textContent = typeName;
  resultTheme.textContent = data.visual_theme;
  const accent = detectAccentColor(data.visual_theme);
  resultSwatch.style.background = accent;
  resultSwatch.setAttribute('title', `Accent color: ${accent}`);
  // Build the two-field JSON object Coursera expects and display it as a
  // formatted string. JSON.stringify handles all escaping automatically.
  const pluginJson = JSON.stringify({ html: data.json.html, script: data.json.script }, null, 2);
  resultJsonCode.textContent = pluginJson;
  resultStatic.textContent = data.static;
}

function setupCopy(btn, getTextFn) {
  btn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(getTextFn());
      const origHTML = btn.innerHTML;
      btn.textContent = 'Copied!';
      btn.classList.add('copied');
      setTimeout(() => { btn.innerHTML = origHTML; btn.classList.remove('copied'); }, 1500);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = getTextFn();
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      const origHTML = btn.innerHTML;
      btn.textContent = 'Copied!';
      btn.classList.add('copied');
      setTimeout(() => { btn.innerHTML = origHTML; btn.classList.remove('copied'); }, 1500);
    }
  });
}

setupCopy(document.getElementById('copy-json-btn'), () => resultJsonCode.textContent);
setupCopy(document.getElementById('copy-static-btn'), () => resultStatic.textContent);

textarea.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === 'Enter' && !analyzeBtn.disabled) analyzeBtn.click();
});
