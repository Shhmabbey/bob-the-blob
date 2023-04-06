const Birb = require('./scripts/birb');
const Platform = require('./scripts/platform');
const Player = require('./scripts/player');

class Game {
  static GRAVITY = 0.78;
  static RUN_SPEED = 0.7;
  static CRAWL_SPEED = 0.2;
  static JUMP_INIT_VELOCITY = 18.2;
  static SUPER_JUMP_VELOCITY = 30;
  static DAMPEN = 0.9;
  static DISPLAY_WRAP = false;

  constructor(){
    this.birbs = [];
    this.platforms = [];

    this.maxPlatforms = 6;
    this.maxBirbs = 5;

    this.isPaused = true;

    this.instructions = ['Tap the up arrow key to jump.',
      'Tap the left or right arrow key to move side to side.',
      'Toggle the down and up arrow keys for a boosted jump.',
      'Don\'t get hit by the birbs!',
      'See how high you can climb.',
      'Click the play button to start or resume the game.']
    this.gameOverMessage = ['Click the space bar to start a new game.'];
  }

  generateInitialBirbs() {
    this.maxBirbs = 4; // BUG: doesn't generate max birbs
    for (let i = 0; i < this.maxBirbs; i++){
      let birbY = (50  + (i * (displayHeight / this.maxBirbs)));
      this.birbs.push(new Birb(displayWidth, birbY, Game.GRAVITY));
      i += .5;
    }
  }

  generateInitialPlatforms() {
    for (let i = 0; i < this.maxPlatforms; i++) {
      let newPlatformHeight = 100 + i * (displayHeight / this.maxPlatforms);
      this.platforms.push(new Platform(newPlatformHeight, displayWidth));
    }
  }

  allObjects() {
    return [].concat(this.player, this.platforms, this.birbs);
  }

  draw(ctx) {
    this.allObjects().forEach((object) => {
      object.draw(ctx);
    });
  }

  render() {
    resize();
    drawBackground();
    this.draw();
    drawScore();
  }

  moveBirbs(distance) {
    this.birbs.forEach((birb) => {
      birb.y -= distance;
  
      if (birb.y > displayHeight) {
        this.birbs.pop();
        this.birbs.unshift(new Birb(displayWidth, 0, GRAVITY));
      }
    })
  }

  movePlatforms(distance) {
    this.platforms.forEach((platform) => {
      platform.y -= distance; 
      
      if (platform.y > displayHeight) {
        this.platforms.pop();
        this.platforms.unshift(new Platform(0, displayWidth));
      }
    })
  }

  checkPlayerBirbCollision() {
    this.birbs.forEach((birb) => {
      if (player.checkBirbCollision(birb)) return true
    })
    return false;
  }

  checkPlayerPlatformCollision() {
    this.platforms.forEach(platform => {
      this.player.checkPlatformCollision(platform)
    })
    return this.player.onPlatform !== -1;
  }

  checkGameOver() {
    return this.player.belowScreen() || this.checkPlayerBirbCollision();
  }

}

function jump() {
  controller.up.active = false;
  this.player.jumping = true;
  this.player.onPlatform = -1;
  if (controller.down.active) {
    controller.down.active = false;
    this.player.unsquish();
    this.player.yVelocity -= SUPER_JUMP_VELOCITY;
  } else {
    this.player.yVelocity -= JUMP_INIT_VELOCITY;
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

module.exports = Game;