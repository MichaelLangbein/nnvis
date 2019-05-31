import { Renderable } from "./context";
import { Node } from "./graph";
import { Object3D, Mesh, Points, PointsMaterial, Geometry, Vector3, Color, VertexColors } from "three";




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
            geometry.colors.push(new Color(this.valueToColor(node.value)));
        }
        let material = new PointsMaterial({ size: 5.25, vertexColors: VertexColors });
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
        // @ts-ignore
        this.body.geometry.verticesNeedUpdate = true;
        // @ts-ignore
        this.body.geometry.colorsNeedUpdate = true;
    }

    private valueToColor(val: number): string {
        return `hsl(${val*100}, 100%, 50%)`;
    }
}

function wiggle(node: Node): Node {
    let x,y,z = (Math.random() - 0.5) * 10;
    node.position.add(new Vector3(x, y, z));
    return node;
}