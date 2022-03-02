class Background {
  constructor() {
    this.width = 730;
    this.height = 1058;
    this.imgHeight = 10578;
    this.x = 0; 
    this.y = (this.imgHeight - this.height);

    this.backgroundSheet = new Image();
    this.backgroundSheet.src = "assets/background.png";
  }

}

module.exports = Background;