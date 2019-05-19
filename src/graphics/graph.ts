

export class Grid {

    graph: Graph;

    constructor(nrows: number, ncols: number) {

        let nodes: Node[][] = new Array(nrows).fill( new Array(ncols) );
        let edges: Edge[] = [];
        
        for(let row = 0; row < nrows; row++) {
            for(let col = 0; col < ncols; col++) {
                let index = row * ncols + col;
                nodes[row][col] = new Node(20 * col, 20 * row, 0, 1);
                if(row >= 1) edges.push( new Edge(nodes[row-1][col], nodes[row][col]) );
                if(col >= 1) edges.push( new Edge(nodes[row][col-1], nodes[row][col]) );
            }
        }

        this.graph = new Graph( nodes.flat(), edges );
    }
}


export class Graph {
    nodes: Node[];
    edges: Edge[];
    constructor(nodes: Node[], edges: Edge[]){
        this.nodes = nodes;
        this.edges = edges;
    }
}

export class Node {
    position: number[];
    value: number;
    constructor(x: number, y: number, z: number, v: number){
        this.position = [x, y, z];
        this.value = v;
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