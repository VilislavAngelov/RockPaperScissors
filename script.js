//TODO
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
let computerHand, playerHand;
let computerBones = [], playerBones = [];
const computerOriginalRotations = [], playerOriginalRotations = [];

const ROCK = "rock";
const PAPER = "paper";
const SCISSORS = "scissors";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000);

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

const directionalLight2 = new THREE.DirectionalLight( 0xffffff, 1 );
directionalLight2.position.set( 0, 5, 0 ); //default; light shining from top
directionalLight2.castShadow = true; // default false
scene.add( directionalLight2 );

const directionalLight = new THREE.DirectionalLight( 0xffffff, 3.5 );
directionalLight.position.set( 0, 8, 10 ); //default; light shining from top
directionalLight.castShadow = true; // default false
scene.add( directionalLight );

const controls = new OrbitControls( camera, renderer.domElement );

camera.position.z = 10;

const loader = new GLTFLoader();


let loadingCounter = 0;

loader.load('RiggedArms.glb', function (gltf) {
  computerHand = gltf.scene;
  scene.add(computerHand);

  setupHand(computerHand, computerBones, computerOriginalRotations, 'computer');

  checkAllModelsLoaded();
}, undefined, function (error) {
  console.error(error);
});

loader.load('RiggedArms.glb', function (gltf) {
  playerHand = gltf.scene;
  scene.add(playerHand);

  setupHand(playerHand, playerBones, playerOriginalRotations, 'player');

  checkAllModelsLoaded();
}, undefined, function (error) {
  console.error(error);
});

function checkAllModelsLoaded() {
  loadingCounter++;
  if (loadingCounter === 2) {
    // Both hands have been loaded and set up
    gsap.delayedCall(0.6, initializeGame);
  }
}

function setupHand(hand, bonesArray, originalRotationsArray, type) {

    hand.rotation.order = 'YZX';

    if (type === 'computer') {
        hand.position.set(6 , 0, 2);
        hand.rotation.set(0, 0, 0);
        hand.rotation.y = Math.PI;
        hand.rotation.z = Math.PI / 2;
        hand.rotation.x = Math.PI;
      } else {
        
        hand.position.set(-6, 0, 2);
        hand.rotation.set(0, 0, 0);
        hand.rotation.y = 0;
        hand.rotation.z = Math.PI / 2;
        hand.rotation.x = -Math.PI;
      }

      hand.traverse(function (object) {
        if (object.isBone) {
          bonesArray.push(object)
        }
    });

    // Store the original rotations
    storeFistRotations(bonesArray, originalRotationsArray);

    // Make the fist pose
    makeFist(bonesArray, originalRotationsArray);
}

// Modify the makeFist function
function makeFist(bones, originalRotations) {
    const duration = 0.5; // Animation duration in seconds

    // Create a GSAP timeline with an onComplete callback
    const tl = gsap.timeline();

    // Animate thumb bones
    tl.to(bones[3].rotation, { z: bones[3].rotation.z - 0.5, duration }, 0);
    tl.to(bones[4].rotation, { y: bones[4].rotation.y - 1, duration }, 0);
    tl.to(bones[5].rotation, { z: bones[5].rotation.z - 1.3, duration }, 0);

    // Animate index finger bones
    tl.to(bones[7].rotation, { z: bones[7].rotation.z - 1.3, duration }, 0);
    tl.to(bones[8].rotation, { z: bones[8].rotation.z - 1, duration }, 0);
    tl.to(bones[9].rotation, { z: bones[9].rotation.z - 1, duration }, 0);

    // Animate middle finger bones
    tl.to(bones[11].rotation, { x: bones[11].rotation.x + 1.3, duration }, 0);
    tl.to(bones[12].rotation, { x: bones[12].rotation.x + 1, duration }, 0);
    tl.to(bones[13].rotation, { x: bones[13].rotation.x + 1, duration }, 0);

    // Animate ring finger bones
    tl.to(bones[15].rotation, { z: bones[15].rotation.z + 1.3, duration }, 0);
    tl.to(bones[16].rotation, { z: bones[16].rotation.z + 1, duration }, 0);
    tl.to(bones[17].rotation, { z: bones[17].rotation.z + 1, duration }, 0);

    // Animate pinky finger bones
    tl.to(bones[19].rotation, { z: bones[19].rotation.z + 1.3, duration }, 0);
    tl.to(bones[20].rotation, { z: bones[20].rotation.z + 1, duration }, 0);
    tl.to(bones[21].rotation, { z: bones[21].rotation.z + 1, duration }, 0);
}

// Function to store the fist rotations after the animation completes
function storeFistRotations(bones, originalRotationsArray) {
    bones.forEach((bone, index) => {
        originalRotationsArray[index] = {
            x: bone.rotation.x,
            y: bone.rotation.y,
            z: bone.rotation.z,
        };
    });
}

function resetToFist(bones, originalRotations) {
    const duration = 0.5;
  
    bones.forEach((bone, index) => {
      gsap.to(bone.rotation, {
        x: originalRotations[index].x,
        y: originalRotations[index].y,
        z: originalRotations[index].z,
        duration,
      });
    });
  }

function performGesture(bones, originalRotations, gestureFunction) {
    const tl = gsap.timeline();
  
    // Perform the gesture
    tl.call(() => gestureFunction(bones, originalRotations));

    // Hold the gesture for a moment
    tl.to({}, { duration: 0.5 });

    // Return to fist position
    tl.call(() => resetToFist(bones, originalRotations));
  }

function shakeHand(bones, onCompleteCallback) {
    const duration = 0.1;
    const shakeAmount = 0.2;
  
    if (!bones[0]) {
        console.error('bones[0] is undefined in shakeHand');
        if (onCompleteCallback) onCompleteCallback();
        return;
      }
    
      const initialRotationZ = bones[0].rotation.z;
    
      const tl = gsap.timeline({ onComplete: onCompleteCallback });
    
      tl.to(bones[0].rotation, { z: initialRotationZ - shakeAmount, duration }, 0);
    
      for (let i = 0; i < 2; i++) {
        tl.to(bones[0].rotation, { z: initialRotationZ, duration });
        tl.to(bones[0].rotation, { z: initialRotationZ - shakeAmount, duration });
      }
    
      tl.to(bones[0].rotation, { z: initialRotationZ, duration });
}
  

function makePaper(bones, originalRotations) {
    gsap.to(bones[3].rotation, { z: originalRotations[3].z + 0.5, duration: 0.5 });
    gsap.to(bones[4].rotation, { y: originalRotations[4].y + 1, duration: 0.5 });
    gsap.to(bones[5].rotation, { z: originalRotations[5].z + 1.3, duration: 0.5 });

    // Animate index finger bones
    gsap.to(bones[7].rotation, { z: originalRotations[7].z + 1.3, duration: 0.5 });
    gsap.to(bones[8].rotation, { z: originalRotations[8].z + 1, duration: 0.5 });
    gsap.to(bones[9].rotation, { z: originalRotations[9].z + 1, duration: 0.5 });

    // Animate middle finger bones
    gsap.to(bones[11].rotation, { x: originalRotations[11].x - 1.3, duration: 0.5 });
    gsap.to(bones[12].rotation, { x: originalRotations[12].x - 1, duration: 0.5 });
    gsap.to(bones[13].rotation, { x: originalRotations[13].x - 1, duration: 0.5 });

    // Animate ring finger bones
    gsap.to(bones[15].rotation, { z: originalRotations[15].z - 1.3, duration: 0.5 });
    gsap.to(bones[16].rotation, { z: originalRotations[16].z - 1, duration: 0.5 });
    gsap.to(bones[17].rotation, { z: originalRotations[17].z - 1, duration: 0.5 });

    // Animate pinky finger bones
    gsap.to(bones[19].rotation, { z: originalRotations[19].z - 1.3, duration: 0.5 });
    gsap.to(bones[20].rotation, { z: originalRotations[20].z - 1, duration: 0.5 });
    gsap.to(bones[21].rotation, { z: originalRotations[21].z - 1, duration: 0.5 });

}

function makeScissors(bones, originalRotations) {

    // Animate index finger bones
    gsap.to(bones[7].rotation, { z: originalRotations[7].z + 1.3, duration: 0.5 });
    gsap.to(bones[8].rotation, { z: originalRotations[8].z + 1, duration: 0.5 });
    gsap.to(bones[9].rotation, { z: originalRotations[9].z + 1, duration: 0.5 });

    // Animate middle finger bones
    gsap.to(bones[11].rotation, { x: originalRotations[11].x - 1.3, duration: 0.5 });
    gsap.to(bones[12].rotation, { x: originalRotations[12].x - 1, duration: 0.5 });
    gsap.to(bones[13].rotation, { x: originalRotations[13].x - 1, duration: 0.5 });

}

function animate() {
	renderer.render( scene, camera );
}
renderer.setAnimationLoop( animate );

function getComputerChoice() {
    const choices = [ROCK, PAPER, SCISSORS];
    const randomIndex = Math.floor(Math.random() * 3);
    return choices[randomIndex];
}



function initializeGame() {
    // Get the computer's choice
    computerChoice = getComputerChoice();
  
    // For testing purposes, let's set the player's choice
    humanChoice = prompt("Rock, Paper, or Scissors?").toLowerCase();
  
    // Shake both hands
    shakeHand(computerBones, () => {
      // After shaking, perform the computer's gesture
      if (computerChoice === ROCK) {
        performGesture(computerBones, computerOriginalRotations, makeFist);
      } else if (computerChoice === PAPER) {
        performGesture(computerBones, computerOriginalRotations, makePaper);
      } else {
        performGesture(computerBones, computerOriginalRotations, makeScissors);
      }
    });
  
    shakeHand(playerBones, () => {
      // After shaking, perform the player's gesture
      if (humanChoice === ROCK) {
        performGesture(playerBones, playerOriginalRotations, makeFist);
      } else if (humanChoice === PAPER) {
        performGesture(playerBones, playerOriginalRotations, makePaper);
      } else {
        performGesture(playerBones, playerOriginalRotations, makeScissors);
      }
    });
  
    // Proceed to determine the winner
    gsap.delayedCall(2, () => {
      playRound(humanChoice, computerChoice);
      updateScoreboard();
    });
  }

  function playRound(humanChoice, computerChoice) {
    if (humanChoice === computerChoice) {
      console.log("It's a draw!");
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

  function updateScoreboard() {
    console.log(`Computer chose: ${computerChoice}.`);
    console.log(`You chose: ${humanChoice}.`);
    console.log(`SCORE: Player ${playerScore} | Computer ${computerScore}`);
    console.log("");
  }
  
  
  
