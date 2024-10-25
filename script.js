//TODO
//sound effects when you lose/win and on shake, click a button
//make the buttons prettier, put in a picture of the action in the btn
// 4d text?

//after element on the stars to make an outline

import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OutlinePass } from "three/examples/jsm/postprocessing/OutlinePass.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";

let computerChoice, playerChoice;
let computerScore = 0,
  playerScore = 0;
let computerHand, playerHand;
let computerBones = [],
  playerBones = [];
let fistRotations = [];
let isGameRunning = true;

const ROCK = "rock";
const PAPER = "paper";
const SCISSORS = "scissors";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);



const geometryWall = new THREE.PlaneGeometry(30, 20);
const materialWall = new THREE.MeshBasicMaterial({
  color: 0x9fc6fc,
  side: THREE.DoubleSide,
});
const wall = new THREE.Mesh(geometryWall, materialWall);
scene.add(wall);

const geometryFloor = new THREE.PlaneGeometry(30, 20);
const materialFloor = new THREE.MeshBasicMaterial({
  color: 0x89aad9,
  side: THREE.DoubleSide,
});
const floor = new THREE.Mesh(geometryFloor, materialFloor);
scene.add(floor);
floor.rotation.x = -0.5 * Math.PI;
floor.position.y = -1.5;

const directionalLight2 = new THREE.DirectionalLight(0xffffff, 1);
directionalLight2.position.set(0, 5, 0);
scene.add(directionalLight2);

const directionalLight = new THREE.DirectionalLight(0xffffff, 3.5);
directionalLight.position.set(0, 8, 10);
scene.add(directionalLight);

const damageMaterial = new THREE.MeshBasicMaterial({
  color: 0xff0000,
  transparent: true,
  opacity: 0,
});
const winMaterial = new THREE.MeshBasicMaterial({
  color: 0x00ff00,
  transparent: true,
  opacity: 0,
});
const damageGeometry = new THREE.PlaneGeometry(20, 20);
const damageMesh = new THREE.Mesh(damageGeometry, damageMaterial);
const winMesh = new THREE.Mesh(damageGeometry, winMaterial);

scene.add(winMesh);
scene.add(damageMesh);

winMesh.position.z = 9;
damageMesh.position.z = 9;

//Sound FX
const sounds = [];
let winGrunt, loseGrunt, shakeWoosh, roundWin;
const manager = new THREE.LoadingManager();
manager.onLoad = () => console.log("loaded", sounds);
const audioLoader = new THREE.AudioLoader(manager);
const mp3s = ["gruntWin", "gruntLose", "ShakeWoosh", "roundWin"];
const listener = new THREE.AudioListener();
camera.add(listener);

mp3s.forEach((name) => {
  const sound = new THREE.Audio(listener);
  sound.name = name;
  if (name === "gruntWin") {
    winGrunt = sound;
  }
  if (name === "gruntLose") {
    loseGrunt = sound;
  }
  if (name === "ShakeWoosh") {
    shakeWoosh = sound;
  }
  if (name === "roundWin") {
    roundWin = sound;
  }

  sounds.push(sound);
  audioLoader.load(`/sfx/${name}.mp3`, function (buffer) {
    sound.setBuffer(buffer);
  });
});

let composer; // Effect composer for post-processing
const playerOutlinePass = new OutlinePass(new THREE.Vector2(window.innerWidth, window.innerHeight), scene, camera);
const computerOutlinePass = new OutlinePass(new THREE.Vector2(window.innerWidth, window.innerHeight), scene, camera);

const renderPass = new RenderPass(scene, camera);
composer = new EffectComposer(renderer);
composer.addPass(renderPass);
composer.addPass(playerOutlinePass);
composer.addPass(computerOutlinePass);

// Set the outline parameters for each model
playerOutlinePass.edgeStrength = 5; 
playerOutlinePass.edgeGlow = 1; 
playerOutlinePass.usePatternTexture = false; 
playerOutlinePass.visibleEdgeColor.set(0x00ff00); // Set player outline to green
playerOutlinePass.hiddenEdgeColor.set(0x00ff00); // Ensure hidden edges match

computerOutlinePass.edgeStrength = 5; 
computerOutlinePass.edgeGlow = 1; 
computerOutlinePass.usePatternTexture = false; 
computerOutlinePass.visibleEdgeColor.set(0xff0000); // Set computer outline to red
computerOutlinePass.hiddenEdgeColor.set(0xff0000); // Ensure hidden edges match

camera.position.z = 10;

window.addEventListener('resize', function() {
    const width = window.innerWidth;  // Use const to avoid variable shadowing
    const height = window.innerHeight;
    
    renderer.setSize(width, height);  // Set the renderer size
    camera.aspect = width / height;    // Update the camera aspect ratio
    camera.updateProjectionMatrix();    // Update the camera projection matrix
});

window.dispatchEvent(new Event('resize'));

const loader = new GLTFLoader();

let loadingCounter = 0;

loader.load(
    "RiggedArms.glb",
    function (gltf) {
      computerHand = gltf.scene;
      scene.add(computerHand);
      setupHand(computerHand, computerBones, "computer");
      checkAllModelsLoaded();
    },
    undefined,
    function (error) {
      console.error(error);
    }
  );
  
  loader.load(
    "RiggedArms.glb",
    function (gltf) {
      playerHand = gltf.scene;
      scene.add(playerHand);
      setupHand(playerHand, playerBones, "player");
      checkAllModelsLoaded();
    },
    undefined,
    function (error) {
      console.error(error);
    }
  );

function setupHand(hand, bonesArray, type) {
  hand.rotation.order = "YZX";

  if (type === "computer") {
    hand.position.set(6, 0, 2);
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
      bonesArray.push(object);
    }
  });

  makeFist(bonesArray);
}

function makeFist(bones) {
  const duration = 1;

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

// Call this function when both models are loaded
function checkAllModelsLoaded() {
    loadingCounter++;
    if (loadingCounter === 2) {
      // Set the outline pass targets for each model
      playerOutlinePass.selectedObjects.push(playerHand); // Add player hand for green outline
      computerOutlinePass.selectedObjects.push(computerHand); // Add computer hand for red outline
  
      gsap.delayedCall(0.6, getPlayerChoice);
    }
  }

function shakeHand(bones, onCompleteCallback) {
  const duration = 0.1;
  const shakeAmount = 0.2;

  if (!bones[0]) {
    console.error("bones[0] is undefined in shakeHand");
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
  const duration = 0.2;

  gsap.to(bones[3].rotation, { z: bones[3].rotation.z + 0.5, duration });
  gsap.to(bones[4].rotation, { y: bones[4].rotation.y + 1, duration });
  gsap.to(bones[5].rotation, { z: bones[5].rotation.z + 1.3, duration });

  // Animate index finger bones
  gsap.to(bones[7].rotation, { z: bones[7].rotation.z + 1.3, duration });
  gsap.to(bones[8].rotation, { z: bones[8].rotation.z + 1, duration });
  gsap.to(bones[9].rotation, { z: bones[9].rotation.z + 1, duration });

  // Animate middle finger bones
  gsap.to(bones[11].rotation, { x: bones[11].rotation.x - 1.3, duration });
  gsap.to(bones[12].rotation, { x: bones[12].rotation.x - 1, duration });
  gsap.to(bones[13].rotation, { x: bones[13].rotation.x - 1, duration });

  // Animate ring finger bones
  gsap.to(bones[15].rotation, { z: bones[15].rotation.z - 1.3, duration });
  gsap.to(bones[16].rotation, { z: bones[16].rotation.z - 1, duration });
  gsap.to(bones[17].rotation, { z: bones[17].rotation.z - 1, duration });

  // Animate pinky finger bones
  gsap.to(bones[19].rotation, { z: bones[19].rotation.z - 1.3, duration });
  gsap.to(bones[20].rotation, { z: bones[20].rotation.z - 1, duration });
  gsap.to(bones[21].rotation, { z: bones[21].rotation.z - 1, duration });
}

function makeScissors(bones) {
  const duration = 0.2;

  // Animate index finger bones
  gsap.to(bones[7].rotation, { z: bones[7].rotation.z + 1.3, duration });
  gsap.to(bones[8].rotation, { z: bones[8].rotation.z + 1, duration });
  gsap.to(bones[9].rotation, { z: bones[9].rotation.z + 1, duration });

  // Animate middle finger bones
  gsap.to(bones[11].rotation, { x: bones[11].rotation.x - 1.3, duration });
  gsap.to(bones[12].rotation, { x: bones[12].rotation.x - 1, duration });
  gsap.to(bones[13].rotation, { x: bones[13].rotation.x - 1, duration });
}

function getPlayerChoice() {
  let choices = document.getElementsByClassName("rps-btn");

  Array.from(choices).forEach(function (element) {
    element.addEventListener("click", onClick);
  });
}

function onClick(event) {
  if (isGameRunning) {
    playerChoice = event.target.textContent.toLowerCase();

    isGameRunning = false;

    initializeGame();
  }
}

function initializeGame() {

  computerChoice = getComputerChoice();

  shakeWoosh.stop();
  shakeWoosh.play();

  shakeHand(computerBones, () => {
    if (computerChoice === PAPER) {
      makePaper(computerBones);
    } else if (computerChoice === SCISSORS) {
      makeScissors(computerBones);
    }

    gsap.delayedCall(0.5, () => {
      resetToFist(computerBones);
    });
  });

  shakeHand(playerBones, () => {
    if (playerChoice === PAPER) {
      makePaper(playerBones);
    } else if (playerChoice === SCISSORS) {
      makeScissors(playerBones);
    }

    gsap.delayedCall(0.5, () => {
      resetToFist(playerBones);
    });
  });

  gsap.delayedCall(0.5, () => {
    playRound(playerChoice, computerChoice);
    if (playerScore == 5 || computerScore == 5) {
      gameOver();
    }

    isGameRunning = true;
  });
}

function playRound(playerChoice, computerChoice) {
  if (playerChoice === computerChoice) {
    document.getElementById("roundWinText").style.display = "none";
    document.getElementById("roundLoseText").style.display = "none";
    document.getElementById("roundDrawText").style.display = "block";
    winGrunt.stop();
    winGrunt.play();
  } else if (
    (playerChoice === ROCK && computerChoice === SCISSORS) ||
    (playerChoice === PAPER && computerChoice === ROCK) ||
    (playerChoice === SCISSORS && computerChoice === PAPER)
  ) {
    document.getElementById("roundWinText").style.display = "block";
    document.getElementById("roundLoseText").style.display = "none";
    document.getElementById("roundDrawText").style.display = "none";
    winGrunt.stop();
    winGrunt.play();
    roundWin.stop();
    roundWin.play();
    showWinEffect();
    increaseScore("player");
  } else {
    document.getElementById("roundWinText").style.display = "none";
    document.getElementById("roundLoseText").style.display = "block";
    document.getElementById("roundDrawText").style.display = "none";
    showDamageEffect();
    screenShake(camera, 0.3, 0.3);
    loseGrunt.stop();
    loseGrunt.play();
    increaseScore("computer");
  }
}

function getComputerChoice() {
  const choices = [ROCK, PAPER, SCISSORS];
  const randomIndex = Math.floor(Math.random() * 3);
  return choices[randomIndex];
}

function animate() {
    composer.render();
}
renderer.setAnimationLoop(animate);

function increaseScore(type) {
  if (type == "player") {
    playerScore++;
    for (let i = 1; i <= playerScore; i++) {
      document.querySelector(
        `.playerRoundsWon li:nth-child(${i}) img`
      ).style.filter =
        "invert(92%) sepia(14%) saturate(3585%) hue-rotate(358deg) brightness(104%) contrast(105%)";
    }
  } else {
    computerScore++;
    for (let i = 1; i <= computerScore; i++) {
      document.querySelector(
        `.computerRoundsWon li:nth-child(${6 - i}) img`
      ).style.filter =
        "invert(92%) sepia(14%) saturate(3585%) hue-rotate(358deg) brightness(104%) contrast(105%)";
    }
  }
}

function gameOver() {
  isGameRunning = false;

  let choices = document.getElementsByClassName("rps-btn");
  Array.from(choices).forEach(function (element) {
    element.removeEventListener("click", onClick);
  });

  if (playerScore == 5) {
    document.getElementById("roundWinText").style.display = "none";
    document.getElementById("gameWinText").style.display = "block";
    showReset();
  } else if (computerScore == 5) {
    document.getElementById("roundLoseText").style.display = "none";
    document.getElementById("gameLoseText").style.display = "block";
    showReset();
  }
}

function showReset() {
  document.getElementById("btn-rock").style.display = "none";
  document.getElementById("btn-paper").style.display = "none";
  document.getElementById("btn-scissors").style.display = "none";
  document.getElementById("btn-reset").style.display = "block";

  document.getElementById("btn-reset").addEventListener("click", resetGame);
}

function resetGame() {
  document.getElementById("btn-rock").style.display = "block";
  document.getElementById("btn-paper").style.display = "block";
  document.getElementById("btn-scissors").style.display = "block";
  document.getElementById("btn-reset").style.display = "none";
  playerScore = 0;
  computerScore = 0;

  console.log(playerScore);
  console.log(computerScore);

  let resetStars = document.querySelectorAll(".starWon img");

  resetStars.forEach(function (star) {
    star.style.filter =
      "invert(100%) sepia(0%) saturate(7500%) hue-rotate(258deg) brightness(109%) contrast(98%)";
  });

  document.getElementById("gameWinText").style.display = "none";
  document.getElementById("gameLoseText").style.display = "none";

  isGameRunning = true;

  getPlayerChoice();
}

function showDamageEffect() {
  const duration = 500;
  damageMaterial.opacity = 0.5;

  gsap.to(damageMaterial, {
    opacity: 0,
    duration: 0.5,
    ease: "power1.out",
  });
}

function showWinEffect() {
  const duration = 500;
  winMaterial.opacity = 0.5;

  gsap.to(winMaterial, {
    opacity: 0,
    duration: 0.5,
    ease: "power1.out",
  });
}

function screenShake(camera, intensity = 0.05, duration = 0.3) {
  const originalPosition = {
    x: camera.position.x,
    y: camera.position.y,
    z: camera.position.z,
  };

  gsap.to(camera.position, {
    x: originalPosition.x + (Math.random() - 0.5) * intensity,
    y: originalPosition.y + (Math.random() - 0.5) * intensity,
    z: originalPosition.z + (Math.random() - 0.5) * intensity,
    duration: 0.05,
    ease: "power1.inOut",
    yoyo: true,
    repeat: Math.floor(duration / 0.05),
    onComplete: () => {
      camera.position.set(
        originalPosition.x,
        originalPosition.y,
        originalPosition.z
      );
    },
  });
}
