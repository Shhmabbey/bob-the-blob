(function () {
  const Platform = require('./scripts/platform');
  const Player = require('./scripts/player');
  const Background = require('./scripts/background');
  const Birb = require('./scripts/birb');
  const Game = require('./scripts/game');
  
  const SPRITE_SIZE = 32;
  const BIRB_SIZE = 32;

  const DISPLAY_WRAP = false;
  const GRAVITY = 0.78;
  const RUN_SPEED = 0.7;
  const CRAWL_SPEED = 0.2;
  const JUMP_INIT_VELOCITY = 18.2;
  const SUPER_JUMP_VELOCITY = 30;
  const DAMPEN = 0.9;

  const platformWidth = 145;
  const platformHeight = 15;
  const maxPlatforms = 6;

  let maxBirbs;

  var displayWidth, displayHeight, controller, playerMaxCameraHeight;

  const display = document.querySelector("canvas").getContext("2d");
  const audioButton = document.getElementById("play-audio");
  const audio = document.getElementById("music");

  var player = new Player(SPRITE_SIZE, SPRITE_SIZE);  
  var background = new Background();
  var game = new Game();
  
  let isPaused = true;
  let birbs = [];
  let platforms = [];
  let netPosition = 0;
  let score = 0;
  let highScore = 0;

  controller = {
    left: { active: false, state: false },     // physical state of key, key being pressed. true = down false = up
    right: { active: false, state: false },    // active is virtual state
    up: { active: false, state: false },
    down: { active:false, state: false},
    space: { active: false, state: false },

    keyUpDown: function (event) {
      var keyState = (event.type == "keydown") ? true : false;
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
        case 32: // space bar 
          if (controller.space.state != keyState) controller.space.active = keyState;
          controller.space.state = keyState;
          break;
      }
    }
  }

  function generateInitialBirbs() {
    maxBirbs = 4; // BUG: doesn't denerate max birbs only 2
    for (let i = 0; i < maxBirbs; i++){
      let birbY = (50  + (i * (displayHeight / maxBirbs)));
      birbs.push(new Birb(displayWidth, birbY, BIRB_SIZE, GRAVITY));
      i += .5;
    }
  }

  function moveBirbs(distance) {
    birbs.forEach((birb) => {
      birb.y -= distance;

      if (birb.y > displayHeight) {
        birbs.pop();
        birbs.unshift(new Birb(displayWidth, 0, BIRB_SIZE, GRAVITY));
      }
    })
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

  function moveCamera(distance) {
    movePlatforms(distance);
    moveBirbs(distance);
  }

  function moveBackground(distance) {
    background.y += distance; 
  }

  function birbAbovePlayer(birb) {
    return (birb.bottom() + birb.easySize <= player.bottom())
  }

  function checkBirbCollision() {
    let birbCollision = false
    birbs.forEach((birb) => {
      birbCollision ||= (
        (player.top() < birb.bottom()) &&
        (player.bottom() > birb.top()) &&
        (player.right() > birb.left()) && 
        (player.left() < birb.right())
        );

      // if (birbCollision && birbAbovePlayer(birb)) {
      //   birb.struck = true;
      //   player.unsquish();
      //   controller.down.active = false;
      //   player.falling();
      //   if (birb.direction() === 'right') {
      //     player.x -= platformWidth;
      //   } else {
      //     player.x += platformWidth;
      //   }
      // } else 
      // if (birbCollision && player.jumping && !birbAbovePlayer(birb)) {
      //   // hitScore += 1;
      //   // jump(); // TODO: make bounce larger
      //   player.yVelocity = 0;
      //   player.yVelocity -= JUMP_INIT_VELOCITY;
      //   birb.falling();
      //   birbCollision = false;
      // }
    })
    return birbCollision;
  }

  function checkPlatformCollision() {
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

  function drawPlayer() {
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
  
  function drawBackground() {
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
  }
  
  function drawScore() {
    display.font = "24px Arial";
    display.fillStyle = "white";
    display.fillText(`Score: ${Math.floor(score * 10) / 10}`, 25, 50);
    display.fillText(`Best: ${Math.floor(highScore * 10) / 10}`, 25, 80);
  }

  function drawPlatforms() {
    display.fillStyle = "#7ec0ff";
    platforms.forEach((platform) => {
      display.fillRect(platform.x, platform.y, platform.width, platform.height);
    });
  }

  function drawBirbs() {
    birbs.forEach((birb) => {
      birb.move();
      display.drawImage(
        birb.birbSheet,
        BIRB_SIZE * birb.indexX,
        BIRB_SIZE * birb.indexY,
        BIRB_SIZE,
        BIRB_SIZE,
        birb.x,
        birb.y,
        birb.width,
        birb.height
      )
    })
  }

  function toggleMusic(){
    audioButton.onclick = function () {
      audioButton.classList.toggle('active')
      if (audio.paused) {
        document.getElementById("play-audio").src = "./assets/darkmodeButtons/musicOn.png"
        audio.play()
      } else {
        document.getElementById("play-audio").src = "./assets/darkmodeButtons/musicOff.png"
        audio.pause();
      }
    }
  }

  function toggleMenuOnClick(){
    const menuButton = document.getElementById("menu");
    menuButton.onclick = function(){
      toggleMenu();
    }
  }

  function toggleMenuOnSpace() {
    if (controller.space.active && !checkGameOver()){
      controller.space.active = false;
      isPaused ? isPaused = false : isPaused = true;
      toggleMenu();
    }
    window.requestAnimationFrame(toggleMenuOnSpace);
  }

  function toggleMenu(){
    const menuButton = document.getElementById("menu");
    menuButton.classList.toggle('active')
    if (menuButton.classList.contains("active")) {
      isPaused = true;
    } else {
      isPaused = false;
    }

    if (isPaused) {
      menuButton.src = "./assets/darkmodeButtons/forward.png";
      drawInstructions();
    } else {
      const context = document.querySelector("canvas").getContext("2d");
      context.clearRect(0, 0, displayWidth, displayHeight)
      menuButton.src = "./assets/darkmodeButtons/pause.png"
      mainLoop();
    }
  }

  function drawInstructions(){
    const context = document.querySelector("canvas").getContext("2d");
    context.clearRect(0, 0, displayWidth, displayHeight)
    display.drawImage(
      background.menuBackground,
      0,
      0,
      background.menuBackground.width,
      background.height,
      0,
      0,
      displayWidth,
      displayHeight
    )

    let thirdDisplay = displayHeight / 3;
    display.textAlign = "center";
    display.font = "50px Arial";
    display.fillStyle = "white";
    display.fillText(`How to Play:`, displayWidth / 2, thirdDisplay);
    display.textAlign = "center";

    display.font = "16px Arial";
    for (let i =0; i < game.instructions.length; i ++) {
      display.fillText(`${game.instructions[i]}`, displayWidth / 2, thirdDisplay + 50 + (i * 40));
      display.textAlign = "center";
    }

    display.drawImage(
      player.spritesheet,
      SPRITE_SIZE * 0,
      0,
      SPRITE_SIZE,
      SPRITE_SIZE,
      (displayWidth *3/4),
      (displayHeight *3/4),
      player.width * 2,
      player.height * 2
    )

    // window.requestAnimationFrame(pauseMenuLoop);
  }

  function drawGameOver(){
    let thirdDisplay = displayHeight / 4;

    display.textAlign = "center";
    display.drawImage(background.gameover, displayWidth *(5/32 ) , displayHeight/6);

    display.textAlign = "center";
    display.font = "24px Arial";
    display.fillStyle = "white";
    display.fillText(`Game Over`, displayWidth / 2, thirdDisplay);
    display.textAlign = "center";

    if ( score === highScore) {
      display.font = "16px Arial";
      display.fillText(`New High Score: ${Math.floor(highScore * 10) / 10}`, displayWidth / 2, thirdDisplay + 50);
      display.textAlign = "center";
    } else {
      display.font = "16px Arial";
      display.textAlign = "center";
      display.fillText(`Score: ${Math.floor(score * 10) / 10}`, displayWidth / 2, thirdDisplay + 50);
      display.fillText(`High Score: ${Math.floor(highScore * 10) / 10}`, displayWidth / 2, thirdDisplay + 75);
      display.fillText(`You can do better than that!`, displayWidth / 2, thirdDisplay + 100);
      display.textAlign = "center";
    }



    display.font = "16px Arial";
      display.fillText(`${game.gameOverMessage[0]}`, displayWidth / 2, thirdDisplay + 25);

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

function getHighScore() {
  if (score > highScore) highScore = score;
  return highScore
}

  function restartGame(){
    player = new Player(SPRITE_SIZE, SPRITE_SIZE);
    background = new Background();
    game = new Game();
    isPaused = false;
    birbs = [];
    platforms = [];
    netPosition = 0;
    score = 0;

    resize();
    generateInitialPlatforms();
    generateInitialBirbs();
    setPlayerInitialPosition();
    toggleMusic();
    toggleMenuOnClick();
    render();

    mainLoop();
  }

  function gameOverLoop(){
    if (controller.space.active) {
      restartGame();
      isPaused = false;
    } else {
      window.requestAnimationFrame(gameOverLoop);
    }
  }

  function playerBelowScreen() {
    return player.y > displayHeight;
  }
  
  function render() {
    resize();
    drawBackground();
    drawPlatforms();
    drawPlayer();
    drawBirbs();
    drawScore();
  }

  function checkGameOver() {
    return playerBelowScreen() || checkBirbCollision();
  }
  
  function mainLoop() {
    if (!isPaused) {
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

})();