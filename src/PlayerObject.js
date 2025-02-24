import gsap from "gsap";
import {randInt} from "three/src/math/MathUtils.js";
import {positions} from "./globalVars.js";

export class PlayerObject {
    constructor(playerId, name, balance, position, inJail, ownedProperties, model) {
        this.playerId = playerId;
        this.name = name;
        this.balance = balance;
        this.position = position;
        this.inJail = inJail;
        this.ownedProperties = ownedProperties;
        this.model = model;
        this.isAnimating = false;
    }

    loadPlayer(loader) {
        return new Promise((resolve, reject) => {
            loader.load(
                `/models/my_monopoly/${this.name}_pawn.glb`,
                (gltf) => {
                    this.model = gltf.scene;
                    console.log(`Loaded model for ${this.name} player`);
                    const {xOffset, zOffset} = this.helperSwitch(this.name);
                    this.model.position.set(9.5 + xOffset, 0.1, 9.5 + zOffset);
                    this.position = 0;
                    this.model.scale.set(0.75, 0.75, 0.75);
                    resolve();
                },
                undefined,
                (error) => reject(`Error loading model for ${this.name}: ${error}`)
            );
        });
    }


    movePlayer(button) {
        if (this.isAnimating) return;

        this.isAnimating = true;
        button.disabled = true;
        button.style.backgroundColor = "red";

        this.randomInt = randInt(1, 5);
        console.log(`Player ${this.name} rolled ${this.randomInt}`);

        this.animatePlayerMovement(() => {
            // this.position = (this.position + this.randomInt) % 40;
            this.isAnimating = false;
            button.disabled = false;
            button.style.backgroundColor = "";
        });
    }


    animatePlayerMovement(callback = () => {
    }) {
        if (!this.model) {
            console.error("Model not loaded yet!");
            return;
        }
        if (!positions) {
            console.error("Game positions are undefined.");
            return;
        }

        let step = 0;
        const duration = 0.66;

        const moveNext = () => {
            if (step < this.randomInt) {
                const nextPosIndex = (this.position + step + 1) % 40;
                const nextPosition = positions[nextPosIndex];

                if (!nextPosition) {
                    console.error("Invalid position data.");
                    return;
                }

                const {xOffset, zOffset} = this.helperSwitch(this.name);

                gsap.to(this.model.position, {
                    x: nextPosition.x + xOffset,
                    z: nextPosition.z + zOffset,
                    y: 0.7,
                    duration: duration / 2,
                    ease: "power1.inOut",
                    onComplete: () => {
                        gsap.to(this.model.position, {
                            y: 0.2,
                            duration: duration / 2,
                            ease: "power1.inOut",
                            onComplete: () => {
                                step++;
                                moveNext();
                            }
                        });
                    }
                });
            } else {
                this.position = (this.position + this.randomInt) % 40;
                if (typeof callback === "function") {
                    callback();
                }
            }
        };

        moveNext();
    }


    helperSwitch(name) {
        const offset = 0.5;
        switch (name) {
            case "red":
                return {xOffset: offset, zOffset: offset};
            case "green":
                return {xOffset: -offset, zOffset: offset};
            case "blue":
                return {xOffset: offset, zOffset: -offset};
            case "yellow":
                return {xOffset: -offset, zOffset: -offset};
            default:
                return {xOffset: 0, zOffset: 0};
        }
    }
}
