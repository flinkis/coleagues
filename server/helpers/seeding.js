'use strict'
const _ = require('lodash');
const {ceil, log2, pow} = Math

module.exports = {
    fair,
    randomized,
    robin
}

function fair (participants) {
    const nRounds = ceil(log2(participants.length));
    const nSlots = pow(2, nRounds);
    const slots = Array(nSlots);
    slots[0] = 0;
    const getContestantAtSlot = (slot) => slots[slot] < participants.length ? participants[slots[slot]] : null;

    for (let depth = 1; depth <= nRounds; depth++) {
        const layerCapacity = pow(2, depth);
        const distanceUnit = nSlots / layerCapacity;

        for (let i = 0; i < layerCapacity; i += 2) {
            slots[(i + 1) * distanceUnit] = slots[i * distanceUnit] + layerCapacity / 2;
        }
    }

    return Array.apply(null, {length: nSlots / 2}).map((x, i) => [
        getContestantAtSlot(2 * i),
        getContestantAtSlot(2 * i + 1)
    ]);
}

function randomized (participants) {
    const participantsCopy = participants.slice(0);
    const swap = (array, i, j) => {
        let temp = array[i]
        array[i] = array[j]
        array[j] = temp;
    };

    for (let i = participantsCopy.length - 1; i > 0; --i) {
        let j = Math.floor(Math.random() * (i + 1))
        swap(participantsCopy, i, j)
    }

    return fair(participantsCopy);
}

function robin(participants) {
    const rounds = [];
    let participantsCopy = participants;
    let j = 0;

    if (participantsCopy.length % 2 === 1) {
        participantsCopy.push({});
    }

    const length = participantsCopy.length;

    for (j; j < participantsCopy.length - 1; j += 1) {
        let i = 0;

        rounds[j] = [];

        for (i; i < length / 2; i += 1) {
            const home = participantsCopy[i];
            const away = participantsCopy[length - 1 - i];

            if (!_.isEmpty(home) && !_.isEmpty(away)) {
                rounds[j].push([home, away]);
            }
        }

        participantsCopy.splice(1, 0, participantsCopy.pop());
    }

    return rounds;
};