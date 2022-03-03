class Birb {
  constructor(displayWidth, y, BIRB_SIZE, GRAVITY) {
    this.x = Math.floor(Math.random() * 2) * (displayWidth);
    this.y = y;
    this.indexX = 0;
    this.indexY = Math.floor(Math.random() * 2);
    this.directions = ['left', 'right']

    this.xVelocity = (Math.floor(Math.random() * 2) + 1.5);
    this.yVelocity = GRAVITY;
    this.isAwake = true;

    this.width = BIRB_SIZE;
    this.height = BIRB_SIZE;

    this.birbSheet = new Image()
    this.birbSheet.src = "assets/blue_birbs.png";
    this.birbSize = BIRB_SIZE;
    this.flyZoneMax = displayWidth;
  }

  direction() {
    return this.directions[this.indexY];
  } 

  flying() {
    if (this.direction() === 'right') this.x -= this.xVelocity;
    if (this.direction() === 'left') this.x += this.xVelocity;
    this.indexX  = ((this.indexX + 1) % 6);
  }

  falling() {
    this.isAwake = false;
    this.y += this.yVelocity * 6;
  }

  handleBirbDisplayEdgeBehavoir() {
    let inBounds = Math.min(Math.max(this.x, 0), this.flyZoneMax - this.width)
    if (this.x !== inBounds ) {
      this.x = inBounds;
      this.switchDirection();
    }
  }

  switchDirection() {
    (this.direction() === 'left') ? this.indexY = 1 : this.indexY = 0;
  }

  move() {
    this.handleBirbDisplayEdgeBehavoir();
    this.isAwake ? this.flying() : this.falling();
    
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


  // static oddsOfBirbGeneration(currentScore) {
  //   // if (currentScore < 50 ) return 2;
  //   // if (currentScore < 150) return 3;
  //   // if (currentScore < 400) return 5;
  //   return 4;
  // }

}

module.exports = Birb;
