class Platform {
  constructor(newplatformHeight, displayWidth, platformWidth, platformHeight) {
    this.x = Math.random() * (displayWidth - platformWidth);
    this.y = newplatformHeight;

    this.indexX = Math.floor(Math.random() * 4);

    this.width = platformWidth;
    this.height = platformHeight;

    this.largePlatformSheet = new Image()
    this.largePlatformSheet.src = "assets/large_platforms_2.png";
    this.largeWidth = 145;
    this.largeHeight = 87;
    // this.largeWidth = 196.25;
    // this.largeHeight = 118;
    this.largePlatformIndex = Math.random() * (3)
  }

  left() {
    return this.x;
  }

  right() {
    return this.x + this.width;
  }

  top() {
    return this.y;
  }

  bottom() {
    return this.y + this.height;
  }
}

module.exports = Platform;
