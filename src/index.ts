import { Net } from "./nn/nn";
import { createDataset } from "./nn/xor";


const net = new Net([2, 3, 4, 1]);

let dataset = createDataset(100);
for(let entry of dataset) {
    net.backprop(entry.input, entry.output, 0.1);
}