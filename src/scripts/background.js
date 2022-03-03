class Background {
  constructor() {
    this.width = 730;
    this.height = 1058;
    this.imgHeight = 10578;
    this.x = 0; 
    this.y = (this.imgHeight - this.height);

    this.backgroundSheet = new Image();
    this.backgroundSheet.src = "assets/background.png";

    this.menuBackground = new Image();
    this.menuBackground.src = "assets/blurred_menu.png";


    this.score = new Image();
    this.score.src = "assets/score_backgrounds.png";


    this.gameover = new Image();
    this.gameover.src = "assets/game_over_final.png";
  }

}

module.exports = Background;