class Platform {
  constructor(newplatformHeight, displayWidth, platformWidth, platformHeight) {
    this.x = Math.random() * (displayWidth - platformWidth);
    this.y = newplatformHeight;

    this.width = platformWidth;
    this.height = platformHeight;
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
