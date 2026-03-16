const generateHash = require("./hash");

let votes = [];

function addVote(voterID, candidateID){

    const timestamp = Date.now();

    const previousHash =
        votes.length === 0
        ? "0"
        : votes[votes.length - 1].hash;

    const hash = generateHash(
        voterID,
        candidateID,
        timestamp,
        previousHash
    );

    const vote = {
        voterID,
        candidateID,
        timestamp,
        previousHash,
        hash
    };

    votes.push(vote);

    return vote;
}

module.exports = { addVote, votes };