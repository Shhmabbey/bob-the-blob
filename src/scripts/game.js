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

  draw(ctx) {
    ctx.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);
    ctx.fillStyle = Game.BG_COLOR;
    ctx.fillRect(0, 0, Game.DIM_X, Game.DIM_Y);

    this.allObjects().forEach((object) => {
      object.draw(ctx);
    });
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
      player.checkPlatformCollision(platform)
    })
    return player.onPlatform !== -1;
  }

  checkGameOver() {
    return player.belowScreen() || this.checkPlayerBirbCollision();
  }

}

module.exports = Game;