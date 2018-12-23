const botRegex = /^pos=<(-?\d+),(-?\d+),(-?\d+)>, r=(\d+)$/;

const parseBot = line => {
    const res = botRegex.exec(line).map(v => Number(v));
    return {
        pos: res.slice(1,4),
        r: res[4]
    }
}

const getDistance = (b1, b2) => {
    return b2.pos.reduce((d, v, i) => d + Math.abs(v - b1.pos[i]), 0);
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
        getDistance(bot, maxBot) <= maxBot.r
    );

    return inRange.length;
}

module.exports = [solution1];