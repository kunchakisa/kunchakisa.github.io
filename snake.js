{
  let gameDiv = document.getElementById("game-content");
  let snakeControllerDiv = document.getElementById("snake-controller");
  let titleH = document.getElementById("game-title");
  let snakeBoard = document.getElementById("game-board");
  let scoreCountDiv = document.getElementById("game-score");
  let highScoreDiv = document.getElementById("game-highscore");
  let playerCountDiv = document.getElementById("game-snakelength");
  let crossCountDiv = document.getElementById("game-crossbuffs");
  let buffTimerDiv = document.getElementById("game-bufftimer");
  let playtimeDiv = document.getElementById("game-playtime");
  let gameMessageDiv = document.getElementById("game-message");

  let showControlsButton = document.getElementById("game-showcontrols");
  showControlsButton.addEventListener("mousedown", (event)=>{
    event.preventDefault();
    if (snakeControllerDiv.style.display === "") {
      snakeControllerDiv.style.display = "initial";
      showControlsButton.innerText = "Hide on-screen controls";
    } else {
      snakeControllerDiv.style.display = "";
      showControlsButton.innerText = "Show on-screen controls";
    }
  });
  
  // Set up controls button and add event listeners
  {
    let query = snakeControllerDiv.querySelectorAll(".ctrl");
    function clickFunction() {
      gameInput(this.dataset.ctrlCode);
    }
    for (let elem of query) {
      elem.addEventListener("click", clickFunction);
    }
  }

  let bigScreenSize = window.innerWidth > 600;

  // Populate the screen with the div grid
  const BOARD_WIDTH = 40;
  const BOARD_HEIGHT = 20;
  const BOARD_GRID = [];
  const BOARD_DIV = [];
  const BOARD_BLOCK = 1;
  const BOARD_FREE = 0;
  const BOARD_FOOD = 2;
  const BOARD_PLAYER_1 = 3;
  const BOARD_PLAYER_2 = 4;
  const BOARD_CROSSBUFF = 5;
  const BOARD_SHRINKBUFF = 6;
  const BOARD_RISKYBUFF = 7;
  for (let y=0; y<BOARD_HEIGHT; y++) {
    let row = [];
    for (let x=0; x<BOARD_WIDTH; x++) {
      let size = bigScreenSize?"10px":"6px";
      let elem = document.createElement("div");
      elem.style.display = "inline-block";
      elem.style.width = size;
      elem.style.height = size;
      row.push(elem);
      snakeBoard.append(elem);
    }
    snakeBoard.append(document.createElement("br"));
    BOARD_DIV.push(row);
  }
  // Define the board obstacle
  for (let y=0; y<BOARD_HEIGHT; y++) {
    let row = [];
    for (let x=0; x<BOARD_WIDTH; x++) {
      let elem = BOARD_FREE;
      if ( (y==0 || y==BOARD_HEIGHT-1) && (x < 18 || x > 22) )
        elem = BOARD_BLOCK;
      else if ( (x==0 || x==BOARD_WIDTH-1) && (y < 8 || y > 12) )
        elem = BOARD_BLOCK;
      else if (Math.pow(x-BOARD_WIDTH/2, 2)+Math.pow(y-BOARD_HEIGHT/2, 2) <= 7)
        elem = BOARD_BLOCK;
      row.push(elem);
    }
    BOARD_GRID.push(row);
  }

  const STEP_LEFT = 0;
  const STEP_RIGHT = 1;
  const STEP_UP = 2;
  const STEP_DOWN = 3;
  const STEP_OPPOSITE = [1, 0, 3, 2];
  const STEP_X = [-1, 1, 0, 0];
  const STEP_Y = [0, 0, -1, 1];
  const SHRINK_SPEED = 1;
  const GAME_PERIOD = 8;

  let playerSteps = [];
  let playerX = 20;
  let playerY = 6;
  let playerTailX = playerX;
  let playerTailY = playerY;
  let playerScore = 0;
  let playerMilestone = 0;
  let highScore = parseInt(localStorage.getItem("snake-highscore") | "0");
  let playerGrowCount = 1;
  let playerCrossCount = 0;
  let playerControl = STEP_LEFT;
  let controlQueue = [];

  let buffTimer = 0;
  let buffAppear = 150;
  let buffDisappear = 250;
  let buffX = -1;
  let buffY = -1;

  let playtime = 0;
  let lastTimestamp = -1;
  let isGameOver = true;
  let isOnSelectionScreen = true;
  let isPaused = false;
  let intervalControlNumber = -1;

  function updateGame () {
    if (isGameOver) return;
    if (isPaused) return;
    // Update play time
    let now = Date.now();
    playtime += (now - lastTimestamp)/1000;
    lastTimestamp = now;
    // Update buff timer
    buffTimer++;
    if (buffTimer===buffAppear) {
      let coords = returnBlankCell();
      buffX = coords[0];
      buffY = coords[1];
      BOARD_GRID[buffY][buffX] = BOARD_CROSSBUFF; 
    } else if (buffTimer===buffDisappear) {
      if (buffX !== -1) {
        BOARD_GRID[buffY][buffX] = BOARD_FREE; 
      }
      buffTimer = 0;
    }

    // Apply queued action
    if (controlQueue.length > 0) playerControl = controlQueue.splice(0, 1)[0];

    // Move the player
    playerSteps.push(playerControl);
    playerX = (playerX + STEP_X[playerControl] + BOARD_WIDTH)%BOARD_WIDTH;
    playerY = (playerY + STEP_Y[playerControl] + BOARD_HEIGHT)%BOARD_HEIGHT;
    // Check obstacle under player
    let currentCell = BOARD_GRID[playerY][playerX];
    BOARD_GRID[playerY][playerX] = BOARD_PLAYER_1;
    if (currentCell === BOARD_BLOCK || currentCell === BOARD_PLAYER_2) {
      BOARD_GRID[playerY][playerX] = currentCell;
      gameOver();
      return;
    } else if (currentCell === BOARD_PLAYER_1) {
      if (playerCrossCount > 0) {
        BOARD_GRID[playerY][playerX] = BOARD_PLAYER_2;
        playerCrossCount--;
      } else {
        gameOver();
        return;
      }
    } else if (currentCell === BOARD_FOOD) {
      // Generate food randomly
      let coords = returnBlankCell();
      BOARD_GRID[coords[1]][coords[0]] = BOARD_FOOD;
      // Add score
      playerScore += 4;
      playerGrowCount++;
      updateScore();
    } else if (currentCell === BOARD_CROSSBUFF) {
      playerScore += 1;
      playerCrossCount++;
      playerGrowCount-=3;
      buffX = -1;
      updateScore();
    }

    if (playerGrowCount <= 0) {
      moveTail();
      let shrink = SHRINK_SPEED;
      while ((playerGrowCount < 0) && (playerSteps.length > 1) && (shrink > 0)) {
        shrink--;
        playerGrowCount++;
        moveTail();
      }
    } else playerGrowCount--;

    updateDivs();
  }

  function moveTail() {
    // Move the tail, and remove player trail
    let currentCell = BOARD_GRID[playerTailY][playerTailX];
    BOARD_GRID[playerTailY][playerTailX] = BOARD_FREE;
    if (currentCell === BOARD_PLAYER_2)  BOARD_GRID[playerTailY][playerTailX] = BOARD_PLAYER_1;
    // Move
    playerTailX = (playerTailX + STEP_X[playerSteps[0]] + BOARD_WIDTH)%BOARD_WIDTH;
    playerTailY = (playerTailY + STEP_Y[playerSteps[0]] + BOARD_HEIGHT)%BOARD_HEIGHT;
    playerSteps.splice(0,1);
  }

  function updateScore() {
    switch(playerMilestone) {
      case 0:
        if (playerScore >= 150) {
          snakeBoard.classList.toggle("milestone-150", true);
          playerMilestone = 150;
        }
      case 150:
        if (playerScore >= 500) {
          snakeBoard.classList.toggle("milestone-150", false);
          snakeBoard.classList.toggle("milestone-500", true);
          playerMilestone = 150;
        }
      case 500:
        if (playerScore >= 500) {
          snakeBoard.classList.toggle("milestone-500", false);
          snakeBoard.classList.toggle("milestone-1000", true);
          playerMilestone = 1000;
        }
    }
  }

  function updateDivs() {
    for (let y=0; y<BOARD_HEIGHT; y++) {
      for (let x=0; x<BOARD_WIDTH; x++) {
        let currentCell = BOARD_GRID[y][x];
        let currentCellDiv = BOARD_DIV[y][x];
        currentCellDiv.className = "";
        if (currentCell === BOARD_BLOCK) {
          currentCellDiv.classList.add("board-block");
        } else if (currentCell === BOARD_FOOD) {
          currentCellDiv.classList.add("board-food");
        } else if (currentCell === BOARD_PLAYER_1) {
          currentCellDiv.classList.add("board-player");
        } else if (currentCell === BOARD_PLAYER_2) {
          currentCellDiv.classList.add("board-player2");
        } else if (currentCell === BOARD_CROSSBUFF) {
          currentCellDiv.classList.add("board-crossbuff");
        }
        // Add border to snake head
        if (playerX == x && playerY == y) {
          currentCellDiv.classList.add("board-playerhead");
        } 
      }
    }

    scoreCountDiv.innerText = playerScore;
    playerCountDiv.innerText = playerSteps.length;
    crossCountDiv.innerText = playerCrossCount;
    buffTimerDiv.innerText = buffTimer;
    playtimeDiv.innerText = toReadableTime(playtime);
  }

  function gameOver() {
    if (isGameOver) return;
    isGameOver = true;
    clearInterval(intervalControlNumber);
    titleH.innerText = "Game Over!";
    if (highScore < playerScore) {
      highScore = playerScore;
      highScoreDiv.innerText = highScore.toString().padStart(2, "\xa0");
      titleH.innerText = "New Highscore!";
      localStorage.setItem("snake-highscore", highScore);
    }
    gameMessageDiv.innerText = "Game over! Press SPACE to choose the level, or R to restart.";
  }
  function togglePause() {
    if (isGameOver) return;
    isPaused = !isPaused;
    if (isPaused) titleH.innerText = "Paused";
    else {
      titleH.innerText = "Snake";
      lastTimestamp = Date.now();
    }
  }

  function returnBlankCell() {
    while(true) {
      let x = Math.floor(Math.random()*BOARD_WIDTH);
      let y = Math.floor(Math.random()*BOARD_HEIGHT);
      if (BOARD_GRID[y][x] === BOARD_FREE) return [x, y];
    }
  }

  function newGame () {
    isGameOver = false;
    isPaused = false;
    playerSteps = [];
    playerX = 20;
    playerY = 2;
    playerTailX = playerX;
    playerTailY = playerY;
    playerScore = 0;
    playerMilestone = 0;
    playerGrowCount = 1;
    playerCrossCount = 0;
    playerControl = STEP_LEFT;
    playtime = 0;
    buffTimer = 0;
    for (let y=0; y<BOARD_HEIGHT; y++) {
      for (let x=0; x<BOARD_WIDTH; x++) {
        if (BOARD_GRID[y][x] !== BOARD_BLOCK) BOARD_GRID[y][x] = BOARD_FREE;
      }
    }
    // Generate food randomly
    let coords = returnBlankCell();
    BOARD_GRID[coords[1]][coords[0]] = BOARD_FOOD;
    // Add the interval function
    intervalControlNumber = setInterval(updateGame, 1/GAME_PERIOD * 1000);
    // Update UI elements
    titleH.innerText = "Snake";
    highScoreDiv.innerText = highScore;
    snakeBoard.classList.toggle("milestone-150", false);
    snakeBoard.classList.toggle("milestone-500", false);
    snakeBoard.classList.toggle("milestone-1000", false);
    playtimeDiv.innerText = "0s";
    lastTimestamp = Date.now();
    gameMessageDiv.innerText = "";
  }

  function toReadableTime(timestamp) {
    if (timestamp >= 3600) {
      return Math.floor(timestamp/3600).toString()
        + ":" + Math.floor((timestamp/60)%60).toString().padStart(2, "0")
        + ":" + Math.floor((timestamp)%60).toString().padStart(2, "0");
    } else if (timestamp > 60) {
      return Math.floor(timestamp/60).toString()
      + ":" + Math.floor((timestamp)%60).toString().padStart(2, "0");
    } else return Math.floor(timestamp) + "s";
  }

  function gameInput(code) {
    let currentControl = playerControl, toQueue;

    if (controlQueue.length > 0) currentControl = controlQueue[controlQueue.length-1];
    else if (playerSteps.length > 0) currentControl = playerSteps[playerSteps.length-1];

    if (code === "KeyW" || code === "ArrowUp") {
      toQueue = STEP_UP;
    } else if (code === "KeyA" || code === "ArrowLeft") {
      toQueue = STEP_LEFT;
    } else if (code === "KeyS" || code === "ArrowDown") {
      toQueue = STEP_DOWN;
    } else if (code === "KeyD" || code === "ArrowRight") {
      toQueue = STEP_RIGHT;
    } else if (code === "KeyR") {
      gameOver();
      newGame();
      return true;
    } else if (code === "Space") {
      togglePause();
      return true;
    } else return false;
    if (controlQueue.length < 3) {
      if (toQueue === STEP_OPPOSITE[currentControl]) toQueue = currentControl;
      controlQueue.push(toQueue);
    }
    return true;
  }

  document.addEventListener("keydown", (event) => {
    if (gameInput(event.code)) event.preventDefault();
  });

  window.addEventListener('resize', function(event) {
    let currentBigScreenSize = bigScreenSize;
    bigScreenSize = window.innerWidth > 600;
    if (currentBigScreenSize != bigScreenSize) {
      let size = bigScreenSize?"10px":"6px";
      for (let y=0; y<BOARD_HEIGHT; y++) {
        for (let x=0; x<BOARD_WIDTH; x++) {
          let elem = BOARD_DIV[y][x];
          elem.style.width = size;
          elem.style.height = size;
        }
      }
    }
  },);

  updateDivs();
  highScoreDiv.innerText = highScore;
}