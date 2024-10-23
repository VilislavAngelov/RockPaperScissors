import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

let computerChoice;
let humanChoice;
let computerScore = 0;
let playerScore = 0;
let computerHand, playerHand;
let computerBones = [], playerBones = [];
let fistRotations = [];

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

  setupHand(computerHand, computerBones, 'computer');

  checkAllModelsLoaded();
}, undefined, function (error) {
  console.error(error);
});

loader.load('RiggedArms.glb', function (gltf) {
  playerHand = gltf.scene;
  scene.add(playerHand);

  setupHand(playerHand, playerBones, 'player');

  checkAllModelsLoaded();
}, undefined, function (error) {
  console.error(error);
});

function setupHand(hand, bonesArray, type) {

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

    // Make the fist pose
    makeFist(bonesArray);

}

function makeFist(bones) {
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

    tl.call(() => storeFistRotations(bones));
}

function storeFistRotations(bones) {
    bones.forEach((bone, index) => {
        fistRotations[index] = {
            x: bone.rotation.x,
            y: bone.rotation.y,
            z: bone.rotation.z,
        };
    });
}

function resetToFist(bones) {
    const duration = 0.5;
    bones.forEach((bone, index) => {
        gsap.to(bone.rotation, {
            x: fistRotations[index].x,
            y: fistRotations[index].y,
            z: fistRotations[index].z,
            duration,
        });
    });
}

function checkAllModelsLoaded() {
  loadingCounter++;
  if (loadingCounter === 2) {
    // Both hands have been loaded and set up
    gsap.delayedCall(0.6, getPlayerChoice);
  }
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
  

function makePaper(bones) {

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

function makeScissors(bones) {

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

function getPlayerChoice() {
    let choices = document.getElementsByClassName("rps-btn");

    Array.from(choices).forEach(function(element) {
        element.addEventListener('click', function onClick() {

            humanChoice = element.textContent.toLowerCase();

            // Initialize the game after the player has made a choice
            initializeGame();
        });
    });
}

function initializeGame() {
    // Get the computer's choice
    computerChoice = getComputerChoice();
  
    // Shake both hands
    shakeHand(computerBones, () => {
      // After shaking, perform the computer's gesture
       if (computerChoice === PAPER) {
        makePaper(computerBones);
      } else if (computerChoice === SCISSORS){
        makeScissors(computerBones);
      }

      gsap.delayedCall(1, () => {
        resetToFist(computerBones);
      });
    });
  
    shakeHand(playerBones, () => {
      // After shaking, perform the player's gesture
      if (humanChoice === PAPER) {
        makePaper(playerBones);
      } else if (humanChoice === SCISSORS) {
        makeScissors(playerBones);
      }

      gsap.delayedCall(1, () => {
        resetToFist(playerBones);
      });
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

function getComputerChoice() {
    const choices = [ROCK, PAPER, SCISSORS];
    const randomIndex = Math.floor(Math.random() * 3);
    return choices[randomIndex];
}
  
  
  
