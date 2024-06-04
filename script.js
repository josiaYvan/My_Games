let words = [];
let timerInterval;
let startTime;
let isChronoRunning = false;
let displayWord = "";
let interval;

// Capitalize and shuffle a word
function capitalizeAndShuffle(word) {
  let capitalizedWord = word.toUpperCase();
  let shuffledWord = capitalizedWord
    .split("")
    .sort(() => 0.5 - Math.random())
    .join("");
  displayWord = shuffledWord;
}

// Show the word manager view
function showWordManagerView() {
  document.getElementById("wordManagerView").classList.remove("d-none");
  document.getElementById("displayView").classList.add("d-none");
  document.getElementById("calculationView").classList.add("d-none");
  populateWordTable();
}

// Show the display view
function showDisplayView() {
  document.getElementById("wordManagerView").classList.add("d-none");
  document.getElementById("displayView").classList.remove("d-none");
  document.getElementById("calculationView").classList.add("d-none");
  displayRandomWord();
}

// Show the calculation view
function showCalculationView() {
  document.getElementById("wordManagerView").classList.add("d-none");
  document.getElementById("displayView").classList.add("d-none");
  document.getElementById("calculationView").classList.remove("d-none");
  generateCalculation();
}

// Save words to localStorage
function saveWords() {
  localStorage.setItem("words", JSON.stringify(words));
}

// Load words from localStorage
function loadWords() {
  const savedWords = localStorage.getItem("words");
  if (savedWords) {
    words = JSON.parse(savedWords);
  }
}

// Handle the form submission
document
  .getElementById("wordForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    const wordInput = document.getElementById("wordInput");
    const word = wordInput.value.trim();
    if (word) {
      words.push(word);
      wordInput.value = "";
      saveWords();
      document.getElementById(
        "insertStatus"
      ).textContent = `Word "${word}" added!`;
      populateWordTable();
    }
  });

// Display a random word
function displayRandomWord() {
  if (words.length === 0) {
    document.getElementById("wordDisplay").textContent = "No words available.";
  } else {
    const randomIndex = Math.floor(Math.random() * words.length);
    const word = words[randomIndex];
    capitalizeAndShuffle(word);
    document.getElementById("wordDisplay").textContent = displayWord;
    startChrono();
  }
}

// Find word in array
function findWordInArray(charSet, wordArray) {
  const wordCharSets = wordArray.map((word) => new Set(word.toLowerCase()));
  const matchingWord = wordCharSets.find((charSetArray) => {
    const givenCharSet = new Set(charSet.toLowerCase());
    return (
      charSetArray.size === givenCharSet.size &&
      [...charSetArray].every((char) => givenCharSet.has(char))
    );
  });

  return matchingWord ? wordArray[wordCharSets.indexOf(matchingWord)] : null;
}

// Populate the word table
function populateWordTable() {
  const wordTableBody = document.getElementById("wordTableBody");
  wordTableBody.innerHTML = "";
  words.forEach((word, index) => {
    const row = document.createElement("tr");
    const wordCell = document.createElement("td");
    wordCell.textContent = word;
    const actionCell = document.createElement("td");
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.className = "btn btn-danger";
    deleteButton.onclick = () => deleteWord(index);
    actionCell.appendChild(deleteButton);
    row.appendChild(wordCell);
    row.appendChild(actionCell);
    wordTableBody.appendChild(row);
  });
}

// Delete a word
function deleteWord(index) {
  words.splice(index, 1);
  saveWords();
  populateWordTable();
}

// Handle the "Next Word" button click
document
  .getElementById("nextWordBtn")
  .addEventListener("click", displayRandomWord);

// Start the chronometer
function startChrono() {
  if (timerInterval) {
    clearInterval(timerInterval);
  }
  isChronoRunning = true;
  startTime = new Date().getTime();
  timerInterval = setInterval(updateChrono, 100);
}

// Update the chronometer display
function updateChrono() {
  const now = new Date().getTime();
  const elapsed = now - startTime;
  document.getElementById("chronoDisplay").textContent =
    (elapsed / 1000).toFixed(1) + "s";
}

// Stop the chronometer
function stopChrono() {
  if (isChronoRunning) {
    clearInterval(timerInterval);
    isChronoRunning = false;
  }
}

// Event listener for the space key to stop the chronometer
document.addEventListener("keydown", function (event) {
  console.log(event.code, "knn");
  if (event.code === "Space" && isChronoRunning) {
    event.preventDefault();
    stopChrono();
  }
  if (event.code === "KeyN") {
    displayRandomWord();
  }
});

// Load JSON data
function loadJSON() {
  fetch("bible_data.json")
    .then((response) => response.json())
    .then((data) => {
      localStorage.setItem("data", JSON.stringify(data));
      localStorage.setItem(
        "malagasy_personnage",
        JSON.stringify(data.malgache["Personnages Bibliques"])
      );
      localStorage.setItem(
        "malagasy_livres",
        JSON.stringify(
          data.malgache["Ancien Testament"].concat(
            data.malgache["Nouveau Testament"]
          )
        )
      );
      localStorage.setItem(
        "francais_personnage",
        JSON.stringify(data.francais["Personnages Bibliques"])
      );
      localStorage.setItem(
        "francais_livres",
        JSON.stringify(
          data.francais["Ancien Testament"].concat(
            data.francais["Nouveau Testament"]
          )
        )
      );
    })
    .catch((error) => {
      console.error("Erreur lors de la récupération de s données JSON:", error);
    });
}

// Load words by category
function loadWordsByCategory() {
  const language = document.querySelector(
    'input[name="languageRadio"]:checked'
  ).value;
  const category = document.querySelector(
    'input[name="categoryRadio"]:checked'
  ).value;

  if (language === "malgache") {
    if (category === "livres") {
      const malagasyLivres = localStorage.getItem("malagasy_livres");
      if (malagasyLivres) {
        words = JSON.parse(malagasyLivres);
      } else {
        words = [];
      }
    } else if (category === "personnages") {
      const malagasyPersonnages = localStorage.getItem("malagasy_personnage");
      if (malagasyPersonnages) {
        words = JSON.parse(malagasyPersonnages);
      } else {
        words = [];
      }
    }
  } else if (language === "francais") {
    if (category === "livres") {
      const francaisLivres = localStorage.getItem("francais_livres");
      if (francaisLivres) {
        words = JSON.parse(francaisLivres);
      } else {
        words = [];
      }
    } else if (category === "personnages") {
      const francaisPersonnages = localStorage.getItem("francais_personnage");
      if (francaisPersonnages) {
        words = JSON.parse(francaisPersonnages);
      } else {
        words = [];
      }
    }
  }
  populateWordTable();
}

// Attach event listeners for radio button changes
document
  .querySelectorAll('input[name="languageRadio"]')
  .forEach(function (radio) {
    radio.addEventListener("change", loadWordsByCategory);
  });
document
  .querySelectorAll('input[name="categoryRadio"]')
  .forEach(function (radio) {
    radio.addEventListener("change", loadWordsByCategory);
  });

// Display the correct answer from localStorage
function displayCorrectAnswer() {
  let wordFind = findWordInArray(displayWord, words);
  if (wordFind) {
    document.getElementById("wordDisplay").textContent = wordFind.toUpperCase();
  } else {
    document.getElementById("wordDisplay").textContent =
      "No matching word found in localStorage.";
  }
}

// Event listener for the Enter key to display the correct answer
document.addEventListener("keydown", function (event) {
  if (event.code === "Enter" && !isChronoRunning) {
    event.preventDefault();
    displayCorrectAnswer();
  }
});

// Variables and functions for calculation view
let currentOperation, num1, num2, correctAnswer;

function generateCalculation() {
  const operations = ["+", "-", "*"];
  currentOperation = operations[Math.floor(Math.random() * operations.length)];
  num1 = Math.floor(Math.random() * 10);
  num2 = Math.floor(Math.random() * 10);

  document.getElementById(
    "calculation"
  ).textContent = `${num1} ${currentOperation} ${num2}`;
  startTimer();
}

function startTimer() {
  startTime = new Date().getTime();
  interval = setInterval(() => {
    const elapsedTime = new Date().getTime() - startTime;
    document.getElementById("timer").textContent =
      (elapsedTime / 1000).toFixed(1) + "s";
  }, 10);
}

function stopTimer() {
  clearInterval(interval);
}

function checkAnswer() {
  correctAnswer =
    currentOperation === "+"
      ? num1 + num2
      : currentOperation === "-"
      ? num1 - num2
      : num1 * num2;
  document.getElementById("calculation").textContent =
    document.getElementById("calculation").textContent + " = " + correctAnswer;
  stopTimer();
}

// Event listeners for calculation view key events
document.addEventListener("keydown", (event) => {
  if (event.code === "Space") {
    stopTimer();
  } else if (event.code === "Enter") {
    checkAnswer();
  } else if (event.code === "KeyN") {
    generateCalculation();
  }
});

// Initial setup
loadJSON();
loadWords();
loadWordsByCategory();
showWordManagerView();
