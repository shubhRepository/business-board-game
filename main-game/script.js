let players;
let bidPlayers;

// for correctly mapping the player token
const numOfCells = 24;
const numOfCellsInWords = [
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
  "ten",
  "eleven",
  "twelve",
  "thirteen",
  "fourteen",
  "fifteen",
  "sixteen",
  "seventeen",
  "eighteen",
  "nineteen",
  "twenty",
  "twenty-one",
  "twenty-two",
  "twenty-three",
  "twenty-four",
];

// const buyable = [
//   "panaji",
//   "station",
//   "agra",
//   "vadodara",
//   "goa",
//   "station",
//   "indore",
//   "lucknow",
//   "udaipur",
//   "pune",
//   "kochi",
//   "jaipur",
//   "chennai",
//   "mumbai",
// ];

const nonBuyable = [
  "go!",
  "chest",
  "pay tax",
  "station",
  "jail",
  "extra chance",
  "petrol",
  "free parking",
  "go to jail",
];

// array of all the game cells
const blockArray = numOfCellsInWords.map((word) =>
  document.getElementById(`block-${word}`)
);

let isPlayerOneTurn = false;
let isBuyable;
let isRecentlyBought = false;
let isModalOpen = false;
let enableRollBtn = false;
let isAllActionsDisabled = false;
let isExtraChance = false;
let isBidPlaced = false;
// let isAssetClicked = false;
let isRentPending = false;
const playersInJail = Array(2).fill(false);

// player's runtime generated token element are stored
const playersToken = [];
// token's position wrt. first cell in the grid
const playersCellNumber = Array(2).fill(0);
const playersPrevCellNumber = Array(2).fill(0);

const playersCellContainer = Array(2).fill(null);

// const playerAcquisition = [{}, {}];
const playerAcquisition = [[], []];

let currentCellProperties;
let playerIndex;

const whichPlayersTurn = () =>
  getCurrentPlayerIndex() ? "playerTwo" : "playerOne";

// current player's worth elements
const balance = document.querySelector("#balance.amount-info .amount");
const assets = document.querySelector(".amount-info#assets .amount");

const rollDiceBtn = document.getElementById("roll-dice");
const dices = [...document.querySelectorAll(".dices")];

// buttons for all the actions a player can take
const [buyBtn, bidBtn] = [
  ...document.querySelectorAll(".game-option-controls .btn"),
];
// const [buyBtn, sellBtn, bidBtn] = [
//   ...document.querySelectorAll(".game-option-controls .btn"),
// ];
const actionsList = ["buy", "jail", "bid"];

const questionnaire = document.querySelector(".question");
const guidingText = document.querySelector(".guide-item");

const playerName = document.querySelector(".current-player-name");

// for showing modal window for different actions taken by buttons
const modalWindow = document.querySelector(".modal");
const modalClose = document.querySelector(".close-btn__circle");
// for dynamically adding html for buying or selling info.
const modalPriceInfo = document.querySelector(".price-info");
const cancelBtn = document.getElementById("cancel-btn");
const yesBtn = document.getElementById("yes-btn");
const modalBid = document.querySelector(".modal-bid");

const firstOverlay = document.querySelector(".first-overlay");
const countDownTimer = document.querySelector(".countdown-timer");
const modalBidArea = document.querySelector(".player-area");
const bidTimerDiv = document.querySelector(".player-timer__circle");
const bidTimer = document.querySelector(".bid-timer");
const userBidDiv = document.querySelector(".user-bid__text");
const bidPlayerName = document.querySelector(".player-name");
const biddingText = document.querySelector(".bidding-text");
const userBidInputDiv = document.querySelector(".user-bid__input");
const bidLabel = document.getElementById("user-label__bid");
const bidInput = document.querySelector(".user-input__bid-amount");
const bidSubmit = document.querySelector(".bid-submit");
const modalGreeting = document.querySelector(".modal-bid__greeting");
const greetHeading = document.querySelector(".head-greet");
const greetParagraph = document.querySelector(".para-greet");
const boughtSpan = document.querySelector(".bought-info");
const modalBidClose = document.getElementById("modal-bid__close");

const assetListBtn = document.querySelector(".asset-list__img");
const assetInfoContainer = document.querySelector(".asset-info__container");
const assetListModal = document.querySelector(".asset-list__container");
const assetModalMessage = document.querySelector(".asset-message");
const assetModalClose = document.getElementById("modal-asset__close");
const assetListContainer = document.querySelector(".list-container");
const restartBtn = document.querySelector(".btn--restart");
// const confirmationContainer = document.querySelector(".confirmation-container");
// const yesSellBtn = document.querySelector(".yes-sell__btn");
// const noSellBtn = document.querySelector(".no-sell__btn");

const playersAssetElements = [[], []];
const playersSellButtons = [[], []];

String.prototype.capitalize = function () {
  return this.charAt(0).toUpperCase() + this.slice(1);
};

// const assetList = document.querySelector("game-guide-controls");

//TODO
// const startTimerFor = function (secs) {
//   let timeInString;
//   function showCountDown() {
//     if (secs === 0) timeInString = "START!";
//     else timeInString = (secs--).toString();
//     countDownTimer.textContent = timeInString;
//   }

//   // console.log(playerOne, playerTwo);
//   let value = setInterval(showCountDown, 800);

//   return new Promise(function (resolve) {
//     setTimeout(() => resolve(value), (secs + 1) * 1000);
//   });
// };

// program starts here
// startTimerFor(3).then((value) => {
//   clearInterval(value);
//   // firstOverlay.classList.add("hidden");
//   // countDownTimer.classList.add("hidden");
//   // initializeGame();
// });

firstOverlay.classList.add("hidden");
countDownTimer.classList.add("hidden");
initializeGame();

function addTokenStyles(token, player) {
  token.classList.add("circle");
  token.style.backgroundColor = player.color;
  token.style.border = `1.5px solid #1b1b1b`;
  token.style.boxShadow = `1px 1px 0px 2px ${player.color}`;
}

function createPlayerToken(player, i) {
  const token = document.createElement("div");
  token.textContent = player.username.capitalize()[0];
  addTokenStyles(token, player);
  token.setAttribute("id", `token-${numOfCellsInWords[i]}`);
  return token;
}

function createPlayerDataAndTokens() {
  players = JSON.parse(localStorage.getItem("players"));

  // initilizing more data props and creating token element
  players.forEach((player, i) => {
    const initialWorth = { balance: 2500.0, assets: 0, assetsWorth: 0.0 };
    player.worth = initialWorth;
    playersToken.push(createPlayerToken(player, i));
  });
}

function createTokenContainer() {
  const tokenContainer = document.createElement("div");
  tokenContainer.classList.add("token-container");
  return tokenContainer;
}

function displayPlayersWorth({ balance: playerBalance, assets: playerAssets }) {
  balance.textContent = `$${playerBalance}`;
  assets.textContent = `${playerAssets}`;
}

function showCurrentPlayerInfo(turn) {
  playerName.textContent = players[turn].username;
  displayPlayersWorth(players[turn].worth);
}

function toggleRollBtn(isEnabled) {
  isEnabled
    ? rollDiceBtn.removeAttribute("disabled")
    : rollDiceBtn.setAttribute("disabled", true);
}

// here the main game starts
function initializeGame() {
  playerIndex = 0;
  createPlayerDataAndTokens();

  const tokenContainerBoth = createTokenContainer();
  playersToken.forEach((pElement) => {
    tokenContainerBoth.appendChild(pElement);
  });

  // adding token container to start cell in DOM
  blockArray[0].insertBefore(tokenContainerBoth, blockArray[0].children[0]);
  // displayPlayersWorth(players[0].worth);

  showCurrentPlayerInfo(playerIndex);
  // enableRollBtn = true;
  toggleRollBtn(true);
}

function extractNumber(numString) {
  return Number.parseInt(numString.replace(/\D/g, ""));
}

// function checkNonBuyable() {
//   return nonBuyable.includes(currentCellProperties.cellName);
// }

function checkNonBuyable() {
  return !currentCellProperties.hasOwnProperty("isBought");
}

function randomDieRoll() {
  return Math.trunc(Math.random() * 6) + 1;
}

function setDiceImgInDOM(dieOne, dieTwo) {
  dices[0].src = `../images/dice/${dieOne}.png`;
  dices[1].src = `../images/dice/${dieTwo}.png`;
}

const getCurrentPlayerIndex = () => (isPlayerOneTurn ? 0 : 1);

function calcCellIndex(steps, turn) {
  const designatedCell = steps + playersCellNumber[turn];
  playersCellNumber[turn] = designatedCell % numOfCells;
  return playersCellNumber[turn];
}

function showModalWindowFor(idName, injectHtml) {
  if (injectHtml) {
    modalPriceInfo.classList.remove("hidden");
    modalPriceInfo.innerHTML = injectHtml;
  }
  firstOverlay.classList.remove("hidden");
  modalWindow.classList.remove("hidden");
  modalWindow.setAttribute("id", idName);
}

function initializeJailModal() {
  questionnaire.textContent = `Do you wanna get out from this jail?`;
  if (currentCellProperties.price) {
    let injectHtml = `<span>Bailing Price: $${currentCellProperties.price}</span>`;
    showModalWindowFor("jail-modal", injectHtml);
    isModalOpen = true;
  }
}

function inJailActions(cellIdx) {
  // stops current player to move
  playersCellNumber[playerIndex] = playersPrevCellNumber[playerIndex];

  currentCellProperties = getCurrentCellProperties(cellIdx);
  // console.log(playersCellNumber[turn]);
  initializeJailModal();
}

function getTextByClassName(currentCell, className) {
  const element = document.querySelector(
    `#${currentCell.getAttribute("id")} .${className}`
  );
  return element?.textContent.toLowerCase();
}

function getPrice(cellIdx) {
  // console.log(blockArray[cellIdx]);
  const priceText = getTextByClassName(blockArray[cellIdx], "price-tag");
  // if priceText is not undefined extract number from it
  return priceText ? Number.parseInt(priceText.replace(/\D/g, "")) : undefined;
}

function getCurrentCellProperties(cellIdx) {
  let titleText = getTextByClassName(blockArray[cellIdx], "main-tag");
  let price = +getPrice(cellIdx);
  let id = +blockArray[cellIdx].getAttribute("data-id");
  if (!price) return { id, cellName: titleText };
  else if (!blockArray[cellIdx].hasAttribute("data-isBought"))
    return { id, cellName: titleText, price };
  else {
    let isBought =
      blockArray[cellIdx].getAttribute("data-isBought") === "false"
        ? false
        : true;
    return { id, cellName: titleText, price, isBought };
  }
}

function addOrDeductBalance(price) {
  players[playerIndex].worth.balance += price;
  displayPlayersWorth(players[playerIndex].worth);
}

function goToJail() {
  playersPrevCellNumber[playerIndex] = playersCellNumber[playerIndex];
  playersInJail[playerIndex] = true;
}

function handleNonBuyableCellActions(cellName, price) {
  if (cellName === "chest") {
    addOrDeductBalance(price);
    // players[playerIndex].worth.balance += price;
    // displayPlayersWorth(players[playerIndex].worth);
  } else if (
    cellName === "pay tax" ||
    cellName === "station" ||
    cellName === "petrol"
  ) {
    addOrDeductBalance(-price);
    // players[playerIndex].worth.balance -= price;
    // displayPlayersWorth(players[playerIndex].worth);
  } else if (cellName === "extra chance") {
    isExtraChance = true;
  } else if (cellName === "jail" && !playersInJail[playerIndex]) goToJail();
  else if (cellName === "go to jail") {
    cellIdx = +blockArray[cellIdx].getAttribute("data-jailId") - 1;
    playersCellNumber[playerIndex] = cellIdx;
    goToJail();
  }
}

// removing player token from its current cell
function removeTokenFromContainer(parentElement, childElement) {
  Array.from(parentElement.children)
    .find((child) => child === childElement)
    .remove();
}

// add token to specified cell
function addTokenContainerToCell(cellPosition, token) {
  if (cellPosition.firstElementChild.classList.contains("token-container")) {
    cellPosition.firstElementChild.appendChild(token);
  } else {
    const tokenContainer = createTokenContainer();
    tokenContainer.appendChild(token);
    cellPosition.insertBefore(tokenContainer, cellPosition.children[0]);
  }
}

function changeTokenPosition(cellIdx) {
  const tokenContainer = playersToken[playerIndex].parentNode;
  removeTokenFromContainer(tokenContainer, playersToken[playerIndex]);
  tokenContainer.children.length ? null : tokenContainer.remove();

  playersCellContainer[playerIndex] = blockArray[cellIdx];
  // console.log(playersCellContainer[turn]);
  addTokenContainerToCell(
    playersCellContainer[playerIndex],
    playersToken[playerIndex]
  );
}

function resetButtons() {
  buyBtn.setAttribute("disabled", true);
  // sellBtn.setAttribute("disabled", true);
  bidBtn.setAttribute("disabled", true);
}

function buttonControlHandler() {
  resetButtons();
  if (
    currentCellProperties.hasOwnProperty("isBought") &&
    !currentCellProperties.isBought
  ) {
    buyBtn.removeAttribute("disabled");
    bidBtn.removeAttribute("disabled");
  }
  // if (currentCellProperties.hasOwnProperty("isBought")) {
  //   if (
  //     currentCellProperties.isBought &&
  //     playerAcquisition[turn].hasOwnProperty(currentCellProperties.cellName)
  //   )
  //     sellBtn.removeAttribute("disabled");
  //   else {
  // buyBtn.removeAttribute("disabled");
  // bidBtn.removeAttribute("disabled");
  //   }
  // }
}

const switchPlayerIndex = (currIndex) => (currIndex ? 0 : 1);

//ERROR Caught
function getRentPrice() {
  const index = switchPlayerIndex(playerIndex);
  console.log(`playerIndex: ${playerIndex}, index: ${index}`);
  const cellData = playerAcquisition[index].find(
    (item) => item.id === currentCellProperties.id
  );
  console.log(cellData);
  return cellData.rentPrice;
}

function checkPlayerBalance(amount, index = playerIndex) {
  return players[index].worth.balance >= amount;
}

function payRentActions(rentPrice) {
  addOrDeductBalance(-rentPrice);
  const index = switchPlayerIndex(playerIndex);
  players[index].worth.balance += rentPrice;
}

function gameOver() {
  location.href = "./../game-over/index.html";
}

function takeRent() {
  const rentAmount = getRentPrice();
  if (checkPlayerBalance(rentAmount)) {
    payRentActions(rentAmount);
    isRentPending = false;
    // enableRollBtn = true;
    toggleRollBtn(true);
  } else {
    if (!(players[playerIndex].worth.assetsWorth >= rentAmount)) {
      // GAME OVER
      gameOver();
      console.log("game over");
    }
  }
}

// TODO
function rentHandler() {
  // is current cell bought
  if (currentCellProperties?.isBought) {
    // if current player doesn't own current cell
    if (!players[playerIndex].assetId?.includes(currentCellProperties.id)) {
      isRentPending = true;
      takeRent();
    } else toggleRollBtn(true);
  }
}

// for moving player token from one cell to specified
function playerMoveActions(cellIdx, turn) {
  let enableRollBtn;

  if (playersInJail[playerIndex]) {
    inJailActions(cellIdx);
    return;
  }
  currentCellProperties = getCurrentCellProperties(cellIdx);

  if (!currentCellProperties.hasOwnProperty("isBought")) {
    handleNonBuyableCellActions(
      currentCellProperties.cellName,
      currentCellProperties.price
    );
    enableRollBtn = true;
  } else {
    enableRollBtn = false;
  }

  // console.log(currentCellProperties);

  changeTokenPosition(cellIdx);

  buttonControlHandler(turn);
  rentHandler();
  toggleRollBtn(enableRollBtn);
}

function clearAssetListFromDOM() {
  const elements = assetListContainer.getElementsByClassName("asset-list");
  while (elements.length > 0) {
    elements[0].parentNode.removeChild(elements[0]);
  }
}

rollDiceBtn.addEventListener("click", () => {
  const randDieOne = randomDieRoll();
  const randDieTwo = randomDieRoll();
  // const randDieOne = 2;
  // const randDieTwo = 2;
  const totalStepsToTake = randDieOne + randDieTwo;
  // guidingText.textContent = "To guide you";

  setDiceImgInDOM(randDieOne, randDieTwo);

  isRecentlyBought = false;

  // only for one cell which has an extra chance
  // in that case DO NOT swtich player chances
  // otherwise just swtich players
  isExtraChance
    ? (isExtraChance = false)
    : (isPlayerOneTurn = !isPlayerOneTurn);

  playerIndex = getCurrentPlayerIndex();
  const cellIdx = calcCellIndex(totalStepsToTake, playerIndex);

  playerMoveActions(cellIdx, playerIndex);
  showCurrentPlayerInfo(playerIndex);

  // isAssetClicked = false;
  clearAssetListFromDOM();
});

const rentPercentage = 20;
const sellPercentage = 50;

const calcPrice = (amount, percent) => {
  const price = (percent * amount) / 100;
  return price.toFixed(2);
};

buyBtn.addEventListener("click", function () {
  // currentCellProperties.price = +getPrice(playerIndex);
  const rentPrice = +calcPrice(currentCellProperties.price, rentPercentage);
  questionnaire.textContent = `Are you sure you wanna buy this property?`;
  if (currentCellProperties.price) {
    let injectHtml = `<span>Buy Price: $${currentCellProperties.price}</span>
                      <span>Rent Price: $${rentPrice}</span>`;
    showModalWindowFor("buy-modal", injectHtml);
    isModalOpen = true;
  }
});

// sellBtn.addEventListener("click", function () {
//   const cityName = currentCellProperties.cellName;
//   const sellingPrice = playerAcquisition[playerIndex][cityName].sell;
//   questionnaire.textContent = `Are you sure you wanna sell this property?`;
//   let injectHtml = `<span>Buy Price: $${sellingPrice}</span>`;
//   showModalWindowFor("sell-modal", injectHtml);
//   isModalOpen = true;
// });

bidBtn.addEventListener("click", function () {
  questionnaire.textContent = `Are you sure you wanna bid on this property?`;
  showModalWindowFor("bid-modal", "");
  isModalOpen = true;
  isBidPlaced = false;
});

function buyAsset(turn, price, fromBuy) {
  const cellIndex = !fromBuy ? (turn ? 0 : 1) : turn;
  players[turn].worth.balance -= price;
  players[turn].worth.assetsWorth += +calcPrice(price, sellPercentage);
  players[turn].worth.assets += 1;
  !players[turn].assetId ? (players[turn].assetId = []) : null;
  players[turn].assetId.push(
    +playersCellContainer[cellIndex].getAttribute("data-id")
  );
  playersCellContainer[cellIndex].setAttribute("data-isBought", true);
}

function getAcquisitionInfo(turn, buyPrice, fromBuy) {
  turn = !fromBuy ? (turn ? 0 : 1) : turn;
  const id = +playersCellContainer[turn].getAttribute("data-id");
  const originalPrice = +getPrice(id - 1);
  const cityName = getTextByClassName(playersCellContainer[turn], "main-tag");
  const sellPrice = +calcPrice(buyPrice, sellPercentage);
  const rentPrice = +calcPrice(originalPrice, rentPercentage);
  return {
    id,
    cityName,
    buyPrice,
    sellPrice,
    rentPrice,
  };
}

function buyActions(price, index = playerIndex, fromBuy = true) {
  if (checkPlayerBalance(price, index)) {
    buyAsset(index, price, fromBuy);
    fromBuy ? displayPlayersWorth(players[index].worth) : null;
    playerAcquisition[index].push(getAcquisitionInfo(index, price, fromBuy));
    // console.log(playerAcquisition[index]);
    // Object.assign(playerAcquisition[index], getAcquisitionInfo(index, price));
    currentCellProperties.isBought = true;
    isRecentlyBought = true;
    // enableRollBtn = true;
    toggleRollBtn(true);
    buttonControlHandler(index);
  } else {
    guidingText.textContent = "You don't have enough balance to buy";
  }
}

let stopIntervalTimer, stopTimeOutTimer;
let biddingCity, currentBidPlayerIndex, prevBidPlayerIndex;

function startPlayerTimer(secs) {
  // let seconds = secs;
  stopIntervalTimer = setInterval(() => (bidTimer.textContent = secs--), 1000);
  stopTimeOutTimer = setTimeout(() => {
    console.log("5 secs passed");
    if (!isBidPlaced) {
      clearInterval(stopIntervalTimer);
      bidTimer.textContent = "";
      playerWonBidActions();
      enableRollBtn = true;
      toggleRollBtn();
    }
  }, (secs + 1) * 1000);
  // startBidTimer(5, bidTimer).then((value) => {
  //   clearInterval(value);
  //   bidTimer.textContent = "";
  //   if (!isBidPlaced) {
  // playerWonBidActions();
  // enableRollBtn = true;
  // toggleRollBtn();
  //     // setBiddingText(`you lost the bid from your opponent for ${biddingCity}`);
  //     // bidInput.setAttribute("disabled", true);
  //   }
  // });
}

function closeModal(isBid) {
  modalPriceInfo.innerHTML = "";
  modalPriceInfo.classList.add("hidden");
  isBid ? null : firstOverlay.classList.add("hidden");
  isBid ? null : modalBid.classList.add("hidden");
  modalWindow.classList.add("hidden");
  isModalOpen = false;
}

function showBidModal() {
  firstOverlay.classList.remove("hidden");
  modalBid.classList.remove("hidden");
  modalBidClose.classList.add("hidden");
}

function createBidPlayersState() {
  biddingCity = currentCellProperties.cellName;
  prevBidPlayerIndex = 0;
  currentBidPlayerIndex = 1;
  const bidPlayerOneIndex = playerIndex;
  const bidPlayerTwoIndex = playerIndex ? 0 : 1;
  // currentBidPlayerIndex = playerIndex;
  // const bidPlayerOneIndex = currentBidPlayerIndex;
  // const bidPlayerTwoIndex = playerIndex ? 0 : 1;
  bidPlayers = [
    {
      id: bidPlayerOneIndex,
      username: players[bidPlayerOneIndex].username,
      bidPrice: 0,
    },
    {
      id: bidPlayerTwoIndex,
      username: players[bidPlayerTwoIndex].username,
      bidPrice: 0,
    },
  ];
}

function displayBidPlayerInfo(prevPlayerIndex) {
  bidPlayerName.textContent = bidPlayers[prevPlayerIndex].username;
  biddingText.textContent = `Bids $${
    bidPlayers[prevPlayerIndex].bidPrice
  } for ${biddingCity.capitalize()}`;
  bidLabel.textContent = `${bidPlayers[currentBidPlayerIndex].username} place your bid amount`;
  bidInput.focus();
}

function initializeBidModal() {
  const initialBidAmount = 1;
  if (checkPlayerBalance(initialBidAmount)) {
    createBidPlayersState();
    bidPlayers[prevBidPlayerIndex].bidPrice = initialBidAmount;
    displayBidPlayerInfo(prevBidPlayerIndex);
  }
}

function bidActions() {
  startPlayerTimer(5);
  closeModal();
  showBidModal();
  initializeBidModal();
}

function fineActions() {
  const fineCharge = currentCellProperties.price;
  if (checkPlayerBalance(fineCharge)) {
    players[playerIndex].worth.balance -= fineCharge;
    playersInJail[playerIndex] = false;
    displayPlayersWorth(players[playerIndex].worth);
    // enableRollBtn = true;
    toggleRollBtn(true);
  }
}

function actionToBeTaken(action) {
  if (action === "buy") buyActions(currentCellProperties.price);
  else if (action === "bid") bidActions();
  else if (action === "jail") fineActions();
}

yesBtn.addEventListener("click", function (e) {
  const modalAttr = e.target.parentElement.parentElement.getAttribute("id");
  const action = actionsList.find((act) => modalAttr.includes(act));
  actionToBeTaken(action);
  closeModal(action === "bid");
});

function removeBidContent() {
  userBidDiv.classList.add("hidden");
  userBidInputDiv.classList.add("hidden");
  bidSubmit.classList.add("hidden");
  modalGreeting.classList.remove("hidden");
}

function wonBidMessage() {
  greetHeading.textContent = `Congratulations ${bidPlayers[prevBidPlayerIndex].username},`;
  greetParagraph.textContent = `You successfully won this bid from ${bidPlayers[currentBidPlayerIndex].username}`;
  boughtSpan.textContent = `You own ${biddingCity.capitalize()}.`;
}

function showInitialBidModal() {
  modalGreeting.classList.add("hidden");
  bidTimerDiv.classList.remove("hidden");
  userBidDiv.classList.remove("hidden");
  userBidInputDiv.classList.remove("hidden");
  bidSubmit.classList.remove("hidden");
}

function addCloseButton() {
  bidTimerDiv.classList.add("hidden");
  modalBidClose.classList.remove("hidden");

  modalBidClose.addEventListener("click", function () {
    closeModal();
    showInitialBidModal();
  });
}

function playerWonBidActions() {
  clearTimeout(stopTimeOutTimer);
  clearInterval(stopIntervalTimer);
  removeBidContent();
  buyActions(
    bidPlayers[prevBidPlayerIndex].bidPrice,
    bidPlayers[prevBidPlayerIndex].id,
    playerIndex === bidPlayers[prevBidPlayerIndex].id
  );
  wonBidMessage();
  addCloseButton();
}

bidSubmit.addEventListener("click", function () {
  isBidPlaced = true;
  const enteredAmount = Number(bidInput.value);
  bidPlayers[currentBidPlayerIndex].bidPrice = enteredAmount;
  const hasBalance = checkPlayerBalance(
    enteredAmount,
    bidPlayers[currentBidPlayerIndex].id
  );
  if (!hasBalance || enteredAmount <= bidPlayers[prevBidPlayerIndex].bidPrice) {
    playerWonBidActions();
    // enableRollBtn = true;
    toggleRollBtn(true);
  } else {
    isBidPlaced = false;
    clearTimeout(stopTimeOutTimer);
    clearInterval(stopIntervalTimer);
    startPlayerTimer(5);
    prevBidPlayerIndex = currentBidPlayerIndex;
    currentBidPlayerIndex = switchPlayerIndex(currentBidPlayerIndex);
    displayBidPlayerInfo(prevBidPlayerIndex);
  }
  bidInput.value = "";
  buttonControlHandler(playerIndex);
});

// function sellAsset(cityName) {
//   const sellingPrice = playerAcquisition[playerIndex][cityName].sell;
//   players[playerIndex].worth.assets -=
//     playerAcquisition[playerIndex][cityName].buy;
//   players[playerIndex].worth.balance += sellingPrice;
//   delete playerAcquisition[playerIndex][cityName];
// }

// function buyAsset(turn, price, fromBuy) {
//   const cellIndex = !fromBuy ? (turn ? 0 : 1) : turn;
//   players[turn].worth.balance -= price;
//   players[turn].worth.assetsWorth += +calcPrice(price, sellPercentage);
//   players[turn].worth.assets += 1;
//   !players[turn].assetId ? (players[turn].assetId = []) : null;
//   players[turn].assetId.push(
//     +playersCellContainer[cellIndex].getAttribute("data-id")
//   );
//   playersCellContainer[cellIndex].setAttribute("data-isBought", true);
// }

function sellAsset(turn, price, id) {
  players[turn].worth.balance += +price;
  players[turn].worth.assetsWorth -= +price;

  const soldEl = blockArray[id - 1];
  soldEl.setAttribute("data-isBought", false);

  const index = players[turn].assetId.indexOf(id);
  players[turn].assetId.splice(index, 1);

  players[turn].worth.assets -= 1;
  playersCellContainer[turn].setAttribute("data-isBought", false);
}

function sellActions(index) {
  // if (isRecentlyBought) {
  //   closeModal();
  //   guidingText.textContent = "You can only transact for once in a move!";
  // } else {
  //   sellAsset(currentCellProperties.cellName);
  //   displayPlayersWorth(players[playerIndex].worth);
  //   enableRollBtn = true;
  //   toggleRollBtn();
  //   buttonControlHandler(playerIndex);
  // }
  // console.log(index);
  // console.log(playerAcquisition[playerIndex][index]);
  // console.log(playerAcquisition[playerIndex]);
  sellAsset(
    playerIndex,
    playerAcquisition[playerIndex][index].sellPrice,
    playerAcquisition[playerIndex][index].id
  );
  displayPlayersWorth(players[playerIndex].worth);
  // enableRollBtn = true;
  // toggleRollBtn();
  buttonControlHandler(playerIndex);
}

// const startBidTimer = function (secs) {
//   let value = setInterval(() => (bidTimer.textContent = secs--), 1000);

//   return new Promise(function (resolve) {
//     setTimeout(() => resolve(value), (secs + 1) * 1000);
//   });
// };

function clearBidInput() {
  bidInput.value = "";
}

modalClose.addEventListener("click", function () {
  closeModal();
});

cancelBtn.addEventListener("click", function () {
  closeModal();
});

assetModalClose.addEventListener("click", function () {
  assetListModal.classList.add("hidden");
  firstOverlay.classList.add("hidden");
  playersSellButtons[playerIndex].forEach((sellBtn) => {
    sellBtn.removeEventListener("click", onSellBtnClick);
  });
});

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && isModalOpen) closeModal();
});

function toggleAssetInfo(elementToShow = "") {
  if (elementToShow === "messageModal") {
    assetModalMessage.classList.remove("hidden");
    assetInfoContainer.classList.add("hidden");
  } else {
    assetModalMessage.classList.add("hidden");
    assetInfoContainer.classList.remove("hidden");
  }
}

function toggleAssetModal(assetLength) {
  if (!assetLength) {
    toggleAssetInfo("messageModal");
  } else {
    toggleAssetInfo("infoContainer");
  }
}

function showAssetModal(assetsAcquired) {
  firstOverlay.classList.remove("hidden");
  assetListModal.classList.remove("hidden");
  toggleAssetModal(assetsAcquired);
}

function showAssetListInDOM() {
  console.log(playersAssetElements[playerIndex]);
  // console.log(blockArray);
  playersAssetElements[playerIndex].forEach((el) => {
    assetListContainer.insertAdjacentElement("beforeend", el);
  });
}

function createConfirmation(triggeredBtn) {
  const confirmText = document.createElement("span");
  confirmText.textContent = "Are you sure you wanna sell?";
  const yesSellBtn = document.createElement("button");
  yesSellBtn.classList.add("yes-sell__btn");
  yesSellBtn.textContent = "Yes";
  yesSellBtn.setAttribute(
    "data-listID",
    triggeredBtn.getAttribute("data-btnID")
  );
  const noSellBtn = document.createElement("button");
  noSellBtn.classList.add("no-sell__btn");
  noSellBtn.textContent = "No";
  const container = document.createElement("div");
  container.classList.add("confirmation-container");
  container.append(confirmText);
  container.append(yesSellBtn);
  container.append(noSellBtn);
  return container;
}

function listenToConfirmButtons(parentContainer) {
  const yesBtn = parentContainer.querySelector(".yes-sell__btn");
  const noBtn = parentContainer.querySelector(".no-sell__btn");
  noBtn.addEventListener("click", () => {
    parentContainer.nextElementSibling.classList.remove("hidden");
    parentContainer.remove();
  });
  yesBtn.addEventListener("click", (event) => {
    const id = yesBtn.getAttribute("data-listID");

    // Delete list from DOM
    parentContainer.nextElementSibling.remove();
    parentContainer.remove();

    console.log(playersAssetElements[playerIndex]);
    // Delete element from playersAssetElements
    const index = playersAssetElements[playerIndex].findIndex(
      (el) => el.getAttribute("data-listID") === id
    );
    playersAssetElements[playerIndex].splice(index, 1);

    // sellAsset(playerIndex, playerAcquisition[playerIndex][index].sellPrice);
    sellActions(index);
    if (isRentPending) {
      takeRent();
      // if (players[playerIndex].worth.assetsWorth >=);
    }
    // Delete item from playerAcquisition
    playerAcquisition[playerIndex].splice(index, 1);

    if (!playersAssetElements[playerIndex].length) toggleAssetModal(0);
  });
}

function onSellBtnClick(event) {
  if (event.target === this) {
    this.parentElement.classList.add("hidden");
    const container = createConfirmation(this);
    this.parentElement.insertAdjacentElement("beforebegin", container);
    listenToConfirmButtons(container);
  }
}

function listenToSellButtons() {
  playersSellButtons[playerIndex].forEach((sellBtn) => {
    sellBtn.addEventListener("click", onSellBtnClick);
  });
}

function createNewAssetListItem(index) {
  const citySpan = document.createElement("span");
  citySpan.textContent =
    playerAcquisition[playerIndex][index].cityName.capitalize();
  const sellSpan = document.createElement("span");
  sellSpan.textContent = playerAcquisition[playerIndex][index].sellPrice;
  const sellBtn = document.createElement("button");
  sellBtn.textContent = "Sell";
  sellBtn.classList.add("sell-btn");
  sellBtn.setAttribute("data-btnID", playerAcquisition[playerIndex][index].id);
  playersSellButtons[playerIndex].push(sellBtn);
  const assetListItem = document.createElement("div");
  assetListItem.classList.add("asset-list");
  assetListItem.setAttribute(
    "data-listID",
    playerAcquisition[playerIndex][index].id
  );
  assetListItem.append(citySpan);
  assetListItem.append(sellSpan);
  assetListItem.append(sellBtn);
  return assetListItem;
}

const addNewListItem = (listItem) =>
  playersAssetElements[playerIndex].push(listItem);

assetListBtn.addEventListener("click", function () {
  showAssetModal(playerAcquisition[playerIndex].length);
  // if (
  //   playerAcquisition[playerIndex].length ===
  //   playersAssetElements[playerIndex].length &&
  //   !isAssetClicked
  // ) showAssetListInDOM();
  const acquiredAssets = playerAcquisition[playerIndex].length;
  const assetElements = playersAssetElements[playerIndex].length;
  if (acquiredAssets !== assetElements) {
    for (let i = assetElements; i < acquiredAssets; i++)
      addNewListItem(createNewAssetListItem(i));
    // showAssetListInDOM();
  }
  showAssetListInDOM();
  listenToSellButtons();
  // isAssetClicked = true;
});

restartBtn.addEventListener("click", function () {
  window.location.href = window.location.href;
  // location.href = "./../index.html";
});

// if (!playerAcquisition[playerIndex]) {
//   toggleAssetInfo("messageModal");
// } else {
//   toggleAssetInfo("infoContainer");
//   playersAssetElements[playerIndex] = playerAcquisition[playerIndex].map(
//     (cellData) => {
//       const citySpan = document.createElement("span");
//       citySpan.textContent = cellData.cityName.capitalize();
//       const sellSpan = document.createElement("span");
//       sellSpan.textContent = cellData.sellPrice;
//       const sellBtn = document.createElement("button");
//       sellBtn.textContent = "Sell";
//       sellBtn.setAttribute("data-btnID", cellData.id);
//       const assetList = document.createElement("div");
//       assetList.classList.add("asset-list");
//       assetList.append(citySpan);
//       assetList.append(sellSpan);
//       assetList.append(sellBtn);
//       assetListContainer.insertAdjacentElement("beforeend", assetList);
//       return assetList;
//     }
//   );
// }
//     const length = playersAssetElements[playerIndex].length;
//     const lastAssetList = playersAssetElements[playerIndex][length - 1];
//     console.log(lastAssetList);
//     console.log(
//       lastAssetList.getElementsByTagName("button")[0].getAttribute("data-btnID")
//     );

// const startBidTimer = function (secs) {
// let value = setInterval(() => (bidTimer.textContent = secs--), 1000);

//   return new Promise(function (resolve) {
//     setTimeout(() => resolve(value), (secs + 1) * 1000);
//   });
// };

// startBidTimer(10, bidTimer).then((value) => {
//   clearInterval(value);
//   if (!isBidPlaced) {
//     setBiddingText(`you lost the bid from your opponent for ${biddingCity}`);
//     bidInput.setAttribute("disabled", true);
//   }
// });

// function resetButtonsFor(turn, isRecentlyBought = false) {
//   if (playersCellContainer[turn].hasAttribute("data-isBought")) {
//     if (playersCellContainer[turn].getAttribute("data-isBought") === "true") {
//       if (isRecentlyBought) {
//         buyBtn.setAttribute("disabled", true);
//         bidBtn.setAttribute("disabled", true);
//       } else sellBtn.removeAttribute("disabled");
//     } else {
//       buyBtn.removeAttribute("disabled");
//       bidBtn.removeAttribute("disabled");
//     }
//   }
// }

// line 338
// const startBidTimer = function (secs) {
//   let value = setInterval(() => (bidTimer.textContent = secs--), 1000);

//   return new Promise(function (resolve) {
//     setTimeout(() => resolve(value), (secs + 1) * 1000);
//   });
// };

// let bidPlayerOneIndex,
//   bidPlayerTwoIndex,
//   isBidPlaced = false,
//   biddingCity;

// function createBidPlayersState() {
//   biddingCity = currentCellProperties.cellName;
//   currentBidPlayerIndex = playerIndex ? 0 : 1;
//   bidPlayerOneIndex = playerIndex;
//   bidPlayerTwoIndex = currentBidPlayerIndex;
//   bidPlayers = [
//     {
//       id: bidPlayerOneIndex,
//       username: players[bidPlayerOneIndex].username,
//       balance: players[bidPlayerOneIndex].worth.balance,
//       bidPrice: 0,
//     },
//     {
//       id: bidPlayerTwoIndex,
//       username: players[bidPlayerTwoIndex].username,
//       balance: players[bidPlayerTwoIndex].worth.balance,
//       bidPrice: 0,
//     },
//   ];
// }

// function playerHasBalance(bidAmount) {
//   return players[playerIndex].worth.balance >= bidAmount;
// }

// function showBidModal() {
//   firstOverlay.classList.remove("hidden");
//   modalBid.classList.remove("hidden");
// }

// function setBiddingText(message) {
//   biddingText.textContent = message;
// }

// function displayBidModalInfo(name, message) {
//   // const currentPlayerName = bidPlayers[currentBidPlayerIndex].username;
//   bidPlayerName.textContent = name;
//   setBiddingText(message);
// }

// function getBidPlayerName() {
//   return bidPlayers[currentBidPlayerIndex].username;
// }

// bidBtn.addEventListener("click", function () {
//   const initialBidPrice = 1;
//   if (playerHasBalance(initialBidPrice)) {
//     createBidPlayersState();
//     showBidModal();

//     const currentPlayerName = getBidPlayerName();
//     const message = `${currentPlayerName} bids $${initialBidPrice} for ${biddingCity}`;

//     displayBidModalInfo(currentPlayerName, message);
// startBidTimer(10, bidTimer).then((value) => {
//   clearInterval(value);
//   if (!isBidPlaced) {
//     setBiddingText(
//       `you lost the bid from your opponent for ${biddingCity}`
//     );
//     bidInput.setAttribute("disabled", true);
//   }
// });
//   }
// });

// function checkPlayerBalance(amount) {
//   if (playersWorth[biddingPlayerIndex].balance >= amount) {
//     console.log(true);
//   }
//   return true;
// }

// function updateBidModal() {
//   const currentPlayerName = bidPlayers[currentBidPlayerIndex].username;
//   const prevBidPrice = bidPlayers[currentBidPlayerIndex]
//   bidPlayerName.textContent = currentPlayerName;
//   biddingText.textContent = `${currentPlayerName} bids $${} for ${currentCellProperties.cellName}`;
// }

// function getOpponentPlayerIndex(currIndex) {
//   return currIndex ? 0 : 1;
// }

// bidButton.addEventListener("click", function () {
//   isBidPlaced = true;
//   const enteredAmount = Number(bidInput.value);
//   bidPlayers[currentBidPlayerIndex].bidPrice = enteredAmount;
//   if (playerHasBalance(enteredAmount)) {
//     const prevPlayerIndex = currentBidPlayerIndex;
//     currentBidPlayerIndex = currentBidPlayerIndex ? 0 : 1;
//     const currentPlayerName = getBidPlayerName();
//     const message = `${currentPlayerName} bids $${bidPlayers[prevPlayerIndex].bidPrice} for ${biddingCity}`;

//     displayBidModalInfo(currentPlayerName, message);
//   } else {
//     const opponentPlayerIndex = getOpponentPlayerIndex(currentBidPlayerIndex);
//     console.log(players[opponentPlayerIndex]);
//     players[opponentPlayerIndex].worth.balance -=
//       bidPlayers[opponentPlayerIndex].bidPrice;
//     console.log(players[opponentPlayerIndex]);

//     biddingText.textContent = `You don't have that much money, you lost this bid from your opponent for ${currentCellProperties.cellName}`;
//   }
// });
