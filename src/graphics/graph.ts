import { Renderable } from "./context";
import { Mesh, LineSegments, LineBasicMaterial, BufferGeometry, Float32BufferAttribute, Object3D } from "three";


export class Grid implements Renderable {

    readonly id: string;
    readonly graph: Graph;
    readonly body: Object3D;

    constructor(nrows: number, ncols: number) {

        this.id = `graph_${nrows}_${ncols}_${Math.random() * 1000}`;
        let nodes: Node[][] = new Array(nrows).fill( new Array(ncols) );
        let edges: Edge[] = [];
        
        for(let row = 0; row < nrows; row++) {
            for(let col = 0; col < ncols; col++) {
                nodes[row][col] = new Node(20 * col, 20 * row, 0, 1, `node_${row}_${col}`);
                if(row >= 1) edges.push( new Edge(nodes[row-1][col], nodes[row][col]) );
                if(col >= 1) edges.push( new Edge(nodes[row][col-1], nodes[row][col]) );
            }
        }

        this.graph = new Graph( this.flatArray(nodes), edges );

        let geometry = new BufferGeometry();        
        let positions: number[] = []
        let indexPairs: number[] = [];
        let i = 0;
        for(let edge of this.graph.edges){
            let node1 = edge.node1; 
            let node2 = edge.node2;
            positions.concat(node1.position);
            positions.concat(node2.position);
            indexPairs.concat([i, i+1]);
            i += 2;
        }
        let positionAttribute = new Float32BufferAttribute(positions, 3);
        geometry.addAttribute("position", positionAttribute);
        geometry.setIndex(indexPairs);
        let lines = new LineSegments(geometry, new LineBasicMaterial());

        this.body = lines;
    }

    getId(): string {
        return this.id;
    }

    getBody(): Object3D {
        return this.body;
    }
    
    onupdate(deltat: number): void {
        
    }

    private flatArray(nestedArray: any[][]): any[] {
        let out: any[] = [];
        for(let subArr of nestedArray) {
            out.concat(subArr);
        }
        return out;
    }
}


export class Graph {
    nodes: Node[];
    edges: Edge[];
    
    constructor(nodes: Node[], edges: Edge[]){
        this.nodes = nodes;
        this.edges = edges;
    }

    getNode(id: string): Node | undefined {
        return this.nodes.find(node => node.id == id);
    }

    getNeighbours(node: Node): Node[] {
        let sources = this.getSources(node);
        let targets = this.getTargets(node);
        return sources.concat(targets);
    }

    getTargets(node: Node): Node[] {
        return this.edges
                .filter(edge => edge.node1.id == node.id)
                .map(edge => edge.node2);
    }

    getSources(node: Node): Node[] {
        return this.edges
                .filter(edge => edge.node2.id == node.id)
                .map(edge => edge.node1);
    }


}

export class Node {
    id: string;
    position: number[];
    value: number;
    constructor(x: number, y: number, z: number, v: number, id: string){
        this.position = [x, y, z];
        this.value = v;
        this.id = id;
    }
}

export class Edge {
    node1: Node;
    node2: Node;
    constructor(node1: Node, node2: Node) {
        this.node1 = node1;
        this.node2 = node2;
    }
}