import { Renderable } from "./context";
import { Mesh, LineSegments, LineBasicMaterial, BufferGeometry, Float32BufferAttribute, Object3D, Int16BufferAttribute, Uint16BufferAttribute, Geometry, Vector3, Line } from "three";


export class Grid implements Renderable {

    readonly id: string;
    readonly graph: Graph;
    readonly body: Object3D;

    constructor(nrows: number, ncols: number) {

        this.id = `graph_${nrows}_${ncols}_${Math.random() * 1000}`;
        let nodes: Node[][] = Array(nrows).fill(0).map(x => Array(ncols).fill(undefined));  // new Array(nrows).fill( new Array(ncols) );
        let edges: Edge[] = [];
        
        for(let row = 0; row < nrows; row++) {
            for(let col = 0; col < ncols; col++) {
                nodes[row][col] = new Node(20 * col, 20 * row, 0, 1, `node_${row}_${col}`);
                if(row >= 1) edges.push( new Edge(nodes[row-1][col], nodes[row][col]) );
                if(col >= 1) edges.push( new Edge(nodes[row][col-1], nodes[row][col]) );
            }
        }

        this.graph = new Graph( this.flatArray(nodes), edges );

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
        console.log("updating ...")
        this.graph.apply(wiggle);
        // @ts-ignore
        this.body.geometry.verticesNeedUpdate = true;
    }

    private flatArray(nestedArray: any[][]): any[] {
        let out: any[] = [];
        for(let subArr of nestedArray) {
            out = out.concat(subArr);
        }
        return out;
    }
}

function wiggle(node: Node): Node {
    let x,y,z = (Math.random() - 0.5) * 10;
    node.position.add(new Vector3(x, y, z));
    return node;
}


export class Graph {
    nodes: Node[];
    edges: Edge[];
    
    constructor(nodes: Node[], edges: Edge[]){
        this.nodes = nodes;
        this.edges = edges;
    }

    apply(func: (a: Node) => Node) {
        this.nodes.map(node => func(node));
    }

    getNode(id: string): Node | undefined {
        return this.nodes.find(node => node.id == id);
    }

    getNodeIndex(node: Node): number | undefined {
        for(let i = 0; i < this.nodes.length; i++) {
            if(node.id == this.nodes[i].id) return i;
        }
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
    position: Vector3;
    value: number;
    constructor(x: number, y: number, z: number, v: number, id: string){
        this.position = new Vector3(x, y, z);
        this.value = v;
        this.id = id;
    }
}

export class Edge {
    node1: Node;
    node2: Node;
    constructor(node1: Node, node2: Node) {
        if(node1.id == node2.id){
            console.log("ho!")
        }
        this.node1 = node1;
        this.node2 = node2;
    }
}