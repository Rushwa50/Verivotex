// src/utils/helpers.js

/**
 * Format an ISO timestamp to a readable string
 */
function formatTimestamp(iso) {
  try {
    const d = new Date(iso);
    return d.toLocaleString('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  } catch {
    return iso;
  }
}

/**
 * Truncate a hash for display
 */
function truncateHash(hash, len = 16) {
  if (!hash || hash === '0') return hash;
  return hash.slice(0, len) + '…';
}

/**
 * Show an alert element
 * @param {string} id - element ID
 * @param {string} type - 'success' | 'error' | 'info'
 * @param {string} message
 */
function showAlert(id, type, message) {
  const el = document.getElementById(id);
  if (!el) return;
  el.className = `alert alert-${type} visible`;
  el.innerHTML = `<span>${type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ'}</span><span>${message}</span>`;
}

/**
 * Hide an alert element
 */
function hideAlert(id) {
  const el = document.getElementById(id);
  if (el) el.className = 'alert';
}

/**
 * Set button loading state
 */
function setLoading(btnId, loading, text = 'Submit') {
  const btn = document.getElementById(btnId);
  if (!btn) return;
  btn.disabled = loading;
  btn.innerHTML = loading
    ? `<span class="spinner"></span> Processing…`
    : text;
}

/**
 * Candidate colour palette (by index)
 */
const CANDIDATE_COLORS = [
  '#00e5a0', '#0ef', '#ffd166', '#ff6b9d', '#a855f7',
];

/**
 * Candidate emoji avatars
 */
const CANDIDATE_EMOJIS = ['🧑‍💼', '👩‍⚖️', '🧑‍🔬', '👨‍🏫', '👩‍💻'];