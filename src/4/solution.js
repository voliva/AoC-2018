
// excluding 23:XX guards
const guardRegex = /(\d+):(\d+)\] Guard \#(\d+)/;
const parseGuard = line => {
    const regRes = guardRegex.exec(line);
    const hour = parseInt(regRes[1]);
    return regRes && {
        minute: (hour === 23 ? 0 : parseInt(regRes[2])),
        guard: parseInt(regRes[3])
    }
}
const comandRegex = /(\d+):(\d+)\] (.*)$/;
const parseCommand = line => {
    const regRes = comandRegex.exec(line);
    const hour = parseInt(regRes[1]);
    return regRes && {
        minute: (hour === 23 ? 0 : parseInt(regRes[2])),
        command: regRes[3]
    }
}

const getGuardStats = inputLines => {const sortedLines = inputLines.sort();
    const guardStats = {
    };
    for(let i=0; i<sortedLines.length; i++) {
        let {guard} = parseGuard(sortedLines[i]);
        let asleepPeriods = [];
        let lastAsleepMinute = null;
        while(!guardRegex.test(sortedLines[i+1]) && comandRegex.test(sortedLines[i+1])) {
            i++;
            const {minute: comMinute, command} = parseCommand(sortedLines[i]);
            if(command === 'falls asleep') {
                lastAsleepMinute = comMinute;
            } else if(command === 'wakes up') {
                asleepPeriods.push([
                    lastAsleepMinute,
                    comMinute
                ]);
                lastAsleepMinute = null;
            }
        }
        if(lastAsleepMinute !== null) {
            asleepPeriods.push([
                lastAsleepMinute,
                60
            ]);
        }
        guardStats[guard] = (guardStats[guard] || [...new Array(60)].map(_ => 0));
        asleepPeriods.forEach(([start, end]) => {
            for(let k=start; k<end; k++) {
                guardStats[guard][k]++
            }
        });
    }
    return guardStats;
}

const optimizeGuard = (guardStats, strategy) => {
    const winningGuard = Object.entries(guardStats)
        .reduce((max, [guardId, stats]) => {
            const timeAsleep = stats.reduce(strategy, 0);
            if(max.timeAsleep < timeAsleep) {
                return {
                    guardId,
                    stats,
                    timeAsleep
                }
            }
            return max;
        }, {
            timeAsleep: -1
        });

    const winningMinute = Object.entries(winningGuard.stats)
        .reduce((max, [minute, total]) => {
            if(max.total < total) {
                return {
                    minute,
                    total
                }
            }
            return max;
        }, {
            total: -1
        });
    return winningGuard.guardId * winningMinute.minute;
}

const solution1 = inputLines => {
    const guardStats = getGuardStats(inputLines);
    return optimizeGuard(guardStats, (acc, v) => acc + v);
};

const solution2 = inputLines => {
    const guardStats = getGuardStats(inputLines);
    return optimizeGuard(guardStats, (acc, v) => Math.max(acc, v));
};

module.exports = [solution1, solution2];
