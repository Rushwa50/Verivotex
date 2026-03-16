// src/pages/results.js

/**
 * Fetch and display live results
 */
async function loadResults() {
  const container = document.getElementById('results-list');

  // Spinner while loading
  container.innerHTML = `
    <div style="text-align:center; padding:40px; color:var(--text-muted); font-family:var(--font-mono); font-size:0.82rem;">
      <span class="spinner" style="margin-right:10px;"></span> Loading results…
    </div>
  `;

  hideAlert('results-alert');

  try {
    const res = await fetch('https://verivotex-2.onrender.com/results');
    const data = await res.json();
    renderResults(data);
  } catch (err) {
    container.innerHTML = '';
    showAlert('results-alert', 'error', 'Cannot reach server. Is the backend running on port 3000?');
  }
}