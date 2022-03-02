(function () {
  const Platform = require('./scripts/platform');
  const Player = require('./scripts/player');
  const Background = require('./scripts/background')
  
  const SPRITE_SIZE = 32;

  const DISPLAY_WRAP = false;
  const GRAVITY = 0.78;
  const RUN_SPEED = 0.7;
  const CRAWL_SPEED = 0.2;
  const JUMP_INIT_VELOCITY = 18.2;
  const SUPER_JUMP_VELOCITY = 30;
  const DAMPEN = 0.9;

  var displayWidth, displayHeight, controller, playerMaxCameraHeight;

  let display = document.querySelector("canvas").getContext("2d");

  let netPosition = 0;
  let score = 0;

  var player = new Player(SPRITE_SIZE, SPRITE_SIZE);  
  var background = new Background();

  let platformWidth = 145;
  let platformHeight = 15;
  let maxPlatforms = 6;
  let platforms = [];

  controller = {
    left: { active: false, state: false },     // physical state of key, key being pressed. true = down false = up
    right: { active: false, state: false },    // active is virtual state
    up: { active: false, state: false },
    down: { active:false, state: false},

    keyUpDown: function (event) {
      var keyState = (event.type == "keydown") ? true : false;
      // console.log(event.keyCode)
      switch (event.keyCode) {
        case 37: // left key
          if (controller.left.state != keyState) controller.left.active = keyState;
          controller.left.state = keyState;
          break;
        case 38: // up key
          if (controller.up.state != keyState) controller.up.active = keyState;
          controller.up.state = keyState;
          break;
        case 39: // right key
          if (controller.right.state != keyState) controller.right.active = keyState;
          controller.right.state = keyState;
          break;
        case 40: // down key is a toggle
          if (controller.down.state != keyState) {
            if (keyState) controller.down.active = !controller.down.active;
          }
          controller.down.state = keyState;
          break;
        case 32: // space bar -- DEBUG
          console.log(player);
          break;
      }
    }
  }

  function generateInitialPlatforms() {
    for (let i = 0; i < maxPlatforms; i++) {
      let newPlatformHeight = 100 + i * (displayHeight / maxPlatforms);
      platforms.push(new Platform(newPlatformHeight, displayWidth, platformWidth, platformHeight));
    }
  }

  function movePlatforms(distance) {
    platforms.forEach((platform) => {
      platform.y -= distance; 

      if (platform.y > displayHeight) {
        platforms.pop();
          platforms.unshift(new Platform(0, displayWidth, platformWidth, platformHeight));
      }
    })
  }

  function moveBackground(distance) {
    background.y += distance; 
  }

  function checkCollision() {
    platforms.forEach(platform => {
      if (
        player.isFalling() &&
        (player.bottom() < platform.bottom()) &&
        (player.bottom() > platform.top()) &&
        (player.right() > platform.left()) &&
        (player.left() < platform.right())
      ) {
        player.jumping = false;
        player.yVelocity = 0;
        player.y = platform.top() - player.height;
        player.onPlatform = platform;
      }
    })
    return player.onPlatform !== -1;
  }

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

  function moveLeft(){
    player.squished ? player.xVelocity -= CRAWL_SPEED : player.xVelocity -= RUN_SPEED;
  }

  function moveRight() {
    player.squished ? player.xVelocity += CRAWL_SPEED : player.xVelocity += RUN_SPEED;
  }

  function updatePlayerVelocity() {
    if (controller.up.active && !player.jumping) jump();
    if (controller.left.active) moveLeft();
    if (controller.right.active) moveRight();

    applyGravity();
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

  function applyGravity() {
    if (player.onPlatform !== -1) {
      // if player falls off side of platform => apply gravity
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
          if (checkCollision()) break;
        }
      } else {
        // if velocity is less than platformHeight, we can simply
        // add it and check for collision
        player.y += player.yVelocity;
        checkCollision();
      }
    } else {
      // Not falling, moving upwards and on flat ground
      if (player.y < playerMaxCameraHeight) {
        // if player is moving upwards and above a certain height threshold,
        // move the platforms and background instead
        movePlatforms(player.yVelocity);
        moveBackground(player.yVelocity);
      } else {
        player.y += player.yVelocity;
      }
    }
    // checkCollision();
    handlePlayerDisplayEdgeBehavior();
  }

  function updateScore() {
    netPosition -= (player.yVelocity / 100);
    score = Math.max(score, netPosition);
  }

  function mainLoop() {
    updatePlayerVelocity();
    updatePlayerPosition();
    updateScore();
    updatePlayerAnimation();
    render();
    window.requestAnimationFrame(mainLoop);
  };

  function setPlayerInitialPosition() {
    player.x = platforms[maxPlatforms - 1].x + ((platformWidth - player.width) / 2);
    player.y = platforms[maxPlatforms - 1].top() -100;
  }

  function resize() {
    let aspectRatio = background.width / background.height;

    displayHeight = (document.documentElement.clientHeight) - 100;
    displayWidth = displayHeight * aspectRatio;

    display.canvas.height = displayHeight;
    display.canvas.width = displayWidth;

    display.imageSmoothingEnabled = false;
  };

  function render() {
    resize();

    if (background.y < 0) { // TO DO: broken loop
      background.y = (background.imgHeight - background.height);
    }
    display.drawImage(
      background.backgroundSheet,
      0,
      background.y,
      background.backgroundSheet.width, // investigate why doesn't work when shrunk
      background.height, 
      0,
      0,
      displayWidth,
      displayHeight
    )

    display.font = "30px Arial";
    display.fillStyle = "white";
    display.fillText(`${Math.floor(score * 10) / 10}`, 50, 50);

    display.fillStyle = "#7ec0ff";
    platforms.forEach((platform) => {
      display.fillRect(platform.x, platform.y, platform.width, platform.height);
    });

    display.drawImage(
      player.spritesheet,
      SPRITE_SIZE * player.spriteIndex,
      0,
      SPRITE_SIZE,
      SPRITE_SIZE,
      player.x,
      player.y, 
      player.width,
      player.height
    );
  }

  // add listener for click to start game

  background.backgroundSheet.addEventListener('load', () => {
    resize();
    generateInitialPlatforms();
    setPlayerInitialPosition();

    window.addEventListener("resize", resize);
    window.addEventListener("keydown", controller.keyUpDown);
    window.addEventListener("keyup", controller.keyUpDown);
    window.requestAnimationFrame(mainLoop);
  })

})();