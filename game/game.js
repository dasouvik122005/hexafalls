/* ═══════════════════════════════════════
   HexaFalls — Gaming (PUBG) Track JS
   ═══════════════════════════════════════ */

let currentStep = 1;
const totalSteps = 3;

/* ── Stars ── */
const starsEl = document.getElementById('stars');
for (let i = 0; i < 140; i++) {
  const s = document.createElement('div');
  s.className = 'star';
  s.style.cssText = `left:${Math.random()*100}%;top:${Math.random()*100}%;--d:${2+Math.random()*5}s;--o:${.3+Math.random()*.7};animation-delay:${Math.random()*6}s;width:${1+Math.random()*2}px;height:${1+Math.random()*2}px;`;
  starsEl.appendChild(s);
}

/* ── Particles ── */
const pColors = ['#c9a84c','#f59e0b','#ff6b9d'];
for (let i = 0; i < 20; i++) {
  const p = document.createElement('div');
  p.className = 'particle';
  const c = pColors[i % 3];
  p.style.cssText = `left:${Math.random()*100}%;background:${c};--dur:${15+Math.random()*20}s;--op:${.3+Math.random()*.4};--dx:${-40+Math.random()*80}px;animation-delay:${Math.random()*20}s;box-shadow:0 0 6px ${c};`;
  document.body.appendChild(p);
}

/* ── Cursor ── */
const cursor = document.getElementById('cursorMagic');
let lastTrail = 0;
document.addEventListener('mousemove', e => {
  cursor.style.left = e.clientX - 3 + 'px';
  cursor.style.top = e.clientY - 3 + 'px';
  const now = Date.now();
  if (now - lastTrail > 40) {
    lastTrail = now;
    const trail = document.createElement('div');
    trail.className = 'cursor-trail';
    trail.style.cssText = `left:${e.clientX-2}px;top:${e.clientY-2}px;background:${Math.random()>.5?'#f59e0b':'#c9a84c'};box-shadow:0 0 6px ${Math.random()>.5?'#f59e0b':'#c9a84c'};`;
    document.body.appendChild(trail);
    setTimeout(() => trail.remove(), 600);
  }
});

/* ── HexaID DB ── */
const hexaDB = {
  'HXF-001': { name: 'Aryan Sharma',  email: 'aryan@jisu.edu.in' },
  'HXF-002': { name: 'Priya Das',     email: 'priya@jisu.edu.in' },
  'HXF-003': { name: 'Rohan Ghosh',   email: 'rohan@jisu.edu.in' },
  'HXF-004': { name: 'Sneha Patel',   email: 'sneha@jisu.edu.in' },
  'HXF-005': { name: 'Amit Paul',     email: 'amit@jisu.edu.in' },
  'HXF-006': { name: 'Ritika Bose',   email: 'ritika@jisu.edu.in' },
  'HXF-007': { name: 'Debjit Roy',    email: 'debjit@jisu.edu.in' },
  'HXF-008': { name: 'Manas Kundu',   email: 'manas@jisu.edu.in' },
};

/* ── PUBG Rank map ── */
const rankMap = {
  'Bronze': 'rank-bronze',
  'Silver': 'rank-silver',
  'Gold': 'rank-gold',
  'Platinum': 'rank-platinum',
  'Diamond': 'rank-diamond',
  'Crown': 'rank-crown',
  'Ace': 'rank-ace',
  'Conqueror': 'rank-conqueror'
};

function lookupHexaId(idx) {
  const hexaInput = document.getElementById(`m${idx}hexa`);
  const nameInput = document.getElementById(`m${idx}name`);
  const emailInput = document.getElementById(`m${idx}email`);
  const statusEl = document.getElementById(`m${idx}status`);
  const val = hexaInput.value.trim().toUpperCase();

  nameInput.value = ''; emailInput.value = '';
  nameInput.readOnly = false; emailInput.readOnly = false;
  nameInput.style.borderColor = ''; emailInput.style.borderColor = '';

  if (!val) { statusEl.innerHTML = ''; return; }
  statusEl.innerHTML = '<i class="bi bi-search"></i> Consulting the registry…';
  statusEl.style.color = 'var(--muted)';

  setTimeout(() => {
    const found = hexaDB[val];
    if (found) {
      nameInput.value = found.name; emailInput.value = found.email;
      nameInput.readOnly = true; emailInput.readOnly = true;
      nameInput.style.borderColor = 'var(--accent-dim)';
      emailInput.style.borderColor = 'var(--accent-dim)';
      statusEl.innerHTML = '<i class="bi bi-patch-check-fill"></i> Player identified — sealed by registry';
      statusEl.style.color = 'var(--accent)';
    } else {
      statusEl.innerHTML = '<i class="bi bi-exclamation-triangle"></i> HexaID not found — enter details manually';
      statusEl.style.color = 'var(--gold)';
    }
  }, 500);
}

function showRankBadge(idx) {
  const sel = document.getElementById(`m${idx}rank`);
  const badge = document.getElementById(`m${idx}rankBadge`);
  const val = sel.value;
  if (val && rankMap[val]) {
    badge.className = 'rank-display ' + rankMap[val];
    badge.innerHTML = `<i class="bi bi-award"></i> ${val}`;
    badge.style.display = 'inline-flex';
  } else {
    badge.style.display = 'none';
  }
}

/* ── Render Squad Members ── */
function renderMembers() {
  const n = parseInt(document.getElementById('teamSize').value);
  const container = document.getElementById('members-container');
  if (!n) { container.innerHTML = ''; return; }
  container.innerHTML = '';

  const ranks = ['Bronze','Silver','Gold','Platinum','Diamond','Crown','Ace','Conqueror'];

  for (let i = 1; i <= n; i++) {
    const card = document.createElement('div');
    card.className = 'member-card';
    card.innerHTML = `
      <div class="member-tag"><i class="bi bi-crosshair"></i> Player ${i}${i===1?' — Squad Leader':''}</div>
      <div class="three-col member-fields">
        <div class="field-group" style="margin-bottom:0">
          <label for="m${i}hexa" style="font-size:10px">HexaID</label>
          <input type="text" id="m${i}hexa" name="member${i}HexaId" placeholder="HXF-001" oninput="lookupHexaId(${i})" style="text-transform:uppercase;letter-spacing:1px"/>
        </div>
        <div class="field-group" style="margin-bottom:0">
          <label for="m${i}name" style="font-size:10px">Full Name</label>
          <input type="text" id="m${i}name" name="member${i}Name" placeholder="Auto-fill or manual" required/>
        </div>
        <div class="field-group" style="margin-bottom:0">
          <label for="m${i}email" style="font-size:10px">Email</label>
          <input type="email" id="m${i}email" name="member${i}Email" placeholder="Auto-fill or manual" required/>
        </div>
      </div>
      <div class="three-col member-fields" style="margin-top:12px">
        <div class="field-group" style="margin-bottom:0">
          <label for="m${i}pubgid" style="font-size:10px"><i class="bi bi-controller"></i> PUBG User ID</label>
          <input type="text" id="m${i}pubgid" name="member${i}PubgId" placeholder="e.g. 5XXXXXXXXX" required style="letter-spacing:1px"/>
        </div>
        <div class="field-group" style="margin-bottom:0">
          <label for="m${i}ign" style="font-size:10px"><i class="bi bi-tag"></i> In-Game Name (IGN)</label>
          <input type="text" id="m${i}ign" name="member${i}IGN" placeholder="Your PUBG name" required/>
        </div>
        <div class="field-group" style="margin-bottom:0">
          <label for="m${i}rank" style="font-size:10px"><i class="bi bi-award"></i> Current Tier/Rank</label>
          <div class="select-wrap">
            <select id="m${i}rank" name="member${i}Rank" onchange="showRankBadge(${i})" required>
              <option value="" disabled selected>— Rank —</option>
              ${ranks.map(r => `<option value="${r}">${r}</option>`).join('')}
            </select>
          </div>
          <div id="m${i}rankBadge" class="rank-display" style="display:none;margin-top:6px"></div>
        </div>
      </div>
      <div id="m${i}status" class="lookup-status"></div>`;
    container.appendChild(card);
  }
}

/* ── Navigation ── */
function updateProgress() {
  const dots = document.querySelectorAll('.step-dot');
  const fill = document.getElementById('progressFill');
  const trackWidth = document.querySelector('.progress-track').offsetWidth - 48;
  fill.style.width = ((currentStep - 1) / (totalSteps - 1)) * trackWidth + 'px';
  dots.forEach((d, i) => {
    d.classList.remove('active', 'done');
    if (i + 1 === currentStep) d.classList.add('active');
    else if (i + 1 < currentStep) d.classList.add('done');
  });
}

function showPanel(n) {
  document.querySelectorAll('.step-panel').forEach(p => p.classList.remove('active'));
  document.getElementById(`panel${n}`).classList.add('active');
  currentStep = n;
  updateProgress();
  if (n === 2) renderMembers();
  if (n === 3) buildSummary();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function goToStep(n) { if (n <= currentStep) showPanel(n); }

function nextStep(n) {
  if (n > currentStep) {
    const panel = document.getElementById(`panel${currentStep}`);
    const inputs = panel.querySelectorAll('input[required],select[required]');
    let valid = true;
    inputs.forEach(inp => {
      if (!inp.value && inp.type !== 'radio') {
        valid = false;
        inp.style.borderColor = 'var(--danger)';
        inp.addEventListener('input', () => inp.style.borderColor = '', { once: true });
      }
    });
    if (currentStep === 1) {
      const radios = document.querySelectorAll('input[name="firstTournament"]');
      if (![...radios].some(r => r.checked)) { valid = false; alert('Please select your tournament experience.'); }
      if (!document.getElementById('teamSize').value) { valid = false; document.getElementById('teamSize').style.borderColor = 'var(--danger)'; }
    }
    if (!valid) return;
  }
  showPanel(n);
}

/* ── Summary ── */
function buildSummary() {
  const uni = document.getElementById('university').value || '—';
  const team = document.getElementById('teamName').value || '—';
  const size = document.getElementById('teamSize').value || '—';
  const referral = document.getElementById('referral').value || 'None';
  const exp = document.querySelector('input[name="firstTournament"]:checked');
  const expText = exp ? (exp.value === 'yes' ? 'First Tournament' : 'Experienced') : '—';

  let membersHtml = '';
  const n = parseInt(size) || 0;
  for (let i = 1; i <= n; i++) {
    const name = document.getElementById(`m${i}name`)?.value || '—';
    const pubgid = document.getElementById(`m${i}pubgid`)?.value || '—';
    const ign = document.getElementById(`m${i}ign`)?.value || '—';
    const rank = document.getElementById(`m${i}rank`)?.value || '—';
    const cls = rankMap[rank] || '';
    membersHtml += `<div style="margin-left:16px;margin-bottom:8px"><i class="bi bi-crosshair" style="color:var(--accent)"></i> <strong>${name}</strong> · IGN: <span style="color:var(--accent)">${ign}</span> · ID: ${pubgid} · <span class="rank-display ${cls}" style="display:inline-flex;padding:2px 10px;font-size:10px">${rank}</span></div>`;
  }

  document.getElementById('summaryBox').innerHTML = `
    <div style="margin-bottom:12px"><i class="bi bi-mortarboard-fill" style="color:var(--gold)"></i> <strong>University:</strong> ${uni}</div>
    <div style="margin-bottom:12px"><i class="bi bi-trophy-fill" style="color:var(--accent)"></i> <strong>Squad:</strong> ${team} (${size} players)</div>
    <div style="margin-bottom:12px"><i class="bi bi-lightning-charge-fill" style="color:var(--accent)"></i> <strong>Experience:</strong> ${expText}</div>
    <div style="margin-bottom:12px"><i class="bi bi-ticket-perforated-fill" style="color:var(--gold)"></i> <strong>Referral:</strong> ${referral}</div>
    <div style="margin-bottom:8px"><i class="bi bi-people-fill" style="color:var(--accent)"></i> <strong>Squad Roster:</strong></div>
    ${membersHtml}`;
}

/* ── Submit ── */
function handleSubmit() {
  if (!document.getElementById('tcCheck').checked) { alert('Accept Terms & Conditions to proceed.'); return; }
  const data = Object.fromEntries(new FormData(document.getElementById('regForm')));
  console.log('HexaFalls Gaming Registration:', data);

  const btn = document.getElementById('submitBtn');
  btn.innerHTML = '<i class="bi bi-check-circle-fill"></i> Winner Winner Chicken Dinner!';
  btn.style.background = 'linear-gradient(135deg,#f59e0b,#d97706)';
  btn.style.color = '#060912';
  btn.style.pointerEvents = 'none';

  for (let i = 0; i < 40; i++) setTimeout(() => spawnConfetti(), i * 30);

  setTimeout(() => {
    btn.innerHTML = '<i class="bi bi-send"></i> <span>Drop In</span>';
    btn.style.background = ''; btn.style.color = ''; btn.style.pointerEvents = '';
  }, 5000);
}

function spawnConfetti() {
  const el = document.createElement('div');
  const colors = ['#f59e0b','#d97706','#ffd700','#ff6b9d','#c9a84c'];
  el.style.cssText = `position:fixed;left:${30+Math.random()*40}%;top:50%;width:${6+Math.random()*6}px;height:${6+Math.random()*6}px;background:${colors[Math.floor(Math.random()*colors.length)]};border-radius:${Math.random()>.5?'50%':'2px'};z-index:10000;pointer-events:none;animation:confettiFall ${1.5+Math.random()*2}s ease-out forwards;`;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 4000);
}
const cs = document.createElement('style');
cs.textContent = `@keyframes confettiFall{0%{transform:translateY(0) translateX(0) rotate(0deg);opacity:1}100%{transform:translateY(${window.innerHeight}px) translateX(${-100+Math.random()*200}px) rotate(${360+Math.random()*360}deg);opacity:0}}`;
document.head.appendChild(cs);

updateProgress();
