// src/services/api.js
// Base URL of the Express backend
const BASE_URL = "https://verivotex-2.onrender.com";

/**
 * Login with a Voter ID
 * POST /login
 */
async function loginVoter(voterID) {
  const res = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ voterID }),
  });
  return await res.json();
}

/**
 * Cast a vote for a candidate
 * POST /vote
 */
async function castVote(voterID, candidateID) {
  const res = await fetch(`${BASE_URL}/vote`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ voterID, candidateID }),
  });
  return await res.json();
}

/**
 * Get full vote chain (blockchain audit trail)
 * GET /votes
 */
async function getVoteChain() {
  const res = await fetch(`${BASE_URL}/votes`);
  return await res.json();
}

/**
 * Get election results (candidate tally)
 * GET /results
 */
async function getResults() {
  const res = await fetch(`${BASE_URL}/results`);
  return await res.json();
}

export { loginVoter, castVote, getVoteChain, getResults };