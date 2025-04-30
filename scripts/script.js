const el_scrambled = document.body.querySelector(`.scrambled_word`);
const el_tries = document.body.querySelector(`#tries`);
const el_mistakes = document.body.querySelector(`#mistakes`);
const el_word_input = document.body.querySelector(`.word_input`);
const el_random = document.body.querySelector(`#random`);
const el_reset = document.body.querySelector(`#reset`);
const els_dots = document.body.querySelectorAll(`.dot`)


/* Random Int from 0 - max (inclusive) */
function randomInt(max) {
    return Math.floor(Math.random()*(max + 1));
}

Array.prototype.shuffleArray = function() {
    for (let i = this.length - 1; i > 0 ; i--) {
        const j = randomInt(i);
        const temp = this[i];
        this[i] = this[j];
        this[j] = temp;
    }
    return this
}

function randomArray(arr) {
    return arr[randomInt(arr.length - 1)];
}

const words =["example", "javascript", "coding", "challenge"] /* [`matara`, `vinesauce`, `northernlion`, `limealicious`, `chiblee`, `hackerling`, `andersonjph`] */;
let word;
let word_array;
let scrambled_array;
let scrambled_word;

let tries;
let letter_containers = []
let focused;
let letter_num;

function randomiseWord() {
    word = randomArray(words);

    el_scrambled.style.fontSize = `2rem`
    if (word.length > 9) {
        el_scrambled.style.fontSize = Math.max(0.5, (2 - (word.length - 9)/9)) + `rem`
    }

    word_array = word.split("");
    scrambled_array = [...word_array].shuffleArray();
    scrambled_word = scrambled_array.join(``);

    el_scrambled.innerHTML = scrambled_word;
    resetMistakes()
    fillInputBoxes()
}

function resetMistakes() {
    el_mistakes.innerHTML = `\u00a0 \u00a0 \u00a0 \u00a0 \u00a0 \u00a0 \u00a0 \u00a0`;
}

function reset() {
    randomiseWord() 

    tries = 5;
    applyTries()    
}

function applyTries() {
    el_tries.innerHTML = tries;

    for (let index = 0; index < els_dots.length; index++) {        
        const dot = els_dots[index];

        dot.classList.remove(`true`); 
        if (index <= tries - 1) {            
            dot.classList.add(`true`); 
        }
    }
}

function fillInputBoxes() {
    letter_containers = [];


    for (let index = 0; index < word_array.length; index++) {
        const element = document.createElement("div");
        element.setAttribute( "class", "letter_input"); 

        letter_containers.push(element)
    }
    el_word_input.replaceChildren(...letter_containers);    

    letter_num = 0;
    focusElement(letter_num)
}

function unfocusElement() {
    if (focused !== undefined) {
        focused.classList.remove(`focused`);
        focused.onkeydown = undefined
    }
}


function focusElement(i) {
    unfocusElement() 

    focused = letter_containers[i];   
    focused.classList.add(`focused`);   


    if (focused.textContent === ``) {
        focused.textContent = `_`;
    }
}



function isLetter(str) {
  return str.length === 1 && str.match(/[a-z]/i);
}

el_reset.onclick = reset;
el_random.onclick = randomiseWord;

document.onkeydown = (e) => {

    if (!isLetter(e.key)) {
        focused.textContent = `_`
        return
    }

    focused.textContent = e.key 
    if (++letter_num < word.length) {
        focusElement(letter_num)
    } else {
        unfocusElement();
        checkWord();
    }    
}

function checkWord() {
    el_mistakes.innerHTML = ``
    for (let index = 0; index < word.length; index++) {
        const letter = word[index];
        const container = letter_containers[index];

        if (letter !== container.innerHTML) {
            el_mistakes.innerHTML = el_mistakes.innerHTML + (el_mistakes.innerHTML === `` ? `${container.innerHTML}` : `,${container.innerHTML}`);
        }        
    }

    if (el_mistakes.innerHTML !== ``) {
        if (--tries === 0) return reset();
        else {
            applyTries() 
            return fillInputBoxes();
        }
    } else {
        alert(`🎉 Success`);
        reset();
    }
}


reset();