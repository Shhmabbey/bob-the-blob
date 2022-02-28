const Bug = require("./bug");
const Branch = require("./branch");


function startGame() {
  if (gameStarted == false) {
    score = 0;
    createBranches();
    createBug()
    gameStarted = true;
  }
}


function Game() {
  this.branchCount = 5;
  this.branches = [];
}

function createBranches() {
  for (let i = 0; i < branchCount; i++) {
    let branchHeightDif = 600 / branchCount;
    let newBranchBottom = 100 + i * branchHeightDif;
    let newBranch = new Branch(newBranchBottom);
    branches.push(newBranch);
    console.log(branches);
  }
}

function moveBranches() {
  if (bugY > 200) {
    branches.forEach((branch) => {
      branch.bottom -= 4;

      let visual = branch.visual;
      visual.style.bottom = branch.bottom + 'px';

      if (branch.bottom < 10) {
        level += 1;
        let firstBranch = branches[0].visual;
        firstBranch.classList.remove('branch');
        branches.shift();
        // start at top of grid
        let newBranch = new Branch(600);
        branches.push(newBranch);
      }
    })
  }
}

// Game.BG_COLOR = "#000000";
// Game.DIM_X = 1000;
// Game.DIM_Y = 600;
// Game.FPS = 32;


module.exports = Game;
