class Player {
  constructor(playerHeight, playerWidth) {
    this.jumping = true;
    this.height = playerHeight;
    this.width = playerWidth;

    this.onPlatform = -1; // not on platform
    this.x = 0;
    this.y = 0;

    this.xVelocity = 0;
    this.yVelocity = 0;
  }

  right() {
    return this.x + this.width;
  }

  left() {
    return this.x;
  }

  top() {
    return this.y;
  }

  bottom() {
    return this.y + this.height;
  }

  isFalling() {
    return this.yVelocity >= 0;
  }

  still_on_platform() {  // todo: think about this
    if (this.onPlatform !== -1) {
      return ((player.right() > this.onPlatform.left()) && (player.left() < platform.right()))
    }
  }
}

module.exports = Player;