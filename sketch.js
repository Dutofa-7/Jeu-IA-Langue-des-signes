// sketch.js
const URL = "./model/";
const signs = ["Oui", "Bonjour", "Non", "Au Revoir"];
const signImages = ["signs/oui.png", "signs/bonjour.png", "signs/non.png", "signs/aurevoir.png"];
let model, webcam, labelContainer, maxPredictions;
let currentLevel = 0;
let validationTimer = null;

async function init() {
    // Désactive le bouton "Démarrer" dès qu'il est cliqué
    document.querySelector("button").disabled = true;

    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();

    webcam = new tmImage.Webcam(200, 200, true);
    await webcam.setup();
    await webcam.play();
    window.requestAnimationFrame(loop);

    document.getElementById("webcam-container").appendChild(webcam.canvas);
    labelContainer = document.getElementById("label-container");
    for (let i = 0; i < maxPredictions; i++) {
        labelContainer.appendChild(document.createElement("div"));
    }

    updateLevelDisplay();
}


async function loop() {
    webcam.update();
    await predict();
    window.requestAnimationFrame(loop);
}

async function predict() {
    const prediction = await model.predict(webcam.canvas);
    labelContainer.innerHTML = "";

    for (let i = 0; i < maxPredictions; i++) {
        if (prediction[i].className === signs[currentLevel] && prediction[i].probability > 0.5) {
            if (!validationTimer) {
                validationTimer = setTimeout(() => {
                    nextLevel();
                    validationTimer = null;
                }, 1500);
            }
            return;
        }
    }

    if (validationTimer) {
        clearTimeout(validationTimer);
        validationTimer = null;
    }
}

function nextLevel() {
    currentLevel++;
    if (currentLevel < signs.length) {
        updateLevelDisplay();
    } else {
        alert("Félicitations ! Vous avez complété tous les niveaux !");
        restartGame();
    }
}

function updateLevelDisplay() {
    document.getElementById("level").innerText = currentLevel + 1;
    document.getElementById("sign-image").src = signImages[currentLevel];
    document.getElementById("sign-name").innerText = signs[currentLevel];
}

function restartGame() {
    currentLevel = 0;
    updateLevelDisplay();
}
