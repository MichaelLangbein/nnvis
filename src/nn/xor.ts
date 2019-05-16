import { Vector } from "./linalg";


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
    return new Vector([
        randInt(0, 1),
        randInt(0, 1)
    ]);
}

function xor(input: Vector): Vector {
    let sum = input.sum();
    if (sum == 2 || sum == 0) return new Vector([0]);
    else return new Vector([1]);
}

function randInt(min: number, max: number) {
    max += 1;
    return Math.floor(Math.random() * (max - min)) + min; 
} 