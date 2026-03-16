// src/pages/audit.js

/**
 * Fetch and render the full vote chain
 */
async function loadAudit() {
  const container = document.getElementById('chain-container');

  container.innerHTML = `
    <div style="text-align:center; padding:40px; color:var(--text-muted); font-family:var(--font-mono); font-size:0.82rem;">
      <span class="spinner" style="margin-right:10px;"></span> Fetching chain…
    </div>
  `;

  try {
    const res = await fetch('https://verivotex-2.onrender.com/votes');
    const data = await res.json();
    renderChain(data);
  } catch (err) {
    container.innerHTML = `
      <div class="alert alert-error visible">
        <span>✕</span>
        <span>Cannot reach server. Is the backend running on port 3000?</span>
      </div>
    `;
  }
}