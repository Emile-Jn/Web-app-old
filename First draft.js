
const word = document.getElementById("word")
const input = document.getElementById("input")
const feedback = document.getElementById("feedback")
const result = document.getElementById("result")
const Deutsch = document.getElementById("Deutsch")
const slovensky = document.getElementById("slovensky")
const again = document.getElementById("again")
const change_list = document.getElementById("change_list")
const change_lan = document.getElementById("change_lan")

// Declare variables
let vortoj = []
let word_list = []
let current_word_index = 0
let score = 0
let score_max = 50
let message_1 = ["Attention aux espaces!", "Careful with spaces!"]
let message_2 = ["Attention aux majuscules!", "Case sensitive!"]
let message_3 = ["Attention aux espaces et aux majuscules!", "Careful with spaces and case sensitivity!"]
let message_4 = ["Essaye encore", "Try again"]
let message_5 = ["choisir une langue à apprendre", "choose a language to learn"]
let message_6 = ["Choisirr une liste", "Choose a list"]
let message_7 = ["ce doit être un nombre entier!", "it must be an integer!"]
let message_8 = ["le nombre doit être compris entre 1 et 20", "the number must be between 1 and 20"]
let message_9 = ["recommencer", "start again"]
let message_10 = ["changer de liste", "change list"]
let message_11 = ["changer de langue", "change language"]
let message_12 = ["choisir", "choose"]
let message_13 = ["genre incorrect", "incorrect gender"]
let langue = 0  // 0 : français, 1 : english
let rep = 3  // repeat word after rep words
let lan = "Deutsch"  // Deutsch or Slovensky
let num = 0  // list number
let determinants = ["der", "die", "das"]


// Function to load the JSON data from a local file
function loadJSONFile(file, callback) {
    const xhr = new XMLHttpRequest();
    xhr.overrideMimeType("application/json");
    xhr.open("GET", file, true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            callback(xhr.responseText);
        } else if (xhr.readyState === 4) {
            callback(null);
        }
    };
    xhr.send(null);
}

function fetchQuestions() {
    // Load the questions from the local JSON file
    loadJSONFile("vortoj.json", function (data) {
        if (data) {
            vortoj = JSON.parse(data);
            // displayQuestion();
        } else {
            // If no data is found, show a message to the user to add questions manually
            questionElem.textContent = "Please add questions manually in the JSON format.";
        }
    });
}


function d_or_s() {
    input.style.display = "none"
    // choice = tk.Label(root, text = message_5[langue], font = ("Arial", 25))
    word.textContent = message_5[langue]
    //Deutsch = tk.Button(root, text = "Deutsch", command = deutsch)
    Deutsch.addEventListener("click", () => {
        Deutsch.style.display = "none"
        slovensky.style.display = "none"
        lan = 'Deutsch'
        list_number()
    });
    // TODO: assign command to Deutsch button done?
    //Slovensky = tk.Button(root, text = "Slovensky", command = slovensky)
    slovensky.addEventListener("click", () => {
        Deutsch.style.display = "none"
        slovensky.style.display = "none"
        lan = 'slovensky'
        list_number()
    });
    // TODO: assign command to slovensky button done?
    again.style.display = "none"
    change_list.style.display = "none"
    change_lan.style.display = "none"
}

function deu() { // not used
    lan = 'D'
    list_number()
}

function slo() { // not used
    lan = 'S'
    list_number()
}

/*
function list_number() {
    word.textContent = message_6[langue]
    input.style.display = "block"
    window.addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
            // event.preventDefault();
            let inp = input.value;
            set_list(inp);
            quiz();
        }
    });
}

 */


function list_number() {
    word.textContent = message_6[langue]
    input.style.display = "block"
    input.addEventListener("keydown", listHandler);
}

let AA = 1

function listHandler(e) {
    if (e.key === "Enter") {
        let inp = parseInt(input.value);
        // console.log(`the input is ${inp}`)
        console.log(vortoj[0][lan]["lists"][inp-1])
        input.value = ""
        input.removeEventListener("keydown", listHandler);
        set_list(inp);
        // word.textContent = "enter"
        quiz();
    } /* else {
        word.textContent = AA
        AA++
    }
    */
}

function list_select() { // not used
    set_list()
    quiz()
}

function set_list(inp) {
    // console.log(vortoj[0][lan])
    word_list = vortoj[0][lan]["lists"][inp-1]
    // console.log(word_list instanceof Array)
    score_max = word_list.length
    for (let i = 0; i < score_max; i++) {
        word_list[i] = [word_list[i][0], word_list[i][1], false]
    }
    // word.textContent = "list is set"
}

function quiz() {
    word.textContent = word_list[current_word_index][0]
    input.addEventListener("keydown", enterHandler)
}

function enterHandler(e) {
    if (e.key === "Enter") {
        check_answer()
    }
}

function check_answer() {
    const inp = input.value
    const answer = word_list[current_word_index][1]
    const shown = word_list[current_word_index][2]
    if (inp === answer) {
        if (!shown) {
            score++
        }
        current_word_index++
        if (current_word_index >= word_list.length) {
            show_result()
        } else {
            word.textContent = word_list[current_word_index][0]
            input.value = ""
            feedback.textContent = "correct!"
            feedback.style.color = "green"
            setTimeout(function () {
                feedback.textContent = "";
            }, 1000 ); // appears for one second
        }
    } else if (inp === "?") {
        input.value = "" // clear text in text box
        input.disabled = true; // disable text box
        setTimeout(function () {
            input.disabled = false;
        }, 4000); // re-enable it after 4 seconds
        word_list[current_word_index][2] = true // answer has been shown
        word_list.splice(current_word_index + rep, word_list[current_word_index]) // add word later in list
        feedback.textContent = word_list[current_word_index][1] // show answer
        feedback.style.color = "blue" // in blue
        setTimeout(function () {
            feedback.textContent = "";
        }, 4000 ); // appears for four seconds
    } else {
        // User input is incorrect
        const split_1 = inp.split(' ')
        const split_2 = answer.split(' ')
        input.value = ""
        feedback.style.color = "red"
        setTimeout(function () {
            feedback.textContent = "";
        }, 1000 ); // appears for one second
        if ((split_1.length === split_2.length) &&
            (determinants.includes(split_1[0])) &&
            (determinants.includes(split_2[0])) &&
            (split_1[0] !== split_2[0])) {
            feedback.textContent = message_13[langue]  // determinant!
        }
        else if (inp.split(' ').join('') === answer.split(' ').join('')) { //everything is correct except spaces
            feedback.textContent = message_1[langue]  // espaces!
        }
        else if (inp.toLowerCase() === answer.toLowerCase()) { //everything is correct except the case (capital letters)
            feedback.textContent = message_2[langue]  // majuscules!
        }
        else if (inp.split(' ').join('').toLowerCase() === answer.split(' ').join('').toLowerCase()) {
            feedback.textContent = message_3[langue]  // espaces & majuscules!
        }
        else {
            feedback.textContent = message_4[langue]  // encore!
        }
    }
}

function show_result() {
    result.textContent = `Score: ${score}/${score_max}`
    again.textContent = message_9[langue]
    change_list.textContent = message_10[langue]
    change_lan.textContent = message_11[langue]
    current_word_index = 0
    score = 0
    word_list = []

}

function repeat() { // not used
}

fetchQuestions()
d_or_s()