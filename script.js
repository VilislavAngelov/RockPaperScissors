//TODO
//make a function to make scissors sign
//make the shake function
//attach computerChoice to the functions to show choice
//clone the hand to use it as playerHand
//be able to enter input myself
//make the buttons to choose R P or S
//be able to play a round
//Add text about whos winning
//Track the score

import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

let computerChoice;
let humanChoice;
let computerScore = 0;
let playerScore = 0;
let computerHand;

const ROCK = "rock";
const PAPER = "paper";
const SCISSORS = "scissors";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000);

const loader = new GLTFLoader();
let bones = [];
const originalRotations = [];

loader.load('RiggedArms.glb', function (gltf) {
    computerHand = gltf.scene;
    scene.add(gltf.scene);

    computerHand.traverse(function (object) {
        if (object.isBone) {
          bones.push(object)
        }
    });


    computerHand.position.set(5 , 0, 2);
    computerHand.rotation.set(0, 0, 0);
    computerHand.rotation.order = 'YZX';
    computerHand.rotation.y = Math.PI;
    computerHand.rotation.z = Math.PI / 2;
    computerHand.rotation.x = Math.PI;
    
    makeFist();

    gsap.delayedCall(1, makePaper);

    gsap.delayedCall(2, resetToFist);

    gsap.delayedCall(3, makeScissors);

    gsap.delayedCall(4, resetToFist);

    
}, undefined, function (error) {
    console.error( error);
}) 

const renderer = new THREE.WebGLRenderer;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild(renderer.domElement);

const geometryWall = new THREE.PlaneGeometry( 20, 20 );
const materialWall = new THREE.MeshBasicMaterial( {color: 0x9fc6fc, side: THREE.DoubleSide} );
const wall = new THREE.Mesh( geometryWall, materialWall );
scene.add( wall );

const geometryFloor = new THREE.PlaneGeometry( 20, 20 );
const materialFloor = new THREE.MeshBasicMaterial( {color: 0x89aad9, side: THREE.DoubleSide} );
const floor = new THREE.Mesh( geometryFloor, materialFloor );
scene.add( floor );
floor.rotation.x = -0.5 * Math.PI;
floor.position.y = -1.5;

const directionalLight = new THREE.DirectionalLight( 0xffffff, 4 );
directionalLight.position.set( 0, 15, 5 ); //default; light shining from top
directionalLight.castShadow = true; // default false
scene.add( directionalLight );

const helper = new THREE.DirectionalLightHelper( directionalLight, 5 );
scene.add( helper );


camera.position.z = 10;

const controls = new OrbitControls( camera, renderer.domElement );

function makeFist() {
    // Animate thumb bones
    gsap.to(bones[3].rotation, { z: bones[3].rotation.z - 0.5, duration: 0.5 });
    gsap.to(bones[4].rotation, { y: -1, duration: 0.5 });
    gsap.to(bones[5].rotation, { z: bones[5].rotation.z - 1.3, duration: 0.5 });

// Animate index finger bones
    gsap.to(bones[7].rotation, { z: bones[7].rotation.z - 1.3, duration: 0.5 });
    gsap.to(bones[8].rotation, { z: bones[8].rotation.z - 1, duration: 0.5 });
    gsap.to(bones[9].rotation, { z: bones[9].rotation.z - 1, duration: 0.5 });

// Animate middle finger bones
    gsap.to(bones[11].rotation, { x: bones[11].rotation.x + 1.3, duration: 0.5 });
    gsap.to(bones[12].rotation, { x: bones[12].rotation.x + 1, duration: 0.5 });
    gsap.to(bones[13].rotation, { x: bones[13].rotation.x + 1, duration: 0.5 });

// Animate ring finger bones
    gsap.to(bones[15].rotation, { z: bones[15].rotation.z + 1.3, duration: 0.5 });
    gsap.to(bones[16].rotation, { z: bones[16].rotation.z + 1, duration: 0.5 });
    gsap.to(bones[17].rotation, { z: bones[17].rotation.z + 1, duration: 0.5 });

// Animate pinky finger bones
    gsap.to(bones[19].rotation, { z: bones[19].rotation.z + 1.3, duration: 0.5 });
    gsap.to(bones[20].rotation, { z: bones[20].rotation.z + 1, duration: 0.5 });
    gsap.to(bones[21].rotation, { z: bones[21].rotation.z + 1, duration: 0.5 });

    bones.forEach((bone, index) => {
        originalRotations[index] = {
            x: bone.rotation.x,
            y: bone.rotation.y,
            z: bone.rotation.z,
        }
    })

}

function resetToFist() {
    const duration = 0.5; // Animation duration in seconds
  
    bones.forEach((bone, index) => {
      gsap.to(bone.rotation, {
        x: originalRotations[index].x,
        y: originalRotations[index].y,
        z: originalRotations[index].z,
        duration,
      });
    });
}
  

function makePaper() {
    gsap.to(bones[3].rotation, { z: bones[3].rotation.z + 0.5, duration: 0.5 });
    gsap.to(bones[4].rotation, { y: bones[4].rotation.y + 1, duration: 0.5 });
    gsap.to(bones[5].rotation, { z: bones[5].rotation.z + 1.3, duration: 0.5 });

    // Animate index finger bones
    gsap.to(bones[7].rotation, { z: bones[7].rotation.z + 1.3, duration: 0.5 });
    gsap.to(bones[8].rotation, { z: bones[8].rotation.z + 1, duration: 0.5 });
    gsap.to(bones[9].rotation, { z: bones[9].rotation.z + 1, duration: 0.5 });

    // Animate middle finger bones
    gsap.to(bones[11].rotation, { x: bones[11].rotation.x - 1.3, duration: 0.5 });
    gsap.to(bones[12].rotation, { x: bones[12].rotation.x - 1, duration: 0.5 });
    gsap.to(bones[13].rotation, { x: bones[13].rotation.x - 1, duration: 0.5 });

    // Animate ring finger bones
    gsap.to(bones[15].rotation, { z: bones[15].rotation.z - 1.3, duration: 0.5 });
    gsap.to(bones[16].rotation, { z: bones[16].rotation.z - 1, duration: 0.5 });
    gsap.to(bones[17].rotation, { z: bones[17].rotation.z - 1, duration: 0.5 });

    // Animate pinky finger bones
    gsap.to(bones[19].rotation, { z: bones[19].rotation.z - 1.3, duration: 0.5 });
    gsap.to(bones[20].rotation, { z: bones[20].rotation.z - 1, duration: 0.5 });
    gsap.to(bones[21].rotation, { z: bones[21].rotation.z - 1, duration: 0.5 });

}

function makeScissors() {

    // Animate index finger bones
    gsap.to(bones[7].rotation, { z: bones[7].rotation.z + 1.3, duration: 0.5 });
    gsap.to(bones[8].rotation, { z: bones[8].rotation.z + 1, duration: 0.5 });
    gsap.to(bones[9].rotation, { z: bones[9].rotation.z + 1, duration: 0.5 });

    // Animate middle finger bones
    gsap.to(bones[11].rotation, { x: bones[11].rotation.x - 1.3, duration: 0.5 });
    gsap.to(bones[12].rotation, { x: bones[12].rotation.x - 1, duration: 0.5 });
    gsap.to(bones[13].rotation, { x: bones[13].rotation.x - 1, duration: 0.5 });

}

function animate() {
	renderer.render( scene, camera );
}
renderer.setAnimationLoop( animate );

// while (computerScore != 5 && playerScore != 5) {
//     humanChoice = prompt("Rock, Paper or Scissors?").toLowerCase();
//     computerChoice = getComputerChoice();
//     playRound(humanChoice, computerChoice);
//     console.log(`Computer chose: ${computerChoice}.`);
//     console.log(`SCORE: Player ${playerScore} | Computer ${computerScore}`);
//     console.log("");
// }

if (computerScore == 5) {
    console.log("The computer won! Loser!");
} else if (playerScore == 5) {
    console.log("You WON! Congrats!");
}

function getComputerChoice() {
    const choices = [ROCK, PAPER, SCISSORS];
    const randomIndex = Math.floor(Math.random() * 3);
    return choices[randomIndex];
}

function playRound(humanChoice, computerChoice){
    if (humanChoice === computerChoice.toLowerCase()) {
        console.log("Draw!");
    } else if (
        (humanChoice === ROCK && computerChoice === SCISSORS) ||
        (humanChoice === PAPER && computerChoice === ROCK) ||
        (humanChoice === SCISSORS && computerChoice === PAPER)
    ) {
        console.log("You Win!");
        playerScore++;
    } else {
        console.log("You Lose!");
        computerScore++;
    }
}