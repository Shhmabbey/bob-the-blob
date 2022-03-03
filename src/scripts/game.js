class Game {
  constructor(){
    this.instructions = ['Tap the up arrow key to jump.',
      'Tap the left or right arrow key to move side to side.',
      'Toggle the down and up arrow keys for a boosted jump.',
      'Don\'t get hit by the birbs!',
      'See how high you can climb.',
      'Click the play button to start or resume the game.']
    this.gameOverMessage = ['Click the space bar to start a new game.'];
  }
}

module.exports = Game;