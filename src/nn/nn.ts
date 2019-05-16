import { Vector, Matrix, pointwiseMinus, crossProduct, matrixVectorProd, scalarMatrixProd, matrixAddition, randomMatrix } from "./linalg";

export class Net {

    private layers: Layer[] = [];


    constructor(sizes: Vector) {
        for(let i = 1; i < sizes.length; i++) {
            const prevSize = sizes[i-1];
            const thisSize = sizes[i];
            this.layers.push(new Layer(prevSize, thisSize));
        }
    }

    execute(input: Vector): Vector {
        let intermediate = input;
        for(let layer of this.layers) {
            let output = layer.execute(intermediate);
            intermediate = output.ys;
        }
        return intermediate;
    }

    backprop(input: Vector, outputReal: Vector, alpha: number): void {

        // 1. Arrays forward pass
        let L = this.layers.length;
        let x: Vector[] = Array(L).fill([]);
        let y: Vector[] = Array(L).fill([]);

        // 1. Forward pass
        let intermediate = input;
        for(let l = 0; l < L; l++) {
            let layer = this.layers[l];
            let output = layer.execute(intermediate);
            x[l] = output.xs;
            y[l] = output.ys;
            intermediate = output.ys;
        }

        // 2. Arrays backward pass
        let dEdX: Vector[] = Array(L).fill([]);
        let dEdW: Matrix[] = Array(L).fill([[]]);
        let dEdY: Vector[] = Array(L).fill([]);

        // 2. Backwards pass
        L = L - 1;
        dEdY[L] = pointwiseMinus(outputReal, y[L]);
        for(let l = L; l >= 0; l--) {
            let layer = this.layers[l];
            dEdX[l] = pointwiseMinus( dEdY[l], layer.gradient(x[l]) );
            dEdW[l] = crossProduct( dEdX[l], y[l-1] );
            dEdY[l-1] = matrixVectorProd( layer.weights, dEdX[l] );
        }

        // 3. Weight update
        for(let l = 0; l < L; l++) {
            let layer = this.layers[l];
            let change = scalarMatrixProd( alpha, dEdW[l] );
            let newWeights = matrixAddition(layer.weights, change);
            layer.weights = newWeights;
        }
    }


}

interface Layeroutput {
    xs: Vector,
    ys: Vector
}

class Layer {

    public weights: Matrix;
    private neuron: Neuron;

    constructor(sizeInput: number, sizeLayer: number) {
        this.neuron = new Neuron();
        this.weights = randomMatrix(sizeLayer, sizeInput);
    }

    execute(input: Vector): Layeroutput {
        let xs = matrixVectorProd(this.weights, input);
        let ys = xs.map(x => this.neuron.execute(x));
        return {
            xs: xs,
            ys: ys
        };
    }

    gradient(input: Vector): Vector {
        return input.map(x => this.neuron.gradient(x));
    }
}

class Neuron {

     execute(input: number): number {
        return Math.sinh(input) / Math.cosh(input);
    }

    gradient(input: number): number {
        return 1.0 - Math.pow( this.execute(input), 2 );
    }
}


