export class Net {
    private layers: Layer[] = [];

    constructor(sizes: number[]) {
        for(let i = 1; i < sizes.length; i++) {
            const prevSize = sizes[i-1];
            const thisSize = sizes[i];
            this.layers.push(new Layer(prevSize, thisSize));
        }
    }

    execute(input: number[]): number[] {
        let intermed = input;
        for(let layer of this.layers) {
            intermed = layer.execute(intermed);
        }
        return intermed;
    }
}

class Layer {
    private neurons: Neuron[] = [];
    private weights: Matrix;

    constructor(sizeInput: number, sizeLayer: number) {
        let weights = [];
        for(let r = 0; r < sizeLayer; r++) {
            let ws = [];
            this.neurons.push(new Neuron(Math.random()));
            for(let c = 0; c < sizeInput; c++) {
                ws.push(Math.random());
            }
            weights.push(ws);
        }
        this.weights = new Matrix(weights);
    }

    execute(input: number[]): number[] {
        let weighted = this.weights.prod(input);
        let output = this.neurons.map((neuron, i) => neuron.execute(weighted[i]));
        return output;
    }
}

class Neuron {
    private bias: number;

    constructor(bias = 0) {
        this.bias = bias;
    }

    execute(input: number): number {
        return Math.sinh(input) / Math.cosh(input);
    }

}


class Matrix {
    private values: number[][];

    constructor(values: number[][]) {
        this.values = values;
    }

    prod(vector: number[]): number[] {
        let out = [];
        for(let row of this.values) {
            let s = 0;
            for(let c = 0; c < row.length; c++) {
                s += row[c] * vector[c];
            }
            out.push(s);
        }
        return out;
    }

}

