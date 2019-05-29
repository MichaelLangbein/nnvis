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

// export function normalizeDataset(data: Entry[]): Entry[] {
    
//     let inputMinima = new Array(data[0].input.length);
//     let outputMinima = new Array(data[0].output.length);
//     let inputMaxima = new Array(data[0].input.length);
//     let outputMaxima = new Array(data[0].output.length);

//     // first pass: finding maxima and minima
//     for(let entry of data) {
        
//     }

//     // second pass: normalizing
//     for(let entry of data) {
//         entry.input
//     }
// }


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
    let center = new Vector([0.5, 0.5]);
    let offset = center.min(input);
    // let squareDistance = offset.pointwise(v => v*v).sum();
    // let distance = Math.sqrt(squareDistance);
    // if(distance > 0.25) return 0; 
    // else return 1;
    return offset.sum() / 2.0;
}


function randInt(min: number, max: number) {
    max += 1;
    return Math.floor(Math.random() * (max - min)) + min; 
} 

function randFloat(min: number, max: number) {
    let range = max - min;
    return Math.random() * range + min;
}