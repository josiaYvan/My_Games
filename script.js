let words = [];
let timerInterval;
let startTime;
let isChronoRunning = false;
let displayWord = "";

function capitalizeAndShuffle(word) {
  let capitalizedWord = word.toUpperCase();
  let shuffledWord = capitalizedWord
    .split("")
    .sort(() => 0.5 - Math.random())
    .join("");
  //   displayWord = shuffledWord.replace(/\s/g, "");
  displayWord = shuffledWord;
}
// Function to show the word manager view
function showWordManagerView() {
  document.getElementById("wordManagerView").classList.remove("d-none");
  document.getElementById("displayView").classList.add("d-none");
  populateWordTable();
}

// Function to show the display view
function showDisplayView() {
  document.getElementById("wordManagerView").classList.add("d-none");
  document.getElementById("displayView").classList.remove("d-none");
  displayRandomWord();
}

// Function to save words to localStorage
function saveWords() {
  localStorage.setItem("words", JSON.stringify(words));
}

// Function to load words from localStorage
function loadWords() {
  const savedWords = localStorage.getItem("words");
  if (savedWords) {
    words = JSON.parse(savedWords);
  }
}

// Function to handle the form submission
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
      populateWordTable(); // Update table immediately
    }
  });

// Function to display a random word
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

// Function to populate the word table
function populateWordTable() {
  const wordTableBody = document.getElementById("wordTableBody");
  wordTableBody.innerHTML = ""; // Clear existing table content
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

// Function to delete a word
function deleteWord(index) {
  words.splice(index, 1);
  saveWords();
  populateWordTable();
}

// Handle the "Next Word" button click
document
  .getElementById("nextWordBtn")
  .addEventListener("click", displayRandomWord);

// Function to start the chronometer
function startChrono() {
  if (timerInterval) {
    clearInterval(timerInterval);
  }
  isChronoRunning = true;
  startTime = new Date().getTime();
  timerInterval = setInterval(updateChrono, 100);
}

// Function to update the chronometer display
function updateChrono() {
  const now = new Date().getTime();
  const elapsed = now - startTime;
  document.getElementById("chronoDisplay").textContent =
    (elapsed / 1000).toFixed(1) + "s";
}

// Function to stop the chronometer
function stopChrono() {
  if (isChronoRunning) {
    clearInterval(timerInterval);
    isChronoRunning = false;
  }
}

// Event listener for the space key to stop the chronometer
document.addEventListener("keydown", function (event) {
  if (event.code === "Space" && isChronoRunning) {
    event.preventDefault(); // Prevent default action
    stopChrono();
  }
});

// Charger les données JSON depuis un fichier externe
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
        localStorage.setItem("words", malagasyLivres);
        words = JSON.parse(malagasyLivres);
      } else {
        words = [];
        localStorage.setItem("words", []);
      }
    } else if (category === "personnages") {
      const malagasyPersonnages = localStorage.getItem("malagasy_personnage");
      if (malagasyPersonnages) {
        localStorage.setItem("words", malagasyPersonnages);
        words = JSON.parse(malagasyPersonnages);
      } else {
        words = [];
        localStorage.setItem("words", []);
      }
    }
  } else if (language === "francais") {
    if (category === "livres") {
      const francaisLivres = localStorage.getItem("francais_livres");
      if (francaisLivres) {
        localStorage.setItem("words", francaisLivres);
        words = JSON.parse(francaisLivres);
      } else {
        words = [];
        localStorage.setItem("words", []);
      }
    } else if (category === "personnages") {
      const francaisPersonnages = localStorage.getItem("francais_personnage");
      if (francaisPersonnages) {
        localStorage.setItem("words", francaisPersonnages);
        words = JSON.parse(francaisPersonnages);
      } else {
        words = [];
        localStorage.setItem("words", []);
      }
    }
  }
  populateWordTable();
}

// Appeler la fonction lorsque la sélection de l'utilisateur change
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

// Function to handle the Enter key press event
// Event listener for the space key to stop the chronometer
document.addEventListener("keydown", function (event) {
  if (event.code === "Enter" && !isChronoRunning) {
    event.preventDefault(); // Prevent default action
    displayCorrectAnswer();
  }
});

// Function to display the correct answer from localStorage
function displayCorrectAnswer() {
  let wordFind = findWordInArray(displayWord, words);
  console.log(wordFind, "ito");
  if (wordFind.length > 0) {
    document.getElementById("wordDisplay").textContent = wordFind.toUpperCase();
  } else {
    document.getElementById("wordDisplay").textContent =
      "No matching word found in localStorage.";
  }
}

// Au chargement initial de la page, chargez les mots par défaut
loadJSON();
loadWordsByCategory();
// Load words on page load
loadWords();
showWordManagerView(); // Show the word manager view by default
