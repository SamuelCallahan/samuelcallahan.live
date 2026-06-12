/* AI Readiness quiz — all content and logic. No dependencies. */

const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xnjygveq';

const CATEGORIES = {
  repetitive: {
    name: 'Repetitive work',
    diagnosis: {
      low: 'A big slice of your week is going to work a machine should be doing. This is usually the fastest win — the hours are sitting right there.',
      mid: 'Some of your routine work runs itself, but real time is still leaking out every week. A few targeted automations would close the gap.',
      high: 'Your routine work is tight. Whatever time you’re losing, it isn’t here — your opportunity lives in another category.',
    },
  },
  communication: {
    name: 'Customer communication',
    diagnosis: {
      low: 'Slow responses and dropped follow-ups are quietly costing you customers you already paid to attract. This is where automation tends to pay for itself first — in revenue, not just hours.',
      mid: 'You respond and follow up, but it depends on you remembering. An automated layer would catch what slips on busy weeks.',
      high: 'Leads get answered and followed up reliably. This part of your business is doing its job.',
    },
  },
  content: {
    name: 'Content & marketing',
    diagnosis: {
      low: 'Marketing only happens when you have spare time — which means it mostly doesn’t. AI cuts production time enough to make consistency realistic.',
      mid: 'You’re producing, but it costs more time than it should. Faster production and systematic repurposing would multiply output without more hours.',
      high: 'You’ve got a working content engine. Gains here would be incremental, not transformative.',
    },
  },
  ai: {
    name: 'Current AI usage',
    diagnosis: {
      low: 'You’re starting from zero — which is actually the strongest position on this quiz. Every improvement is still on the table, and you get to skip the trial-and-error most people pay for.',
      mid: 'You’ve touched the tools, but they’re not wired into how the business runs. The gap between “using ChatGPT sometimes” and “workflows that run without you” is where the real return is.',
      high: 'You’re already an AI-forward operator. The question isn’t whether to use it — it’s which builds compound.',
    },
  },
};

// Each answer is [label, points]. Max 3 points per question, 3 questions per category.
const QUESTIONS = [
  {
    category: 'repetitive',
    text: 'How many hours a week do you (or your team) spend on repetitive admin — data entry, moving info between tools, scheduling?',
    answers: [['0–2 hours', 3], ['3–5 hours', 2], ['6–10 hours', 1], ['More than 10 hours', 0]],
  },
  {
    category: 'repetitive',
    text: 'When a recurring task comes up — invoicing, onboarding a new client — how does it get done?',
    answers: [
      ['It runs automatically', 3],
      ['There’s a written process someone follows', 2],
      ['Someone does it from memory', 1],
      ['We figure it out from scratch each time', 0],
    ],
  },
  {
    category: 'repetitive',
    text: 'How often does something fall through the cracks — a missed follow-up, a forgotten step, a late reply?',
    answers: [['Almost never', 3], ['A few times a month', 2], ['Weekly', 1], ['Honestly, all the time', 0]],
  },
  {
    category: 'communication',
    text: 'How quickly does a new lead or inquiry get a response?',
    answers: [
      ['Within minutes, automatically', 3],
      ['Within a few hours', 2],
      ['Within a day or two', 1],
      ['Whenever I get to it', 0],
    ],
  },
  {
    category: 'communication',
    text: 'How are quotes, bookings, or client intake handled?',
    answers: [
      ['Self-serve — customers book or buy without me', 3],
      ['Templates I fill in', 2],
      ['Mostly by hand, every time', 1],
      ['It’s different every time and lives in my head', 0],
    ],
  },
  {
    category: 'communication',
    text: 'What happens to leads who don’t buy right away?',
    answers: [
      ['They enter an automatic follow-up sequence', 3],
      ['I follow up manually, on a system', 2],
      ['I follow up when I remember', 1],
      ['Nothing — they drift away', 0],
    ],
  },
  {
    category: 'content',
    text: 'How consistently do you put out marketing content — emails, posts, ads?',
    answers: [['On a regular schedule', 3], ['Most weeks', 2], ['In bursts, when I find time', 1], ['Rarely or never', 0]],
  },
  {
    category: 'content',
    text: 'How long does one piece of marketing take to produce, start to finish?',
    answers: [
      ['Under 30 minutes', 3],
      ['About an hour', 2],
      ['A few hours', 1],
      ['Half a day or more — so it often doesn’t happen', 0],
    ],
  },
  {
    category: 'content',
    text: 'When you do make content, does it get reused across channels?',
    answers: [
      ['Always — one idea becomes many pieces', 3],
      ['Sometimes', 2],
      ['Rarely', 1],
      ['One-and-done', 0],
    ],
  },
  {
    category: 'ai',
    text: 'Do you use AI tools like ChatGPT or Claude in your work today?',
    answers: [
      ['Daily, wired into real workflows', 3],
      ['A few times a week', 2],
      ['I’ve tried them a little', 1],
      ['Never', 0],
    ],
  },
  {
    category: 'ai',
    text: 'Do any of your tools talk to each other automatically — Zapier, n8n, native integrations?',
    answers: [
      ['Several automations running', 3],
      ['One or two', 2],
      ['I’ve heard of those', 1],
      ['Everything is manual', 0],
    ],
  },
  {
    category: 'ai',
    text: 'If AI could save you 10 hours a week, could you name which 10 hours?',
    answers: [
      ['Yes — I know exactly where', 3],
      ['I have a rough idea', 2],
      ['Maybe one or two things', 1],
      ['No idea — that’s why I’m here', 0],
    ],
  },
];

const BANDS = [
  {
    min: 70,
    label: 'Operating',
    copy: 'You run tighter than most. At your level the wins are surgical — specific high-leverage automations, not basics.',
  },
  {
    min: 40,
    label: 'Emerging',
    copy: 'You’ve got pieces working, but they don’t add up to a system yet. You’re past the hard part — starting. The next moves are about connecting what you have.',
  },
  {
    min: 0,
    label: 'Untapped',
    copy: 'Most of your potential is still on the table — which is the expensive way to run a business, but the best possible starting point. The gap between where you are and even average AI usage is measured in hours per week.',
  },
];

const MAX_PER_CATEGORY = 9;
const MAX_TOTAL = QUESTIONS.length * 3;

// --- State ---
let current = 0;
const responses = []; // { question, category, answer, points }

// --- Elements ---
const el = (id) => document.getElementById(id);
const states = { hero: el('hero'), quiz: el('quiz'), gate: el('gate'), results: el('results') };

function show(stateName) {
  Object.entries(states).forEach(([name, section]) => {
    section.hidden = name !== stateName;
  });
  window.scrollTo(0, 0);
}

// --- Quiz flow ---
function renderQuestion() {
  const q = QUESTIONS[current];
  el('progress-label').textContent = `Question ${current + 1} of ${QUESTIONS.length}`;
  el('progress-fill').style.width = `${(current / QUESTIONS.length) * 100}%`;
  el('question-category').textContent = CATEGORIES[q.category].name;
  el('question-text').textContent = q.text;
  el('back').hidden = current === 0;

  const answersDiv = el('answers');
  answersDiv.innerHTML = '';
  q.answers.forEach(([label, points]) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'answer';
    btn.textContent = label;
    btn.addEventListener('click', () => selectAnswer(q, label, points));
    answersDiv.appendChild(btn);
  });
}

function selectAnswer(q, label, points) {
  responses[current] = { question: q.text, category: q.category, answer: label, points };
  current += 1;
  if (current < QUESTIONS.length) {
    renderQuestion();
  } else {
    show('gate');
  }
}

// --- Scoring ---
function computeScores() {
  const categoryPoints = {};
  Object.keys(CATEGORIES).forEach((c) => { categoryPoints[c] = 0; });
  responses.forEach((r) => { categoryPoints[r.category] += r.points; });

  const categoryScores = {};
  Object.entries(categoryPoints).forEach(([c, pts]) => {
    categoryScores[c] = Math.round((pts / MAX_PER_CATEGORY) * 100);
  });

  const total = responses.reduce((sum, r) => sum + r.points, 0);
  const overall = Math.round((total / MAX_TOTAL) * 100);
  return { overall, categoryScores };
}

function bandFor(score) {
  if (score >= 70) return 'high';
  if (score >= 40) return 'mid';
  return 'low';
}

// --- Results ---
function renderResults({ overall, categoryScores }) {
  el('overall-score').textContent = overall;
  const band = BANDS.find((b) => overall >= b.min);
  el('band-label').textContent = band.label;
  el('band-copy').textContent = band.copy;

  const container = el('category-results');
  container.innerHTML = '';
  let weakest = null;
  Object.entries(categoryScores).forEach(([key, score]) => {
    if (!weakest || score < categoryScores[weakest]) weakest = key;

    const block = document.createElement('div');
    block.className = 'category-block';
    block.innerHTML = `
      <div class="category-header">
        <h4>${CATEGORIES[key].name}</h4>
        <span class="category-score">${score}%</span>
      </div>
      <div class="bar-track"><div class="bar-fill" style="width:${score}%"></div></div>
      <p>${CATEGORIES[key].diagnosis[bandFor(score)]}</p>
    `;
    container.appendChild(block);
  });

  el('opportunity-name').textContent = CATEGORIES[weakest].name;
  show('results');
}

// --- Email gate / Formspree ---
function submitGate(event) {
  event.preventDefault();
  const email = el('email').value.trim();
  const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  el('email-error').hidden = valid;
  if (!valid) return;

  const scores = computeScores();

  // Flat keys + readable answer log — nested JSON renders poorly in Formspree's dashboard.
  const payload = { email, overall_score: scores.overall };
  Object.entries(scores.categoryScores).forEach(([key, score]) => {
    payload[`score_${key}`] = `${score}%`;
  });
  payload.answers = responses
    .map((r) => `[${CATEGORIES[r.category].name}] ${r.question} → ${r.answer}`)
    .join('\n');

  // Fire-and-forget: a capture failure must never block the results reveal.
  fetch(FORMSPREE_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(payload),
  }).catch((err) => console.error('Lead capture failed:', err));

  renderResults(scores);
}

// --- Wire up ---
el('start-quiz').addEventListener('click', () => {
  current = 0;
  responses.length = 0;
  renderQuestion();
  show('quiz');
});

el('back').addEventListener('click', () => {
  if (current > 0) {
    current -= 1;
    renderQuestion();
  }
});

el('gate-form').addEventListener('submit', submitGate);
