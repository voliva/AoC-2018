const pointRegex = /^position=< ?(-?\d+),  ?(-?\d+)> velocity=< ?(-?\d+),  ?(-?\d+)>$/;

const parsePoint = line => {
    const result = pointRegex.exec(line);
    const [_,x,y,vx,vy] = result
    return {
        pos: {
            x: parseInt(x),
            y: parseInt(y)
        },
        speed: {
            x: parseInt(vx),
            y: parseInt(vy)
        }
    }
}

const detectPosibleFinish = points => {
    const minPos = points.reduce(({x,y}, p) => {
        return {
            x: Math.min(x, p.pos.x),
            y: Math.min(y, p.pos.y)
        }
    }, {x: Infinity, y: Infinity});
    const maxPos = points.reduce(({x,y}, p) => {
        return {
            x: Math.max(x, p.pos.x),
            y: Math.max(y, p.pos.y)
        }
    }, {x: -Infinity, y: -Infinity});

    const height = maxPos.y - minPos.y + 1;

    return height === 10;
}

// GPJLLLLH
const printPos = points => {
    const minPos = points.reduce(({x,y}, p) => {
        return {
            x: Math.min(x, p.pos.x),
            y: Math.min(y, p.pos.y)
        }
    }, {x: Infinity, y: Infinity});
    const maxPos = points.reduce(({x,y}, p) => {
        return {
            x: Math.max(x, p.pos.x),
            y: Math.max(y, p.pos.y)
        }
    }, {x: -Infinity, y: -Infinity});

    const width = maxPos.x - minPos.x + 1;
    const height = maxPos.y - minPos.y + 1;

    const res = new Array(width*height);
    points.forEach(p => {
        const row = p.pos.y - minPos.y;
        const col = p.pos.x - minPos.x;
        const i = row*width + col;
        res[i] = true;
    });

    for(let row=0; row<height; row++) {
        let line = ''
        for(let col=0; col<width; col++) {
            if(res[row*width + col]) {
                line += '#'
            }else {
                line += '.'
            }
        }
        console.log(line);
    }
}

const solution1 = inputLines => {
    const points = inputLines.map(parsePoint);

    while(!detectPosibleFinish(points)) {
        points.forEach(p => {
            p.pos.x += p.speed.x;
            p.pos.y += p.speed.y;
        });
    }

    console.log('found!');

    printPos(points);

    return null; // JSON.stringify(points);
};

const solution2 = inputLines => {
    const points = inputLines.map(parsePoint);

    let s = 0;
    while(!detectPosibleFinish(points)) {
        s++;
        points.forEach(p => {
            p.pos.x += p.speed.x;
            p.pos.y += p.speed.y;
        });
    }

    return s;
};

module.exports = [solution1, solution2];