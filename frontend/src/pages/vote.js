// src/pages/vote.js

const BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://localhost:3000'
  : 'https://verivotex-2.onrender.com';

// State
let currentVoterID = null;
let selectedCandidateID = null;

// REPLACE THIS WITH YOUR REAL GOOGLE CLIENT ID
const GOOGLE_CLIENT_ID = "667473584175-47gc1jmc0ee8v4ot768gd8gqddapjafv.apps.googleusercontent.com";

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('google-button-container')) {
    renderGoogleButton();
  }
});

function renderGoogleButton() {
  if (typeof google === 'undefined' || !google.accounts) {
    setTimeout(renderGoogleButton, 100);
    return;
  }

  google.accounts.id.initialize({
    client_id: GOOGLE_CLIENT_ID,
    callback: handleGoogleLogin
  });

  google.accounts.id.renderButton(
    document.getElementById("google-button-container"),
    { theme: "outline", size: "large", width: "100%" }
  );
}

/**
 * Triggered automatically by Google upon successful Sign-In
 */
async function handleGoogleLogin(response) {
  const credential = response.credential;

  if (!credential) {
    showAlert('login-alert', 'error', 'Google authentication failed. No credential received.');
    return;
  }

  try {
    const loginRes = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ credential })
    });

    const loginData = await loginRes.json();

    if (loginRes.ok) {
      currentVoterID = loginData.voterID;
      sessionStorage.setItem('voterID', currentVoterID);
      hideAlert('login-alert');
      showVotingStep();
    } else {
      showAlert('login-alert', 'error', loginData.message || 'Verification failed.');
    }
  } catch (err) {
    console.error("Google Login Error:", err);
    showAlert('login-alert', 'error', 'Failed to reach server. Is backend running on port 3000?');
  }
}

/**
 * Show the candidate selection panel
 */
function showVotingStep() {
  document.getElementById('vote-step-login').style.display = 'none';
  document.getElementById('vote-step-cast').style.display = 'block';

  // Update navbar badge
  const badge = document.getElementById('navbar-voter-badge');
  badge.textContent = `👤 ${currentVoterID}`;
  badge.classList.add('visible');

  document.getElementById('logout-btn').style.display = 'block';

  selectedCandidateID = null;
  renderCandidateGrid(null, selectCandidate);
}

/**
 * Candidate selection handler — called from card onclick
 */
function selectCandidate(candidateId) {
  selectedCandidateID = candidateId;
  renderCandidateGrid(candidateId, selectCandidate);

  const btn = document.getElementById('cast-vote-btn');
  if (btn) btn.disabled = false;

  hideAlert('vote-alert');
}

/**
 * Submit the vote
 */
async function handleCastVote() {
  if (!currentVoterID || !selectedCandidateID) {
    showAlert('vote-alert', 'error', 'Please select a candidate first.');
    return;
  }

  setLoading('cast-vote-btn', true, 'Submit Vote Securely');

  try {
    const res = await fetch(`${BASE_URL}/vote`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ voterID: currentVoterID, candidateID: selectedCandidateID }),
    });

    const data = await res.json();

    if (data.message === 'You have already voted') {
      showAlert('vote-alert', 'error', 'You have already cast your vote. Each voter may only vote once.');
    } else if (data.vote) {
      showConfirmation(data.vote);
    } else {
      showAlert('vote-alert', 'error', data.message || 'Something went wrong.');
    }
  } catch (err) {
    showAlert('vote-alert', 'error', 'Cannot reach server. Is the backend running on port 3000?');
  }

  setLoading('cast-vote-btn', false, 'Submit Vote Securely');
}

/**
 * Show vote confirmation panel
 */
function showConfirmation(vote) {
  document.getElementById('vote-step-cast').style.display = 'none';
  document.getElementById('vote-step-done').style.display = 'block';

  document.getElementById('confirm-voter').textContent = vote.voterID;
  document.getElementById('confirm-candidate').textContent = getCandidateName(vote.candidateID);
  document.getElementById('confirm-timestamp').textContent = formatTimestamp(vote.timestamp);
  document.getElementById('confirm-hash').textContent = vote.hash;
}

/**
 * Go back to login step
 */
function backToLogin() {
  currentVoterID = null;
  selectedCandidateID = null;
  document.getElementById('vote-step-cast').style.display = 'none';
  document.getElementById('vote-step-done').style.display = 'none';
  document.getElementById('vote-step-login').style.display = 'block';
  hideAlert('login-alert');
}

/**
 * Reset vote page state (called when navigating to vote page)
 */
function resetVotePage() {
  // Restore session if available
  const stored = sessionStorage.getItem('voterID');
  if (stored && !currentVoterID) {
    currentVoterID = stored;
  }

  const donePanelVisible = document.getElementById('vote-step-done').style.display === 'block';
  if (donePanelVisible) return; // keep done state visible

  if (currentVoterID) {
    showVotingStep();
  } else {
    document.getElementById('vote-step-login').style.display = 'block';
    document.getElementById('vote-step-cast').style.display = 'none';
    document.getElementById('vote-step-done').style.display = 'none';
  }
}