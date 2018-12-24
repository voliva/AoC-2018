
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
    const ret = {
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
        ret[team].push(group);
    });
    return ret;
}

const effectivePower = gr => gr.size * gr.atk;

const getAtkMultiplier = (attacking, target) => {
    if(target.immune.includes(attacking.type)) return 0;
    if(target.weak.includes(attacking.type)) return 2;
    return 1;
}

const targetSelection = groups => {
    const allGroups = groups.immune.concat(groups.infection)
        .map(gr => {
            gr.chosen = false;
            return gr;
        })
        .sort((gr1, gr2) => {
            const efp1 = effectivePower(gr1);
            const efp2 = effectivePower(gr2);
            if(efp1 !== efp2) {
                return efp2 - efp1;
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

const pruneDead = group => group.filter(gr => gr.size > 0);
const unitCount = group => group.reduce((total, gr) => total + gr.size, 0);

const solution1 = inputLines => {
    const groups = parseInput(inputLines);
    
    while(!hasFinished(groups)) {
        const groupsSelected = targetSelection(groups);
        attack(groupsSelected);
        groups.immune = pruneDead(groups.immune);
        groups.infection = pruneDead(groups.infection);

        console.log(unitCount(groups.immune), unitCount(groups.infection));
    }

    return unitCount(groups.immune) + unitCount(groups.infection);
};


module.exports = [solution1];