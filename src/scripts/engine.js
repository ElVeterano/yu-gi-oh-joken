const state = {
    score: {
        playerScore: 0,
        computerScore: 0,
        scoreBox: document.getElementById("score_points"),
    },
    cardSprites: {
        avatar: document.getElementById("card-image"),
        name: document.getElementById("card-name"),
        type: document.getElementById("card-type"),
    },
    fieldCards: {
        player: document.getElementById("playerFieldCard"),
        computer: document.getElementById("computerFieldCard"),
    },
    playerSides: {
        player1: "player-cards",
        computer: "computer-cards",
        player1box: document.querySelector("#player-cards"),
        computer1box: document.querySelector("#computer-cards"),
    },
    actions: {
        button: document.getElementById("nextDuel"),
    },
};

const pathImages = "./src/assets/icons/";
const cardData = [
    {
        id:0,
        name: "Blue Eyes White Dragon",
        type: "Paper",
        img: `${pathImages}dragon.png`,
        winOff: [1],
        loseOff: [2],
    },
    {
        id:1,
        name: "DarkMagician",
        type: "Rock",
        img: `${pathImages}magician.png`,
        winOff: [2],
        loseOff: [0],
    },
    {
        id:2,
        name: "Exodia",
        type: "Scissors",
        img: `${pathImages}exodia.png`,
        winOff: [0],
        loseOff: [1],
    },
];

async function createCardImage (IdCard, fieldSide) {
    const cardImage = document.createElement("img");
    cardImage.setAttribute("height", "100px");
    cardImage.setAttribute("src", "./src/assets/icons/card-back.png");
    cardImage.setAttribute("data-id", IdCard);
    cardImage.classList.add("card");

    if (fieldSide === state.playerSides.player1) {
        cardImage.addEventListener("click", () => {
            setCardsField(cardImage.getAttribute("data-id"));
        });

        cardImage.addEventListener("mouseover", () => {
            drawSelectCard(IdCard);
        });
    };

    return cardImage;
};

async function setCardsField (cardId) {
    await removeAllCardsImages();

    let computerCardId = await getRandomCardId();
    state.fieldCards.player.style.display = "block";
    state.fieldCards.computer.style.display = "block";

    state.fieldCards.player.src = cardData[cardId].img;
    state.fieldCards.computer.src = cardData[computerCardId].img;

    let duelResults = await checkDuelResults(cardId, computerCardId);

    await updateScore();
    await drawButton(duelResults);
}
async function updateScore() {
    state.score.scoreBox.innerText = `Win: ${state.score.playerScore} | Lose: ${state.score.computerScore}`
}

async function drawButton (text) {
    state.actions.button.innerText = text.toUpperCase();
    state.actions.button.style.display = "block";
}

async function checkDuelResults (playerId, computerId) {
    let duelResults = "Empate";
    let playerCard = cardData[playerId];

    if (playerCard.winOff.includes(computerId)) {
        duelResults = "Ganhou";
        await playAudio("win");
        state.score.playerScore++;
    }

    if (playerCard.loseOff.includes(computerId)) {
        duelResults = "Perdeu";
        await playAudio("lose");
        state.score.computerScore++;
    }

    if (duelResults === "Empate") {
        await playAudio("empate");
    }

    return duelResults;
}

async function removeAllCardsImages () {
    let {player1box, computer1box} = state.playerSides;
    let imgElements = computer1box.querySelectorAll("img");
    imgElements.forEach((img) => img.remove());

    imgElements = player1box.querySelectorAll("img");
    imgElements.forEach((img) => img.remove());
}

async function getRandomCardId () {
    const ramdomIndex = Math.floor(Math.random() * cardData.length);
    return cardData[ramdomIndex].id;
};

async function drawSelectCard(index) {
    state.cardSprites.avatar.src = cardData[index].img;
    state.cardSprites.name.innerText = cardData[index].name;
    state.cardSprites.type.innerText = "Atribute : " + cardData[index].type;
}

async function drawCards (cardNumbers, fieldSide) {

    for (let i = 0; i < cardNumbers; i++) {
        const randomIdCard = await getRandomCardId();
        const cardImage = await createCardImage(randomIdCard, fieldSide);

        document.getElementById(fieldSide).appendChild(cardImage);
    };
};

async function resetDuel () {
    state.cardSprites.avatar.src = "";
    state.actions.button.style.display = "none";
    state.cardSprites.type.innerText = "Uma Carta";
    state.cardSprites.name.innerText = "Selecione";

    state.fieldCards.player.style.display = "none";
    state.fieldCards.computer.style.display = "none";

    init();
}

async function playAudio(status) {
    const audio = new Audio(`./src/assets/audios/${status}.wav`);
    audio.play();
}

function init() {

    const bgm = document.getElementById("bgm");
    bgm.play();
    
    state.fieldCards.player.style.display = "none";
    state.fieldCards.computer.style.display = "none";
    
    drawCards (5, state.playerSides.player1);
    drawCards (5, state.playerSides.computer);

}

init();
