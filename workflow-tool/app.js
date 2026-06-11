// ── API CONFIG ───────────────────────────────────────────────────────────
// Set USE_MOCK_API = true to use built-in sample data (no key needed).
// Set USE_MOCK_API = false to call Claude via the Netlify serverless
// function. The API key lives in Netlify environment variables only —
// it never appears in this file or in the browser.
const USE_MOCK_API = false;

const MOCK_RESPONSES = {
  "Accordion": {
    "type": "Accordion",
    "recommendation": {
      "type": "Accordion",
      "rationale": "This content introduces five distinct nursing assessment frameworks that learners may encounter unevenly — some will already know SBAR, others will not. The accordion format lets learners scan all five terms at once and choose which to read in depth, respecting prior knowledge and reducing cognitive load. Because each framework is a discrete named concept with a structured explanation, the glossary-style accordion is the clearest match."
    },
    "available_types": [
      { "type": "Accordion", "learning_goal": "Selective comprehension and reference", "pedagogical_note": "Learners see all five framework names at once before opening any. This overview supports scanning — learners can skip what they already know and focus on what they don't. Best when prior knowledge is uneven across the group." },
      { "type": "Click-to-reveal", "learning_goal": "Recall and retrieval practice", "pedagogical_note": "If the goal shifts from comprehension to memorization, click-to-reveal prompts learners to retrieve each full framework name from the abbreviation before confirming. The retrieval attempt — even an unsuccessful one — strengthens long-term retention more than reading." },
      { "type": "Tabbed explorer", "learning_goal": "Parallel navigation and comparison", "pedagogical_note": "If learners need to compare frameworks side-by-side or navigate between their details repeatedly, tabs give each framework its own persistent panel. Best when all frameworks are equally unfamiliar and the internal structure of each (full name, when to use, key steps) benefits from a dedicated layout." }
    ],
    "visual_theme": "Clinical EHR aesthetic using Eno green (#339898) as the accent color, Roboto Mono for framework abbreviations to suggest clinical documentation, and structured row layouts that reference the visual language of electronic health record interfaces.",
    "json": {
      "html": "<div style=\"font-family: 'Open Sans', Arial, sans-serif; max-width: 720px; margin: 0 auto; padding: 24px; background: #F3F2F1;\"><h2 style=\"font-family: 'Montserrat', Arial, sans-serif; color: #012169; font-size: 1.25rem; margin-bottom: 16px;\">Nursing Assessment Frameworks</h2><div id=\"accordion-container\"></div></div>",
      "script": "(function(){ function init(){ var frameworks = [{term:'SBAR',def:'Situation, Background, Assessment, Recommendation — a structured communication tool used during patient handoffs.'},{term:'HEAD-TO-TOE',def:'A systematic physical assessment approach moving from neurological status down through all body systems.'},{term:'OLDCARTS',def:'Onset, Location, Duration, Character, Alleviating factors, Relieving factors, Timing, Severity — used for symptom analysis.'},{term:'ABCDE',def:'Airway, Breathing, Circulation, Disability, Exposure — the primary survey framework for rapid patient assessment.'},{term:'CIWA-Ar',def:'Clinical Institute Withdrawal Assessment for Alcohol — a validated scale for monitoring and managing alcohol withdrawal symptoms.'}]; var container = document.getElementById('accordion-container'); frameworks.forEach(function(f){ var item = document.createElement('div'); item.style.cssText = 'border: 0.5px solid #E2E6ED; border-radius: 8px; margin-bottom: 8px; overflow: hidden; background: white;'; var btn = document.createElement('button'); btn.setAttribute('aria-expanded','false'); btn.style.cssText = 'width:100%;text-align:left;padding:14px 16px;background:white;border:none;cursor:pointer;font-family:Roboto Mono,Courier New,monospace;font-size:0.95rem;color:#012169;display:flex;justify-content:space-between;align-items:center;'; btn.innerHTML = f.term + '<span style=\"color:#339898;font-size:1.2rem;\">+</span>'; var panel = document.createElement('div'); panel.style.cssText = 'display:none;padding:14px 16px;font-size:0.9rem;color:#262626;border-top:0.5px solid #E2E6ED;line-height:1.6;'; panel.textContent = f.def; btn.addEventListener('click',function(){ var open = btn.getAttribute('aria-expanded')==='true'; btn.setAttribute('aria-expanded',String(!open)); panel.style.display = open?'none':'block'; btn.querySelector('span').textContent = open?'+':'-'; }); item.appendChild(btn); item.appendChild(panel); container.appendChild(item); }); } if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',init);}else{init();} })()"
    },
    "static": "Nursing practice relies on a set of standardized assessment frameworks that bring consistency and clarity to clinical documentation and communication. These frameworks are not interchangeable — each serves a distinct purpose and is applied in different clinical contexts, so nurses must understand when and why to use each one.\n\nSBAR (Situation, Background, Assessment, Recommendation) is the most widely used handoff communication tool in acute care settings. It gives nurses a predictable structure for reporting patient status changes to physicians or during shift transitions. HEAD-TO-TOE assessment is a systematic physical examination sequence that ensures no body system is overlooked during routine assessments.\n\nOLDCARTS guides symptom analysis by capturing the full character of a patient complaint — when it started, where it is, how long it lasts, what it feels like, and what makes it better or worse. ABCDE (Airway, Breathing, Circulation, Disability, Exposure) is the rapid primary survey framework used in emergency and deterioration scenarios. Finally, CIWA-Ar is a validated clinical instrument specifically for monitoring patients at risk of alcohol withdrawal, with scored items that guide medication decisions.\n\nTogether, these frameworks form the structural backbone of nursing assessment. Familiarity with all five — and clarity about when each applies — is foundational to safe, communicative practice."
  },
  "Tabbed Explorer": {
    "type": "Tabbed Explorer",
    "recommendation": {
      "type": "Tabbed Explorer",
      "rationale": "Five discrete frameworks of equal conceptual weight map naturally to five tabs, giving learners a side-by-side navigation experience without needing to scroll through a long page. Tabs allow focused reading of one framework at a time while keeping all other options persistently visible, which supports comparison and deliberate exploration. This format is well-suited when each item has parallel internal structure — full name, use context, and key components — as all five frameworks do."
    },
    "visual_theme": "Duke identity palette with Duke Navy (#012169) for active tab labels and selected underlines, Hatteras (#E2E6ED) for inactive tab backgrounds, and Eno green (#339898) as the accent color on component lists and in-tab headings to reinforce the clinical context.",
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
    "json": {
      "html": "<div style=\"font-family: Arial, sans-serif; max-width: 760px; margin: 0 auto; padding: 28px; background: #F3F2F1;\"><h2 style=\"color: #012169; font-size: 1.15rem; margin-bottom: 6px;\">Nursing Assessment Frameworks</h2><p style=\"color: #555; font-size: 0.88rem; margin-bottom: 20px;\">Click each card to reveal the full framework name and description.</p><div id=\"reveal-grid\" style=\"display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 16px;\"></div></div>",
      "script": "var cards = [{abbr:'SBAR',full:'Situation, Background, Assessment, Recommendation',desc:'A structured communication framework for patient handoffs and urgent clinical notifications between care team members.'},{abbr:'HEAD-TO-TOE',full:'Head-to-Toe Assessment',desc:'A systematic sequential physical assessment starting at the head and progressing downward through all body systems to ensure comprehensive coverage.'},{abbr:'OLDCARTS',full:'Onset, Location, Duration, Character, Alleviating/Relieving factors, Timing, Severity',desc:'A structured symptom history framework used to fully characterize a patient complaint during the clinical interview.'},{abbr:'ABCDE',full:'Airway, Breathing, Circulation, Disability, Exposure',desc:'A rapid primary survey framework used during acute deterioration and emergencies to identify and address life threats in priority order.'},{abbr:'CIWA-Ar',full:'Clinical Institute Withdrawal Assessment for Alcohol, Revised',desc:'A validated scoring tool for monitoring and managing alcohol withdrawal symptoms, with scored items guiding medication and intervention decisions.'}]; var grid = document.getElementById('reveal-grid'); cards.forEach(function(c) { var card = document.createElement('div'); card.style.cssText = 'background: #E2E6ED; border-radius: 10px; min-height: 160px; display: flex; flex-direction: column; justify-content: center; align-items: center; padding: 20px; cursor: pointer; border: 2px solid transparent; transition: box-shadow 0.2s;'; var front = document.createElement('div'); front.style.cssText = 'text-align: center;'; front.innerHTML = '<div style=\"font-family: Courier New, monospace; font-size: 1.3rem; font-weight: bold; color: #012169; margin-bottom: 8px;\">' + c.abbr + '</div><div style=\"font-size: 0.78rem; color: #555;\">Click to reveal</div>'; var back = document.createElement('div'); back.style.cssText = 'display: none; text-align: left;'; back.innerHTML = '<div style=\"font-size: 0.78rem; font-weight: bold; color: #339898; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 6px;\">' + c.abbr + '</div><div style=\"font-size: 0.85rem; font-weight: bold; color: #012169; margin-bottom: 8px; line-height: 1.4;\">' + c.full + '</div><div style=\"font-size: 0.82rem; color: #262626; line-height: 1.5;\">' + c.desc + '</div>'; card.appendChild(front); card.appendChild(back); var revealed = false; card.addEventListener('click', function() { if (!revealed) { revealed = true; front.style.display = 'none'; back.style.display = 'block'; card.style.background = 'white'; card.style.border = '2px solid #339898'; card.style.boxShadow = '0 2px 8px rgba(51,152,152,0.15)'; } else { revealed = false; back.style.display = 'none'; front.style.display = 'block'; card.style.background = '#E2E6ED'; card.style.border = '2px solid transparent'; card.style.boxShadow = 'none'; } }); grid.appendChild(card); });"
    },
    "static": "In clinical settings, nursing assessment frameworks are almost always referred to by their abbreviations. A nurse says 'I used SBAR' or 'I ran through ABCDE' — the full names are rarely spoken aloud. This creates a specific learning challenge: students must internalize both the abbreviation and the full conceptual structure it represents.\n\nClick-to-reveal cards address this directly. By showing only the abbreviation first, the format prompts learners to actively retrieve what they know before the answer is confirmed. This retrieval attempt — even when unsuccessful — strengthens the memory trace more effectively than reading a list of definitions.\n\nEach card in this set represents one framework. SBAR and ABCDE are the two most likely to be encountered early in clinical rotations, and most students will have some exposure to them. OLDCARTS and HEAD-TO-TOE are framework names that are less universally known before clinical placement. CIWA-Ar is the most specialized and is typically introduced in the context of medical-surgical or detox unit content.\n\nAfter working through all five cards, learners should be able to state the full name behind each abbreviation and identify the clinical context in which it is applied — the foundational level of framework knowledge required before applying them in simulated or real patient encounters."
  },
  "Image Hotspot": {
    "type": "Image Hotspot",
    "recommendation": {
      "type": "Image Hotspot",
      "rationale": "A hotspot interaction creates an active spatial mapping experience, inviting learners to connect each assessment framework to a visual anchor rather than reading a linear list. Mapping frameworks to zones of a body figure reinforces the logic of HEAD-TO-TOE and ABCDE as spatially grounded assessments while distinguishing SBAR, OLDCARTS, and CIWA-Ar as frameworks tied to communication and symptom analysis rather than anatomy. The interaction rewards curiosity-driven exploration and supports learners who process information visually."
    },
    "visual_theme": "Eno clinical green (#339898) for hotspot markers and active zone highlights against a clean white SVG body figure on a Hatteras (#E2E6ED) background, with Duke Navy (#012169) for tooltip headers — evoking the clean annotated diagrams found in clinical reference materials and anatomy atlases.",
    "json": {
      "html": "<div style=\"font-family: Arial, sans-serif; max-width: 720px; margin: 0 auto; padding: 24px; background: #F3F2F1;\"><h2 style=\"color: #012169; font-size: 1.15rem; margin-bottom: 6px;\">Assessment Framework Map</h2><p style=\"color: #555; font-size: 0.88rem; margin-bottom: 16px;\">Click a hotspot on the diagram to learn about each assessment framework.</p><div style=\"position: relative; display: inline-block; width: 100%; max-width: 680px;\" id=\"hotspot-container\"><svg viewBox=\"0 0 680 500\" xmlns=\"http://www.w3.org/2000/svg\" style=\"width:100%;background:#E2E6ED;border-radius:12px;display:block;\"><!-- Background --><rect width=\"680\" height=\"500\" fill=\"#E2E6ED\" rx=\"12\"/><!-- Body figure --><ellipse cx=\"340\" cy=\"80\" rx=\"38\" ry=\"44\" fill=\"white\" stroke=\"#012169\" stroke-width=\"2\"/><!-- Neck --><rect x=\"328\" y=\"120\" width=\"24\" height=\"20\" fill=\"white\" stroke=\"#012169\" stroke-width=\"2\"/><!-- Torso --><path d=\"M290 140 Q270 160 272 240 L272 320 Q272 330 340 330 Q408 330 408 320 L408 240 Q410 160 390 140 Z\" fill=\"white\" stroke=\"#012169\" stroke-width=\"2\"/><!-- Left arm --><path d=\"M290 155 Q260 170 250 260 Q248 275 255 280 Q265 285 270 275 Q278 235 295 200\" fill=\"white\" stroke=\"#012169\" stroke-width=\"2\"/><!-- Right arm --><path d=\"M390 155 Q420 170 430 260 Q432 275 425 280 Q415 285 410 275 Q402 235 385 200\" fill=\"white\" stroke=\"#012169\" stroke-width=\"2\"/><!-- Left leg --><path d=\"M300 325 Q295 370 295 430 Q295 445 308 445 Q320 445 322 430 Q325 385 330 335\" fill=\"white\" stroke=\"#012169\" stroke-width=\"2\"/><!-- Right leg --><path d=\"M380 325 Q385 370 385 430 Q385 445 372 445 Q360 445 358 430 Q355 385 350 335\" fill=\"white\" stroke=\"#012169\" stroke-width=\"2\"/><!-- Labels for zones --><text x=\"510\" y=\"85\" font-size=\"12\" fill=\"#555\" font-family=\"Arial, sans-serif\">Zone A: Head</text><text x=\"510\" y=\"185\" font-size=\"12\" fill=\"#555\" font-family=\"Arial, sans-serif\">Zone B: Chest</text><text x=\"510\" y=\"285\" font-size=\"12\" fill=\"#555\" font-family=\"Arial, sans-serif\">Zone C: Abdomen</text><text x=\"510\" y=\"340\" font-size=\"12\" fill=\"#555\" font-family=\"Arial, sans-serif\">Zone D: Upper body</text><text x=\"510\" y=\"420\" font-size=\"12\" fill=\"#555\" font-family=\"Arial, sans-serif\">Zone E: Lower body</text><!-- Connector lines --><line x1=\"378\" y1=\"80\" x2=\"505\" y2=\"82\" stroke=\"#339898\" stroke-width=\"1\" stroke-dasharray=\"4 3\"/><!-- Hotspot A: Head - ABCDE --><circle id=\"hs-a\" cx=\"340\" cy=\"80\" r=\"16\" fill=\"#339898\" opacity=\"0.85\" style=\"cursor:pointer;\"/><text x=\"340\" y=\"85\" text-anchor=\"middle\" font-size=\"13\" font-weight=\"bold\" fill=\"white\" font-family=\"Arial, sans-serif\" style=\"pointer-events:none;\">A</text><!-- Hotspot B: Chest - SBAR --><circle id=\"hs-b\" cx=\"340\" cy=\"185\" r=\"16\" fill=\"#339898\" opacity=\"0.85\" style=\"cursor:pointer;\"/><text x=\"340\" y=\"190\" text-anchor=\"middle\" font-size=\"13\" font-weight=\"bold\" fill=\"white\" font-family=\"Arial, sans-serif\" style=\"pointer-events:none;\">B</text><!-- Hotspot C: Abdomen - OLDCARTS --><circle id=\"hs-c\" cx=\"340\" cy=\"280\" r=\"16\" fill=\"#339898\" opacity=\"0.85\" style=\"cursor:pointer;\"/><text x=\"340\" y=\"285\" text-anchor=\"middle\" font-size=\"13\" font-weight=\"bold\" fill=\"white\" font-family=\"Arial, sans-serif\" style=\"pointer-events:none;\">C</text><!-- Hotspot D: Upper limbs - HEAD-TO-TOE --><circle id=\"hs-d\" cx=\"255\" cy=\"230\" r=\"16\" fill=\"#339898\" opacity=\"0.85\" style=\"cursor:pointer;\"/><text x=\"255\" y=\"235\" text-anchor=\"middle\" font-size=\"13\" font-weight=\"bold\" fill=\"white\" font-family=\"Arial, sans-serif\" style=\"pointer-events:none;\">D</text><!-- Hotspot E: Lower limbs - CIWA-Ar --><circle id=\"hs-e\" cx=\"340\" cy=\"420\" r=\"16\" fill=\"#339898\" opacity=\"0.85\" style=\"cursor:pointer;\"/><text x=\"340\" y=\"425\" text-anchor=\"middle\" font-size=\"13\" font-weight=\"bold\" fill=\"white\" font-family=\"Arial, sans-serif\" style=\"pointer-events:none;\">E</text></svg><div id=\"hs-tooltip\" style=\"display:none; position:absolute; top:10px; right:10px; width:220px; background:white; border:2px solid #339898; border-radius:8px; padding:14px; box-shadow: 0 2px 10px rgba(0,0,0,0.12);\"><button id=\"hs-close\" style=\"position:absolute;top:8px;right:8px;background:none;border:none;cursor:pointer;font-size:1rem;color:#555;line-height:1;\">x</button><div id=\"hs-title\" style=\"font-size:0.78rem;font-weight:bold;color:#339898;text-transform:uppercase;letter-spacing:0.07em;margin-bottom:4px;\"></div><div id=\"hs-name\" style=\"font-size:0.95rem;font-weight:bold;color:#012169;margin-bottom:8px;line-height:1.3;\"></div><div id=\"hs-body\" style=\"font-size:0.83rem;color:#262626;line-height:1.55;\"></div></div></div></div>",
      "script": "var hotspotData = {a:{abbr:'ABCDE',name:'Airway, Breathing, Circulation, Disability, Exposure',body:'Used in acute deterioration and emergencies. Starts with the airway — the fastest threat to life — and systematically works through breathing, circulation, neurological status, and full body exposure. Applied before any other detailed assessment in an unstable patient.'},b:{abbr:'SBAR',name:'Situation, Background, Assessment, Recommendation',body:'A communication framework, not a physical assessment tool. Used when calling a physician or handing off care. Ensures critical information is conveyed in a predictable structure: what is happening, relevant history, your clinical interpretation, and what you are asking for.'},c:{abbr:'OLDCARTS',name:'Onset, Location, Duration, Character, Alleviating/Relieving factors, Timing, Severity',body:'Used to fully characterize a symptom during the patient interview. Each element captures a different dimension of the complaint. Particularly useful when a patient presents with pain, discomfort, or any symptom requiring a structured history before clinical decision-making.'},d:{abbr:'HEAD-TO-TOE',name:'Head-to-Toe Assessment',body:'A comprehensive sequential physical assessment starting at the head and progressing downward through all body systems. Used on admission and during routine shift assessments to ensure no system is overlooked. Documents baseline status and identifies changes over time.'},e:{abbr:'CIWA-Ar',name:'Clinical Institute Withdrawal Assessment for Alcohol, Revised',body:'A validated scoring tool for monitoring alcohol withdrawal. Items include tremor, sweating, anxiety, agitation, perceptual disturbances, and orientation. A total score guides decisions about medication administration. Typically repeated every 1-4 hours in at-risk patients.'}}; var tooltip = document.getElementById('hs-tooltip'); var title = document.getElementById('hs-title'); var name = document.getElementById('hs-name'); var body = document.getElementById('hs-body'); function showTip(key) { var d = hotspotData[key]; title.textContent = d.abbr; name.textContent = d.name; body.textContent = d.body; tooltip.style.display = 'block'; } ['a','b','c','d','e'].forEach(function(k) { var el = document.getElementById('hs-' + k); if (el) { el.addEventListener('click', function() { showTip(k); }); } }); document.getElementById('hs-close').addEventListener('click', function() { tooltip.style.display = 'none'; });"
    },
    "static": "Clinical assessment frameworks can be understood as applying to different domains of nursing practice: some map to the physical body, some to clinical communication, and some to structured symptom analysis. This visual mapping makes those distinctions tangible rather than abstract.\n\nABCDE is the most spatially immediate framework — it literally moves through physiological systems in the order most critical to survival, beginning with airway and ending with full-body exposure. HEAD-TO-TOE is similarly body-anchored, progressing from neurological assessment at the head through every system to the extremities. Both frameworks have an inherent spatial logic that a body diagram can reinforce.\n\nSBAR and OLDCARTS have no direct anatomical anchor — SBAR structures communication between clinicians, and OLDCARTS structures the nurse's conversation with the patient about a symptom. Mapping them to a body figure makes the point that they are applied in the context of a patient encounter but are not themselves physical assessment sequences.\n\nCIWA-Ar occupies a middle ground: it involves observing physical signs (tremor, diaphoresis, agitation) and asking the patient questions, but its output is a numerical score rather than a body-system documentation. Treating it as a distinct category in a visual framework helps learners understand that validated scoring tools are a different kind of clinical instrument from open-ended assessment frameworks."
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

async function callClaude(userInput, forcedType) {
  if (USE_MOCK_API) {
    await new Promise(r => setTimeout(r, 800));
    if (forcedType && MOCK_RESPONSES[forcedType]) return MOCK_RESPONSES[forcedType];
    return MOCK_RESPONSES['Accordion'];
  }

  // Call Claude via the Netlify serverless function.
  // The API key lives in Netlify's environment variables — never in
  // the browser or this file. No credentials needed on the client side.
  const response = await fetch('/.netlify/functions/analyze', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ userInput, forcedType })
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

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    sseBuffer += decoder.decode(value, { stream: true });
    const lines = sseBuffer.split('\n');
    sseBuffer = lines.pop(); // keep any incomplete line for the next chunk
    for (const line of lines) {
      if (!line.startsWith('data: ')) continue;
      const payload = line.slice(6).trim();
      if (payload === '[DONE]') continue;
      try {
        const evt = JSON.parse(payload);
        if (evt.type === 'content_block_delta' && evt.delta?.type === 'text_delta') {
          raw += evt.delta.text;
        }
      } catch { /* ignore malformed SSE lines */ }
    }
  }

  // Flush anything left in the buffer after the stream closes
  if (sseBuffer.trim()) {
    for (const line of sseBuffer.split('\n')) {
      if (!line.startsWith('data: ')) continue;
      const payload = line.slice(6).trim();
      if (payload === '[DONE]') continue;
      try {
        const evt = JSON.parse(payload);
        if (evt.type === 'content_block_delta' && evt.delta?.type === 'text_delta') {
          raw += evt.delta.text;
        }
      } catch { /* ignore */ }
    }
  }

  const cleaned = raw
    .replace(/^```json\n?/, '')
    .replace(/^```\n?/, '')
    .replace(/\n?```$/, '')
    .trim();

  // First attempt — direct parse
  try {
    return JSON.parse(cleaned);
  } catch (parseErr) {
    // Second attempt — repair common Claude JSON issues:
    // actual newlines/tabs inside string values break JSON.parse
    const repaired = cleaned
      .replace(/:\s*"([\s\S]*?)"\s*([,}])/g, (match, val, trail) => {
        const fixed = val
          .replace(/\\/g, '\\\\')   // escape lone backslashes first
          .replace(/\n/g, '\\n')    // newlines → \n
          .replace(/\r/g, '\\r')    // carriage returns → \r
          .replace(/\t/g, '\\t')    // tabs → \t
          .replace(/\\\\/g, '\\');  // undo double-escaped backslashes we already had
        return `: "${fixed}"${trail}`;
      });
    try {
      return JSON.parse(repaired);
    } catch {
      throw new Error(`The AI returned a response that could not be parsed. Please try again. (Detail: ${parseErr.message})`);
    }
  }
}

let currentInput = '';
let currentResult = null;
let confirmedResult = null;
const typeCache = {};   // stores results keyed by type name for this session

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

// Normalise a type name from Claude's response to match the button data-type
// values (case-insensitive). Falls back to the raw value if no match found.
// Normalise a type name to the canonical form used as the button data-type
function normalizeType(typeName) {
  if (!typeName) return typeName;
  const match = s2TypeButtons.find(
    btn => btn.dataset.type.toLowerCase() === typeName.toLowerCase()
  );
  return match ? match.dataset.type : typeName;
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
    if (typeInfo.type === recommendedType) {
      btn.classList.add('active');
    } else if (typeCache[typeInfo.type]) {
      btn.classList.add('cached'); // already generated in this session
    }
    s2TypeButtonsContainer.appendChild(btn);
    s2TypeButtons.push(btn);

    // Show pedagogy note on hover / focus
    btn.addEventListener('mouseenter', () => showPedagogyNote(typeInfo));
    btn.addEventListener('focus',      () => showPedagogyNote(typeInfo));

    // Click to switch type
    btn.addEventListener('click', async () => {
      const type = btn.dataset.type;
      const currentTypeName = currentResult && currentResult.recommendation
        ? normalizeType(currentResult.recommendation.type)
        : '';
      if (type === currentTypeName) return;
      if (typeCache[type]) { updatePreview(typeCache[type]); return; }
      s2TypeButtons.forEach(b => b.disabled = true);
      s2Regenerating.textContent = 'Generating ' + type + '...';
      s2Regenerating.style.color = '';
      s2Regenerating.classList.add('visible');
      try {
        const result = await callClaude(currentInput, type);
        updatePreview(result);
      } catch (err) {
        s2Regenerating.textContent = 'Something went wrong generating ' + type + '. Try again.';
        s2Regenerating.style.color = '#C84E00';
        setTimeout(() => {
          s2Regenerating.textContent = 'Regenerating...';
          s2Regenerating.style.color = '';
          s2Regenerating.classList.remove('visible');
        }, 4000);
      } finally {
        s2TypeButtons.forEach(b => b.disabled = false);
        // Only hide the message if it's still the default text (not an error)
        if (!s2Regenerating.style.color) s2Regenerating.classList.remove('visible');
      }
    });
  });

  // Show recommended type's note by default
  const rec = availableTypes.find(t => t.type === recommendedType);
  if (rec) showPedagogyNote(rec);
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

function updatePreview(result) {
  currentResult = result;
  const rawType  = result.recommendation ? result.recommendation.type : result.type;
  const rationale = result.recommendation ? result.recommendation.rationale : '';

  // Detect out-of-scope — Claude may put the prefix in either field
  const typeHasPrefix     = rawType.trimStart().toUpperCase().startsWith('OUT OF SCOPE:');
  const rationaleHasPrefix = rationale.trimStart().toUpperCase().startsWith('OUT OF SCOPE:');
  const isOutOfScope      = typeHasPrefix || rationaleHasPrefix;

  // Always display a clean type name with no "OUT OF SCOPE:" prefix
  const cleanType = rawType.replace(/^out of scope:\s*/i, '').trim();
  const typeName  = normalizeType(cleanType) || cleanType;

  // Store in session cache keyed by normalised type name
  typeCache[typeName] = result;

  // Surface out-of-scope banner and set detail text
  s2OutOfScope.style.display = isOutOfScope ? 'flex' : 'none';
  if (isOutOfScope) {
    // Use whichever field carries the explanation
    const detail = rationaleHasPrefix
      ? rationale.replace(/^out of scope:\s*/i, '')
      : rawType.replace(/^out of scope:\s*/i, '');
    s2OutOfScopeDetail.textContent = ' ' + detail;
    s2RationaleText.style.display = 'none';
  } else {
    s2RationaleText.style.display = '';
  }

  s2RecommendBadge.textContent = (isOutOfScope ? 'Closest alternative: ' : 'Recommended: ') + typeName;
  s2RationaleText.textContent = rationale;

  // Build type buttons exactly once from the initial recommendation response.
  // On all subsequent type switches, only update active/cached state — never
  // rebuild, which would change or lose the available options.
  if (s2TypeButtons.length === 0 && result.available_types && result.available_types.length) {
    renderTypeButtons(result.available_types, typeName);
  } else {
    s2TypeButtons.forEach(btn => {
      const isCurrent = btn.dataset.type === typeName;
      btn.classList.toggle('active', isCurrent);
      btn.classList.toggle('cached', !!typeCache[btn.dataset.type] && !isCurrent);
    });
  }

  setPreviewIframe(result);
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

analyzeBtn.addEventListener('click', async () => {
  const input = textarea.value.trim();
  if (input.length < 50) return;
  currentInput = input;
  errorBox.style.display = 'none';
  // Reset type buttons and cache so the new analysis starts clean
  s2TypeButtons = [];
  s2TypeButtonsContainer.innerHTML = '';
  Object.keys(typeCache).forEach(k => delete typeCache[k]);
  s2PedagogyPanel.classList.remove('visible');
  setStep2Substate('loading');
  showStep(2);
  try {
    const result = await callClaude(input);
    updatePreview(result);
    setStep2Substate('preview');
  } catch (err) {
    showStep(1);
    errorBox.textContent = `Something went wrong: ${err.message}. Please try again.`;
    errorBox.style.display = 'block';
  }
});

s2ConfirmBtn.addEventListener('click', () => {
  confirmedResult = currentResult;
  // Populate the edit textareas with the generated content
  editHtml.value   = confirmedResult.json.html;
  editScript.value = confirmedResult.json.script;
  editStatic.value = confirmedResult.static;
  showStep(3);
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
  // Build Step 4 from whatever is currently in the edit textareas
  const data = {
    recommendation: confirmedResult.recommendation,
    visual_theme:   confirmedResult.visual_theme,
    json: { html: editHtml.value, script: editScript.value },
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
