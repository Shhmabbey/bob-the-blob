class Birb {
  constructor(displayWidth, y, BIRB_SIZE, GRAVITY) {
    this.x = Math.floor(Math.random() * 2) * (displayWidth);
    this.y = y;
    this.indexX = 0;
    this.indexY = Math.floor(Math.random() * 2);
    this.directions = ['left', 'right']

    this.xVelocity = ((Math.floor(Math.random() * 3)+1) + (Math.random() * 2));
    this.yVelocity = GRAVITY;
    this.isAwake = true;

    this.width = BIRB_SIZE;
    this.height = BIRB_SIZE;

    this.birbSheet = new Image()
    this.birbSheet.src = "assets/blue_birbs.png";
    this.birbSize = BIRB_SIZE;
    this.flyZoneMax = displayWidth;
    this.animationFrame = 0

    this.easySize = BIRB_SIZE * 0.2;
  }

  direction() {
    return this.directions[this.indexY];
  } 

  flying() {
    if (this.direction() === 'right') this.x -= this.xVelocity;
    if (this.direction() === 'left') this.x += this.xVelocity;
    this.animationFrame += 1;
    if (this.animationFrame % 12 === 0) this.indexX  = ((this.indexX + 1) % 6);
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
    return this.x + this.easySize;
  }

  right() {
    return (this.x + this.width) - this.easySize;
  }

  top() {
    return this.y + this.easySize;
  }

  bottom() {
    return (this.y + this.height) - this.easySize;
  }


  // static oddsOfBirbGeneration(currentScore) {
  //   // if (currentScore < 50 ) return 2;
  //   // if (currentScore < 150) return 3;
  //   // if (currentScore < 400) return 5;
  //   return 4;
  // }

}

module.exports = Birb;
