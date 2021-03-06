import { Scene, Camera, WebGLRenderer, PerspectiveCamera, Vector3, AxesHelper, Mesh, BoxGeometry, MeshBasicMaterial, TextureLoader, DoubleSide, Raycaster, Vector2, Object3D, PointLight, AmbientLight } from "three";
import { isArray } from "util";
const OrbitControls = require('three-orbitcontrols');

export class Context {

    objects: Renderable[];
    scene: Scene;
    camera: Camera;
    renderer: WebGLRenderer;
    controls: any;
    raycaster: Raycaster;
    mouse: Vector2;

    constructor(divId: string, WIDTH = 400, HEIGHT = 400, VIEW_ANGLE = 45, NEAR = 0.1, FAR = 10000) {
        const ASPECT = WIDTH / HEIGHT;

        // create renderer
        this.renderer = new WebGLRenderer();
        this.renderer.setSize(WIDTH, HEIGHT);
        //renderer.vr.enabled = true;

        // create scene
        const scene = new Scene();

        // create camera
        const camera = new PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
        camera.position.set(-100, 20, -100);
        camera.up = new Vector3(0, 1, 0);
        scene.add(camera);

        // create helpers 
        var axesHelper = new AxesHelper( 70 );
        scene.add(axesHelper);

        // create controls
        this.controls = new OrbitControls( camera );
        this.controls.update();

        // create lightsource
        const light = new AmbientLight(0xFFFFFF);
        scene.add(light);

        // put renderer in site
        // const container = document.createElement('div');
        // container.setAttribute("id", `${divId}`);
        // document.body.append(container);
        const container = document.getElementById(divId);
        if(container) container.appendChild(this.renderer.domElement);
        else throw new Error(`No such element: #${divId}`);

        // assign properties for layer access.
        this.objects = [];
        this.scene = scene;
        this.camera = camera;
    }

    addObject(object: Renderable) {
        this.objects.push(object);
        let body = object.getBody();
        this.scene.add(body);
    }

    render() {
        this.objects.forEach(object => {
            object.onupdate(0.03);
        });
        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(() => {this.render()});

        this.controls.update();
    }

    getObjectById(id: string): Renderable | undefined {
        return this.objects.find(object => object.getId() == id);
    }

}

export interface Renderable {
    getId(): string;
    getBody(): Object3D;
    onupdate(deltat:number): void
}