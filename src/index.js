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

function jump() {
  controller.up.active = false;
  player.jumping = true;
  player.onPlatform = -1;
  if (controller.down.active) {
    controller.down.active = false;
    player.unsquish();
    player.yVelocity -= SUPER_JUMP_VELOCITY;
  } else {
    player.yVelocity -= JUMP_INIT_VELOCITY;
  }
}

function updatePlayerVelocity() {
  if (controller.up.active && !player.jumping) jump();
  if (controller.left.active) moveLeft();
  if (controller.right.active) moveRight();

  player.applyGravity(GRAVITY);
  player.xVelocity *= DAMPEN;
}

function updatePlayerAnimation() {
  if (controller.left.active) {
    player.lookLeft();
  } else if (controller.right.active) {
    player.lookRight();
  }
  
  if (player.onPlatform !== -1) {
    (controller.down.active) ? player.squish() : player.unsquish();
  }
}

function handlePlayerDisplayEdgeBehavior() {
  if (!Game.DISPLAY_WRAP) {
    player.x = Math.min(Math.max(player.x, 0), displayWidth - player.width);
  }
  else {
    // TODO wrap logic
  }
}

function updatePlayerPosition() {
  player.x += player.xVelocity;
  playerMaxCameraHeight = (displayHeight * .5);

  if (player.isFalling()) {
    // handle high and low velocity cases
    if (player.yVelocity > platformHeight) {
      // if downward velocity is too high, it can clip through the platform
      // so chunk the velocity and apply iteratively to check for collisions
      let destY = player.y + player.yVelocity;
      let chunkSize = platformHeight / 2;
      let numChunks = (player.yVelocity / chunkSize) + 1;
      for (let i = 0; i < numChunks; i++) {
        player.y = Math.min(player.y + chunkSize, destY);
        if (checkPlatformCollision()) break;
      }
    } else {
      // if velocity is less than platformHeight, we can simply
      // add it and check for collision
      player.y += player.yVelocity;
      checkPlatformCollision();
    }
  } else {
    // Not falling, moving upwards and on flat ground
    if (player.y < playerMaxCameraHeight) {
      // if player is moving upwards and above a certain height threshold,
      // move the platforms and background instead
      moveCamera(player.yVelocity); // move objects in game downwards
      moveBackground(player.yVelocity);
    } else {
      player.y += player.yVelocity;
    }
  }
  handlePlayerDisplayEdgeBehavior();
}

function updateScore() {
  netPosition -= (player.yVelocity / 100);
  score = Math.max(score, netPosition);
}

function setPlayerInitialPosition() {
  player.x = game.platforms[game.maxPlatforms - 1].x + ((platformWidth - player.width) / 2);
  player.y = game.platforms[game.maxPlatforms - 1].top() -100;
}

function gameOver() {
  getHighScore();
  drawGameOver();
  window.requestAnimationFrame(gameOverLoop);
}

function loadStartScreen() {
  // TODO add character color options
  document.getElementById("menu").classList.toggle('active');
  drawInstructions();
  toggleMenuOnSpace();
}

function gameOverLoop(){
  if (controller.space.active) {
    restartGame();
    game.isPaused = false;
  } else {
    window.requestAnimationFrame(gameOverLoop);
  }
}

function render() {
  resize();
  drawBackground();
  drawPlatforms();
  drawPlayer();
  drawBirbs();
  drawScore();
}

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
  resize();
  loadStartScreen(); 
  generateInitialPlatforms();
  generateInitialBirbs();
  setPlayerInitialPosition();
  toggleMusic();
  toggleMenuOnClick();

  window.addEventListener("resize", resize);
  window.addEventListener("keydown", controller.keyUpDown);
  window.addEventListener("keyup", controller.keyUpDown); 
  window.requestAnimationFrame(mainLoop);
})
