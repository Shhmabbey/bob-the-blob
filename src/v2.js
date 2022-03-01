
const { setInterval } = require("core-js");

// run after html page is loaded
document.addEventListener('DOMContentLoaded', () => {
  const grid = document.querySelector('.grid');
  const player = document.createElement('div');

  // background
  let bgTop = 600;
  let bgBottom = 0;
  let bgWidth = 400;
  let bgLeft = 0;

  // positions
  let playerX;
  let playerY;
  let playerVel = 0;
  let playerSpeed = 4;
  let startPoint = 150;
  let playerWidth = 60;
  let playerHeight = 85;

  //platform rendering
  let maxplatforms = 5;
  let platforms = [];
  let platformWidth = 85;
  let platformHeight = 15;

  // game logic
  let isGameOver = false;
  let level = 0;
  let coffee = 0;
  let score = 0;
  // let highscore;

  // player movement
  let upTimerId;
  let downTimerId;
  let leftTimerId;
  let rightTimerId;
  let jumping = true;
  let movingRight = false;
  let movingLeft = false;


  function createplayer() {
    // add player to html
    grid.appendChild(player);
    player.classList.add('player')

    // set positions, center player, set player on top of platform
    playerX = platforms[0].left + ((platformWidth - playerWidth) / 2);
    playerY = platforms[0].bottom + platformHeight;

    player.style.left = playerX + 'px';
    player.style.bottom = playerY + 'px';
  }

  class Platform {
    constructor(newplatformHeight){
      this.bottom = newplatformHeight;
      this.left = Math.random() * (bgWidth - platformWidth);

      this.visual = document.createElement('div');
      const visual = this.visual
      this.visual.classList.add('platform');

      visual.style.left = this.left + 'px';
      visual.style.bottom = this.bottom + 'px';

      grid.appendChild(visual);
    }
  }

  function generatePlatforms() {
    for (let i = 0; i < maxplatforms; i++) {
      let platformDelta = bgTop / maxplatforms;
      let newplatformHeight = 100 + i * platformDelta;
      let newplatform = new Platform(newplatformHeight);
      platforms.push(newplatform);
    }
  }

  function movePlatforms() {
    if (playerY > bgTop / 3) {
      platforms.forEach((platform) => {
        platform.bottom -= 4;

        let visual = platform.visual;
        visual.style.bottom = platform.bottom + 'px';

        if (platform.bottom < 10) {
          level++; // consider changing to when player passes platform

          let firstplatform = platforms[0].visual;
          firstplatform.classList.remove('platform');
          platforms.shift();

          let newplatform = new Platform(bgTop);
          platforms.push(newplatform);
        }
      })
    }
  }

  function fall() {
    clearInterval(upTimerId);
    jumping = false;

    downTimerId = setInterval(() => {
      playerY -= 5;
      player.style.bottom = playerY + 'px';

      if (playerY <= 0) {
        gameOver();
      }

      collision();
    }, 30);
  }

  function collision() {
    platforms.forEach((platform) => {
      if (
        (playerY > platform.bottom) &&
        (playerY < platform.bottom + platformHeight) &&
        ((playerX + playerWidth) > platform.left) &&
        (playerX < (platform.left + platformWidth)) &&
        (!jumping)
      ) {
        startPoint = playerY
        grounded();
      }
    })
  }

  function grounded(){
    clearInterval(downTimerId);
    clearInterval(upTimerId);
    clearInterval(leftTimerId);
    clearInterval(rightTimerId);
    jumping = false;
    movingRight = false;
    movingLeft = false;
  }

  function jump() {
    // set jump height to variable
    // add jump height to y axis
    // add gravity
    clearInterval(downTimerId);
    jumping = true;

    upTimerId = setInterval(() => {
      playerY += 10;
      player.style.bottom = playerY + 'px';

      // test out other heights
      // something wrong with this line?
      if (playerY > startPoint + 140) {
        fall();
      }
    }, 30);
  }

  function gameOver() {
    isGameOver = true;
    clearInterval(upTimerId);
    clearInterval(downTimerId);
    clearInterval(leftTimerId);
    clearInterval(rightTimerId);
    console.log('Game Over');

    while (grid.firstChild) {
      grid.removeChild(grid.firstChild);
    }

    grid.innerHTML = getScore();
  }

  function moveLeft() {
    if (movingRight) {
      clearInterval(rightTimerId);
      movingRight = false;
    }

    movingLeft = true;

    leftTimerId = setInterval(() =>{
      if (playerX >= bgLeft) {
        playerX -= 7;
        player.style.left = playerX + 'px';
      } else {
        playerX = bgWidth - playerWidth;
      }
    }, 30)
  }

  function moveRight() {
    if (movingLeft) {
      clearInterval(leftTimerId);
      movingLeft = false;
    }

    movingRight = true;

    rightTimerId = setInterval(() => {
      if (playerX <= bgWidth - playerWidth) {
        playerX += 7;
        player.style.left = playerX + 'px';
      } else {
        playerX = bgLeft;
      }
    }, 30)
  }

  function moveplayer(event) {
    if (event.key === 'ArrowLeft') {
      moveLeft();
    } else if (event.key === 'ArrowRight') {
      moveRight();
    } else if (event.key === 'ArrowUp') {
      jump();
    }
  }

  function getScore(){
    score = level + coffee;
    return score;
  }

  function start() {
    if (!isGameOver){
      generatePlatforms();
      createplayer();
      setInterval(movePlatforms, 30);
      document.addEventListener('keyup', moveplayer)
    }
  }

  // set listener for click start
  start();
})