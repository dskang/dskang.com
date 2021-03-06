var kPixelWidth;
var kPixelHeight;
var kPixelThreshold = 600;
var kScoreHeight = 40;
var kBoxSide = 20;
var kLoopInterval = 125;
var kLineColor = "#ccc";
var kIncrement = 3;
var kSwipeThreshold = 20;
// allow queuing up max two directions (e.g. go up then go right immediately after one move)
var kDirectionQueueLimit = 2;

var gCanvasElement;
var gDrawingContext;
var gGameController;
var gTouchManager;
var gKeyManager;
var gClickManager;
var gDisplayManager;
var gDialogManager;
var gScoreboard;
var gSnake;
var gFood;

var LEFT_KEYCODE = 37;
var UP_KEYCODE = 38;
var RIGHT_KEYCODE = 39;
var DOWN_KEYCODE = 40;

var UP = 0;
var RIGHT = 1;
var DOWN = 2;
var LEFT = 3;

window.onload = function() {
  // get viewport size
  kPixelWidth = document.documentElement.clientWidth;
  kPixelHeight = document.documentElement.clientHeight;

  if (kPixelWidth > kPixelThreshold && kPixelHeight > kPixelThreshold) {
    kPixelWidth = kPixelThreshold;
    kPixelHeight = kPixelThreshold;
  }

  // round to nearest box border
  kPixelWidth = Math.floor(kPixelWidth / kBoxSide) * kBoxSide;
  kPixelHeight = Math.floor(kPixelHeight / kBoxSide) * kBoxSide;

  gGameController = new GameController();
  gGameController.initGame();
};

function Point(x, y) {
  this.x = x;
  this.y = y;
  this.intersects = function(pt) {
    return (this.x === pt.x && this.y === pt.y);
  }
}

function Snake() {
  // head of snake is last element of this.body
  this.body = []
  this.bodyColor = "red";
  this.headColor = "green";
  this.getHead = function() {
    if (this.body.length == 0) {
      return null;
    } else {
      return this.body[this.body.length-1];
    }
  }
  this.direction = null;
  this.directionQueue = [];
  this.numAdd = 0;
  this.move = function() {
    if (this.directionQueue.length > 0) {
      var currentDir = this.direction;
      var newDir = this.directionQueue.shift();
      var opposite = (currentDir === LEFT && newDir === RIGHT) ||
                     (currentDir === RIGHT && newDir === LEFT) ||
                     (currentDir === UP && newDir === DOWN) ||
                     (currentDir === DOWN && newDir === UP);
      if (!opposite) {
        this.direction = newDir;
      }
    }
    var xDiff = 0;
    var yDiff = 0;
    switch (this.direction) {
    case UP:
      yDiff = -kBoxSide;
      break;
    case RIGHT:
      xDiff = kBoxSide;
      break;
    case DOWN:
      yDiff = kBoxSide;
      break;
    case LEFT:
      xDiff = -kBoxSide;
      break;
    }
    var curHead = this.getHead();
    var newHead = new Point(curHead.x + xDiff, curHead.y + yDiff);
    if (this.isDead(newHead)) {
      gGameController.endGame();
    } else {
      this.body.push(newHead);
      this.checkForFood();
      if (this.numAdd > 0) {
        this.numAdd -= 1;
      } else {
        var tail = this.body.shift();
        gDisplayManager.eraseBox(tail);
      }
      this.draw();
    }
  }
  this.isDead = function(newHead) {
    var outsideBoundaries = (newHead.x < 0 ||
                             newHead.y < kScoreHeight ||
                             newHead.x == kPixelWidth ||
                             newHead.y == kPixelHeight);
    var selfCollision = this.contains(newHead);
    return (outsideBoundaries || selfCollision);
  }
  this.checkForFood = function() {
    if (this.getHead().intersects(gFood.location)) {
      this.numAdd += kIncrement;
      gDisplayManager.eraseBox(gFood.location);
      gScoreboard.score += 1;
      gScoreboard.updateScore();
      gFood.generate();
    }
  }
  this.contains = function(pt) {
    for (var i = 0; i < this.body.length; i++) {
      var snakePt = this.body[i];
      if (pt.intersects(snakePt)) {
        return true;
      }
    }
    return false;
  }
  this.draw = function() {
    gDrawingContext.fillStyle = this.bodyColor;
    for (var i = 0; i < this.body.length - 1; i++) {
      gDisplayManager.drawBox(this.body[i]);
    }
    gDrawingContext.fillStyle = this.headColor;
    gDisplayManager.drawBox(this.getHead());
  }
}

function Food() {
  this.location = null;
  this.color = "blue";
  this.generate = function() {
    var numBoxesWidth = Math.floor(kPixelWidth / kBoxSide);
    var numBoxesHeight = Math.floor((kPixelHeight - kScoreHeight) / kBoxSide);
    do {
      var randWidth = Math.floor(Math.random() * numBoxesWidth);
      var randHeight = Math.floor(Math.random() * numBoxesHeight);
      var randX = randWidth * kBoxSide;
      var randY = kScoreHeight + randHeight * kBoxSide;
      var randPt = new Point(randX, randY);
    } while (gSnake.contains(randPt));

    this.location = randPt;
    this.draw();
  }
  this.draw = function() {
    gDrawingContext.fillStyle = this.color;
    gDisplayManager.drawBox(this.location);
  }
}

function GameController() {
  this.gameOver = false;
  this.initGame = function() {
    gScoreboard = new Scoreboard();

    gCanvasElement = document.createElement("canvas");
    gCanvasElement.id = "canvas";
    document.body.appendChild(gCanvasElement);

    gCanvasElement.width = kPixelWidth;
    gCanvasElement.height = kPixelHeight;

    gTouchManager = new TouchManager();
    document.addEventListener('touchstart', gTouchManager.touchstart);
    document.addEventListener('touchmove', gTouchManager.touchmove);

    gKeyManager = new KeyManager();
    document.addEventListener('keydown', gKeyManager.keydown);

    gClickManager = new ClickManager();
    document.addEventListener('click', gClickManager.click);

    gDisplayManager = new DisplayManager();
    gDialogManager = new DialogManager();

    gDrawingContext = gCanvasElement.getContext("2d");

    var self = this;
    setInterval(function() { self.update(); }, kLoopInterval);
    this.newGame();

    this.gameOver = true;
    gDialogManager.showInstructions();
  }
  this.newGame = function() {
    gSnake = new Snake();
    gSnake.body.push(new Point(5 * kBoxSide, kScoreHeight + 5 * kBoxSide));
    gSnake.direction = RIGHT;
    gDisplayManager.drawBoard();
    gSnake.draw();
    gFood = new Food();
    gFood.generate();
    gScoreboard.score = 0;
    gScoreboard.updateScore();
    this.gameOver = false;
  }
  this.update = function() {
    if (!this.gameOver) {
      gSnake.move();
    }
  }
  this.endGame = function() {
    this.gameOver = true;
    var setNewTopScore = gScoreboard.submitScore();
    gDialogManager.showFinalScore(setNewTopScore);
  }
}

function Scoreboard() {
  this.score = 0;
  this.supportsLocalStorage = ('localStorage' in window &&
                               window['localStorage'] !== null);
  this.storage = window['localStorage'];
  this.getTopScore = function() {
    if (this.supportsLocalStorage) {
      if ("snake.top" in this.storage) {
        return this.storage["snake.top"];
      } else {
        return 0;
      }
    }
    return null;
  }
  this.submitScore = function() {
    if (this.supportsLocalStorage && this.score > this.getTopScore()) {
      this.storage["snake.top"] = this.score;
      return true;
    }
    return false;
  }
  this.updateScore = function() {
    gDrawingContext.clearRect(10, 10, kPixelWidth, 20);

    gDrawingContext.fillStyle = "black";
    gDrawingContext.font = "bold 20px sans-serif";
    gDrawingContext.textBaseline = "top";
    gDrawingContext.textAlign = "left";
    gDrawingContext.fillText("Score: " + this.score, 10, 10);

    if (this.supportsLocalStorage) {
      gDrawingContext.textAlign = "right";
      gDrawingContext.fillText("Top Score: " + this.getTopScore(), kPixelWidth - 10, 10);
    }
  }

}

function DisplayManager() {
  this.drawBoard = function() {
    gDrawingContext.clearRect(0, 0, kPixelWidth, kPixelHeight);

    gDrawingContext.beginPath();

    // vertical lines
    for (var x = 0; x <= kPixelWidth; x += kBoxSide) {
      gDrawingContext.moveTo(x, kScoreHeight);
      gDrawingContext.lineTo(x, kPixelHeight);
    }

    // horizontal lines
    for (var y = kScoreHeight; y <= kPixelHeight; y += kBoxSide) {
      gDrawingContext.moveTo(0, y);
      gDrawingContext.lineTo(kPixelWidth, y);
    }

    // draw board
    gDrawingContext.strokeStyle = kLineColor;
    gDrawingContext.stroke();
  }
  this.drawBox = function(pt) {
    gDrawingContext.fillRect(pt.x, pt.y, kBoxSide, kBoxSide);
  }
  this.eraseBox = function(pt) {
    gDrawingContext.strokeStyle = kLineColor;
    gDrawingContext.clearRect(pt.x, pt.y, kBoxSide, kBoxSide);
    gDrawingContext.strokeRect(pt.x, pt.y, kBoxSide, kBoxSide);
  }
}

function TouchManager() {
  this.oldPoint = null;
  this.touchstart = function(e) {
    gTouchManager.oldPoint = gTouchManager.getCursorPosition(e);

    if (gGameController.gameOver) {
      var x = gTouchManager.oldPoint.x;
      var y = gTouchManager.oldPoint.y;
      if (gDialogManager.inPlayButton(x, y)) {
        gGameController.newGame();
      }
    }
  }
  this.touchmove = function(e) {
    var newPoint = gTouchManager.getCursorPosition(e);
    if (newPoint === null) {
      return;
    }
    var xDiff = newPoint.x - gTouchManager.oldPoint.x;
    var yDiff = newPoint.y - gTouchManager.oldPoint.y;

    var xAbsDiff = Math.abs(xDiff);
    var yAbsDiff = Math.abs(yDiff);

    var swipeTooSmall = xAbsDiff < kSwipeThreshold && yAbsDiff < kSwipeThreshold;
    if (swipeTooSmall) {
      return;
    }

    var direction = gTouchManager.getDirection(xDiff, yDiff);
    if (gSnake.directionQueue.length < kDirectionQueueLimit) {
      gSnake.directionQueue.push(direction);
    }
    gTouchManager.oldPoint = newPoint;
  }
  this.getDirection = function(xDiff, yDiff) {
    var xAbsDiff = Math.abs(xDiff);
    var yAbsDiff = Math.abs(yDiff);

    if (xAbsDiff > yAbsDiff) {
      if (xDiff > 0) {
        return RIGHT;
      } else {
        return LEFT;
      }
    } else {
      if (yDiff > 0) {
        return DOWN;
      } else {
        return UP;
      }
    }
  }
  this.getCursorPosition = function(e) {
    if (e.touches === undefined) {
      return null;
    }
    var x = e.touches[0].pageX;
    var y = e.touches[0].pageY;
    return new Point(x, y);
  }
}

function KeyManager() {
  this.keydown = function(e) {
    var direction = gKeyManager.getDirection(e.keyCode);
    if (direction !== null && gSnake.directionQueue.length < kDirectionQueueLimit) {
      gSnake.directionQueue.push(direction);
    }
  }
  this.getDirection = function(keyCode) {
    switch (keyCode) {
      case LEFT_KEYCODE: return LEFT;
      case UP_KEYCODE: return UP;
      case RIGHT_KEYCODE: return RIGHT;
      case DOWN_KEYCODE: return DOWN;
      default: return null;
    }
  }
}

function ClickManager() {
  this.click = function(e) {
    if (gGameController.gameOver) {
      var x = e.clientX - gCanvasElement.offsetLeft;
      var y = e.clientY - gCanvasElement.offsetTop;
      if (gDialogManager.inPlayButton(x, y)) {
        gGameController.newGame();
      }
    }
  }
}

function DialogManager() {
  this.midCanvasX = kPixelWidth / 2;
  this.midCanvasY = kPixelHeight / 2;
  this.dialogWidth = 300;
  this.dialogHeight = 120;
  this.dialogCoord = {
    xStart: this.midCanvasX - (this.dialogWidth / 2),
    yStart: this.midCanvasY - (this.dialogHeight / 2)
  }
  this.playButtonWidth = 200;
  this.playButtonHeight = 40;
  this.playButtonCoord = {
    xStart: this.midCanvasX - (this.playButtonWidth / 2),
    yStart: this.midCanvasY - (this.playButtonHeight / 2) + 15
  }
  this.showInstructions = function() {
    var mainText = "Swipe or use arrow keys to turn";
    var mainTextColor = "white";
    var buttonText = "Play";
    this.showDialog(mainText, mainTextColor, buttonText);
  }
  this.showFinalScore = function(topScoreChanged) {
    var scoreText;
    var color;
    if (topScoreChanged) {
      scoreText = "New Top Score: ";
      color = "red";
    } else {
      scoreText = "Final Score: ";
      color = "white";
    }
    this.showDialog(scoreText + gScoreboard.score, color, "Play Again");
  }
  this.showDialog = function(mainText, mainTextColor, buttonText) {
    gDrawingContext.fillStyle = "black";
    gDrawingContext.fillRect(this.dialogCoord.xStart,
                             this.dialogCoord.yStart,
                             this.dialogWidth,
                             this.dialogHeight);

    gDrawingContext.fillStyle = "gray";
    gDrawingContext.fillRect(this.playButtonCoord.xStart,
                             this.playButtonCoord.yStart,
                             this.playButtonWidth,
                             this.playButtonHeight);

    gDrawingContext.fillStyle = mainTextColor;
    gDrawingContext.textBaseline = "top";
    gDrawingContext.textAlign = "center";
    gDrawingContext.font = "bold 18px sans-serif";
    gDrawingContext.fillText(mainText,
                             this.midCanvasX,
                             this.midCanvasY - 40);

    gDrawingContext.fillStyle = "white";
    gDrawingContext.font = "bold 16px sans-serif";
    gDrawingContext.fillText(buttonText,
                             this.midCanvasX,
                             this.midCanvasY + 6);
  }

  this.inPlayButton = function(x, y) {
    var xBoxStart = this.playButtonCoord.xStart;
    var xBoxEnd = xBoxStart + this.playButtonWidth;

    var yBoxStart = this.playButtonCoord.yStart;
    var yBoxEnd = yBoxStart + this.playButtonHeight;

    var inBox = (x > xBoxStart &&
                 x < xBoxEnd &&
                 y > yBoxStart &&
                 y < yBoxEnd);
    return inBox;
  }
}
