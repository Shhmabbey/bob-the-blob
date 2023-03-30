class Menu {
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

    this.gameover = new Image();
    this.gameover.src = "assets/game_over_final.png";
  }

  resize() {
    let aspectRatio = background.width / background.height;
  
    displayHeight = (document.documentElement.clientHeight) - 100;
    displayWidth = displayHeight * aspectRatio;
  
    display.canvas.height = displayHeight;
    display.canvas.width = displayWidth;
  
    display.imageSmoothingEnabled = false;
  };
  
  drawBackground() {
    if (background.y < 0) { // TO DO: broken loop
      background.y = (background.imgHeight - background.height);
    }
    display.drawImage(
      background.backgroundSheet,
      0,
      background.y,
      background.backgroundSheet.width, // investigate why doesn't work when shrunk
      background.height,
      0,
      0,
      displayWidth,
      displayHeight
    )
  }
  
  drawScore() {
    display.font = "24px Arial";
    display.fillStyle = "white";
    display.fillText(`Score: ${Math.floor(score * 10) / 10}`, 25, 50);
    // display.fillText(`Best: ${Math.floor(highScore * 10) / 10}`, 25, 80);
  }
  
  toggleMusic(){
    audioButton.onclick = function () {
      audioButton.classList.toggle('active')
      if (audio.paused) {
        document.getElementById("play-audio").src = "./assets/darkmodeButtons/musicOn.png"
        audio.play()
      } else {
        document.getElementById("play-audio").src = "./assets/darkmodeButtons/musicOff.png"
        audio.pause();
      }
    }
  }
  
  toggleMenuOnClick(){
    const menuButton = document.getElementById("menu");
    menuButton.onclick = function(){
      toggleMenu();
    }
  }
  
  toggleMenuOnSpace() {
    if (controller.space.active && !checkGameOver()){
      controller.space.active = false;
      game.isPaused ? game.isPaused = false : game.isPaused = true;
      toggleMenu();
    }
    window.requestAnimationFrame(toggleMenuOnSpace);
  }
  
  toggleMenu(){
    const menuButton = document.getElementById("menu");
    menuButton.classList.toggle('active')
    if (menuButton.classList.contains("active")) {
      game.isPaused = true;
    } else {
      game.isPaused = false;
    }
  
    if (game.isPaused) {
      menuButton.src = "./assets/darkmodeButtons/forward.png";
      drawInstructions();
    } else {
      const context = document.querySelector("canvas").getContext("2d");
      context.clearRect(0, 0, displayWidth, displayHeight)
      menuButton.src = "./assets/darkmodeButtons/pause.png"
      mainLoop();
    }
  }
  
  drawInstructions(){
    const context = document.querySelector("canvas").getContext("2d");
    context.clearRect(0, 0, displayWidth, displayHeight)
    display.drawImage(
      background.menuBackground,
      0,
      0,
      background.menuBackground.width,
      background.height,
      0,
      0,
      displayWidth,
      displayHeight
    )
  
    let thirdDisplay = displayHeight / 3;
    display.textAlign = "center";
    display.font = "50px Arial";
    display.fillStyle = "white";
    display.fillText(`How to Play:`, displayWidth / 2, thirdDisplay);
    display.textAlign = "center";
  
    display.font = "16px Arial";
    for (let i =0; i < game.instructions.length; i ++) {
      display.fillText(`${game.instructions[i]}`, displayWidth / 2, thirdDisplay + 50 + (i * 40));
      display.textAlign = "center";
    }
  
    display.drawImage(
      player.spritesheet,
      player.spriteSize * 0,
      0,
      player.spriteSize,
      player.spriteSize,
      (displayWidth *3/4),
      (displayHeight *3/4),
      player.width * 2,
      player.height * 2
    )
  
    // window.requestAnimationFrame(pauseMenuLoop);
  }
  
  drawGameOver(){
    let thirdDisplay = displayHeight / 4;
  
    display.textAlign = "center";
    display.drawImage(background.gameover, displayWidth *(6/32) , displayHeight/6);
  
    display.textAlign = "center";
    display.font = "24px Arial";
    display.fillStyle = "white";
    display.fillText(`Game Over`, displayWidth / 2, thirdDisplay);
    display.textAlign = "center";
  
    // if ( score === highScore) {
    //   display.font = "16px Arial";
    //   display.fillText(`New High Score: ${Math.floor(highScore * 10) / 10}`, displayWidth / 2, thirdDisplay + 50);
    //   display.textAlign = "center";
    // } else {
    //   display.font = "16px Arial";
    //   display.textAlign = "center";
    //   display.fillText(`Score: ${Math.floor(score * 10) / 10}`, displayWidth / 2, thirdDisplay + 50);
    //   display.fillText(`High Score: ${Math.floor(highScore * 10) / 10}`, displayWidth / 2, thirdDisplay + 75);
    //   display.fillText(`You can do better than that!`, displayWidth / 2, thirdDisplay + 100);
    //   display.textAlign = "center";
    // }
  
    display.font = "16px Arial";
      display.fillText(`${game.gameOverMessage[0]}`, displayWidth / 2, thirdDisplay + 25);
  
  }

}

module.exports = Menu;