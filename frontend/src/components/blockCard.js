// src/components/blockCard.js

/**
 * Render the full vote chain into #chain-container
 * @param {Array} votes - array of vote objects from GET /votes
 */
function renderChain(votes) {
  const container = document.getElementById('chain-container');
  if (!container) return;

  if (!votes || votes.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <span class="empty-icon">🔗</span>
        <p>No votes in chain yet.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = votes.map((vote, i) => `
    <div class="chain-block" style="animation-delay: ${i * 0.07}s;">
      <div class="chain-block-header">
        <span class="block-number">BLOCK #${i + 1}</span>
        <span class="block-timestamp">${formatTimestamp(vote.timestamp)}</span>
      </div>
      <div class="block-row">
        <span class="block-label">Voter ID</span>
        <span class="block-value voter">${vote.voterID}</span>
      </div>
      <div class="block-row">
        <span class="block-label">Candidate</span>
        <span class="block-value">${getCandidateNameSafe(vote.candidateID)}</span>
      </div>
      <div class="block-row">
        <span class="block-label">Prev Hash</span>
        <span class="block-value prev-hash" title="${vote.previousHash}">${
          vote.previousHash === '0'
            ? '<span style="color:var(--text-muted)">0 (genesis)</span>'
            : truncateHash(vote.previousHash, 20)
        }</span>
      </div>
      <div class="block-row">
        <span class="block-label">Block Hash</span>
        <span class="block-value hash" title="${vote.hash}">${truncateHash(vote.hash, 20)}</span>
      </div>
    </div>
  `).join('');
}

/**
 * Safe candidate name lookup (works even if CANDIDATES not yet loaded)
 */
function getCandidateNameSafe(id) {
  if (typeof getCandidateName === 'function') return getCandidateName(id);
  return id;
}