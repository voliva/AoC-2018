
const N_ROWS = 7;
const N_COLS = 7;

const fromPos = (row, col) => row*N_COLS + col;
const fromIdx = idx => ({
    row: Math.trunc(idx/N_COLS),
    col: idx % N_COLS
});

const enemyOf = {
    'E': 'G',
    'G': 'E'
};

const readInput = inputLines => {
    const field = new Array(N_ROWS * N_COLS);
    const units = [];

    inputLines.forEach((line, row) => {
        const positions = line.split('');
        positions.forEach((c, col) => {
            field[fromPos(row, col)] = c === '#' ? false : c;
            if(c === 'E' || c === 'G') {
                units.push({
                    c,
                    row,
                    col,
                    HP: 200
                });
            }
        });
    });

    return {
        field, units
    }
}

const printGrid = grid => {
    for(let r=0; r<N_ROWS; r++) {
        console.log(grid.slice(r*N_COLS, (r+1)*N_COLS).map(c => !c ? '#' : c).join(''));
    }
}

const BFT = (field, unit) => {
    const positionsToExplore = [{
        path: [],
        i: fromPos(unit.row, unit.col)
    }];
    const positionsAdded = [];
    positionsAdded[fromPos(unit.row, unit.col)] = true;

    const enemy = enemyOf[unit.c];

    let pathFound = [];

    const explore = (row, col, path, find) => {
        const i = fromPos(row, col);
        if(!pathFound.length && field[i] === find) {
            pathFound = [
                ...path,
                i
            ];
        }

        if(
            field[i] === '.' &&
            !positionsAdded[i]
        ) {
            positionsAdded[i] = true;
            positionsToExplore.push({
                path,
                i
            });
        }
    }

    while(positionsToExplore.length > 0 && !pathFound.length) {
        const {i, path} = positionsToExplore.shift();
        const {row, col} = fromIdx(i);
        const newPath = [
            ...path,
            i
        ];

        explore(row-1, col, newPath, enemy);
        explore(row, col-1, newPath, enemy);
        explore(row, col+1, newPath, enemy);
        explore(row+1, col, newPath, enemy);
    }

    return pathFound.slice(1);
}

const findAttackTarget = (field, units, unit) => {
    const { row, col, c } = unit;
    const enemyChar = enemyOf[c];

    let enemyToAttack = {
        HP: Infinity
    };
    [
        fromPos(row-1, col),
        fromPos(row, col-1),
        fromPos(row, col+1),
        fromPos(row+1, col)
    ].forEach(i => {
        if(field[i] === enemyChar) {
            const enemy = units.find(u => fromPos(u.row, u.col) === i);
            if(enemy.HP < enemyToAttack.HP) {
                enemyToAttack = enemy;
            }
        }
    });
    return enemyToAttack
}

const unitTurn = (field, units, unit) => {
    if(unit.HP <= 0) {
        return false;
    }

    const pathToEnemy = BFT(field, unit);
    if(!pathToEnemy.length) {
        return false;
    }

    if(pathToEnemy.length > 1) {
        const i = pathToEnemy.shift();
        const currentI = fromPos(unit.row, unit.col);
        field[currentI] = '.';
        field[i] = unit.c;
        const { row, col } = fromIdx(i);
        unit.row = row;
        unit.col = col;
    }

    if(pathToEnemy.length === 1) {
        // We have to check again for which enemies we have around, as we might attack another one (with fewer hit points)
        const enemyToAttack = findAttackTarget(field, units, unit);
        enemyToAttack.HP -= 3;
        if(enemyToAttack.HP <= 0) {
            const i = fromPos(enemyToAttack.row, enemyToAttack.col);
            field[i] = '.';
        }
    }

    return true;
}

const round = (field, units) => {
    units = units
        .filter(u => u.HP > 0)
        .sort((u1, u2) => {
            const u1Val = fromPos(u1.row, u1.col);
            const u2Val = fromPos(u2.row, u2.col);
            return u1Val - u2Val;
        });

    return units.reduce((acc, unit) => unitTurn(field, units, unit) || acc, false);
}

const solution1 = inputLines => {
    const { field, units } = readInput(inputLines);

    let nRounds = 0;
    let finished = false;
    while(!finished) {
        finished = !round(field, units);
        nRounds++;
    }

    const remainingHP = units
        .filter(u => u.HP > 0)
        .reduce((acc, u) => acc + u.HP, 0);

    return (nRounds-1)*remainingHP;
};

const solution2 = inputLines => {

    return inputLines;
};

module.exports = [solution1, solution2];