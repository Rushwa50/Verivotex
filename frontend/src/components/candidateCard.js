// src/components/candidateCard.js

/**
 * List of candidates for the election.
 * Modify this array to change candidates.
 */
const CANDIDATES = [
  { id: 'C1', name: 'Narendra Modi',    party: 'BJP' },
  { id: 'C2', name: 'Mamta Banerjee',   party: 'TMC' },
  { id: 'C3', name: 'Akhilesh Yadav',    party: 'SP' },
  { id: 'C4', name: 'Rahul Gandhi',    party: 'INC' },
  { id: 'C5', name: 'Arvind Kejriwal',     party: 'AAP' },
];

/**
 * Render candidate cards into #candidate-grid
 * @param {string|null} selectedId - currently selected candidate ID
 * @param {function} onSelect - callback(candidateId)
 */
function renderCandidateGrid(selectedId, onSelect) {
  const grid = document.getElementById('candidate-grid');
  if (!grid) return;

  grid.innerHTML = CANDIDATES.map((c, i) => {
    const color = CANDIDATE_COLORS[i % CANDIDATE_COLORS.length];
    const emoji = CANDIDATE_EMOJIS[i % CANDIDATE_EMOJIS.length];
    const isSelected = c.id === selectedId;

    return `
      <div
        class="candidate-card ${isSelected ? 'selected' : ''}"
        onclick="selectCandidate('${c.id}')"
        data-id="${c.id}"
      >
        <div class="check-badge">✓</div>
        <div class="avatar" style="background: ${color}20; font-size:1.8rem;">${emoji}</div>
        <div class="candidate-name">${c.name}</div>
        <div class="candidate-id" style="color:${color}; margin-top:4px; font-size:0.72rem;">${c.id}</div>
        <div class="candidate-id" style="margin-top:2px;">${c.party}</div>
      </div>
    `;
  }).join('');
}

/**
 * Get a candidate's display name by ID
 */
function getCandidateName(candidateId) {
  const c = CANDIDATES.find(x => x.id === candidateId);
  return c ? `${c.name} (${c.id})` : candidateId;
}