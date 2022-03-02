class Player {
  constructor(playerHeight, playerWidth, SPRITE_SIZE) {
    this.jumping = true;
    this.squished = false;
    this.struck = false;
    this.height = playerHeight;
    this.width = playerWidth;

    this.onPlatform = -1;
    this.x = 0;
    this.y = 0;

    this.xVelocity = 0;
    this.yVelocity = 0;

    this.spritesheet = new Image()
    this.spritesheet.src = "assets/spritesheet_white_blob_transparent.png";
    this.spriteSize = SPRITE_SIZE;
    this.spriteIndex = 0;
  }

  falling() {
    if (this.struck) {
      this.onPlatform = -1;
      this.isAwake = false;
      this.yVelocity = 0;
      this.y += this.yVelocity * 6;
    }
  }

  right() {
    return this.x + this.width;
  }

  left() {
    return this.x;
  }

  top() {
    // TO DO: half when squished for birb-ducking
    // return (this.squished ? this.y + (this.height * 3 / 4) : this.y)
    return this.y; 
  }

  bottom() {
    return this.y + this.height;
  }

  isFalling() {
    return this.yVelocity > 0;
  }

  still_on_platform() {  // todo: think about this
    if (this.onPlatform !== -1) {
      return ((player.right() > this.onPlatform.left()) && (player.left() < platform.right()))
    }
  }

  lookLeft() {
    this.spriteIndex = 0;
  }

  squish() {
    this.squished = true;
    if (this.spriteIndex === 0) {
      this.spriteIndex = 1;
    } else if (this.spriteIndex === 2){
      this.spriteIndex = 3;
    }
  }

  unsquish() {
    this.squished = false;
    if (this.spriteIndex === 1) {
      this.spriteIndex = 0;
    } else if (this.spriteIndex === 3){
      this.spriteIndex = 2;
    }
  }

  lookRight() {
    this.spriteIndex = 2;
  }

}

module.exports = Player;