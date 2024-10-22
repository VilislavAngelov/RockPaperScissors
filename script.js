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

loader.load('RiggedArms.glb', function (gltf) {
    computerHand = gltf.scene;
    scene.add(gltf.scene);

    computerHand.traverse(function (object) {
        if (object.isBone) {

          bones.push(object)
        }
    });

    bones[12].rotation.x += 0.5;
    computerHand.position.set(0, -2, 2);
    computerHand.rotateY(Math.PI / 1);
    computerHand.rotateX(Math.PI / 1);
    computerHand.rotateZ(Math.PI / 1);
}, undefined, function (error) {
    console.error( error);
}) 

const renderer = new THREE.WebGLRenderer;
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild(renderer.domElement);

const geometryWall = new THREE.PlaneGeometry( 20, 20 );
const materialWall = new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide} );
const wall = new THREE.Mesh( geometryWall, materialWall );
scene.add( wall );

const geometryFloor = new THREE.PlaneGeometry( 20, 20 );
const materialFloor = new THREE.MeshBasicMaterial( {color: 0x00ff00, side: THREE.DoubleSide} );
const floor = new THREE.Mesh( geometryFloor, materialFloor );
scene.add( floor );
floor.rotation.x = -0.5 * Math.PI;
floor.position.y = -1.5;

const light = new THREE.AmbientLight( 0xffffff ); // soft white light
scene.add( light );

camera.position.z = 20;

const controls = new OrbitControls( camera, renderer.domElement );

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