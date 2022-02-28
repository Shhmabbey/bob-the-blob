const Platform = require('./scripts/platform');
const Player = require('./scripts/player');
const DISPLAY_WRAP = false;

(function () {
  var displayWidth, displayHeight, controller;

  var display = document.querySelector("canvas").getContext("2d");

  let playerHeight = 16;
  let playerWidth = 16;
  var player = new Player(playerHeight, playerWidth);
  

  let bg = new Image();
  bg.src = "assets/platform/bg4.png"
  let sprite = new Image();
  sprite.src = "assets/Sprites/Cloud_Ball_Blue.png"

  let platformWidth = 85;
  let platformHeight = 15;
  let maxPlatforms = 7;
  let platforms = [];

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

  function movePlatforms() {
    if (player.y > bg.height / 3) {
      platforms.forEach((platform) => {
        platform.y -= 4;

        if (platform.y < 10) {
          // level++; 
          platforms.shift();

          let newplatform = new Platform(bgTop, displayWidth, platformWidth, platformHeight);
          platforms.push(newplatform);
        }
      })
    }
  }

  function checkCollision() {
    platforms.forEach(platform => {
      if (
        player.isFalling() &&
        (player.bottom() > platform.bottom()) &&
        (player.bottom() < platform.top()) &&
        (player.right() > platform.left()) &&
        (player.left() < platform.right()) // &&
        // (!player.jumping)
      ) {
        player.jumping = false;
        player.y = platform.top;
        player.yVelocity = 0;
      } else {
        // gravity?
      }
    })
  }

  function updatePlayerVelocity() {
    if (controller.up.active && !player.jumping) {
      controller.up.active = false;
      player.jumping = true;
      player.yVelocity -= 2.5; // initial jump velocity
    }
    if (controller.left.active) {
      /* To change the animation, call animation.change. */
      // player.animation.change(sprite_sheet.frame_sets[2], 15);
      player.xVelocity -= 0.05;
    }
    if (controller.right.active) {
      // player.animation.change(sprite_sheet.frame_sets[1], 15);
      player.xVelocity += 0.05;
    }
    /* If you're just standing still, change the animation to standing still. */
    // if (!controller.left.active && !controller.right.active) {
    //   player.animation.change(sprite_sheet.frame_sets[0], 20);
    // }
    player.yVelocity += 0.25; // gravity
    player.xVelocity *= 0.9; // dampening factor
    player.yVelocity *= 0.9;
  }

  function handlePlayerDisplayEdgeBehavior() {
    if (!DISPLAY_WRAP) {
      // saturate x position
      player.x = Math.min(player.x, displayWidth);
      player.x = Math.max(player.x, 0);
    }
    else {
      // TODO wrap logic
    }
  }

  function updatePlayerPosition() {
    // position is only updated from velocity
    player.x += player.xVelocity;
    player.y += player.yVelocity;

    checkCollision();
    handlePlayerDisplayEdgeBehavior();
  }


  function mainLoop() {
    movePlatforms();
    updatePlayerVelocity();
    updatePlayerPosition();
    // player.animation.update();
    render();
    window.requestAnimationFrame(mainLoop);
  };

  function setPlayerInitialPosition() {
    player.x = platforms[maxPlatforms - 1].x + ((platformWidth - player.width) / 2);
    player.y = platforms[maxPlatforms - 1].top();
    console.log(player)
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
      // console.log(platform.x, platform.y, platform.width, platform.height);
      display.fillRect(platform.x, platform.y, platform.width, platform.height);
    });

    display.drawImage(sprite, player.x, player.y, player.width, player.height);
    console.log(player);

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