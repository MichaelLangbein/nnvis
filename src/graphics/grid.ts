import { Renderable } from "./context";
import { Graph, Edge, Node } from "./graph";
import { LineSegments, Geometry, LineBasicMaterial, Object3D } from "three";


export class Grid implements Renderable {

    readonly id: string;
    readonly graph: Graph;
    readonly body: LineSegments;

    constructor(id: string, graph: Graph) {

        this.id = id;
        this.graph = graph;

        let vertexPairs = new Geometry();
        for (let node of this.graph.nodes) {
            for (let targetNode of this.graph.getTargets(node)) {
                vertexPairs.vertices.push(node.position);
                vertexPairs.vertices.push(targetNode.position);
            }
        }
        vertexPairs.verticesNeedUpdate = true;
        let material = new LineBasicMaterial( { color: 0xffffff } );
        let lines = new LineSegments( vertexPairs,  material );

        this.body = lines;
    }

    getId(): string {
        return this.id;
    }

    getBody(): Object3D {
        return this.body;
    }
    
    onupdate(deltat: number): void { 
        //this.graph.apply(wiggle);
        // @ts-ignore
        //this.body.geometry.verticesNeedUpdate = true;
    }

}
