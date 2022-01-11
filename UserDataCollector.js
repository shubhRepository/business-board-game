const body = document.querySelector("body");
const modal = document.querySelector(".modal");
const form = document.getElementById("start-form");
const pOneName = document.getElementById("p1-name");
const p1InputColor = document.getElementById("p1-color");
const pTwoName = document.getElementById("p2-name");
const p2InputColor = document.getElementById("p2-color");

const defaultColors = ["#2f9e44", "#1971c2"];
let pOneColor = defaultColors[0];
let pTwoColor = defaultColors[1];

const removeClass = (radioInputs, className) => {
  const label = Array.from(radioInputs);
  label.forEach((el) => {
    el.classList.contains(className) ? el.classList.remove(className) : null;
  });
};

const addClass = (el) => {
  if (el.classList.contains("square")) {
    el.classList.add("outline");
  }
};

const addNotAllowedClass = (opponentRadioInput, pColor) => {
  const oppositeChildren = Array.from(opponentRadioInput);
  oppositeChildren.forEach((el) => {
    // if (el.value !== undefined && el.value === pColor) {
    if (el?.value === pColor) {
      el.nextElementSibling.classList.add("not-allowed");
    }
  });
};

function handleInputColor(event, p2InputColor) {
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
}

p1InputColor.addEventListener("click", function (event) {
  const inputHandler = handleInputColor.bind(this, event);
  pOneColor = inputHandler(p2InputColor);
});

p2InputColor.addEventListener("click", function (event) {
  const inputHandler = handleInputColor.bind(this, event);
  pTwoColor = inputHandler(p1InputColor);
});

const checkPlayerName = (name) => {
  return name.length > 20 ? `${name.slice(0, 11)}...` : name;
};

const createUserObjData = (username, color) => {
  return {
    username,
    color,
  };
};

let players = [];

form.addEventListener("submit", function (e) {
  e.preventDefault();
  players.push(createUserObjData(checkPlayerName(pOneName.value), pOneColor));
  players.push(createUserObjData(checkPlayerName(pTwoName.value), pTwoColor));
  pOneName.value = "";
  pTwoName.value = "";
  modal.style.display = "none";
  localStorage.setItem("players", JSON.stringify(players));
  location.href = "./main-game/index.html";
});
