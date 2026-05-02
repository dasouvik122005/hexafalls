/* ═══════════════════════════════════════════════════
   HexaFalls — CP Track (Individual) Registration JS
   ═══════════════════════════════════════════════════ */

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
const pColors = ['#c9a84c','#34d399','#a78bfa'];
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
    trail.style.cssText = `left:${e.clientX-2}px;top:${e.clientY-2}px;background:${Math.random()>.5?'#c9a84c':'#34d399'};box-shadow:0 0 6px ${Math.random()>.5?'#c9a84c':'#34d399'};`;
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

/* ── HexaID Lookup (individual) ── */
const hexaInput = document.getElementById('hexaId');
hexaInput.addEventListener('input', () => {
  const nameInput = document.getElementById('fullName');
  const emailInput = document.getElementById('email');
  const statusEl = document.getElementById('lookupStatus');
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
      statusEl.innerHTML = '<i class="bi bi-patch-check-fill"></i> Caster identified — name sealed by the registry';
      statusEl.style.color = 'var(--accent)';
    } else {
      statusEl.innerHTML = '<i class="bi bi-exclamation-triangle"></i> HexaID not found — enter details manually';
      statusEl.style.color = 'var(--gold)';
    }
  }, 500);
});

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
  if (n === 3) buildSummary();
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
      if (![...radios].some(r => r.checked)) {
        valid = false;
        alert('Please select your competition experience.');
      }
    }
    if (!valid) return;
  }
  showPanel(n);
}

/* ── Build Summary ── */
function buildSummary() {
  const name = document.getElementById('fullName').value || '—';
  const email = document.getElementById('email').value || '—';
  const uni = document.getElementById('university').value || '—';
  const github = document.getElementById('github').value || 'Not provided';
  const linkedin = document.getElementById('linkedin').value || 'Not provided';
  const tshirt = document.getElementById('tshirt').value || '—';
  const foodRadio = document.querySelector('input[name="food"]:checked');
  const food = foodRadio ? foodRadio.value : '—';
  const referral = document.getElementById('referral').value || 'None';
  const hexaId = document.getElementById('hexaId').value || 'Not provided';
  const hackExp = document.querySelector('input[name="firstHackathon"]:checked');
  const hackText = hackExp ? (hackExp.value === 'yes' ? 'First Contest' : 'Experienced') : '—';
  const techs = [...document.querySelectorAll('input[name="tech"]:checked')].map(c => c.value).join(', ') || 'None selected';

  document.getElementById('summaryBox').innerHTML = `
    <div style="margin-bottom:12px"><i class="bi bi-hexagon-fill" style="color:var(--accent)"></i> <strong>HexaID:</strong> ${hexaId}</div>
    <div style="margin-bottom:12px"><i class="bi bi-person-fill" style="color:var(--gold)"></i> <strong>Name:</strong> ${name}</div>
    <div style="margin-bottom:12px"><i class="bi bi-envelope-fill" style="color:var(--gold)"></i> <strong>Email:</strong> ${email}</div>
    <div style="margin-bottom:12px"><i class="bi bi-mortarboard-fill" style="color:var(--gold)"></i> <strong>University:</strong> ${uni}</div>
    <div style="margin-bottom:12px"><i class="bi bi-github" style="color:var(--gold)"></i> <strong>GitHub:</strong> ${github}</div>
    <div style="margin-bottom:12px"><i class="bi bi-linkedin" style="color:var(--gold)"></i> <strong>LinkedIn:</strong> ${linkedin}</div>
    <div style="margin-bottom:12px"><i class="bi bi-bag-heart-fill" style="color:var(--gold)"></i> <strong>T-Shirt:</strong> ${tshirt}</div>
    <div style="margin-bottom:12px"><i class="bi bi-egg-fried" style="color:var(--gold)"></i> <strong>Food:</strong> ${food}</div>
    <div style="margin-bottom:12px"><i class="bi bi-lightning-charge-fill" style="color:var(--gold)"></i> <strong>Experience:</strong> ${hackText}</div>
    <div style="margin-bottom:12px"><i class="bi bi-braces" style="color:var(--gold)"></i> <strong>Languages & Platforms:</strong> ${techs}</div>
    <div><i class="bi bi-ticket-perforated-fill" style="color:var(--gold)"></i> <strong>Referral:</strong> ${referral}</div>`;
}

/* ── Submit ── */
function handleSubmit() {
  const tc = document.getElementById('tcCheck');
  if (!tc.checked) { alert('You must accept the Terms & Conditions to proceed.'); return; }
  const data = Object.fromEntries(new FormData(document.getElementById('regForm')));
  console.log('HexaFalls CP Registration:', data);

  const btn = document.getElementById('submitBtn');
  btn.innerHTML = '<i class="bi bi-check-circle-fill"></i> Scroll Sealed — Owls Dispatched';
  btn.style.background = 'linear-gradient(135deg,#34d399,#22a67a)';
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
  const colors = ['#c9a84c', '#34d399', '#f0d080', '#a78bfa', '#00e5ff'];
  el.style.cssText = `position:fixed;left:${30+Math.random()*40}%;top:50%;width:${6+Math.random()*6}px;height:${6+Math.random()*6}px;background:${colors[Math.floor(Math.random()*colors.length)]};border-radius:${Math.random()>.5?'50%':'2px'};z-index:10000;pointer-events:none;animation:confettiFall ${1.5+Math.random()*2}s ease-out forwards;`;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 4000);
}

const confettiStyle = document.createElement('style');
confettiStyle.textContent = `@keyframes confettiFall{0%{transform:translateY(0) translateX(0) rotate(0deg);opacity:1}100%{transform:translateY(${window.innerHeight}px) translateX(${-100+Math.random()*200}px) rotate(${360+Math.random()*360}deg);opacity:0}}`;
document.head.appendChild(confettiStyle);

updateProgress();
