class Branch {
  constructor(newBranchBottom){
    this.bottom = newBranchBottom;
    // grid width - the width of the platform
    this.left = Math.random() * 315;

    this.visual = document.createElement('div');
    const visual = this.visual
    this.visual.classList.add('branch');
    visual.style.left = this.left + 'px';
    visual.style.bottom = this.bottom + 'px';
    grid.appendChild(visual);
  }
}

let branches = [];
let branchCount = 5;

function generateBranches() {
  for (let i = 0; i < branchCount; i++) {
    let branchHeightDif = 600 / branchCount;
    let newBranchHeight = 100 + i * branchHeightDif;
    let newBranch = new Branch(newBranchHeight);
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
module.exports = Branch;
