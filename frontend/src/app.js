// src/app.js
// =============================================
// MAIN APP — Router, Navigation, Init
// =============================================

/**
 * Navigate to a named page
 * @param {'home'|'vote'|'results'|'audit'} page
 */
function navigate(page) {
  // Hide all pages
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));

  // Deactivate all tabs
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));

  // Show target page
  const target = document.getElementById(`page-${page}`);
  if (target) target.classList.add('active');

  // Activate tab
  const tab = document.getElementById(`tab-${page}`);
  if (tab) tab.classList.add('active');

  // Page-specific on-enter logic
  switch (page) {
    case 'home':
      loadHomeStats();
      break;
    case 'vote':
      resetVotePage();
      break;
    case 'results':
      loadResults();
      break;
    case 'audit':
      loadAudit();
      break;
  }

  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * Load total vote count for the home stats bar
 */
async function loadHomeStats() {
  try {
    const baseUrl = typeof BASE_URL !== 'undefined' ? BASE_URL : (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' ? 'http://localhost:3000' : 'https://verivotex-2.onrender.com');
    const res = await fetch(`${baseUrl}/votes`);
    const votes = await res.json();
    const el = document.getElementById('stat-total-votes');
    if (el) el.textContent = votes.length;
  } catch {
    // Silently fail — server might not be running yet
  }
}

/**
 * Logout — clear session and return to home
 */
function logout() {
  sessionStorage.removeItem('voterID');
  // Reset vote page state
  if (typeof backToLogin === 'function') backToLogin();
  const badge = document.getElementById('navbar-voter-badge');
  if (badge) badge.classList.remove('visible');
  document.getElementById('logout-btn').style.display = 'none';
  navigate('home');
}

// =============================================
// KEYBOARD SHORTCUTS
// =============================================
document.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    // If login input is focused, trigger login
    if (document.activeElement && document.activeElement.id === 'voter-id-input') {
      handleLogin();
    }
  }
});

// =============================================
// INIT
// =============================================
document.addEventListener('DOMContentLoaded', () => {
  // Initialize home page
  loadHomeStats();

  // Restore voterID from session if present
  const stored = sessionStorage.getItem('voterID');
  if (stored) {
    const badge = document.getElementById('navbar-voter-badge');
    if (badge) {
      badge.textContent = `👤 ${stored}`;
      badge.classList.add('visible');
    }
    document.getElementById('logout-btn').style.display = 'block';
  }

  console.log('%c VoteChain Frontend Loaded ', 'background:#00e5a0; color:#0a0c10; font-weight:bold; padding:4px 8px; border-radius:4px;');
  console.log('Backend expected at: http://localhost:3000');
});