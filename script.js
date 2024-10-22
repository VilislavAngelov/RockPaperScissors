let computerChoice;
let humanChoice;
let computerScore = 0;
let playerScore = 0;

const ROCK = "rock";
const PAPER = "paper";
const SCISSORS = "scissors";


while (computerScore != 5 && playerScore != 5) {
    humanChoice = prompt("Rock, Paper or Scissors?").toLowerCase();
    computerChoice = getComputerChoice();
    playRound(humanChoice, computerChoice);
    console.log(`Computer chose: ${computerChoice}.`);
    console.log(`SCORE: Player ${playerScore} | Computer ${computerScore}`);
    console.log("");
}

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