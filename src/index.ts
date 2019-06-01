import { Net } from "./nn/nn";
import { createDataset, Entry } from "./nn/data";
import { Vector, Matrix } from "./nn/linalg";
import { Context } from "./graphics/context";
import { Node, TwoDGrid } from "./graphics/graph"; 
import { Cloud } from "./graphics/cloud";
import { Grid } from "./graphics/grid";





function training(net: Net, batches: number, batchsize: number, repeats: number = 25): void {
    let trainingdata = createDataset(batches * batchsize);
    let alpha = 0.1;
    let dAlpha = alpha / (batches * repeats);
    
    let renderContexts = createDisplay(net, trainingdata);

    for(let repetition = 0; repetition < repeats; repetition++) {
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
    
            updateDisplay(renderContexts, net, trainingdata);
        }
    }
    
}



function createDisplay(net: Net, data: Entry[]): Context[] {
    const scaleFactor = 100;

    let nodes = data.map((datapoint, i) => new Node(
        datapoint.input[0] * scaleFactor, 
        datapoint.input[1] * scaleFactor, 
        0, 
        datapoint.output[0] * scaleFactor, 
        `datapoint_${i}`
    ));

    let contexts = [];

    createElement("input", "input");
    const context = new Context("input");
    const cloud = new Cloud("input_cloud", nodes);
    context.addObject(cloud);
    context.render();
    contexts.push(context);

    for (let layer of net.layers) {

        // creating context
        createElement(layer.id + "_context", layer.id);
        const context = new Context(layer.id + "_context");

        // displaying nodes
        const cloud = new Cloud(layer.id + "_cloud", data.map((datapoint, i) => new Node(
            0, 0, 0, datapoint.output[0] * scaleFactor,
            `datapoint_${i}`
        )));
        context.addObject(cloud);

        context.render();

        contexts.push(context);
    }
    return contexts;
}

function updateDisplay(contexts: Context[], net: Net, data: Entry[]) {
    let points = data.map(pt => pt.input);
    
    for(let i = 0; i < net.layers.length; i++) {
        const layer = net.layers[i];
        const context = contexts[i+1];
        
        // get data
        let output = points.map(point => layer.execute(point));
        points = output.map(o => o.ys);

        // display data
        const cloud = context.getObjectById(layer.id + "_cloud");
        if(!cloud) throw new Error();
        (cloud as Cloud).apply((n: Node, i: number) => {
            const point = points[i];
            n.position.setX(point[0] * 100);
            if(point[1]) n.position.setY(point[1] * 100);
            if(point[2]) n.position.setZ(point[2] * 100);
            return n;
        })
    }
}

function createElement(divId: string, heading?: string) {
    const container = document.createElement('div');
    if(heading) {
        container.appendChild(document.createTextNode(heading))
    }
    container.setAttribute("id", `${divId}`);
    document.body.append(container);
}

const net = new Net([2, 3, 1]);
let batches = 15;
let batchsize = 10;
training(net, batches, batchsize);
