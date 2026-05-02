/* ═══════════════════════════════════════════
   HexaFalls — Hardware Track Registration JS
   ═══════════════════════════════════════════ */

let currentStep = 1;
const totalSteps = 4;

/* ── Stars ── */
const starsEl = document.getElementById('stars');
for (let i = 0; i < 140; i++) {
  const s = document.createElement('div');
  s.className = 'star';
  s.style.cssText = `left:${Math.random()*100}%;top:${Math.random()*100}%;--d:${2+Math.random()*5}s;--o:${.3+Math.random()*.7};animation-delay:${Math.random()*6}s;width:${1+Math.random()*2}px;height:${1+Math.random()*2}px;`;
  starsEl.appendChild(s);
}

/* ── Particles ── */
const pColors = ['#c9a84c','#ff6b9d','#a78bfa'];
for (let i = 0; i < 20; i++) {
  const p = document.createElement('div');
  p.className = 'particle';
  const c = pColors[i % 3];
  p.style.cssText = `left:${Math.random()*100}%;background:${c};--dur:${15+Math.random()*20}s;--op:${.3+Math.random()*.4};--dx:${-40+Math.random()*80}px;animation-delay:${Math.random()*20}s;box-shadow:0 0 6px ${c};`;
  document.body.appendChild(p);
}

/* ── Cursor magic with trail ── */
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
    trail.style.cssText = `left:${e.clientX-2}px;top:${e.clientY-2}px;background:${Math.random()>.5?'#c9a84c':'#ff6b9d'};box-shadow:0 0 6px ${Math.random()>.5?'#c9a84c':'#ff6b9d'};`;
    document.body.appendChild(trail);
    setTimeout(() => trail.remove(), 600);
  }
});

/* ── Mock HexaID Database ── */
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

/* ── HexaID Lookup ── */
function lookupHexaId(idx) {
  const hexaInput = document.getElementById(`m${idx}hexa`);
  const nameInput = document.getElementById(`m${idx}name`);
  const emailInput = document.getElementById(`m${idx}email`);
  const statusEl = document.getElementById(`m${idx}status`);
  const val = hexaInput.value.trim().toUpperCase();

  nameInput.value = '';
  emailInput.value = '';
  nameInput.readOnly = false;
  emailInput.readOnly = false;
  nameInput.style.borderColor = '';
  emailInput.style.borderColor = '';

  if (!val) { statusEl.innerHTML = ''; return; }

  statusEl.innerHTML = '<i class="bi bi-search"></i> Consulting the registry…';
  statusEl.style.color = 'var(--muted)';

  setTimeout(() => {
    const found = hexaDB[val];
    if (found) {
      nameInput.value = found.name;
      emailInput.value = found.email;
      nameInput.readOnly = true;
      emailInput.readOnly = true;
      nameInput.style.borderColor = 'var(--accent-dim)';
      emailInput.style.borderColor = 'var(--accent-dim)';
      statusEl.innerHTML = '<i class="bi bi-patch-check-fill"></i> Caster identified — sealed by registry';
      statusEl.style.color = 'var(--accent)';
    } else {
      statusEl.innerHTML = '<i class="bi bi-exclamation-triangle"></i> HexaID not found — enter details manually';
      statusEl.style.color = 'var(--gold)';
    }
  }, 500);
}

/* ── Render Team Members ── */
function renderMembers() {
  const n = parseInt(document.getElementById('teamSize').value);
  const container = document.getElementById('members-container');
  if (!n) { container.innerHTML = ''; return; }
  container.innerHTML = '';

  const sizes = ['S', 'M', 'L', 'XL', 'XXL'];

  for (let i = 1; i <= n; i++) {
    const card = document.createElement('div');
    card.className = 'member-card';
    card.innerHTML = `
      <div class="member-tag"><i class="bi bi-person-vcard"></i> Member ${i}${i === 1 ? ' — Team Leader' : ''}</div>
      <div class="three-col member-fields">
        <div class="field-group" style="margin-bottom:0">
          <label for="m${i}hexa" style="font-size:10px">HexaID</label>
          <input type="text" id="m${i}hexa" name="member${i}HexaId" placeholder="HXF-001" oninput="lookupHexaId(${i})" style="text-transform:uppercase;letter-spacing:1px"/>
        </div>
        <div class="field-group" style="margin-bottom:0">
          <label for="m${i}name" style="font-size:10px">Full Name</label>
          <input type="text" id="m${i}name" name="member${i}Name" placeholder="Auto-filled or manual" required/>
        </div>
        <div class="field-group" style="margin-bottom:0">
          <label for="m${i}email" style="font-size:10px">Email</label>
          <input type="email" id="m${i}email" name="member${i}Email" placeholder="Auto-filled or manual" required/>
        </div>
      </div>
      <div class="two-col member-fields" style="margin-top:12px">
        <div class="field-group" style="margin-bottom:0">
          <label for="m${i}github" style="font-size:10px"><i class="bi bi-github"></i> GitHub </label>
          <input type="url" id="m${i}github" name="member${i}Github" placeholder="https://github.com/username"/>
        </div>
        <div class="field-group" style="margin-bottom:0">
          <label for="m${i}linkedin" style="font-size:10px"><i class="bi bi-linkedin"></i> LinkedIn Profile</label>
          <input type="url" id="m${i}linkedin" name="member${i}Linkedin" placeholder="https://linkedin.com/in/username"/>
        </div>
      </div>
      <div class="two-col member-fields" style="margin-top:12px">
        <div class="field-group" style="margin-bottom:0">
          <label for="m${i}tshirt" style="font-size:10px"><i class="bi bi-bag-heart"></i> T-Shirt Size</label>
          <div class="select-wrap">
            <select id="m${i}tshirt" name="member${i}Tshirt" required>
              <option value="" disabled selected>Size</option>
              ${sizes.map(s => `<option value="${s}">${s}</option>`).join('')}
            </select>
          </div>
        </div>
        <div class="field-group" style="margin-bottom:0">
          <label style="font-size:10px"><i class="bi bi-egg-fried"></i> Food Preference</label>
          <div style="display:flex;gap:10px;margin-top:4px">
            <label style="display:flex;align-items:center;gap:6px;cursor:pointer;font-size:12px;color:var(--text)">
              <input type="radio" name="member${i}Food" value="Veg" required style="width:auto;padding:0;accent-color:var(--gold)"/> <span style="color:#34d399">🟢</span> Veg
            </label>
            <label style="display:flex;align-items:center;gap:6px;cursor:pointer;font-size:12px;color:var(--text)">
              <input type="radio" name="member${i}Food" value="Non-Veg" style="width:auto;padding:0;accent-color:var(--gold)"/> <span style="color:#ff4d6a">🔴</span> Non-Veg
            </label>
          </div>
        </div>
      </div>
      <div id="m${i}status" class="lookup-status"></div>`;
    container.appendChild(card);
  }
}

/* ── Step Navigation ── */
function updateProgress() {
  const dots = document.querySelectorAll('.step-dot');
  const fill = document.getElementById('progressFill');
  const trackWidth = document.querySelector('.progress-track').offsetWidth - 48;
  const pct = ((currentStep - 1) / (totalSteps - 1)) * trackWidth;
  fill.style.width = pct + 'px';

  dots.forEach((d, i) => {
    const step = i + 1;
    d.classList.remove('active', 'done');
    if (step === currentStep) d.classList.add('active');
    else if (step < currentStep) d.classList.add('done');
  });
}

function showPanel(n) {
  document.querySelectorAll('.step-panel').forEach(p => p.classList.remove('active'));
  document.getElementById(`panel${n}`).classList.add('active');
  currentStep = n;
  updateProgress();
  if (n === 2) renderMembers();
  if (n === 4) buildSummary();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function goToStep(n) {
  if (n <= currentStep) showPanel(n);
}

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
      const radios = document.querySelectorAll('input[name="firstHackathon"]');
      if (![...radios].some(r => r.checked)) { valid = false; alert('Please select your hackathon experience.'); }
      if (!document.getElementById('teamSize').value) { valid = false; document.getElementById('teamSize').style.borderColor = 'var(--danger)'; }
    }
    if (!valid) return;
  }
  showPanel(n);
}

/* ── Build Summary ── */
function buildSummary() {
  const uni = document.getElementById('university').value || '—';
  const team = document.getElementById('teamName').value || '—';
  const size = document.getElementById('teamSize').value || '—';
  const referral = document.getElementById('referral').value || 'None';
  const hackExp = document.querySelector('input[name="firstHackathon"]:checked');
  const hackText = hackExp ? (hackExp.value === 'yes' ? 'First Hackathon' : 'Experienced') : '—';
  const techs = [...document.querySelectorAll('input[name="tech"]:checked')].map(c => c.value).join(', ') || 'None selected';

  let membersHtml = '';
  const n = parseInt(size) || 0;
  for (let i = 1; i <= n; i++) {
    const name = document.getElementById(`m${i}name`)?.value || '—';
    const email = document.getElementById(`m${i}email`)?.value || '—';
    const github = document.getElementById(`m${i}github`)?.value || '—';
    const linkedin = document.getElementById(`m${i}linkedin`)?.value || '—';
    const tshirt = document.getElementById(`m${i}tshirt`)?.value || '—';
    const foodRadio = document.querySelector(`input[name="member${i}Food"]:checked`);
    const food = foodRadio ? foodRadio.value : '—';
    membersHtml += `<div style="margin-left:16px;margin-bottom:6px"><i class="bi bi-person-fill" style="color:var(--accent)"></i> <strong>${name}</strong> · ${email} · T-Shirt: ${tshirt} · Food: ${food}${github !== '—' ? ' · <a href="'+github+'" target="_blank" style="color:var(--accent)">GitHub</a>' : ''}${linkedin !== '—' ? ' · <a href="'+linkedin+'" target="_blank" style="color:var(--accent)">LinkedIn</a>' : ''}</div>`;
  }

  document.getElementById('summaryBox').innerHTML = `
    <div style="margin-bottom:12px"><i class="bi bi-mortarboard-fill" style="color:var(--gold)"></i> <strong>University:</strong> ${uni}</div>
    <div style="margin-bottom:12px"><i class="bi bi-trophy-fill" style="color:var(--gold)"></i> <strong>Team:</strong> ${team} (${size} members)</div>
    <div style="margin-bottom:12px"><i class="bi bi-lightning-charge-fill" style="color:var(--gold)"></i> <strong>Experience:</strong> ${hackText}</div>
    <div style="margin-bottom:12px"><i class="bi bi-cpu-fill" style="color:var(--gold)"></i> <strong>Hardware Stack:</strong> ${techs}</div>
    <div style="margin-bottom:12px"><i class="bi bi-ticket-perforated-fill" style="color:var(--gold)"></i> <strong>Referral:</strong> ${referral}</div>
    <div style="margin-bottom:6px"><i class="bi bi-people-fill" style="color:var(--gold)"></i> <strong>Members:</strong></div>
    ${membersHtml}`;
}

/* ── Submit ── */
function handleSubmit() {
  const tc = document.getElementById('tcCheck');
  if (!tc.checked) { alert('You must accept the Terms & Conditions to proceed.'); return; }
  const data = Object.fromEntries(new FormData(document.getElementById('regForm')));
  console.log('HexaFalls Hardware Registration:', data);

  const btn = document.getElementById('submitBtn');
  btn.innerHTML = '<i class="bi bi-check-circle-fill"></i> Scroll Sealed — Owls Dispatched';
  btn.style.background = 'linear-gradient(135deg,#ff6b9d,#cc4f7a)';
  btn.style.color = '#060912';
  btn.style.pointerEvents = 'none';

  for (let i = 0; i < 40; i++) setTimeout(() => spawnConfetti(), i * 30);

  setTimeout(() => {
    btn.innerHTML = '<i class="bi bi-send"></i> <span>Cast the Scroll</span>';
    btn.style.background = '';
    btn.style.color = '';
    btn.style.pointerEvents = '';
  }, 5000);
}

/* ── Confetti ── */
function spawnConfetti() {
  const el = document.createElement('div');
  const colors = ['#c9a84c', '#ff6b9d', '#f0d080', '#a78bfa', '#00e5ff'];
  el.style.cssText = `position:fixed;left:${30+Math.random()*40}%;top:50%;width:${6+Math.random()*6}px;height:${6+Math.random()*6}px;background:${colors[Math.floor(Math.random()*colors.length)]};border-radius:${Math.random()>.5?'50%':'2px'};z-index:10000;pointer-events:none;animation:confettiFall ${1.5+Math.random()*2}s ease-out forwards;`;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 4000);
}

const confettiStyle = document.createElement('style');
confettiStyle.textContent = `@keyframes confettiFall{0%{transform:translateY(0) translateX(0) rotate(0deg);opacity:1}100%{transform:translateY(${window.innerHeight}px) translateX(${-100+Math.random()*200}px) rotate(${360+Math.random()*360}deg);opacity:0}}`;
document.head.appendChild(confettiStyle);

updateProgress();
