(function () {
  const Platform = require('./scripts/platform');
  const Player = require('./scripts/player');
  
  const DISPLAY_WRAP = false;
  const GRAVITY = 0.78;
  const RUN_SPEED = 0.7;
  const JUMP_INIT_VELOCITY = 16.5;

  var displayWidth, displayHeight, controller, playerMaxHeight;

  let display = document.querySelector("canvas").getContext("2d");

  let playerHeight = 30; // refactor to ratio
  let playerWidth = 30; // refactor to ratio
  var player = new Player(playerHeight, playerWidth);
  

  let bg = new Image();
  bg.src = "assets/platform/bg4.png"
  let sprite = new Image();
  sprite.src = "assets/Sprites/Cloud_Ball_Blue.png"

  let platformWidth = 145;
  let platformHeight = 15;
  let maxPlatforms = 6;
  let platforms = [];

  playerMaxHeight = (displayHeight * .4);

  controller = {
    // physical state of key, key being pressed. true = down false = up
    // active is virtual state
    left: { active: false, state: false },
    right: { active: false, state: false },
    up: { active: false, state: false },

    keyUpDown: function (event) {
      var keyState = (event.type == "keydown") ? true : false;

      switch (event.keyCode) {
        case 37:// left key
          /* If the virtual state of the key is not equal to the physical state
          of the key, we know something has changed, and we must update the active
          state of the key. By doing this it prevents repeat firing of keydown events
          from altering the active state of the key. Basically, when you are jumping,
          holding the jump key down isn't going to work. You'll have to hit it every
          time, but only if you set the active key state to false when you jump. */
          if (controller.left.state != keyState) controller.left.active = keyState;
          controller.left.state = keyState;// Always update the physical state.
          break;
        case 38:// up key
          if (controller.up.state != keyState) controller.up.active = keyState;
          controller.up.state = keyState;
          break;
        case 39:// right key
          if (controller.right.state != keyState) controller.right.active = keyState;
          controller.right.state = keyState;
          break;
        case 32: // space bar -- DEBUG
          console.log(player)
      }

      //console.log("left:  " + controller.left.state + ", " + controller.left.active + "\nright: " + controller.right.state + ", " + controller.right.active + "\nup:    " + controller.up.state + ", " + controller.up.active);
    }

  }

  // static class method or factory mehtod?
  function generatePlatforms() {
    for (let i = 0; i < maxPlatforms; i++) {
      let newplatformHeight = 100 + i * (displayHeight / maxPlatforms);
      let newplatform = new Platform(newplatformHeight, displayWidth, platformWidth, platformHeight);
      platforms.push(newplatform);
    }
  }

  function movePlatforms(distance) {
    platforms.forEach((platform) => {
      platform.y += distance; 

      // if (platform.y > displayHeight) {
      //   // level++; 
      //   platforms.shift();

      //   let newplatform = new Platform(0, displayWidth, platformWidth, platformHeight);
      //   platforms.push(newplatform);
      // }
    })
  }

  function checkCollision() {
    platforms.forEach(platform => {
      if (
        player.isFalling() &&
        (player.bottom() < platform.bottom()) &&
        (player.bottom() > platform.top()) &&
        (player.right() > platform.left()) &&
        (player.left() < platform.right()) // &&
        // (!player.jumping)
      ) {
        console.log('Landed on', platform)
        player.jumping = false;
        player.yVelocity = 0;
        player.y = platform.top() - playerHeight;
        player.onPlatform = platform
        return true
      }
    })
  }

  function updatePlayerVelocity() {
    if (controller.up.active && !player.jumping) {
      controller.up.active = false;
      player.jumping = true;
      player.onPlatform = -1;
      player.yVelocity -= JUMP_INIT_VELOCITY;
    }
    if (controller.left.active) {
      /* To change the animation, call animation.change. */
      // player.animation.change(sprite_sheet.frame_sets[2], 15);
      player.xVelocity -= RUN_SPEED;
    }
    if (controller.right.active) {
      // player.animation.change(sprite_sheet.frame_sets[1], 15);
      player.xVelocity += RUN_SPEED;
    }
    /* If you're just standing still, change the animation to standing still. */
    // if (!controller.left.active && !controller.right.active) {
    //   player.animation.change(sprite_sheet.frame_sets[0], 20);
    // }
    applyGravity();
    player.xVelocity *= 0.9; // dampening factor
    // player.yVelocity *= 0.9;
  }

  function applyGravity() {
    if (player.onPlatform !== -1) {
      // check if player falls off side of platform => apply gravity
      let platform = player.onPlatform;
      if (!((player.right() > platform.left()) && (player.left() < platform.right()))) {
        player.jumping = true;
        player.onPlatform = -1;
      }
    } else {
      player.yVelocity += GRAVITY;
    }
  }


  function handlePlayerDisplayEdgeBehavior() {
    if (!DISPLAY_WRAP) {
      // saturate x position
      player.x = Math.min(player.x, displayWidth);
      player.x = Math.max(player.x, 0); //might not be working
    }
    else {
      // TODO wrap logic
    }
  }

  function updatePlayerPosition() {
    player.x += player.xVelocity;
    player.y += player.yVelocity;
    // player.y += player.yVelocity;
    
    if (player.y < playerMaxHeight) {
      // player.y += player.yVelocity;
      // console.log(player.yVelocity);
      movePlatforms(player.yVelocity);
    }

    checkCollision();
    handlePlayerDisplayEdgeBehavior();
  }


  function mainLoop() {
    updatePlayerVelocity();
    updatePlayerPosition();
    // player.animation.update();
    render();
    window.requestAnimationFrame(mainLoop);
  };

  function setPlayerInitialPosition() {
    player.x = platforms[maxPlatforms - 1].x + ((platformWidth - player.width) / 2);
    player.y = platforms[maxPlatforms - 1].top() -100;
  }

  function resize() {
    let aspectRatio = bg.width / bg.height;

    displayHeight = (document.documentElement.clientHeight) - 100;
    displayWidth = displayHeight * aspectRatio;

    display.canvas.height = displayHeight;
    display.canvas.width = displayWidth;

    display.imageSmoothingEnabled = false;
  };

  function render() {
    resize();
    display.drawImage(
      bg,
      0,
      0,
      bg.width,
      bg.height,
      0,
      0,
      displayWidth,
      displayHeight
    );

    display.fillStyle = "#7ec0ff";
    platforms.forEach((platform) => {
      display.fillRect(platform.x, platform.y, platform.width, platform.height);
    });

    display.drawImage(sprite, player.x, player.y, player.width, player.height);


  }

  // add listener for click to start game

  bg.addEventListener('load', () => {
    resize();
    generatePlatforms();
    setPlayerInitialPosition();

    window.addEventListener("resize", resize);
    window.addEventListener("keydown", controller.keyUpDown);
    window.addEventListener("keyup", controller.keyUpDown);
    window.requestAnimationFrame(mainLoop);
  })


})();

// const { setInterval } = require("core-js");

// // run after html page is loaded
// document.addEventListener('DOMContentLoaded', () => {
//   const grid = document.querySelector('.grid');
//   const player = document.createElement('div');

//   // background
//   let bgTop = 600;
//   let bgBottom = 0;
//   let bgWidth = 400;
//   let bgLeft = 0;

//   // positions
//   let playerX;
//   let playerY;
//   let playerVel = 0;
//   let playerSpeed = 4;
//   let startPoint = 150;
//   let playerWidth = 60;
//   let playerHeight = 85;

//   //platform rendering
//   let maxplatforms = 5;
//   let platforms = [];
//   let platformWidth = 85;
//   let platformHeight = 15;

//   // game logic
//   let isGameOver = false;
//   let level = 0;
//   let coffee = 0;
//   let score = 0;
//   // let highscore;

//   // player movement
//   let upTimerId;
//   let downTimerId;
//   let leftTimerId;
//   let rightTimerId;
//   let jumping = true;
//   let movingRight = false;
//   let movingLeft = false;


//   function createplayer() {
//     // add player to html
//     grid.appendChild(player);
//     player.classList.add('player')

//     // set positions, center player, set player on top of platform
//     playerX = platforms[0].left + ((platformWidth - playerWidth) / 2);
//     playerY = platforms[0].bottom + platformHeight;

//     player.style.left = playerX + 'px';
//     player.style.bottom = playerY + 'px';
//   }

//   class Platform {
//     constructor(newplatformHeight){
//       this.bottom = newplatformHeight;
//       this.left = Math.random() * (bgWidth - platformWidth);

//       this.visual = document.createElement('div');
//       const visual = this.visual
//       this.visual.classList.add('platform');

//       visual.style.left = this.left + 'px';
//       visual.style.bottom = this.bottom + 'px';

//       grid.appendChild(visual);
//     }
//   }

//   function generatePlatforms() {
//     for (let i = 0; i < maxplatforms; i++) {
//       let platformDelta = bgTop / maxplatforms;
//       let newplatformHeight = 100 + i * platformDelta;
//       let newplatform = new Platform(newplatformHeight);
//       platforms.push(newplatform);
//     }
//   }

//   function movePlatforms() {
//     if (playerY > bgTop / 3) {
//       platforms.forEach((platform) => {
//         platform.bottom -= 4;

//         let visual = platform.visual;
//         visual.style.bottom = platform.bottom + 'px';

//         if (platform.bottom < 10) {
//           level++; // consider changing to when player passes platform

//           let firstplatform = platforms[0].visual;
//           firstplatform.classList.remove('platform');
//           platforms.shift();

//           let newplatform = new Platform(bgTop);
//           platforms.push(newplatform);
//         }
//       })
//     }
//   }

//   function fall() {
//     clearInterval(upTimerId);
//     jumping = false;

//     downTimerId = setInterval(() => {
//       playerY -= 5;
//       player.style.bottom = playerY + 'px';

//       if (playerY <= 0) {
//         gameOver();
//       }

//       collision();
//     }, 30);
//   }

//   function collision() {
//     platforms.forEach((platform) => {
//       if (
//         (playerY > platform.bottom) &&
//         (playerY < platform.bottom + platformHeight) &&
//         ((playerX + playerWidth) > platform.left) &&
//         (playerX < (platform.left + platformWidth)) &&
//         (!jumping)
//       ) {
//         startPoint = playerY
//         grounded();
//       }
//     })
//   }

//   function grounded(){
//     clearInterval(downTimerId);
//     clearInterval(upTimerId);
//     clearInterval(leftTimerId);
//     clearInterval(rightTimerId);
//     jumping = false;
//     movingRight = false;
//     movingLeft = false;
//   }

//   function jump() {
//     // set jump height to variable
//     // add jump height to y axis
//     // add gravity
//     clearInterval(downTimerId);
//     jumping = true;

//     upTimerId = setInterval(() => {
//       playerY += 10;
//       player.style.bottom = playerY + 'px';

//       // test out other heights
//       // something wrong with this line?
//       if (playerY > startPoint + 140) {
//         fall();
//       }
//     }, 30);
//   }

//   function gameOver() {
//     isGameOver = true;
//     clearInterval(upTimerId);
//     clearInterval(downTimerId);
//     clearInterval(leftTimerId);
//     clearInterval(rightTimerId);
//     console.log('Game Over');

//     while (grid.firstChild) {
//       grid.removeChild(grid.firstChild);
//     }

//     grid.innerHTML = getScore();
//   }

//   function moveLeft() {
//     if (movingRight) {
//       clearInterval(rightTimerId);
//       movingRight = false;
//     }

//     movingLeft = true;

//     leftTimerId = setInterval(() =>{
//       if (playerX >= bgLeft) {
//         playerX -= 7;
//         player.style.left = playerX + 'px';
//       } else {
//         playerX = bgWidth - playerWidth;
//       }
//     }, 30)
//   }

//   function moveRight() {
//     if (movingLeft) {
//       clearInterval(leftTimerId);
//       movingLeft = false;
//     }

//     movingRight = true;

//     rightTimerId = setInterval(() => {
//       if (playerX <= bgWidth - playerWidth) {
//         playerX += 7;
//         player.style.left = playerX + 'px';
//       } else {
//         playerX = bgLeft;
//       }
//     }, 30)
//   }

//   function moveplayer(event) {
//     if (event.key === 'ArrowLeft') {
//       moveLeft();
//     } else if (event.key === 'ArrowRight') {
//       moveRight();
//     } else if (event.key === 'ArrowUp') {
//       jump();
//     }
//   }

//   function getScore(){
//     score = level + coffee;
//     return score;
//   }

//   function start() {
//     if (!isGameOver){
//       generatePlatforms();
//       createplayer();
//       setInterval(movePlatforms, 30);
//       document.addEventListener('keyup', moveplayer)
//     }
//   }

//   // set listener for click start
//   start();
// })