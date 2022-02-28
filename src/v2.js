(function () {
  var display, display_width, display_height, controller, player;

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
      var key_state = (event.type == "keydown") ? true : false;

      switch (event.keyCode) {

        case 37:// left key

          /* If the virtual state of the key is not equal to the physical state
          of the key, we know something has changed, and we must update the active
          state of the key. By doing this it prevents repeat firing of keydown events
          from altering the active state of the key. Basically, when you are jumping,
          holding the jump key down isn't going to work. You'll have to hit it every
          time, but only if you set the active key state to false when you jump. */
          if (controller.left.state != key_state) controller.left.active = key_state;
          controller.left.state = key_state;// Always update the physical state.

          break;
        case 38:// up key

          if (controller.up.state != key_state) controller.up.active = key_state;
          controller.up.state = key_state;

          break;
        case 39:// right key

          if (controller.right.state != key_state) controller.right.active = key_state;
          controller.right.state = key_state;

          break;

      }

      //console.log("left:  " + controller.left.state + ", " + controller.left.active + "\nright: " + controller.right.state + ", " + controller.right.active + "\nup:    " + controller.up.state + ", " + controller.up.active);

    }

  };

  player = {
    // animation: new Animation(),// You don't need to setup Animation right away.
    jumping: true,
    height: 16, width: 16,
    x: 0, y: 40 - 18,
    x_velocity: 0, y_velocity: 0
  };

  class Platform {
    constructor(newplatformHeight) {
      this.x = Math.random() * (display_width - platformWidth);
      this.y = newplatformHeight;

      this.width = platformWidth;
      this.height = platformHeight;
    }
  }

  function generatePlatforms() {
    for (let i = 0; i < maxPlatforms; i++) {
      let newplatformHeight = 100 + i * (display_height / maxPlatforms);
      let newplatform = new Platform(newplatformHeight);
      console.log(display.canvas.width, platformWidth)
      platforms.push(newplatform);
    }
  }

  function movePlatforms() {
    if (player.y > bg.height / 3) {
      platforms.forEach((platform) => {
        platform.y -= 4;

        // let visual = platform.visual;
        // visual.style.bottom = platform.bottom + 'px';

        if (platform.y < 10) {
          level++; // consider changing to when player passes platform

          // let firstplatform = platforms[0].visual;
          // firstplatform.classList.remove('platform');
          platforms.shift();

          let newplatform = new Platform(bgTop);
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
      player.y_velocity -= 2.5; // initial jump velocity

    }

    if (controller.left.active) {

      /* To change the animation, all you have to do is call animation.change. */
      // player.animation.change(sprite_sheet.frame_sets[2], 15);
      player.x_velocity -= 0.05;

    }

    if (controller.right.active) {

      // player.animation.change(sprite_sheet.frame_sets[1], 15);
      player.x_velocity += 0.05;

    }

    /* If you're just standing still, change the animation to standing still. */
    // if (!controller.left.active && !controller.right.active) {

    //   player.animation.change(sprite_sheet.frame_sets[0], 20);

    // }

    player.y_velocity += 0.25; // gravity

    // position is only updated from velocity
    player.x += player.x_velocity;
    player.y += player.y_velocity;
    player.x_velocity *= 0.9; // dampening factor, nec?
    player.y_velocity *= 0.9;

    // check collision function
    platforms.forEach(platform => {
      
      if (player.y + player.height > platform.y - 2) {
        player.jumping = false;
        player.y = platform.y - 2 - player.height;
        player.y_velocity = 0;
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
    player.x = platforms[maxPlatforms-1].x + ((platformWidth - player.width) / 2);
    player.y = platforms[maxPlatforms - 1].y + platformHeight;
    console.log(player)
  }

  function resize() {
    // if (display.canvas.height > document.documentElement.clientHeight) {
    //   display.canvas.height = document.documentElement.clientHeight;
    // }
    display_height = document.documentElement.clientHeight;
    let aspect_ratio = bg.width / bg.height;
    display_width = display_height * aspect_ratio;

    display.canvas.height = display_height;
    display.canvas.width = display_width;

    // display.canvas.width = document.documentElement.clientWidth - 32;
    // if (display.canvas.width > document.documentElement.clientHeight) {
    //   display.canvas.width = document.documentElement.clientHeight;
    // }
    // display.canvas.height = display.canvas.width * 0.5;
    display.imageSmoothingEnabled = false;
  };

  function render() {
    display.fillStyle = "#7ec0ff";
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
      display_width,
      display_height
    );
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