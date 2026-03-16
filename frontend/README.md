# VoteChain — Frontend

Verifiable Digital Voting System — SHA-256 Blockchain Frontend

## Folder Structure

```
frontend/
├── index.html                     ← Main HTML (single page app)
├── package.json
├── README.md
└── src/
    ├── app.js                     ← Router, navigation, global init
    ├── styles/
    │   └── main.css               ← All styles (dark industrial theme)
    ├── utils/
    │   └── helpers.js             ← Shared utilities (format, alerts, etc.)
    ├── services/
    │   └── api.js                 ← API call functions (fetch wrappers)
    ├── components/
    │   ├── candidateCard.js       ← Candidate list + selection UI
    │   ├── blockCard.js           ← Blockchain audit block renderer
    │   └── resultBar.js           ← Animated result bar chart
    └── pages/
        ├── vote.js                ← Login + vote casting logic
        ├── results.js             ← Live results fetch + render
        └── audit.js               ← Blockchain chain fetch + render
```

## Pages

| Page    | Route     | Description                                      |
|---------|-----------|--------------------------------------------------|
| Home    | `#home`   | Landing, stats, feature highlights              |
| Vote    | `#vote`   | 2-step: Voter login → candidate selection        |
| Results | `#results`| Live vote tally with animated bar chart          |
| Audit   | `#audit`  | Full blockchain trace with hash linkage display |

## How to Run

### 1. Start the backend first

```bash
cd "Digital vote machine/Backend"
node server.js
# Runs on http://localhost:3000
```

### 2. Serve the frontend

Open `index.html` directly in the browser, OR use a local server to avoid CORS:

```bash
cd frontend
npx serve . -p 5000
# Open: http://localhost:5000
```

## Backend API Reference

| Method | Endpoint  | Body                        | Description              |
|--------|-----------|-----------------------------|--------------------------|
| POST   | /login    | `{ voterID }`               | Authenticate voter       |
| POST   | /vote     | `{ voterID, candidateID }`  | Cast a vote              |
| GET    | /votes    | —                           | Get full vote chain      |
| GET    | /results  | —                           | Get vote tally           |

## Customising Candidates

Edit `src/components/candidateCard.js`:

```js
const CANDIDATES = [
  { id: 'C1', name: 'Your Candidate',  party: 'Party Name' },
  // ...
];
```

## Tech Stack

- **Vanilla HTML/CSS/JS** — no build tools required
- **Fonts**: Syne (display) + IBM Plex Mono (code)
- **Backend**: Node.js + Express (port 3000)
- **Hashing**: SHA-256 via Node `crypto` module