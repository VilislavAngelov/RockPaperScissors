let computerChoice;
let humanChoice;
let computerScore = 0;
let playerScore = 0;

while (computerScore != 5 && playerScore != 5) {
    humanChoice = prompt("Rock, Paper or Scissors?").toLowerCase();
    getComputerChoice();
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
    computerChoice = Math.floor(Math.random() * (3 - 1 + 1) + 1);
    switch (computerChoice) {
        case 1:
            computerChoice = 'Rock';
            return computerChoice;
            break;
        case 2:
            computerChoice = 'Paper';
            return computerChoice;
            break;
        case 3:
            computerChoice = 'Scissors';
            return computerChoice;
            break;
    }
}

function playRound(humanChoice, computerChoice){
    switch (humanChoice){
        case "rock":
            switch (computerChoice){
                case "Rock":
                    console.log("Draw!");
                    break;
                case "Paper":
                    console.log("You Lose!");
                    computerScore += 1;
                    break;
                case "Scissors":
                    console.log("You Win!");
                    playerScore += 1;
                    break;
            }
            break;
        case "paper":
            switch (computerChoice){
                case "Rock":
                    console.log("You Win!");
                    playerScore += 1;
                    break;
                case "Paper":
                    console.log("Draw!");
                    break;
                case "Scissors":
                    console.log("You Lose!");
                    computerScore += 1;
                    break;
            }
            break;
        case "scissors":
            switch (computerChoice){
                case "Rock":
                    console.log("You Lose!");
                    computerScore += 1;
                    break;
                case "Paper":
                    console.log("You Win!");
                    playerScore += 1;
                    break;
                case "Scissors":
                    console.log("Draw!");
                    break;
            }
            break;
    }
}