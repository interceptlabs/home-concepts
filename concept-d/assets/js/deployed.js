/* ── staging script: MAIN ── */

/* ============ SECTION 01 · Read & Reveal panel ============ */
const PROBLEMS_RR = {
  intelligence:{
    num:'01', name:'The Intelligence Problem',
    quote:'My research is stale by the time we act on it, and we&rsquo;re always a step behind the market.',
    attrib:'A CMO, networking infrastructure brand',
    tells:[
      'Traditional research is too slow and too expensive for the pace we move at.',
      'The findings come back telling us what we already knew.',
      'We can never be sure we&rsquo;re not hearing from the same panel of people again.'
    ],
    signalNum:'45%',
    signalLbl:'of the data marketers use to make business decisions is incomplete, inaccurate, or out of date. (Adverity, State of Marketing Data Quality, 2025)',
    bridge:'We triangulate live signals no single source can see on its own, keeping go-to-market current and putting on-demand account research in sellers&rsquo; hands.'
  },
  visibility:{
    num:'02', name:'The Visibility Problem',
    quote:'We&rsquo;ve spent our entire careers understanding human buyers. We have no idea how to influence the AI now deciding what they see.',
    attrib:'A VP Marketing, semiconductor brand',
    tells:[
      'ChatGPT, Gemini, Copilot, and AI Overviews now sit between you and the buyer.',
      'The content that persuades a human does not win an engine. Winning one takes content built for it on purpose.',
      'Leadership wants the score moved now, but the training behind the answers is already locked.'
    ],
    signalNum:'51%',
    signalLbl:'Of B2B software buyers now begin their research in an AI chatbot rather than a search engine. (G2 Buyer Behavior Report, 2025)',
    bridge:'Through voice-of-customer research, we learn how buyers actually prompt the AI engines. We then simulate thousands of those prompts across industries, buying journeys, and personas to map where you show up and where you don&rsquo;t. From there, we build the content and campaigns that make you the answer buyers get.'
  },
  velocity:{
    num:'03', name:'The Velocity Problem',
    quote:'By the time our content and campaigns are ready, the moment has passed.',
    attrib:'A Global Campaigns Director, enterprise platform',
    tells:[
      'Every persona, account, and buying stage needs its own version, and there are too many to pre-produce.',
      'Too many review layers, and agencies that don&rsquo;t know the subject matter, so we end up rewriting everything.',
      'The team keeps shrinking while the demand keeps growing, so we have to move faster with less.'
    ],
    signalNum:'78%',
    signalLbl:'of marketers say they need more personalized content than they&rsquo;re able to produce. (Salesforce, State of Marketing, 2026)',
    bridge:'We triangulate live signals, then run human-led ideas, hero content, and positioning through an AI-native content and campaign engine. It versions that work for every persona, account, stage, and language, and gets it to your execution teams fast enough to meet the moment.'
  },
  activation:{
    num:'04', name:'The Activation Problem',
    quote:'We produce more content and campaigns than ever, but most of it never reaches the right people, and our partners rarely pick it up.',
    attrib:'A VP of Demand Generation, enterprise platform',
    tells:[
      'We produce more content and campaign kits than anyone can use, and no one knows what to reach for when.',
      'Partners are buried in generic campaigns from every vendor, and adapting ours takes more resources than they have.',
      'We can&rsquo;t always tell where our audience is paying attention, so we keep defaulting to the same channels.'
    ],
    signalNum:'',
    signalLbl:'Most B2B technology revenue flows through indirect channels, yet most co-marketing content never gets activated.',
    bridge:'We run activation through our 10-point go-to-market flywheel, so every stage fires together, and the right content reaches the right person at the right time. Then we equip your channel partners to extend that reach into markets your own team can&rsquo;t cover alone.'
  }
};
/* Pre-render all four panels once, then switch by toggling .is-active (crossfade, no DOM thrash). */
function buildSolve(){
  const detail = document.getElementById('solveDetail');
  if(!detail) return;
  detail.innerHTML = Object.keys(PROBLEMS_RR).map(key => {
    const p = PROBLEMS_RR[key];
    const sigNum = p.signalNum ? `<div class="solve-signal-num">${p.signalNum}</div>` : '';
    return `<div class="solve-panel${key === 'intelligence' ? ' is-active' : ''}" data-panel="${key}" role="tabpanel">
      <p class="solve-quote">&ldquo;${p.quote}&rdquo;</p>
      <p class="solve-attrib">${p.attrib}</p>
      <ul class="solve-tells">${p.tells.map(t => '<li>'+t+'</li>').join('')}</ul>
      <div class="solve-signal${p.signalNum ? '' : ' solve-signal--q'}">${sigNum}<div class="solve-signal-lbl">${p.signalLbl}</div></div>
      <p class="solve-bridge">${p.bridge}</p>
    </div>`;
  }).join('');
}
function activateSolve(key){
  document.querySelectorAll('.solve-tab').forEach(t => {
    const on = t.dataset.solve === key;
    t.classList.toggle('is-active', on);
    t.setAttribute('aria-selected', on ? 'true' : 'false');
  });
  document.querySelectorAll('.solve-panel').forEach(pl => pl.classList.toggle('is-active', pl.dataset.panel === key));
}
buildSolve();
/* Activate on click only (Enter/Space fire click natively on the button) — hover is a
   non-committal highlight, selection is deliberate. */
document.querySelectorAll('.solve-tab').forEach(tab => {
  tab.addEventListener('click', () => activateSolve(tab.dataset.solve));
});

/* ============ SECTION 02 · InterceptOS problem selector ============ */
const PROBLEM_FLOWS = {
  intelligence:{
    job:'Bring every signal together so you&rsquo;re never a step behind.',
    layer:'Campaign Studio',
    stages:[
      {tag:'Diagnostic',cls:'stage-diag',name:'Aggregate the signals',agents:['Watchtower','Signal','Dive'],desc:'Pull together real-time market signals, what buyers are downloading and the topics they&rsquo;re searching, and AI-powered desk research, so you see shifts as they happen.'},
      {tag:'Core',cls:'stage-core',name:'Scan the competition',agents:['Geo','Dive'],desc:'Run a continuous competitive scan across search, AI engines, paid social, content, and brand, and track how their messaging and positioning shift over time.'},
      {tag:'Innovation',cls:'stage-inn',name:'Map the account',agents:['Radar'],desc:'Map each buying committee&rsquo;s priorities, pain points, and the events their execs attend, then recommend the content to put in front of them.'},
      {tag:'Outcome',cls:'stage-out',name:'Greater go-to-market precision',agents:[],desc:'You know the pain points, priorities, and buying triggers at the industry, persona, and account level, plus the competitive landscape, so you can design go-to-market campaigns with far greater precision.'}
    ]
  },
  visibility:{
    job:'Show up when buyers ask the AI engines, and build the content that gets you cited.',
    layer:'Campaign Studio',
    stages:[
      {tag:'Diagnostic',cls:'stage-diag',name:'Test the prompts buyers actually use',agents:['Geo'],desc:'Learn how real buyers prompt the engines, then run those prompts across ChatGPT, Gemini, Copilot, and AI Overviews to see where you surface and where you&rsquo;re left out.'},
      {tag:'Core',cls:'stage-core',name:'Map the content gaps',agents:['Index'],desc:'Find where your content is missing, thin, or unreadable to search engines, compared to the questions buyers are actually asking.'},
      {tag:'Innovation',cls:'stage-inn',name:'Build the content that gets cited',agents:['Atom'],desc:'We don&rsquo;t stop at the gaps. We build content that engines can read and cite, structured using our BETA framework (Best-fit, Evidence, Trade-offs, Answerability).'},
      {tag:'Outcome',cls:'stage-out',name:'You become the answer',agents:[],desc:'When buyers ask the AI engines, you&rsquo;re in the answer they get, because the content is built to be cited.'}
    ]
  },
  velocity:{
    job:'Produce the right content fast enough to move with the market.',
    layer:'Campaign Studio',
    stages:[
      {tag:'Diagnostic',cls:'stage-diag',name:'Pinpoint what to produce',agents:['Watchtower'],desc:'Read what the market needs right now, from the shifts and gaps Intelligence and Visibility surfaced, and pinpoint the content and campaigns worth making.'},
      {tag:'Core',cls:'stage-core',name:'Audit what you have',agents:['Index'],desc:'Run an agentic audit of your existing content and campaigns to see how well-positioned you are to meet that, and where you fall short.'},
      {tag:'Innovation',cls:'stage-inn',name:'Atomize and hyper-personalize',agents:['Atom','Cortex'],desc:'Atomize what you have into hyper-personalized variants by segment, account, and stage, pre-tested with neuroscience data so the strongest creative goes out.'},
      {tag:'Outcome',cls:'stage-out',name:'Right content, ready to activate',agents:[],desc:'You have the right content and campaigns to meet each customer segment&rsquo;s real-time needs, and you&rsquo;re set up to activate.'}
    ]
  },
  activation:{
    job:'Get the right content in front of the right people at the right time, across your channels and partners.',
    layer:'Partner Demand Center',
    stages:[
      {tag:'Diagnostic',cls:'stage-diag',name:'Decide where to focus',agents:['Watchtower'],desc:'Pinpoint which segments, accounts, and markets need to move, global or regional, and the business impact you&rsquo;re driving. AI-powered propensity modeling narrows it to the accounts most likely to convert.'},
      {tag:'Core',cls:'stage-core',name:'Pick the right channels and the right content',agents:['Atom'],desc:'Whether your execution partners run it or we do, we pick the right channels for each audience and make sure the content is purpose-built for them.'},
      {tag:'Innovation',cls:'stage-inn',name:'Arm the channel and the field',agents:['Taylor','Telly','Sales Dojo'],desc:'Channel partners get campaign agents that adapt your global campaigns and run them in market fast. AI call-downs generate and qualify regional leads, and sellers rehearse against simulated audiences.'},
      {tag:'Outcome',cls:'stage-out',name:'Your campaigns run in every market',agents:[],desc:'Everyone executing is aligned and equipped, whether that&rsquo;s your team, a partner, or us. The right regional accounts are in focus, and your channel partners are executing your campaigns in market.'}
    ]
  }
};

function renderFlow(p){
  const f = PROBLEM_FLOWS[p];
  if(!f) return;
  const probFlowEl = document.getElementById('probFlow');
  if(!probFlowEl) return;
  const stagesHtml = f.stages.map((s,i) => {
    const agents = `<div class="prob-flow-stage-agents">${s.agents.map(a => '<span class="agent-chip">'+a+'</span>').join('')}</div>`;
    const sep = i < f.stages.length - 1 ? '<div class="prob-flow-conn"></div>' : '';
    return `<div class="prob-flow-stage ${s.cls}">
      <span class="prob-flow-stage-tag">${s.tag}</span>
      <div class="prob-flow-stage-name">${s.name}</div>
      ${agents}
      <p class="prob-flow-stage-desc">${s.desc}</p>
    </div>${sep}`;
  }).join('');
  probFlowEl.innerHTML = `
    <div class="prob-flow-head">
      <p class="prob-flow-job"><b>The job:</b> ${f.job}</p>
      <span class="prob-flow-chip">Runs on <b>${f.layer}</b></span>
    </div>
    <div class="prob-flow-stages">${stagesHtml}</div>
    <div class="prob-flow-bridge">
      <a href="#agents">Meet the agents that compose this work <span class="arrow">&darr;</span></a>
    </div>
  `;
}
document.querySelectorAll('.prob-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.prob-tab').forEach(t => t.setAttribute('aria-selected','false'));
    tab.setAttribute('aria-selected','true');
    renderFlow(tab.dataset.p);
  });
});
renderFlow('intelligence');

/* ============ AGENT ROSTER · 4 categories + cross-applicability ============ */
const AGENTS = {
  watchtower:{cats:['strategy','sales'],primary:'strategy',type:'Audience signals',name:'Watchtower',
    role:'Real-time signals and persona playbooks.',
    desc:'Watchtower tracks stance and intent across a windowed sample of 20 million people globally, then surfaces sentiment shifts, trigger events, and buyer signals within hours.',
    solves:['The Intelligence Problem','The Visibility Problem'],
    sample:'For Microsoft, Watchtower ran global ITDM and BDM persona studies across SMC and Enterprise to shape the customer-journey toolkit its partners use.'},
  dive:{cats:['strategy'],primary:'strategy',type:'Deep research',name:'Dive',
    role:'Deep research on markets, buyers, and competitors.',
    desc:'Dive researches vendor websites, public signals, analyst coverage, and competitor positioning shifts, then turns the findings into briefs your team can act on.',
    solves:['The Intelligence Problem','The Visibility Problem'],
    sample:'For AMD&rsquo;s PRO Component campaign, Dive mapped the system integrator landscape across five regions: APJ, EMEA, India, LATAM, and North America.'},
  camille:{cats:['strategy','content'],primary:'strategy',type:'Synthetic buyer twins',name:'Camille',
    role:'Synthetic buyer twins for neuroscience-led message testing.',
    desc:'Camille tests messaging, content, and creative against modeled ITDM and BDM buyer reactions before the work reaches a real audience.',
    solves:['The Intelligence Problem','The Velocity Problem'],
    sample:'For Logitech, Camille scored three event-theme directions against a modeled enterprise buying committee on stopping power, buyer relevance, value clarity, and emotional resonance.'},
  geo:{cats:['strategy'],primary:'strategy',type:'GEO performance tracking',name:'Geo',
    role:'GEO performance tracking and opportunity audits.',
    desc:'Geo tracks where your brand appears across ChatGPT, Gemini, Copilot, and AI Overviews. It shows where you are cited, where you are missed, and which content gaps to fix before the next leadership readout.',
    solves:['The Visibility Problem'],
    sample:'For Qualcomm, Geo ran 557 buyer-validated prompts across five AI engines, 2,785 responses, to show how Snapdragon is framed against competing silicon and Apple, and where to close the gaps.'},
  cam:{cats:['content'],primary:'content',type:'Synthetic video',name:'Cam',
    role:'AI video production for stories and live-shoot style clips.',
    desc:'Cam creates synthetic-presenter videos in multiple languages, so teams can produce consistent video without coordinating every SME shoot.',
    solves:['The Velocity Problem'],
    sample:'For SAP, Cam piloted an AI avatar video series through Intercept Labs, producing synthetic-presenter videos that cut production costs 55% and timelines 23%.'},
  cortex:{cats:['content'],primary:'content',type:'Creative intelligence',name:'Cortex',
    role:'Neuroscience-led creative validation.',
    desc:'Cortex tests creative for attention, recall, and emotional response before media spend is committed. It is trained on brainwave and eye-tracking data from 300,000+ users.',
    solves:['The Velocity Problem'],
    sample:'For Lenovo IDG, Cortex tested webinar creative and picked the direction that drove the strongest engagement.'},
  atom:{cats:['content','channel'],primary:'content',type:'Content atomization',name:'Atom',
    role:'Content atomization and upcycling engine.',
    desc:'Atom turns a hero asset into tailored variants for specific personas, segments, industries, and journey stages. Brand-safety scans help keep each version aligned before it goes live.',
    solves:['The Visibility Problem','The Velocity Problem'],
    sample:'For HP Workforce Solutions, Atom atomized hero content into tailored variants for each buying-committee persona, fueling a cross-sell campaign that drove 398% deal-size lift and 13.5&times; pipeline growth.'},
  lens:{cats:['content'],primary:'content',type:'AI photography',name:'Lens',
    role:'Modular photoshoots with consistent people and devices.',
    desc:'Lens creates photorealistic lifestyle imagery with consistent characters, scenes, and devices, so teams can produce on-brand campaign visuals without booking a full shoot every time.',
    solves:['The Velocity Problem'],
    sample:'For Microsoft, Lens built an AI photography engine that produced culturally relevant, OEM-flexible imagery for channel partners worldwide.'},
  index:{cats:['content'],primary:'content',type:'Content audit',name:'Index',
    role:'Content audit and journey mapping.',
    desc:'Index maps your content inventory against buyer-journey stages, identifies the gaps, and shows what needs to be created, updated, or retired.',
    solves:['The Visibility Problem','The Velocity Problem'],
    sample:'For AMD&rsquo;s PRO Technologies global relaunch, Index audited the existing content against the buyer journey and mapped the gaps to close before launch.'},
  telly:{cats:['sales','channel'],primary:'sales',type:'Call-down agents',name:'Telly',
    role:'Call-down agents for outbound qualification.',
    desc:'Telly runs brand-trained call-down programs that qualify prospects, clean data, and prompt next-best actions such as webinar registration, trial activation, or follow-up.',
    solves:['The Activation Problem'],
    sample:'HP used Telly for the Concierge Program Junior BDR, delivering 1,600 live conversations, 320 sales-ready leads, and 3&times; more cost-effective outreach than human reps.'},
  salesdojo:{cats:['sales'],primary:'sales',type:'Customer scenario simulations',name:'Sales Dojo',
    role:'Customer scenario simulations for sales reps.',
    desc:'Sales Dojo gives reps a brand-trained buyer simulation where they can practice pitches, handle objections, and improve their talk track before a live customer conversation.',
    solves:['The Activation Problem','The Intelligence Problem'],
    sample:'As part of an exploration, we set up a Copilot+ PC practice environment in Sales Dojo where reps could rehearse pitching to different members of the buying committee.'},
  radar:{cats:['sales'],primary:'sales',type:'Account intelligence platform',name:'Radar',
    role:'Live account intelligence on demand for your sellers.',
    desc:'Radar identifies the members of each buying committee, reads the market signals and events around them, and recommends the sales plays to run for each account.',
    solves:['The Intelligence Problem','The Activation Problem'],
    sample:'HP used Radar to give sellers on-demand account intelligence, delivering account briefs within 48 hours.'},
  taylor:{cats:['channel'],primary:'channel',type:'Intelligent campaign assistant',name:'Taylor',
    role:'Campaign adaptation for channel partners.',
    desc:'Taylor gives your channel partners an agent trained on your brand guidelines and the campaign bill of materials. Partners upload their own assets, and Taylor shows them how to adapt the campaign to their brand and layer in their own offerings and services. A deterministic QA agent checks every output before it goes out.',
    solves:['The Activation Problem'],
    sample:'HP and Intel use Taylor to help their channel partners quickly create high-quality, on-brand marketing rooted in shared HP, Intel, and Windows 11 messaging.'}
};
const CAT_LABELS = {strategy:'Strategy',content:'Content & Creative',sales:'Sales Enablement',channel:'Channel Empowerment'};

function renderAgents(cat){
  const grid = document.getElementById('agentsGrid');
  if(!grid) return;
  const keys = Object.keys(AGENTS).filter(k => AGENTS[k].cats.includes(cat));
  grid.innerHTML = keys.map(k => {
    const a = AGENTS[k];
    const cross = a.primary !== cat ? `<span class="ac-cross">Primary &middot; ${CAT_LABELS[a.primary]}</span>` : `<span class="ac-cross" aria-hidden="true"></span>`;
    return `<button class="agent-card-v6" data-agent="${k}">
      ${cross}
      <div class="agent-head">
        <svg class="agent-glyph" aria-hidden="true"><use href="#glyph-${k}"/></svg>
        <h3>${a.name}</h3>
      </div>
      <p>${a.role}</p>
      <span class="ac-go">Learn more</span>
    </button>`;
  }).join('');
  grid.querySelectorAll('[data-agent]').forEach(btn => btn.addEventListener('click', () => openAgent(btn.dataset.agent)));
}
document.querySelectorAll('.agent-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.agent-tab').forEach(t => t.setAttribute('aria-selected','false'));
    tab.setAttribute('aria-selected','true');
    renderAgents(tab.dataset.cat);
  });
});
renderAgents('strategy');

/* ============ DRAWER OPEN/CLOSE ============ */
const scrim = document.getElementById('scrim');

/* ---- Dialog focus management (move focus in, trap Tab, restore on close) ---- */
let _lastFocus = null, _activeModal = null;
function _focusable(el){
  return Array.from(el.querySelectorAll('a[href],button:not([disabled]),input:not([disabled]),textarea:not([disabled]),select:not([disabled]),[tabindex]:not([tabindex="-1"])'))
    .filter(n => n.offsetWidth || n.offsetHeight || n.getClientRects().length);
}
function _openModal(el){
  _lastFocus = document.activeElement;
  _activeModal = el;
  const f = _focusable(el);
  (f[0] || el).focus();
}
function _closeModal(){
  _activeModal = null;
  if(_lastFocus && typeof _lastFocus.focus === 'function') _lastFocus.focus();
  _lastFocus = null;
}
document.addEventListener('keydown', e => {
  if(e.key !== 'Tab' || !_activeModal) return;
  const f = _focusable(_activeModal);
  if(!f.length){ e.preventDefault(); return; }
  const first = f[0], last = f[f.length - 1];
  if(e.shiftKey && document.activeElement === first){ e.preventDefault(); last.focus(); }
  else if(!e.shiftKey && document.activeElement === last){ e.preventDefault(); first.focus(); }
});

function openDrawer(id){
  document.querySelectorAll('.drawer.open').forEach(d => d.classList.remove('open'));
  const el = document.getElementById(id);
  if(!el) return;
  el.classList.add('open');
  scrim.classList.add('open');
  document.body.style.overflow = 'hidden';
  _openModal(el);
}
function closeAll(){
  const wasOpen = document.querySelector('.drawer.open');
  document.querySelectorAll('.drawer.open').forEach(d => d.classList.remove('open'));
  scrim.classList.remove('open');
  document.body.style.overflow = '';
  if(wasOpen) _closeModal();
}
scrim.addEventListener('click', closeAll);
document.addEventListener('keydown', e => { if(e.key === 'Escape') closeAll(); });
document.querySelectorAll('[data-close]').forEach(b => b.addEventListener('click', closeAll));
document.querySelectorAll('[data-open]').forEach(b => b.addEventListener('click', () => {
  if(b.dataset.open === 'pitchLabs') resetPitch();
  if(b.dataset.open === 'convoDrawer') resetConvo();
  if(typeof closeAgentDetail === 'function') closeAgentDetail();
  openDrawer(b.dataset.open);
}));

/* ============ AGENT DETAIL · compact centered card with backdrop ============ */
const agentsStage = document.getElementById('agentsStage');
const agentDetailOverlay = document.getElementById('agentDetailOverlay');
const agentDetailBackdrop = document.getElementById('agentDetailBackdrop');
let currentAgentName = '';
function openAgent(k){
  const a = AGENTS[k];
  if(!a) return;
  currentAgentName = a.name;
  document.getElementById('adGlyph').setAttribute('href', '#glyph-'+k);
  document.getElementById('adName').innerHTML = a.name;
  document.getElementById('adType').innerHTML = a.type + ' &middot; ' + CAT_LABELS[a.primary];
  document.getElementById('adRole').innerHTML = a.role;
  document.getElementById('adDesc').innerHTML = a.desc;
  document.getElementById('adSample').innerHTML = a.sample;
  document.getElementById('adSolves').innerHTML = a.solves.map(s => '<span>'+s+'</span>').join('');
  agentsStage.classList.add('is-detail');
  agentDetailOverlay.classList.add('is-open');
  _openModal(agentDetailOverlay);
}
function closeAgentDetail(){
  const was = agentDetailOverlay.classList.contains('is-open');
  agentsStage.classList.remove('is-detail');
  agentDetailOverlay.classList.remove('is-open');
  if(was) _closeModal();
}
const agentDetailCloseBtn = document.getElementById('agentDetailClose');
if(agentDetailCloseBtn) agentDetailCloseBtn.addEventListener('click', closeAgentDetail);
if(agentDetailBackdrop) agentDetailBackdrop.addEventListener('click', closeAgentDetail);
document.addEventListener('keydown', e => { if(e.key === 'Escape') closeAgentDetail(); });

/* ============ CASE DRAWER ============ */
const CASE_IMG = {
  'hp-abx':'/concept-d/assets/img/case-hp-abx.png',
  'intel-abm':'/concept-d/assets/img/case-intel-abm.png',
  'sap-video':'/concept-d/assets/img/case-sap-video.png'
};
const CASES = {
  'hp-abx':{client:'HP',tag:'Account-based marketing',name:'AI-powered ABX for Workforce Solutions',
    challenge:'HP needed to cross-sell across the Workforce Solutions portfolio, a complex mix of AI PCs, meeting room solutions, and services, into established enterprise accounts. The buying committee was scattered across roles, and traditional ABM playbooks were over-relying on uniform creative.',
    approach:'We built a buying-committee surround strategy and purpose-built customer journeys, powered by AI-driven content tailored per persona and journey stage. Atom recomposed the hero asset into thousands of brand-safe variants targeted at each committee member&rsquo;s role and context.',
    results:['398% incremental deal-size lift versus control group','13.5× higher pipeline growth versus control group','Pattern is now Intercept&rsquo;s reference ABX motion for enterprise OEMs','5 x B2B marketing awards including Hermes Creative Awards (2026), MarCom (2025), and CMA Awards (2025).'],
    agents:'Atom'},
  'intel-abm':{client:'Intel',tag:'Account-based marketing',name:'Award-winning ABM for enterprise cloud migration',
    challenge:'Intel needed to drive demand for a complex cloud solution into a tightly-scoped 250 enterprise accounts. The story was hard to explain to the right buyers, and off-the-shelf ABM tools weren&rsquo;t built for the precision required.',
    approach:'We simplified the cloud-migration story with clear metaphors, built an intent-led nurture engine for DevOps and FinOps audiences, and powered the creative with GenAI personalization. A risk-free 12-month trial accelerated adoption decisions inside the target accounts.',
    results:['$70M in pipeline value generated','96% of 250 targeted enterprise accounts reached','1,800 qualified leads, 3.6× the target','7 x B2B marketing awards, including Echo (2024), CMA (2024), MarCom (2024), ANA B2 (2025), Elevation (2025), Hermes (2025), and dotCoMM.'],
    agents:'Atom &middot; Camille (multi-agent program)'},
  'sap-video':{client:'SAP',tag:'AI-powered video production',name:'Award-winning AI avatars for multilingual video at scale',
    challenge:'SAP powers over two-thirds of the world&rsquo;s transactions, demanding constant engagement across markets and languages. Video was the most powerful channel, but without a shared system, content was duplicated, costs ballooned, and brand consistency slipped across regions.',
    approach:'We used AI avatars to speed production across 140+ languages, then built the scalable system around it: a global playbook for narrative and brand standards, streamlined intake forms, a shared tracker for cross-region visibility, and a modular 5-part story framework (Intro, Value, Challenge, Demo, CTA) that turns product demos into narratives. Every video carries transparent AI disclosure, and the avatars mirror global audiences for relatability.',
    results:['55% reduction in production costs','23% faster production timelines','Scaled from a 12-video pilot to 100+ videos in active production','AI avatar videos delivered across 140+ languages','2× Gold at the Hermes Creative Awards 2025 in the AI-Assisted Video Production and the Emerging Tech Innovation categories'],
    agents:'Cam'}
};
let currentCaseLabel = '';
function openCase(k){
  const c = CASES[k];
  if(!c) return;
  currentCaseLabel = c.client + ' &mdash; ' + c.name;
  document.getElementById('cType').innerHTML = c.tag;
  document.getElementById('cName').innerHTML = c.name;
  document.getElementById('cClient').innerHTML = c.client;
  document.getElementById('cChallenge').innerHTML = c.challenge;
  document.getElementById('cApproach').innerHTML = c.approach;
  document.getElementById('cResults').innerHTML = c.results.map(r => '<li>'+r+'</li>').join('');
  document.getElementById('cAgents').innerHTML = c.agents;
  const _hero = document.querySelector('#casePanel .case-hero'), _himg = document.getElementById('cHero');
  if(CASE_IMG[k]){ _himg.src = CASE_IMG[k]; _himg.alt = c.client + ' case study'; _hero.hidden = false; } else { _hero.hidden = true; }
  openDrawer('casePanel');
}
document.querySelectorAll('[data-case]').forEach(b => b.addEventListener('click', () => openCase(b.dataset.case)));

/* ============ PITCH LABS form (used by Labs section CTA) ============ */
function resetPitch(){
  document.getElementById('pitchForm').style.display = 'flex';
  document.getElementById('pitchSuccess').style.display = 'none';
  document.getElementById('pitchForm').reset();
}
document.getElementById('pitchForm').addEventListener('submit', e => {
  e.preventDefault();
  /* TODO · wire to real endpoint */
  document.getElementById('pitchForm').style.display = 'none';
  document.getElementById('pitchSuccess').style.display = 'block';
});

/* ============ SECTION 08 · Start the conversation · drawer form ============ */
function resetConvo(){
  document.getElementById('convoForm').style.display = 'flex';
  document.getElementById('convoSuccess').style.display = 'none';
  document.getElementById('convoForm').reset();
  document.getElementById('convoContext').hidden = true;
  document.getElementById('convoContextField').value = '';
  const _ct=document.getElementById('convoType'); _ct.textContent=''; _ct.hidden=true;
}
document.getElementById('convoForm').addEventListener('submit', e => {
  e.preventDefault();
  /* TODO · wire to real endpoint */
  document.getElementById('convoForm').style.display = 'none';
  document.getElementById('convoSuccess').style.display = 'block';
});

/* ============ Contextual contact · agent + case CTAs open the brief intake form ============ */
/* These are alternate entry points to the same intake form as Section 08, pre-tagged with
   what the person was looking at so the partner has context. */
function openConvo(context, typeLabel){
  resetConvo();
  const ctx = document.getElementById('convoContext');
  if(typeLabel){ const _ct=document.getElementById('convoType'); _ct.textContent=typeLabel; _ct.hidden=false; }
  if(context){
    if(!typeLabel){ const _ct2=document.getElementById('convoType'); _ct2.textContent='Talk to us'; _ct2.hidden=false; }
    ctx.innerHTML = 'Regarding &middot; <b>' + context + '</b>';
    ctx.hidden = false;
    document.getElementById('convoContextField').value = context.replace(/&mdash;/g, '—');
  }
  openDrawer('convoDrawer');
}
const agentContactBtn = document.getElementById('agentDetailContact');
if(agentContactBtn) agentContactBtn.addEventListener('click', () => {
  closeAgentDetail();
  openConvo(currentAgentName ? currentAgentName + ' agent' : '');
});
const caseContactBtn = document.getElementById('caseContact');
if(caseContactBtn) caseContactBtn.addEventListener('click', () => openConvo(currentCaseLabel));


/* ── staging script: fritz-bg ── */

/* Fritz pattern section backgrounds — engine ported from .fritz/generators/fritz-pattern.html.
   Each <canvas class="fritz-bg"> carries config via data-* (mode/loop/colors/cell/speed/seed/colmode).
   One shared rAF; only on-screen canvases animate; prefers-reduced-motion renders a static frame. */
(function(){
  const ns=(x,y,s)=>{const a=Math.sin(x*12.9898+y*78.233+s)*43758.5453;return a-Math.floor(a);};
  function dirFor(m,col,row,seed){switch(m){
    case 'truchet':return ns(col,row,seed+100)>0.5?'right':'left';
    case 'pinwheel':return (col+row)%2===0?'right':'left';
    case 'diamond':return (col%2===row%2)?'right':'left';
    case 'herringbone':return row%2===0?(col%2===0?'right':'left'):(col%2===0?'left':'right');
    case 'quilt':{const q=(Math.floor(col/2)+Math.floor(row/2))%2;return q===0?'right':'left';}
    case 'scatter':return ns(col,row,seed+150)>0.5?'right':'left';
    case 'wave':return Math.sin(col*0.6+row*0.4)>0?'right':'left';
    default:return 'right';}}
  function colIdx(m,col,row,len,seed){switch(m){
    case 'diagonal':return (col+row)%len; case 'row':return row%len; case 'col':return col%len;
    case 'random':return Math.floor(ns(col,row,seed)*len);
    default:return (col+row)%2===0?0:(len>1?1:0);}}
  function anim(type,t,spd,c,r,cols,rows,seed){
    const ccx=cols/2,ccy=rows/2,dist=Math.hypot(c-ccx,r-ccy);
    switch(type){
      case 'breathe':return {scale:0.7+Math.sin((c*0.3+r*0.4)-t*spd*2)*0.3,alpha:1};
      case 'wave-scale':return {scale:0.6+Math.sin(dist*0.5-t*spd*3)*0.4,alpha:1};
      case 'swirl':{const ang=Math.atan2(r-ccy,c-ccx);return {scale:0.7+Math.sin(ang*2-t*spd*2)*0.3,alpha:1};}
      case 'ripple-out':return {scale:1,alpha:0.35+0.65*(0.5+0.5*Math.sin(dist*0.6-t*spd*3))};
      case 'twinkle':{const ph=ns(c,r,seed+55)*6.2832;return {scale:1,alpha:0.25+0.75*(0.5+0.5*Math.sin(t*spd*3+ph))};}
      case 'pulse-rows':return {scale:0.5+(0.5+0.5*Math.sin(r*0.7-t*spd*2.5))*0.6,alpha:1};
      default:return {scale:1,alpha:1};}}
  const items=[];
  document.querySelectorAll('canvas.fritz-bg').forEach(cv=>{
    const X=cv.getContext('2d');
    const o={mode:cv.dataset.mode||'herringbone',loop:cv.dataset.loop||'twinkle',
      colors:(cv.dataset.colors||'FF00E5,1A7AFF').split(',').map(c=>'#'+c.trim()),
      cell:+(cv.dataset.cell||24),speed:+(cv.dataset.speed||0.3),seed:+(cv.dataset.seed||1234),
      colmode:cv.dataset.colmode||'checker',base:+(cv.dataset.base||0.85)};
    const it={cv,X,o,W:0,H:0,cols:0,rows:0,vis:true};
    it.size=function(){const r=window.devicePixelRatio||1;it.W=cv.clientWidth;it.H=cv.clientHeight;if(!it.W||!it.H)return;cv.width=it.W*r;cv.height=it.H*r;X.setTransform(r,0,0,r,0,0);it.cols=Math.ceil(it.W/o.cell)+1;it.rows=Math.ceil(it.H/o.cell)+1;};
    it.frame=function(t){if(!it.W||!it.H)return;X.clearRect(0,0,it.W,it.H);const hf=o.cell*0.5;for(let row=0;row<it.rows;row++)for(let col=0;col<it.cols;col++){const dir=dirFor(o.mode,col,row,o.seed);const a=anim(o.loop,t,o.speed,col,row,it.cols,it.rows,o.seed);const hs=hf*(a.scale||1);const v=dir==='right'?[[-hs,-hs],[-hs,hs],[hs,hs]]:[[hs,-hs],[hs,hs],[-hs,hs]];X.save();X.translate(col*o.cell+hf,row*o.cell+hf);X.globalAlpha=o.base*(a.alpha==null?1:a.alpha);X.beginPath();X.moveTo(v[0][0],v[0][1]);X.lineTo(v[1][0],v[1][1]);X.lineTo(v[2][0],v[2][1]);X.closePath();X.fillStyle=o.colors[colIdx(o.colmode,col,row,o.colors.length,o.seed)];X.fill();X.restore();}};
    it.size();items.push(it);
  });
  if(!items.length)return;
  const reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(window.IntersectionObserver){const io=new IntersectionObserver(function(es){es.forEach(function(e){const it=items.find(function(i){return i.cv===e.target;});if(it)it.vis=e.isIntersecting;});},{rootMargin:'120px'});items.forEach(function(it){io.observe(it.cv);});}
  if(reduce){items.forEach(function(it){it.frame(0);});}
  else{let s0=null;(function loop(ts){if(s0==null)s0=ts;const t=(ts-s0)/1000;items.forEach(function(it){if(it.vis)it.frame(t);});requestAnimationFrame(loop);})(performance.now());}
  let to;window.addEventListener('resize',function(){clearTimeout(to);to=setTimeout(function(){items.forEach(function(it){it.size();if(reduce)it.frame(0);});},150);});
})();


/* ── staging script: theme-toggle ── */
(function(){var b=document.getElementById('themeToggle');if(!b)return;function sync(){var l=document.documentElement.getAttribute('data-theme')==='light';b.setAttribute('aria-pressed',l);}b.addEventListener('click',function(){var next=document.documentElement.getAttribute('data-theme')==='light'?'dark':'light';document.documentElement.setAttribute('data-theme',next);try{localStorage.setItem('ig_theme',next);}catch(e){}sync();});sync();})();

/* ── staging script: logo-glitch ── */

(function(){
  var source = document.getElementById("fritz-glitch-source");
  var ACCENT_PALETTE = source.dataset.accentPalette.split(" ");
  var CHANNELS = source.dataset.channels.split(" ");
  var BEAT_MS = 100;
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function parseLayout(g){
    return {
      node: g.dataset.node,
      tx: parseFloat(g.dataset.tx),
      scale: parseFloat(g.dataset.scale),
      fill: g.dataset.fill,
      baseD: Array.prototype.map.call(g.querySelectorAll("path.base"), function(p){ return p.getAttribute("d"); }),
      accents: Array.prototype.map.call(g.querySelectorAll("path.accent"), function(p){
        return { d: p.getAttribute("d"), fill: p.getAttribute("fill") };
      })
    };
  }

  var LAYOUTS = Array.prototype.map.call(
    source.querySelectorAll(".fritz-layout:not(.fritz-canon)"), parseLayout
  );
  var CANON = parseLayout(source.querySelector(".fritz-canon"));

  function pick(arr){ return arr[Math.floor(Math.random() * arr.length)]; }

  function beatHTML(layout, baseFill, accentFills){
    var base = layout.baseD.map(function(d){ return '<path d="' + d + '" fill="' + baseFill + '"/>'; }).join("");
    var accents = layout.accents.map(function(a, i){
      return '<path d="' + a.d + '" fill="' + (accentFills ? accentFills[i] : a.fill) + '"/>';
    }).join("");
    return '<g transform="translate(' + layout.tx + ',0.4247) scale(' + layout.scale + ')">' + base + accents + '</g>';
  }

  function randomBeat(){
    var layout = pick(LAYOUTS);
    var baseFill = pick(CHANNELS);
    var accentFills = layout.accents.map(function(){ return pick(ACCENT_PALETTE); });
    return beatHTML(layout, baseFill, accentFills);
  }

  var CANON_HTML = beatHTML(CANON, CANON.fill, null);

  function initLockup(root){
    var slot = root.querySelector("#mark-slot") || root.querySelector('[id$="mark-slot"]');
    if (!slot) return;
    slot.innerHTML = CANON_HTML;
    if (reduceMotion) return;

    var timers = [];
    var playing = false;

    function clearTimers(){ timers.forEach(clearTimeout); timers = []; }

    function play(){
      if (playing) return;
      playing = true;
      clearTimers();
      var seq = LAYOUTS.map(function(l){ return beatHTML(l, l.fill, null); });
      seq.push(randomBeat());
      seq.push(randomBeat());
      seq.forEach(function(html, i){
        timers.push(setTimeout(function(){ slot.innerHTML = html; }, i * BEAT_MS));
      });
      timers.push(setTimeout(function(){
        slot.innerHTML = CANON_HTML;
        playing = false;
      }, seq.length * BEAT_MS));
    }

    function reset(){
      clearTimers();
      playing = false;
      slot.innerHTML = CANON_HTML;
    }

    root.addEventListener("mouseenter", play);
    root.addEventListener("focus", play);
    root.addEventListener("mouseleave", reset);
    root.addEventListener("blur", reset);
  }

  document.querySelectorAll("[data-fritz-hover-lockup]").forEach(initLockup);

  // Play the glitch once on load so every visitor sees the mark animate at least once
  setTimeout(function(){
    document.querySelectorAll("[data-fritz-hover-lockup]").forEach(function(el){
      el.dispatchEvent(new Event("mouseenter"));
    });
  }, 500);
})();
