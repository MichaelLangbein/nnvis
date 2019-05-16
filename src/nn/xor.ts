import { Vector, vectorSum } from "./linalg";


export interface Entry {
    input: Vector;
    output: Vector;
}

export function createDataset(N: number): Entry[] {
    let out = [];
    for(let n = 0; n < N; n++) {
        let input = getInput();
        let output = xor(input);
        out.push({
            input: input,
            output: output
        });
    }
    return out;
}

function getInput(): Vector {
    return [
        randInt(0, 1),
        randInt(0, 1)
    ];
}

function xor(input: Vector): Vector {
    let sum = vectorSum(input);
    if (sum == 2 || sum == 0) return [0];
    else return [1];
}

function randInt(min: number, max: number) {
    max += 1;
    return Math.floor(Math.random() * (max - min)) + min; 
} 