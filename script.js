import { WORDS } from "./words.js";

const NUMBER_OF_GUESSES = 6;
let guessesRemaining = NUMBER_OF_GUESSES;
let currentGuess = [];
let nextLetter = 0;
let rightGuessString = WORDS[Math.floor(Math.random() * WORDS.length)];
console.log(rightGuessString);

alert("Wordle game \n1.You get 6 guesses to find a 5 letter word \n2.If the box turns green then the letter is in the correct position \n3.If the box turns yellow then the letter is inside of the word but in the wrong position \n4.If the box turns grey then the letter is not inside the word \n5.Goodluck😄")

function createBoard() {
    let board = document.querySelector("#game-board");

    // wordle game has 6 rows, 5 columns
    for (let i = 0; i < NUMBER_OF_GUESSES; i++) {
        let row = document.createElement("section");
        row.className = "letter-row";

        //each row has 5 boxes
        for (let j = 0; j < NUMBER_OF_GUESSES - 1; j++) {
        let box = document.createElement("section");
        box.className = "letter-box";
        row.appendChild(box);
        }

        board.appendChild(row);
    }
}

function shadeKeyBoard(letter, color) {
    for (const elem of document.querySelectorAll(".keyboard-button")) {
        if (elem.textContent === letter) {
        let oldColor = elem.style.backgroundColor;
        if (oldColor === "green") {
            return;
        }

        if (oldColor === "yellow" && color !== "green") {
            return;
        }

        elem.style.backgroundColor = color;
        break;
        }
    }
}

function deleteLetter () {
    let row = document.querySelectorAll(".letter-row")[6 - guessesRemaining]
    let box = row.children[nextLetter - 1]
    // remove letter inside box to empty
    box.textContent = ""
    // remove previous styling
    box.classList.remove("filled-box")
    currentGuess.pop()
    nextLetter-=1
}

function checkGuess() {
    let row = document.querySelectorAll(".letter-row")[6 - guessesRemaining];
    let guessString = "";
    let rightGuess = Array.from(rightGuessString);

    for (const val of currentGuess) {
        guessString += val;
    }

    if (guessString.length != 5) {
        toastr.error("Not enough letters!");
        return;
    }

    if (!WORDS.includes(guessString)) {
        toastr.error("Word not in list!");
        return;
    }

    let letterColor = ["gray", "gray", "gray", "gray", "gray"];

    //check green
    for (let i = 0; i < 5; i++) {
        if (rightGuess[i] == currentGuess[i]) {
        letterColor[i] = "green";
        rightGuess[i] = "#";
        }
    }

    //check yellow
    //checking guess letters
    for (let i = 0; i < 5; i++) {
        if (letterColor[i] == "green") continue;

        //checking right letters
        for (let j = 0; j < 5; j++) {
        if (rightGuess[j] == currentGuess[i]) {
            letterColor[i] = "yellow";
            rightGuess[j] = "#";
        }
        }
    }

    for (let i = 0; i < 5; i++) {
        let box = row.children[i];
        let delay = 250 * i;
        setTimeout(() => {
        //shade box
        box.style.backgroundColor = letterColor[i];
        shadeKeyBoard(guessString.charAt(i) + "", letterColor[i]);
        }, delay);
    }

    if (guessString === rightGuessString) {
        toastr.success("You guessed right! Game over!");
        guessesRemaining = 0;
        return;
    } else {
        guessesRemaining -= 1;
        currentGuess = [];
        nextLetter = 0;

        if (guessesRemaining === 0) {
        toastr.error("You've run out of guesses! Game over!");
        toastr.info(`The right word was: "${rightGuessString}"`);
        }
    }
}

function insertLetter(pressedKey) {
    //boxes are 0-4
    if(nextLetter === 5){
        return
    }

    pressedKey = pressedKey.toLowerCase()
    // get the row we are on
    let row = document.querySelectorAll(".letter-row")[NUMBER_OF_GUESSES-guessesRemaining]
    // get the box we are on
    let box = row.children[nextLetter]
    // add word to box
    box.textContent = pressedKey
    // add style
    box.classList.add("filled-box")
    // move guessed letter into array
    currentGuess.push(pressedKey)
    // go to next letter box space
    nextLetter+=1

}

document.addEventListener("keyup", (e) => {
    if (guessesRemaining === 0) {
        return;
    }

    let pressedKey = String(e.key);
    if (pressedKey === "Backspace" && nextLetter !== 0) {
        deleteLetter();
        return;
    }

    if (pressedKey === "Enter") {
        checkGuess();
        return;
    }

    //if key enter was shift/tab or number then it would not be found
    let found = pressedKey.match(/[a-z]/gi);
    if (!found || found.length > 1) {
        return;
    } else {
        insertLetter(pressedKey);
    }
});

// generate an on screen keyboard
document.querySelector("keyboard-cont").addEventListener("click", (e) => {
    const target = e.target;

    if (!target.classList.contains("keyboard-button")) {
        return;
    }
    let key = target.textContent;

    if (key === "Del") {
        key = "Backspace";
    }

    document.dispatchEvent(new KeyboardEvent("keyup", { key: key }));
});

createBoard();
