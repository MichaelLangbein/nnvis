import { Net } from "./nn/nn";
import { createDataset } from "./nn/data";
import { Vector, Matrix } from "./nn/linalg";


function training(net: Net, batches: number, batchsize: number): number[][] {
    let trainingdata = createDataset(batches * batchsize);
    let alpha = 0.1;
    let dAlpha = alpha / batches;
    
    let errors = [];
    for(let batch = 0; batch < batches; batch++ ) {
        let weightUpdates: Matrix[] = Array(net.layers.length);
        let error = 0;
    
        for(let batchEntry = 0; batchEntry < batchsize; batchEntry++) {
    
            let entry = trainingdata[batch * batchsize + batchEntry];
            let output = net.backprop(entry.input, entry.output);
            let dEdWs = output.dEdW;
    
            for(let l = 0; l < dEdWs.length; l++) {
                let dEdW = dEdWs[l];
                let change = dEdW.scalarProd(alpha);
                if(batchEntry == 0) weightUpdates[l] = change;
                else weightUpdates[l] = weightUpdates[l].add(change);
            }
    
            error += Math.pow(entry.output.min(output.prediction).sum(), 2);
        }
    
        net.updateWeights(weightUpdates);
    
        alpha -= dAlpha;
    
        let meanError = error / batchsize;
        console.log(` --- training ---\n     batchNumber ${batch},\n     alpha ${alpha},\n     mean error: ${meanError},\n     totalChange: ${weightUpdates.map(mtr => mtr.sum())}\n    `);
        errors.push([batch, meanError]);
    }
    
    return errors;
}



const net = new Net([2, 3, 1]);
let batches = 70;
let batchsize = 30;
let errors = training(net, batches, batchsize);

let testingdata = createDataset(3);
for(let entry of testingdata) {
    let output = net.execute(entry.input);
    let error = entry.output.min(output);
    console.log(` --- validation ---\n     predicted: ${output}\n     correct: ${entry.output}\n     error: ${error}\n    `);
}










