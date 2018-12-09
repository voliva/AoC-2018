
const inRegex = /^(\d+) players; last marble is worth (\d+) points$/;

const addMarble = (m, prevNode) => {
    const marble = {
        marble: m,
        next: prevNode.next,
        prev: prevNode
    };
    prevNode.next.prev = marble;
    prevNode.next = marble;
    return marble;
}

const removeMarble = node => {
    const {prev, next} = node;
    prev.next = next;
    next.prev = next;
    delete node.next;
    delete node.prev;
    return next;
}

const getMaxScore = (nPlayers, lastMarble) => {
    const scores = new Array(nPlayers);
    const marbleToNPlayer = m => (m-1) % nPlayers;

    let circle = {
        marble: 0,
        next: null,
        prev: null
    };
    circle.next = circle;
    circle.prev = circle;

    for(let m=1; m<=lastMarble; m++){
        if(m % 23 === 0) {
            const p = marbleToNPlayer(m);
            for(let i=0; i<7; i++) {
                circle = circle.prev;
            }
            scores[p] = (scores[p] || 0) + m + circle.marble;
            circle = removeMarble(circle);
        }else {
            circle = addMarble(m, circle.next);
        }
    }
    
    return scores.filter(s => !!s).reduce((acc, i) => Math.max(acc, i), 0);
}

const solution1 = inputLines => {
    const inputRes = inRegex.exec(inputLines);
    const nPlayers = parseInt(inputRes[1]);
    const lastMarble = parseInt(inputRes[2]);

    return getMaxScore(nPlayers, lastMarble);
};

const solution2 = inputLines => {
    const inputRes = inRegex.exec(inputLines);
    const nPlayers = parseInt(inputRes[1]);
    const lastMarble = parseInt(inputRes[2]);

    return getMaxScore(nPlayers, lastMarble*100);
};

module.exports = [solution1, solution2];
