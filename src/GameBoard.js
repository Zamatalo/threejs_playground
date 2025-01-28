// import * as THREE from "three";
// import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
//
//
// export class GameBoard {
//     constructor(element,players,main) {
//         this.element = element;
//         this.players = players;
//         this.main=main;
//         this.boardSize = 15;
//         this.squareSize = 1.5;
//     }
//
//     init() {
//         this.initRenderer();
//         this.initCamera();
//         this.initScene();
//         this.initControls();
//         this.handleResize();
//     }
//
//     moveinBoard(playerId, posToMove) {
//         let position = 0;
//         const player = this.players.find(p => p.id === playerId);
//
//         if (!player || !player.model) {
//             console.error(`Player with ID ${playerId} does not exist or model is not loaded.`);
//             console.log('Current player models:', this.players.map(p => ({ id: p.id, model: !!p.model })));
//             return;
//         }
//
//         let moved = false;
//         for (let row = 0; row < this.boardSize; row++) {
//             for (let col = 0; col < this.boardSize; col++) {
//                 if (position === posToMove) {
//                     let x = (col - this.boardSize / 2);
//                     let z = (this.boardSize / 2 - row) ;
//                     let y = 0.1;
//                     let offset = 0.2;
//
//                     switch (player.name) {
//                         case 'red':
//                             x += offset;
//                             z += offset;
//                             break;
//                         case 'green':
//                             x -= offset;
//                             z += offset;
//                             break;
//                         case 'blue':
//                             x += offset;
//                             z -= offset;
//                             break;
//                         case 'yellow':
//                             x -= offset;
//                             z -= offset;
//                             break;
//                         default:
//                             console.warn(`No custom position adjustments for player: ${player.name}`);
//                     }
//                    // player.model.position.set(x, y, z);
//
//                     player.model.position.set(x, y, z);
//                     console.log(`${player.name} moved to: x:${x},y:${y},z:${z}, offset:${offset}`);
//                     moved = true;
//                     break;
//                 }
//                 position++;
//             }
//             if (moved) break;
//         }
//     }
//
//
//     createBoard() {
//         const squareMaterial = new THREE.MeshBasicMaterial({
//             color: 0x00ff00,
//             wireframe: true,
//         });
//
//         for (let row = 0; row < this.boardSize; row++) {
//             for (let col = 0; col < this.boardSize; col++) {
//                     const geometry = new THREE.BoxGeometry(this.squareSize, 0.1, this.squareSize);
//                     const square = new THREE.Mesh(geometry, squareMaterial);
//
//                     const x = (col - this.boardSize / 2) * this.squareSize;
//                     const z = (this.boardSize / 2 - row) * this.squareSize;
//                     //square.scale.set(2,2,2)
//                     square.position.set(x , 0.2, z);
//                     this.main.scene.add(square);
//                 }
//
//         }
//     }
// }
