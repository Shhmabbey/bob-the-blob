class GameView {
  constructor(game, ctx) {
    this.ctx = ctx;
    this.game = game;
    this.player = this.game.addPlayer();
    }

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

  moveCamera(distance) {
    this.game.movePlatforms(distance);
    this.game.moveBirbs(distance);
  }
  
  moveBackground(distance) {
    background.y += distance; 
  }

  getHighScore() {
    if (score > highScore) highScore = score;
    return highScore
  }
  
  restartGame(){
    player = new Player();
    background = new Background();
    game = new Game();
    game.isPaused = false;
    netPosition = 0;
    score = 0;
  
  
    resize();
    generateInitialPlatforms();
    generateInitialBirbs();
    setPlayerInitialPosition();
    toggleMusic();
    toggleMenuOnClick();
    render();
  
    window.location.reload(true);
  }
}

module.exports = GameView;