import { Renderable } from "./context";
import { Node } from "./graph";
import { Object3D, Mesh, Points, PointsMaterial, Geometry, Vector3 } from "three";

export class Cloud implements Renderable {

    readonly id: string;
    readonly nodes: Node[];
    readonly body: Points;

    constructor(id: string, nodes: Node[]) {

        this.id = id;
        this.nodes = nodes;

        let geometry = new Geometry();
        for(let node of nodes) {
            geometry.vertices.push(node.position);
        }
        let material = new PointsMaterial({ color: 0xFFFFFF, size: 0.25 });
        let body = new Points(geometry, material);
        this.body = body;

    }

    getId(): string {
        return this.id;
    }

    getBody(): Object3D {
        return this.body;
    }
    
    onupdate(deltat: number): void {
        
    }

    apply(func: (n: Node) => Node): void {
        this.nodes.map(node => func(node));
        this.body.
    }
}

function wiggle(node: Node): Node {
    let x,y,z = (Math.random() - 0.5) * 10;
    node.position.add(new Vector3(x, y, z));
    return node;
}