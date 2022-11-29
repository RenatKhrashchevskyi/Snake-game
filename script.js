// let intervalid = setInterval (function () {
//   ctx.clearRect(0, 0, width, height);
//   drawScore();
//   snake.move();
//   snake.draw();
//   apple.draw();
//   draw.Border();
// }, 100);



//writing game
//==============

//setting canvas
let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d')

//width and height of canvas
let width = canvas.width;
let height = canvas.height;


//Divide "canvas" into cells
let blockSize = 10;
let widthInBlocks = width / blockSize;
let heightInBlocks = height / blockSize;


// variable 'score'
let score = 0;

//drawing 'frame'
let drawBorder = function () {
  ctx.fillStyle = 'Gray';
  ctx.fillRect(0, 0, width, blockSize);
  ctx.fillRect(0, height - blockSize, width, blockSize);
  ctx.fillRect(0, 0, blockSize, height);
  ctx.fillRect(width - blockSize, 0, blockSize, height);
};



//Display score
let drawScore = function () {
  ctx.font = '20px Courier';
  ctx.fillStyle = 'Black';
  ctx.textAlign = 'left'
  ctx.textBaseline = 'top';
  ctx.fillText('Score: ' + score, blockSize, blockSize);
};


//Game over if cancel setInterval
let gameOver = function () {
  // clearInterval(intervalId);
  playing = false;
  ctx.font = '60px Courier';
  ctx.fillStyle = 'Black';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('Game over', width / 2, height / 2);
};


//drawing circle
let circle = function (x, y, radius, fillCircle) {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2, false);
  if (fillCircle) {
    ctx.fill();
  } else {
    ctx.stroke();
  }
};

//Creating a Block constructor (cell)
let Block = function (col, row) {
  this.col = col;
  this.row = row;
};


//method drawSquare. Drawing square in cell position
Block.prototype.drawSquare = function (color) {
  let x = this.col * blockSize;
  let y = this.row * blockSize;
  ctx.fillStyle = color;
  ctx.fillRect(x, y, blockSize, blockSize);
};

//method drawCircle. Drawing circle in cell position
Block.prototype.drawCircle = function (color) {
  let centerX = this.col * blockSize + blockSize / 2;
  let centerY = this.row * blockSize + blockSize / 2;
  ctx.fillStyle = color;
  circle(centerX, centerY, blockSize / 2, true);
};


//method equal. Checking if this cell in same position as otherBlock
Block.prototype.equal = function (otherBlock) {
  return this.col === otherBlock.col && this.row === otherBlock.row;
};


//Creating a snake
//=================
//Snake constructor

let Snake = function () {
  this.segments = [
    new Block(7, 5),
    new Block(6, 5),
    new Block(5, 5)
  ];
  
  this.direction = 'right';
  this.nextDirection = 'right';
};

//drawing Snake (head, body, tail)

Snake.prototype.draw = function () {
  this.segments[0].drawSquare('Green');
  let isEvenSegment = false;

  for (let i = 1; i < this.segments.length; i++) {
    if (isEvenSegment) {
      this.segments[i].drawSquare('Blue');
    } else {
      this.segments[i].drawSquare('Yellow');
    }
    isEvenSegment = !isEvenSegment;
  
  }
};


// Moving the snake

Snake.prototype.move = function () {
  let head = this.segments[0];
  let newHead;

  this.direction = this.nextDirection;

  if (this.direction === 'right') {
    newHead = new Block(head.col + 1, head.row);

  } else if (this.direction === 'down') {
    newHead = new Block(head.col, head.row + 1);
  } else if (this.direction === 'left') {
    newHead = new Block(head.col - 1, head.row);
  } else if (this.direction === 'up') {
    newHead = new Block(head.col, head.row - 1);
  }

  if (this.checkCollision(newHead)) {
    gameOver();
    return;
  }
  this.segments.unshift(newHead);

  if (newHead.equal(apple.position)) {
    score++;
    animationTime -=5;
    apple.move(this.segments);
  } else {
    this.segments.pop();
  }
};

//method checkCollision

Snake.prototype.checkCollision = function (head) {
  let leftCollision = (head.col === 0);
  let topCollision = (head.row === 0);
  let rightCollision = (head.col === widthInBlocks - 1);
  let bottomCollision = (head.row === heightInBlocks - 1);

  let wallCollision = leftCollision || topCollision || rightCollision || bottomCollision;

  let selfCollision = false;

  for (let i = 0; i < this.segments.length; i++) {
    if (head.equal(this.segments[i])) {
      selfCollision = true;
    }
  }
  return wallCollision || selfCollision;
};



//method setDirection
Snake.prototype.setDirection = function (newDirection) {
  if (this.direction === 'up' && newDirection === 'down') {
    return;
  } else if (this.direction === 'right' && newDirection === 'left') {
    return;
  } else if (this.direction === 'down' && newDirection === 'up') {
    return;
  } else if (this.direction === 'left' && newDirection === 'right') {
    return;
  }

  this.nextDirection = newDirection;
};


//creating an apple
let Apple = function () {
  this.position = new Block(10, 10);
};

Apple.prototype.draw = function () {
  this.position.drawCircle('LimeGreen');
};


//moving apple
Apple.prototype.move = function (occupiedBlocks) {
  let randomCol = Math.floor(Math.random() * (widthInBlocks - 2)) + 1;
  let randomRow = Math.floor(Math.random() * (heightInBlocks - 2)) +1;
  this.position = new Block(randomCol, randomRow);


  // // for loop
  // for (let i = 0; i < occupiedBlocks.length; i++) {
  //   if (this.position.equal(occupiedBlocks[i])) {
  //     this.move(occupiedBlocks);
  //     return;
  //   }
  // }
  //};

  // while loop
  let index = occupiedBlocks.length - 1;
  while (index >= 0) {
    if (this.position.equal(occupiedBlocks[index])) {
      this.move(occupiedBlocks);

      return;
    }
    index--;
  }
};


//snake and apple
let snake = new Snake();
let apple = new Apple();

let playing = true;
let animationTime = 100;

//start animation function via setInterval
let gameLoop = function () {
  ctx.clearRect(0, 0, width, height);
  drawScore();
  snake.move();
  snake.draw();
  apple.draw();
  drawBorder();

  if (playing) {
    setTimeout(gameLoop, animationTime);
  }
};

gameLoop();

//control the snake from the keyboard
let directions = {
  37: 'left',
  38: 'up',
  39: 'right',
  40: 'down'
};

//event handler for keyboard
$('body').keydown(function (event) {
  let newDirection = directions[event.keyCode];
  if (newDirection !== undefined) {
    snake.setDirection(newDirection);
  }
});
