class Bug {
  constructor(x, y){
    this.jumping = true;
    this.height = 60;
    this.width = 85;
    this.x = x;
    this.y = y;
    this.x_vel = 0;
    this.y_vel = 0;
    this.speed = 4;
  }
}

// left
// bug.x_vel -= speed;

// right
// bug.x_vel += speed;

// up
// bug.jumping = true;
// bug.y_vel -= 10;



module.exports = Bug;
