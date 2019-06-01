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

    apply(func: (n: Node, i: number) => Node): void {
        this.nodes.map((node, i) => func(node, i));
        // @ts-ignore
        this.body.geometry.verticesNeedUpdate = true;
        // @ts-ignore
        this.body.geometry.colorsNeedUpdate = true;
    }

    private valueToColor(val: number): string {
        return perc2color(val);
    }
}


function perc2color(perc: number): string {
	var r, g, b = 0;
	if(perc < 50) {
		r = 255;
		g = Math.round(5.1 * perc);
	}
	else {
		g = 255;
		r = Math.round(510 - 5.10 * perc);
	}
	var h = r * 0x10000 + g * 0x100 + b * 0x1;
	return '#' + ('000000' + h.toString(16)).slice(-6);
}