import {PlayerObject} from "./PlayerObject.js";
import * as THREE from "three";
import {GameObject} from "./GameObject.js";
import {OrbitControls} from "three/addons/controls/OrbitControls.js";
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';

class MainTemp {
    constructor() {
        this.container = document.getElementById("GameBoardComponent");
        this.scene = this.initScene();
        this.renderer = this.initRenderer();
        this.camera = this.initCamera();
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.loader = new GLTFLoader();
        this.handleResize();
        this.initGame().then(r => console.log("Game started!"));
        this.animate();
    }

    async initGame() {
        this.players = [
            new PlayerObject(1, "red"),
            new PlayerObject(2, "green"),
            new PlayerObject(3, "blue"),
            new PlayerObject(4, "yellow")
        ];


        await Promise.all(
            this.players.map(player => player.loadPlayer(this.loader)));
        this.players.forEach(player => this.scene.add(player.model));

        this.game = new GameObject(1, "STARTED", this.players, 0);

        await Promise.all([
            this.game.loadBoard(this.loader)
        ]);
        this.scene.add(this.game.model);
        this.game.addHelpers(this.scene);
    }


    initScene() {
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0xa0a0a0);

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(5, 10, 7.5);
        scene.add(directionalLight);

        return scene;
    }

    initRenderer() {
        const renderer = new THREE.WebGLRenderer({
            antialias: true,
            powerPreference: "high-performance",
        });
        renderer.setSize(this.container.offsetWidth, this.container.offsetHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        this.container.appendChild(renderer.domElement);
        return renderer;
    }

    initCamera() {
        const camera = new THREE.PerspectiveCamera(
            70,
            this.container.clientWidth / this.container.clientHeight,
            0.01,
            100
        );
        camera.position.set(0, 2, 10);
        return camera;
    }

    handleResize() {
        window.addEventListener("resize", () => {
            const width = this.container.clientWidth;
            const height = this.container.clientHeight;

            this.camera.aspect = width / height;
            this.camera.updateProjectionMatrix();

            this.renderer.setSize(width, height);
        });
    }

    animate() {
        this.renderer.setAnimationLoop(() => {
            this.controls.update();
            this.renderer.render(this.scene, this.camera);
        });
    }

    saveState() {
        const state = this.players.map(player => ({
            id: player.playerId,
            name: player.name,
            inJail: player.inJail,
            pos: player.position,
            //coords: { x: player.model.position.x, y: player.model.position.y, z: player.model.position.z },
            properties: player.ownedProperties
        }));


        console.log(`Saved state: ${JSON.stringify(state)} `);
        return state;
    }

    loadState(state) {
        state.forEach(savedPlayer => {
            const player = this.players.find(p => p.id === savedPlayer.id);
            if (player && player.model && savedPlayer.coords) {
                player.model.position.set(
                    savedPlayer.coords.x,
                    savedPlayer.coords.y,
                    savedPlayer.coords.z
                );
                player.pos = savedPlayer.pos;
            }
        });
    }


}

window.init = function () {
    const main = new MainTemp();
    window.movePlayer = (button, name) =>
        main.game.players.find(player => player.name === name).movePlayer(button);
    window.saveState = () => main.saveState();
    window.loadState = (state) => main.loadState(state);
};