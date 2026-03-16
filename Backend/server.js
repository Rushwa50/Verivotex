const express = require("express");
const cors = require("cors");
const votes = require("./votes");
const generateHash = require("./hash");

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
    res.send("Digital Voting Backend Running");
});
app.post("/login", (req, res) => {

    const { voterID } = req.body;

    if (!voterID) {
        return res.status(400).json({
            message: "Voter ID is required"
        });
    }

    res.json({
        message: "Login successful",
        voterID: voterID
    });

});
app.post("/vote", (req, res) => {

    const { voterID, candidateID } = req.body;

    if (!voterID || !candidateID) {
        return res.status(400).json({
            message: "Invalid vote data"
        });
    }
    const alreadyVoted = votes.find(v => v.voterID === voterID);
    if (alreadyVoted) {
        return res.json({
            message: "You have already voted"
        });
    }

    const timestamp = new Date().toISOString();

    let previousHash = "0";

    if (votes.length > 0) {
        previousHash = votes[votes.length - 1].hash;
    }

    const voteData = voterID + candidateID + timestamp + previousHash;

    const hash = generateHash(voteData);

    const vote = {
        voterID,
        candidateID,
        timestamp,
        previousHash,
        hash
    };

    votes.push(vote);

    res.json({
        message: "Vote recorded successfully",
        vote
    });

});
app.get("/votes", (req, res) => {
    res.json(votes);
});
app.get("/results", (req, res) => {

    let results = {};

    votes.forEach(vote => {

        if (!results[vote.candidateID]) {
            results[vote.candidateID] = 0;
        }

        results[vote.candidateID]++;

    });

    res.json(results);

});

app.listen(PORT, () => {
    console.log("Server running on port " + PORT);
});
