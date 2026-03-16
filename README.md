# VeriVotex 🗳️

> A tamper-evident digital voting system secured by SHA-256 chain hashing.

![Node.js](https://img.shields.io/badge/Node.js-Backend-339933?style=flat-square&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-5.x-000000?style=flat-square&logo=express&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-Vanilla-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![License](https://img.shields.io/badge/License-ISC-blue?style=flat-square)
![Status](https://img.shields.io/badge/Status-Finished-brightgreen?style=flat-square)

---

## 📖 Overview

**VeriVotex** is a full-stack digital voting application that uses **SHA-256 chain hashing** to cryptographically guarantee the integrity of every vote. Inspired by blockchain principles, each vote record is linked to the one before it — making silent tampering mathematically impossible to hide.

The project consists of:
- A **Node.js + Express REST API** that manages votes, enforces one-vote-per-voter, and builds the hash chain
- A **vanilla JavaScript browser frontend** with four views: Home, Vote, Results, and Audit

---

## 🔗 How Chain Hashing Works

Every vote stored by VeriVotex contains:

| Field | Description |
|---|---|
| `voterID` | The voter's unique identifier |
| `candidateID` | The candidate they voted for |
| `timestamp` | ISO timestamp of when the vote was cast |
| `previousHash` | SHA-256 hash of the previous vote (`"0"` for the genesis block) |
| `hash` | SHA-256 hash of `voterID + candidateID + timestamp + previousHash` |

This forms an unbreakable chain:

```
Genesis
  └─► [Vote #1]  prevHash: "0"      hash: "a3f9e2..."
        └─► [Vote #2]  prevHash: "a3f9e2..."  hash: "b72c41..."
              └─► [Vote #3]  prevHash: "b72c41..."  hash: "c194d8..."
```

If any past vote is altered, its hash changes — and every subsequent `previousHash` no longer matches. The tamper is immediately visible in the Audit view.

---

## ✨ Features

- 🔗 **Chain hashing** — every vote is SHA-256 chained using Node's built-in `crypto` module
- 🧑‍💼 **Voter authentication** — login with a Voter ID before casting a ballot
- 🚫 **One vote per voter** — duplicate vote attempts are rejected by the server
- 🗳️ **5 candidate ballot** — pre-configured with real candidate names and party affiliations
- 📊 **Live results** — real-time vote tally with animated percentage bars
- 🔍 **Blockchain audit trail** — inspect every block in the chain with full hash details
- ✅ **Vote confirmation** — after voting, voters see their block hash as a receipt
- 🔒 **CORS-enabled API** — frontend and backend run on separate ports seamlessly

---

## 🏗️ Architecture

```
VeriVotex/
├── Backend/
│   ├── server.js       # Express app — API routes and vote logic
│   ├── hash.js         # SHA-256 hashing utility (Node crypto)
│   ├── chain.js        # Chain building logic (addVote, votes array)
│   ├── votes.js        # In-memory vote store
│   └── package.json    # Backend dependencies (express, cors)
│
└── frontend/
    ├── index.html                    # Single-page app shell + bottom nav
    ├── src/
    │   ├── app.js                    # Router, navigation, session restore
    │   ├── pages/
    │   │   ├── vote.js               # Login, candidate selection, submission
    │   │   ├── results.js            # Live result fetching
    │   │   └── audit.js              # Chain audit fetching
    │   ├── components/
    │   │   ├── candidateCard.js      # Candidate grid renderer + CANDIDATES list
    │   │   ├── blockCard.js          # Vote chain block renderer
    │   │   └── resultBar.js          # Animated result bar renderer
    │   ├── services/
    │   │   └── api.js                # Fetch wrappers for all API endpoints
    │   └── utils/
    │       └── helpers.js            # formatTimestamp, truncateHash, alerts, UI helpers
    └── package.json
```

---

## 🗳️ Candidates

The ballot is pre-configured in `frontend/src/components/candidateCard.js`:

| ID | Name | Party |
|---|---|---|
| C1 | Narendra Modi | BJP |
| C2 | Mamta Banerjee | TMC |
| C3 | Akhilesh Yadav | SP |
| C4 | Rahul Gandhi | INC |
| C5 | Arvind Kejriwal | AAP |

To change candidates, edit the `CANDIDATES` array in `candidateCard.js`.

---

## 🌐 API Reference

The backend runs on `http://localhost:3000`.

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` | Health check — returns `"Digital Voting Backend Running"` |
| `POST` | `/login` | Authenticate a voter by `voterID` |
| `POST` | `/vote` | Cast a vote with `voterID` and `candidateID` |
| `GET` | `/votes` | Return the full vote chain (all blocks) |
| `GET` | `/results` | Return the vote tally as `{ candidateID: count }` |

### Example: Cast a vote

```bash
curl -X POST http://localhost:3000/vote \
  -H "Content-Type: application/json" \
  -d '{"voterID": "V001", "candidateID": "C3"}'
```

Response:
```json
{
  "message": "Vote recorded successfully",
  "vote": {
    "voterID": "V001",
    "candidateID": "C3",
    "timestamp": "2025-03-16T10:22:00.000Z",
    "previousHash": "0",
    "hash": "a3f9e2d1..."
  }
}
```

---

## 📦 Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- npm (bundled with Node.js)
- A static file server for the frontend (e.g. `live-server` or `serve`)

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Rushwa50/Verivotex.git
cd Verivotex
```

### 2. Start the Backend

```bash
cd Backend
npm install
node server.js
```

The API will be running at `http://localhost:3000`.

### 3. Start the Frontend

```bash
cd ../frontend
npm install
npm start         # uses live-server on port 5000
# or
npm run dev       # uses serve on port 5000
```

Then open `http://localhost:5000` in your browser.

---

## 🖥️ Pages

| Page | Description |
|---|---|
| **Home** | Landing page with system stats and feature overview |
| **Vote** | Step 1: Voter ID login → Step 2: Select candidate → Step 3: Confirmation with block hash |
| **Results** | Live animated bar chart of vote tallies per candidate |
| **Audit** | Full blockchain — every vote block with hash, previous hash, voter ID, and timestamp |

---

## ⚠️ Notes

- **In-memory storage only** — votes are stored in a JavaScript array at runtime and are lost when the server restarts. For persistence, connect a database.
- **No real authentication** — any string is accepted as a Voter ID. For production, add proper voter verification.
- **CORS is open** — the backend accepts requests from any origin. Restrict this for production use.

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch — `git checkout -b feature/your-feature`
3. Commit your changes — `git commit -m "Add your feature"`
4. Push to the branch — `git push origin feature/your-feature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the [ISC License](LICENSE).

---

## 👤 Author

**Rushwa50**  
GitHub: [@Rushwa50](https://github.com/Rushwa50)

---

*VeriVotex — Every vote cryptographically sealed. Fraud mathematically impossible to hide.* 🔐
