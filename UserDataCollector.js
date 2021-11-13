const body = document.querySelector("body");
const header = document.querySelector(".header");
const toggleTheme = document.getElementById("toggle-theme");
const circle = document.querySelector(".circle");
const modal = document.querySelector(".modal");
const form = document.getElementById("start-form");

let isOn = false;
toggleTheme.addEventListener("click", function (event) {
  if (!isOn) {
    isOn = true;
    circle.style.backgroundColor = "rgba(44, 44, 44, 0.8)";
    toggleTheme.style.backgroundColor = "rgba(64, 95, 180, 0.8)";
    body.style.backgroundColor = "#181818";
    header.style.backgroundColor = "#282828";
    circle.style.left = "1.725rem";
  } else {
    isOn = false;
    circle.style.backgroundColor = "rgba(211, 211, 211, 0.8)";
    toggleTheme.style.backgroundColor = "rgb(255,255, 255)";
    body.style.backgroundColor = "#ffffff";
    header.style.backgroundColor = "#666633";
    circle.style.left = "0";
  }
});

const pOneName = document.getElementById("player-one__name");
const p1InputColor = document.getElementById("player-one__color");
let pOneColor;
const pTwoName = document.getElementById("player-two__name");
const p2InputColor = document.getElementById("player-two__color");
let pTwoColor;

p1InputColor.addEventListener("click", function (event) {
  const inputHandler = handleInputColor.bind(this, event);
  pOneColor = inputHandler(p2InputColor);
});

p2InputColor.addEventListener("click", function (event) {
  const inputHandler = handleInputColor.bind(this, event);
  pTwoColor = inputHandler(p1InputColor);
});

const handleInputColor = function (event, p2InputColor) {
  event.preventDefault();
  let color;
  if (!event.target.classList.contains("not-allowed")) {
    removeClass(this.children, "outline");
    addClass(event.target);
    color = event.target.previousElementSibling.value;
    removeClass(p2InputColor.children, "not-allowed");
    addNotAllowedClass(p2InputColor.children, color);
  }
  return color;
};

function addClass(el) {
  if (el.classList.contains("square")) {
    el.classList.add("outline");
  }
}

function removeClass(radioInputs, className) {
  const label = Array.from(radioInputs);
  label.forEach((el) => {
    el.classList.contains(className) ? el.classList.remove(className) : null;
  });
}

function addNotAllowedClass(opponentRadioInput, pColor) {
  const oppositeChildren = Array.from(opponentRadioInput);
  oppositeChildren.forEach((el) => {
    if (el.value !== undefined && el.value === pColor) {
      el.nextElementSibling.classList.add("not-allowed");
    }
  });
}

function checkPlayerName(name) {
  return name.length > 20 ? `${name.slice(0, 11)}...` : name;
}

let players = [];

form.addEventListener("submit", function (e) {
  e.preventDefault();
  pOneColor = pOneColor ?? "#2f9e44";
  pTwoColor = pTwoColor ?? "#1971c2";
  players.push(createUserObjData(checkPlayerName(pOneName.value), pOneColor));
  players.push(createUserObjData(checkPlayerName(pTwoName.value), pTwoColor));
  pOneName.value = "";
  pTwoName.value = "";
  modal.style.display = "none";
  localStorage.setItem("players", JSON.stringify(players));
  location.href = "./main-game/index.html";
  // location.href = "./game-over/index.html";
});

const createUserObjData = function (username, color) {
  return {
    username,
    color,
  };
};
