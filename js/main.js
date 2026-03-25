// OSIRIS — main.js

// Nav scroll behaviour
const nav = document.getElementById('nav');
if (nav) {
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  });
}

// Mobile hamburger menu
const navToggle = document.querySelector('.nav-toggle');
if (navToggle) {
  navToggle.addEventListener('click', () => {
    const navEl = navToggle.closest('.nav');
    const expanded = navEl.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', expanded);
  });
}

// Active nav link
(function() {
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === page || (page === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });
})();

// Grade colour class
function gradeClass(cis) {
  const letter = cis.charAt(0).toUpperCase();
  if (letter === 'A') return 'grade-a';
  if (letter === 'B') return 'grade-b';
  if (letter === 'C') return 'grade-c';
  if (letter === 'D') return 'grade-d';
  return 'grade-f';
}

// Factuality bar colour (0–10 scale)
function factBarColor(score) {
  if (score >= 8) return 'var(--primary-light)';
  if (score >= 6) return 'var(--accent)';
  if (score >= 4) return '#C97A2D';
  return '#C93D2D';
}

// Source transparency — filled segment count
function transparencySegments(label) {
  const map = { 'Full': 5, 'High': 4, 'Moderate': 3, 'Low': 2, 'Opaque': 1 };
  return map[label] || 0;
}

// Build segmented bar HTML
function buildSegBar(label, compact) {
  const filled = transparencySegments(label);
  const cls = compact ? 'seg-bar seg-bar-sm' : 'seg-bar';
  let html = `<div class="${cls}">`;
  for (let i = 0; i < 5; i++) {
    html += `<div class="seg-bar-segment${i < filled ? ' filled' : ''}"></div>`;
  }
  html += '</div>';
  return html;
}

// Factuality bar width as percentage (score is 0–10)
function factBarWidth(score) {
  return (score / 10) * 100;
}

// Build a scorecard card element (HTML string)
function buildCard(a) {
  const gc = gradeClass(a.cis);
  const color = factBarColor(a.factualityScore);
  const tags = (a.positionTags || []).map(t => `<span class="tag">${t}</span>`).join('');
  const handleClean = a.handle.replace('@', '');
  const avatarUrl = `https://unavatar.io/twitter/${handleClean}`;
  const displayName = a.displayName || a.handle;
  const autoFlagCount = (a.autoFlags || []).length;

  return `
  <a class="scorecard-card" href="scorecards/view.html?id=${a.id}" style="display: flex; flex-direction: column;">
    <div>
      <div class="card-top">
        <div style="display: flex; align-items: center; gap: 0.75rem; flex: 1;">
          <img src="${avatarUrl}" alt="${a.handle}" class="card-avatar" style="width: 48px; height: 48px; border-radius: 50%; object-fit: cover; flex-shrink: 0;">
          <div style="min-width: 0;">
            <div class="card-name">${displayName}</div>
            <div class="card-handle">${a.handle}</div>
          </div>
        </div>
        <div class="grade-badge ${gc}">${a.cis}</div>
      </div>
      <div class="fact-bar-label">
        <span>Factuality</span>
        <span>${a.factualityScore} / 10</span>
      </div>
      <div class="fact-bar">
        <div class="fact-bar-fill" style="width:${factBarWidth(a.factualityScore)}%; background:${color};"></div>
      </div>
      <div style="margin-top: 0.6rem;">
        <div class="fact-bar-label">
          <span>Source Transparency</span>
          <span>${a.sourceTransparencyLabel || ''}</span>
        </div>
        ${buildSegBar(a.sourceTransparencyLabel || '', true)}
      </div>
      ${autoFlagCount > 0 ? `<div style="margin-top: 0.6rem;"><span class="flag-pill flag-auto">${autoFlagCount} flag${autoFlagCount > 1 ? 's' : ''}</span></div>` : ''}
      ${a.summary ? `<div class="card-summary">${a.summary}</div>` : ''}
      ${tags ? `<div class="card-tags">${tags}</div>` : ''}
    </div>
    <div class="card-footer" style="margin-top: auto;">
      <div class="card-posts">Based on ${a.totalPosts - a.pendingPosts} of ${a.totalPosts} posts${a.pendingPosts > 0 ? ` · ${a.pendingPosts} pending` : ''}</div>
      <div class="card-updated">Updated ${a.lastUpdated}</div>
    </div>
  </a>`;
}
