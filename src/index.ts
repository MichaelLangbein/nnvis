import { Net } from "./nn/nn";


const net = new Net([2, 3, 4, 2]);
const input = [Math.random(), Math.random()];
const output = net.execute(input);

console.log(output);