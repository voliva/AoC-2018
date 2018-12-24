
const groupRegex = /^(\d+) units each with (\d+) hit points (\([^)]+\)|) ?with an attack that does (\d+) ([^ ]+) damage at initiative (\d+)$/

const parseSW = SW => {
    const ret = {
        immune: [],
        weak: []
    }

    if(SW === '') return ret;

    SW = SW.replace('(', '').replace(')', '');
    const splitted = SW.split('; ');
    splitted.forEach(gr => {
        const aux = gr.split(' to ');
        const list = aux[1].split(', ');
        if(aux[0] === 'immune') {
            ret.immune = ret.immune.concat(list);
        }else {
            ret.weak = ret.weak.concat(list);
        }
    });

    return ret;
}

const parseInput = inputLines => {
    const teams = {
        immune: [],
        infection: []
    };
    let team = 'immune';
    inputLines.forEach(line => {
        if(!line.length) return;
        if(line === 'Immune System:') return;
        if(line === 'Infection:') {
            team = 'infection';
            return
        }

        const resLine = groupRegex.exec(line);
        const group = {
            size: Number(resLine[1]),
            hp: Number(resLine[2]),
            ...parseSW(resLine[3]),
            atk: Number(resLine[4]),
            type: resLine[5],
            initiative: Number(resLine[6]),
            team
        }
        teams[team].push(group);
    });
    return teams;
}

const effectivePower = gr => gr.size * gr.atk;

const getAtkMultiplier = (attacking, target) => {
    if(target.immune.includes(attacking.type)) return 0;
    if(target.weak.includes(attacking.type)) return 2;
    return 1;
}

const targetSelection = teams => {
    const allGroups = teams.immune.concat(teams.infection)
        .map(gr => {
            gr.chosen = false;
            return gr;
        })
        .sort((gr1, gr2) => {
            const ep1 = effectivePower(gr1);
            const ep2 = effectivePower(gr2);
            if(ep1 !== ep2) {
                return ep2 - ep1;
            }
            return gr2.initiative - gr1.initiative
        });

    allGroups.forEach(gr => {
        let currentTarget = {
            dmg: 0,
            target: null
        };
        let foundDouble = false;
        const ep = effectivePower(gr);
        for(let i=0; i<allGroups.length && !foundDouble; i++) {
            const target = allGroups[i];
            if(target.team === gr.team) continue;
            if(target.chosen) continue;
            const multiplier = getAtkMultiplier(gr, target);
            if(multiplier === 2) {
                foundDouble = true;
            }
            if(currentTarget.dmg < ep*multiplier) {
                currentTarget = {
                    dmg: ep*multiplier,
                    target
                }
            }
        }

        gr.target = currentTarget.target;
        gr.target ? gr.target.chosen = true : null;
    });
    return allGroups;
}

const attack = allGroups => {
    allGroups = allGroups.sort((gr1, gr2) => gr2.initiative - gr1.initiative);
    allGroups.forEach(gr => {
        if(gr.size <= 0) return;
        if(!gr.target) return;

        const ep = effectivePower(gr);
        const multiplier = getAtkMultiplier(gr, gr.target);
        const totalDmg = ep*multiplier;
        
        const unitsLost = Math.trunc(totalDmg / gr.target.hp);
        gr.target.size -= unitsLost;
    });
}

const hasFinished = groups => groups.immune.length === 0 || groups.infection.length === 0;

const pruneDead = team => team.filter(gr => gr.size > 0);
const unitCount = team => team.reduce((total, gr) => total + gr.size, 0);

const battle = (teams, boost = 0) => {
    const teamsCopy = {
        immune: teams.immune.map(gr => ({
            ...gr ,
            atk: gr.atk + boost
        })),
        infection: teams.infection.map(gr => ({...gr}))
    }

    let prevImmune = Infinity;
    let prevInfection = Infinity;
    while(!hasFinished(teamsCopy)) {
        const groupsSelected = targetSelection(teamsCopy);
        attack(groupsSelected, boost);
        teamsCopy.immune = pruneDead(teamsCopy.immune);
        teamsCopy.infection = pruneDead(teamsCopy.infection);

        const immuneCount = unitCount(teamsCopy.immune);
        const infectionCount = unitCount(teamsCopy.infection);
        if(immuneCount === prevImmune || infectionCount === prevInfection) {
            break;
        }
        prevImmune = immuneCount;
        prevInfection = infectionCount;
    }

    const immuneCount = unitCount(teamsCopy.immune);
    const infectionCount = unitCount(teamsCopy.infection);

    if(immuneCount === prevImmune && infectionCount !== prevInfection) {
        return {
            immune: teamsCopy.immune,
            infection: []
        }
    }
    if(immuneCount !== prevImmune && infectionCount === prevInfection) {
        return {
            immune: [],
            infection: teamsCopy.infection
        }
    }

    return teamsCopy;
}

const solution1 = inputLines => {
    const teams = parseInput(inputLines);

    const result = battle(teams);

    return unitCount(result.immune) + unitCount(result.infection);
};

const solution2 = inputLines => {
    const teams = parseInput(inputLines);

    let lowerBound = 0;
    let maxBound = Infinity;

    let immuneAlive = 0;
    do {
        lowerBound = (lowerBound === 0 ? 1 : lowerBound*2);
        const result = battle(teams, lowerBound);
        immuneAlive = unitCount(result.immune);
    } while(immuneAlive === 0);
    maxBound = lowerBound; // maxBound is the lowest value we know it will pass
    lowerBound = lowerBound / 2; // lowerBound is the highest value we know it won't pass

    while(maxBound - lowerBound > 1) {
        const boost = Math.trunc((maxBound + lowerBound) / 2);
        const result = battle(teams, boost);
        if(unitCount(result.immune) > 0) {
            maxBound = boost;
        }else {
            lowerBound = boost;
        }
        console.log(lowerBound, maxBound);
    }
    const result = battle(teams, maxBound);

    return unitCount(result.immune);
}

module.exports = [solution1, solution2];