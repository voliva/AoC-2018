const botRegex = /^pos=<(-?\d+),(-?\d+),(-?\d+)>, r=(\d+)$/;

const parseBot = line => {
    const res = botRegex.exec(line).map(v => Number(v));
    return {
        pos: res.slice(1,4),
        r: res[4]
    }
}

const getDistance = (b1, b2) => {
    return b2.reduce((d, v, i) => d + Math.abs(v - b1[i]), 0);
}

const solution1 = inputLines => {
    const bots = inputLines.map(parseBot);
    const maxBot = bots.reduce((maxBot, bot) => {
        if(maxBot.r < bot.r) {
            return bot;
        }
        return maxBot;
    });

    const inRange = bots.filter(bot =>
        getDistance(bot.pos, maxBot.pos) <= maxBot.r
    );

    return inRange.length;
}

const getFromMap = (map, pos) => {
    return map[pos.join(',')];
}
const setOnMap = (map, pos, v) => {
    map[pos.join(',')] = v;
}

const kRot = 1 / Math.sqrt(2);
const rotate = pos => {
    return [
        pos[0] * kRot - pos[1] * kRot,
        pos[0] / 2 + pos[1] / 2 - pos[2] * kRot,
        pos[0] / 2 + pos[1] / 2 + pos[2] * kRot
    ]
}
const antirotate = pos => {
    return [
        pos[0] * kRot + pos[1] / 2 + pos[2] / 2,
        -pos[0] * kRot + pos[1] / 2 + pos[2] / 2,
        -pos[1] * kRot + pos[2] * kRot
    ]
}

const kDist = 1 / Math.sqrt(3);
const getPointAtDist = (dist, pos) => pos.map(v => v + dist * kDist);

const intersect = (seg1, seg2) => {
    const min = seg1.min.map((v,i) => Math.max(v, seg2.min[i]));
    const max = seg1.max.map((v,i) => Math.min(v, seg2.max[i]));

    if(min.some((m, i) => m >= max[i])) {
        return null;
    }
    return { max, min }
}

const solution2 = inputLines => {
    const bots = inputLines.map(parseBot);
    const segments = [];

    bots.forEach((bot, i) => {
        console.log(i, segments.length);

        const rotatedPosition = rotate(bot.pos);
        const min = getPointAtDist(-bot.r, rotatedPosition);
        const max = getPointAtDist(bot.r, rotatedPosition);

        const segment = {
            min,
            max,
            value: 1
        }

        segments.forEach(seg => {
            const intersection = intersect(seg, segment);
            if(intersection) {
                intersection.value = seg.value + 1;
                segments.push(intersection);
            }
        });

        segments.push(segment);
    });

    return segments.length;
}

module.exports = [solution1, solution2];