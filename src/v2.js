const Platform = require('./scripts/platform');
const Player = require('./scripts/player');

(function () {
  var display, displayWidth, displayHeight, controller;

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

  // buffer = document.createElement("canvas").getContext("2d");
  display = document.querySelector("canvas").getContext("2d");

  controller = {

    /* Now each key object knows its physical state as well as its active state.
    When a key is active it is used in the game logic, but its physical state is
    always recorded and never altered for reference. */
    left: { active: false, state: false },
    right: { active: false, state: false },
    up: { active: false, state: false },

    keyUpDown: function (event) {

      /* Get the physical state of the key being pressed. true = down false = up*/
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

      }

      //console.log("left:  " + controller.left.state + ", " + controller.left.active + "\nright: " + controller.right.state + ", " + controller.right.active + "\nup:    " + controller.up.state + ", " + controller.up.active);

    }

  };

  // player = {
  //   // animation: new Animation(),// Don't need to setup Animation right away.
  //   jumping: true,
  //   height: 16, width: 16,
  //   x: 0, y: 0,
  //   xVelocity: 0, yVelocity: 0,

  //   right() {
  //     return this.x + this.width;
  //   }
  // };

  // static class method or factory mehtod?
  function generatePlatforms() {
    for (let i = 0; i < maxPlatforms; i++) {
      let newplatformHeight = 100 + i * (displayHeight / maxPlatforms);
      let newplatform = new Platform(newplatformHeight, displayWidth, platformWidth, platformHeight);
      console.log(display.canvas.width, platformWidth)
      platforms.push(newplatform);
    }
  }

  function movePlatforms() {
    if (player.y > bg.height / 3) {
      platforms.forEach((platform) => {
        platform.y -= 4;

        if (platform.y < 10) {
          level++; 
          platforms.shift();

          let newplatform = new Platform(bgTop, displayWidth, platformWidth, platformHeight);
          platforms.push(newplatform);
        }
      })
    }
  }


  function mainLoop() {

    movePlatforms();

    if (controller.up.active && !player.jumping) {

      controller.up.active = false;
      player.jumping = true;
      player.yVelocity -= 2.5; // initial jump velocity

    }

    if (controller.left.active) {

      /* To change the animation, all you have to do is call animation.change. */
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

    // position is only updated from velocity
    player.x += player.xVelocity;
    player.y += player.yVelocity;
    player.xVelocity *= 0.9; // dampening factor, nec?
    player.yVelocity *= 0.9;

    // check collision function
    platforms.forEach(platform => {
      if (
        (player.y > platform.bottom()) &&
        (player.y < platform.top()) && 
        (player.right() > platform.left()) &&
        (player.x < (platform.right())) &&
        (!jumping)
        ) {
        player.jumping = false;
        player.y = platform.y - 2 - player.height;
        player.yVelocity = 0;
        }
      });


    if (player.x + player.width < 0) {  // left wrap
      player.x = display.canvas.width;
    } else if (player.x > display.canvas.width) {  // right wrap
      player.x = - player.width;
    }

    // player.animation.update();

    render();

    // window.requestAnimationFrame(mainLoop);

  };

  function createplayer() {
    // set positions, center player, set player on top of platform
    player.x = platforms[maxPlatforms - 1].x + ((platformWidth - player.width) / 2);
    // console.log(platforms[maxPlatforms - 1].top)
    // player.y = platforms[maxPlatforms - 1].y - ((platforms[maxPlatforms - 1].height) * 2);
    player.y = platforms[maxPlatforms - 1].top();
    console.log(player)
  }

  function resize() {
    // if (display.canvas.height > document.documentElement.clientHeight) {
    //   display.canvas.height = document.documentElement.clientHeight;
    // }
    displayHeight = document.documentElement.clientHeight;
    let aspectRatio = bg.width / bg.height;
    displayWidth = displayHeight * aspectRatio;

    display.canvas.height = displayHeight;
    display.canvas.width = displayWidth;

    // display.canvas.width = document.documentElement.clientWidth - 32;
    // if (display.canvas.width > document.documentElement.clientHeight) {
    //   display.canvas.width = document.documentElement.clientHeight;
    // }
    // display.canvas.height = display.canvas.width * 0.5;
    display.imageSmoothingEnabled = false;
  };

  function render() {
    
    // buffer.strokeStyle = "#8ed0ff";
    // buffer.lineWidth = 10;
    // buffer.drawImage(sprite, player.x, player.y, player.width, player.height);
    display.canvas.width = bg.width;
    display.canvas.height = bg.height;

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

    display.drawImage(sprite, player.x, player.y);
    console.log(player);

  }

  // display = document.querySelector("canvas").getContext("2d");
  // add listener for click to start game

  bg.addEventListener('load', () => {
    resize();
    generatePlatforms();
    createplayer();
    console.log(player.y)
    window.requestAnimationFrame(mainLoop);
  })

  window.addEventListener("resize", resize);
  window.addEventListener("keydown", controller.keyUpDown);
  window.addEventListener("keyup", controller.keyUpDown);
})();