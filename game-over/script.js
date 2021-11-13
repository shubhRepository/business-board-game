const restartBtn = document.querySelector(".restart--btn");
const startBtn = document.querySelector(".start--btn");

restartBtn.addEventListener("click", function () {
  location.href = "./../main-game/index.html";
  // window.location.href = window.location.href;
});

startBtn.addEventListener("click", function () {
  localStorage.removeItem("players");
  location.href = "./../index.html";
  // window.location.href = window.location.href;
});
