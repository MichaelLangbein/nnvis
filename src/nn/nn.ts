import { Vector, Matrix, randomMatrix } from "./linalg";


export interface BackpropOutput {
    dEdW: Matrix[],
    prediction: Vector
}

export class Net {

    readonly layers: Layer[] = [];

    constructor(sizes: number[]) {
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

    backprop(input: Vector, outputReal: Vector): BackpropOutput {

        // 1. Arrays forward pass
        let L = this.layers.length;
        let x: Vector[] = Array(L);
        let y: Vector[] = Array(L);

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
        let dEdX: Vector[] = Array(L);
        let dEdW: Matrix[] = Array(L);
        let dEdY: Vector[] = Array(L);

        // 2. Backwards pass
        L = L - 1;
        y[-1] = input;
        dEdY[L] = outputReal.min(y[L]);
        for(let l = L; l >= 0; l--) {
            let layer = this.layers[l];
            dEdX[l] = dEdY[l].min( layer.gradient(x[l]) );
            dEdW[l] = dEdX[l].outerProd( y[l-1] );
            dEdY[l-1] = dEdX[l].matProd( layer.weights );
        }

        return {
            dEdW: dEdW,
            prediction: y[L]
        };
    }

    updateWeights(dEdW: Matrix[]): void {
        for(let l = 0; l < this.layers.length; l++) {
            let layer = this.layers[l];
            let newWeights = layer.weights.add(dEdW[l]);
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
        let xs = this.weights.vecProd(input);
        let ys = xs.pointwise(x => this.neuron.execute(x));
        return {
            xs: xs,
            ys: ys
        };
    }

    gradient(input: Vector): Vector {
        return input.pointwise(x => this.neuron.gradient(x));
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


