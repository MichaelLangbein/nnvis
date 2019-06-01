import { Vector } from "./linalg";


export interface Entry {
    input: Vector;
    output: Vector;
}

export function createDataset(N: number): Entry[] {
    let out = [];
    for(let n = 0; n < N; n++) {
        out.push(createEntry());
    }
    return out;
}


function createEntry(): Entry {
    let input = new Vector([
        randFloat(-1, 1), 
        randFloat(-1, 1)
    ]);
    let output = new Vector([
        inCircle(input)
    ]);
    return {
        input: input, 
        output: output
    };
}


function inCircle(input: Vector): number {
    let center = new Vector([0.1, 0.1]);
    let offset = center.min(input);
    let squareDistance = offset.pointwise(v => v*v).sum();
    let distance = Math.sqrt(squareDistance);
    distance = distance / 2.0;
    // if(distance > 0.45) return 0; 
    // else return 1;
    return distance;
}


function randInt(min: number, max: number) {
    max += 1;
    return Math.floor(Math.random() * (max - min)) + min; 
} 

function randFloat(min: number, max: number) {
    let range = max - min;
    return Math.random() * range + min;
}