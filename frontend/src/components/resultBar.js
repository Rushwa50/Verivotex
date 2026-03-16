// src/components/resultBar.js

/**
 * Render live results into #results-list
 * @param {Object} results - { candidateId: count, ... }
 */
function renderResults(results) {
  const container = document.getElementById('results-list');
  if (!container) return;

  const entries = Object.entries(results);

  if (entries.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <span class="empty-icon">📊</span>
        <p>No votes recorded yet.</p>
      </div>
    `;
    document.getElementById('results-total-label').textContent = 'Total Votes: 0';
    return;
  }

  // Sort by vote count descending
  entries.sort((a, b) => b[1] - a[1]);

  const totalVotes = entries.reduce((sum, [, n]) => sum + n, 0);
  const winner = entries[0][0];

  document.getElementById('results-total-label').textContent = `Total Votes: ${totalVotes}`;
  document.getElementById('results-timestamp').textContent =
    'Last updated: ' + new Date().toLocaleTimeString('en-IN');

  container.innerHTML = entries.map(([candidateId, count], i) => {
    const pct = totalVotes > 0 ? Math.round((count / totalVotes) * 100) : 0;
    const color = CANDIDATE_COLORS[
      CANDIDATES
        ? CANDIDATES.findIndex(c => c.id === candidateId) % CANDIDATE_COLORS.length
        : i % CANDIDATE_COLORS.length
    ];
    const isWinner = candidateId === winner;
    const name = getCandidateNameSafe(candidateId);

    return `
      <div class="result-row ${isWinner ? 'result-winner card' : ''}" style="${isWinner ? 'padding:16px;' : ''}">
        ${isWinner ? '<div style="font-family:var(--font-mono);font-size:0.65rem;color:var(--accent-primary);letter-spacing:2px;text-transform:uppercase;margin-bottom:8px;">🏆 Leading</div>' : ''}
        <div class="result-row-header">
          <span class="result-candidate">${name}</span>
          <span class="result-count">${count} vote${count !== 1 ? 's' : ''} · ${pct}%</span>
        </div>
        <div class="result-bar-bg">
          <div
            class="result-bar-fill"
            data-pct="${pct}"
            style="background: linear-gradient(90deg, ${color}, ${color}99);"
          ></div>
        </div>
      </div>
    `;
  }).join('');

  // Animate bars after paint
  requestAnimationFrame(() => {
    document.querySelectorAll('.result-bar-fill').forEach(bar => {
      bar.style.width = bar.dataset.pct + '%';
    });
  });
}