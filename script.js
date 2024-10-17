let computerChoice;
let humanChoice;

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

console.log(getComputerChoice());