const Platform = require('./scripts/platform');
const Player = require('./scripts/player');
const Background = require('./scripts/menu');
const Birb = require('./scripts/birb');
const Game = require('./scripts/game');

const display = document.querySelector("canvas").getContext("2d");
const audioButton = document.getElementById("play-audio");
const audio = document.getElementById("music");

var player = new Player();  
var background = new Background();
var game = new Game();
// new GameView(game, ctx).start();

const platformWidth = 145;
const platformHeight = 15;
var displayWidth, displayHeight, controller, playerMaxCameraHeight;

let netPosition = 0;
let score = 0;
let highScore = 0;


function mainLoop() {
  if (!game.isPaused) {
    updatePlayerVelocity();
    updatePlayerPosition();
    checkBirbCollision();
    updateScore();
    toggleMenuOnSpace();
    updatePlayerAnimation();
    render();
    if (checkGameOver()) {
      gameOver();
    } else {
      toggleMenuOnSpace();
      window.requestAnimationFrame(mainLoop); 
    }
  }
}

background.backgroundSheet.addEventListener('load', () => {
  start();
  window.addEventListener("resize", resize);
  window.addEventListener("keydown", controller.keyUpDown);
  window.addEventListener("keyup", controller.keyUpDown); 
  window.requestAnimationFrame(mainLoop);
})
