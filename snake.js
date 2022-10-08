{
  let gameDiv = document.getElementById("game-content");
  let snakeControllerDiv = document.getElementById("snake-controller");
  gameDiv.classList.add("mt-5", "p-3", "bg-white", "text-center");
  let titleH = document.createElement("h3");
  titleH.classList.add("text-center")
  titleH.innerText = "Snake";
  gameDiv.append(titleH);
  let firstScoreDiv = document.createElement("div");
  firstScoreDiv.classList.add("text-center");
  firstScoreDiv.style.fontFamily = "monospace";
  gameDiv.append(firstScoreDiv);
  let snakeBoard = document.createElement("div");
  snakeBoard.classList.add("mt-2", "border", "border-2", "rounded-2", "border-dark", "p-3", "text-center");
  snakeBoard.style.whiteSpace = "nowrap";
  snakeBoard.style.display = "inline-block";
  snakeBoard.style.fontSize = "0px";
  gameDiv.append(snakeBoard);
  let scoreDiv = document.createElement("div");
  scoreDiv.classList.add("text-center");
  scoreDiv.style.fontFamily = "monospace";
  let scoreCountDiv = document.createElement("span");
  scoreCountDiv.innerText = "0";
  let highScoreDiv = document.createElement("span");
  highScoreDiv.innerText = " 0";
  let playerCountDiv = document.createElement("span");
  playerCountDiv.innerText = "0";
  let crossCountDiv = document.createElement("span");
  crossCountDiv.innerText = "0";
  let buffTimerDiv = document.createElement("span");
  buffTimerDiv.innerText = "0";
  firstScoreDiv.append("Score:\xa0", scoreCountDiv, ", High:\xa0", highScoreDiv);
  scoreDiv.append("Length:\xa0", playerCountDiv,
    ", Cross:\xa0", crossCountDiv, ", BT:\xa0", buffTimerDiv,
    
    document.createElement("br"),
    document.createElement("br"),
    "CONTROLS:",document.createElement("br"),
    "WASD/Arrows - Move",document.createElement("br"),
    "R - Restart",document.createElement("br"),
    "Space - Pause");
  gameDiv.append(scoreDiv);
  let showControlsButton = document.createElement("button");
  showControlsButton.classList.add("btn", "btn-primary", "bg-primary", "border-primary");
  showControlsButton.innerText = "Show Touch Controls";
  showControlsButton.addEventListener("mousedown", (event)=>{
    event.preventDefault();
    if (snakeControllerDiv.style.display === "none")
      snakeControllerDiv.style.display = "initial";
    else snakeControllerDiv.style.display = "none";
  });
  gameDiv.append(showControlsButton);
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
  let highScore = parseInt(localStorage.getItem("snake-highscore") | "0");
  let playerGrowCount = 1;
  let playerCrossCount = 0;
  let playerControl = STEP_LEFT;

  let buffTimer = 0;
  let buffAppear = 150;
  let buffDisappear = 250;
  let buffX = -1;
  let buffY = -1;

  let isGameOver = true;
  let isPaused = false;
  let intervalControlNumber = -1;

  function updateGame () {
    if (isGameOver) return;
    if (isPaused) return;
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
    } else if (currentCell === BOARD_CROSSBUFF) {
      playerScore += 1;
      playerCrossCount++;
      playerGrowCount-=3;
      buffX = -1;
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
  function updateDivs() {
    for (let y=0; y<BOARD_HEIGHT; y++) {
      for (let x=0; x<BOARD_WIDTH; x++) {
        currentCell = BOARD_GRID[y][x];
        BOARD_DIV[y][x].style.backgroundColor = "#fff";
        BOARD_DIV[y][x].style.border = "";
        if (currentCell === BOARD_BLOCK) {
          BOARD_DIV[y][x].style.backgroundColor = "#000";
        } else if (currentCell === BOARD_FOOD) {
          BOARD_DIV[y][x].style.backgroundColor = "#2a2";
          BOARD_DIV[y][x].style.border = "2px solid #0f0";
        } else if (currentCell === BOARD_PLAYER_1) {
          BOARD_DIV[y][x].style.backgroundColor = "#88e";
        } else if (currentCell === BOARD_PLAYER_2) {
          BOARD_DIV[y][x].style.backgroundColor = "#33a";
        } else if (currentCell === BOARD_CROSSBUFF) {
          BOARD_DIV[y][x].style.backgroundColor = "#5c5";
          BOARD_DIV[y][x].style.border = "2px solid #ff0";
        }
        // Add border to snake head
        if (playerX == x && playerY == y) {
          BOARD_DIV[y][x].style.border = "2px solid #117";
        } 
      }
    }

    scoreCountDiv.innerText = playerScore.toString().padStart(2, "\xa0");
    playerCountDiv.innerText = playerSteps.length.toString().padStart(2, "\xa0");
    crossCountDiv.innerText = playerCrossCount.toString().padStart(2, "\xa0");
    buffTimerDiv.innerText = buffTimer.toString().padStart(3, "\xa0");
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
  }
  function togglePause() {
    if (isGameOver) return;
    isPaused = !isPaused;
    if (isPaused) titleH.innerText = "Paused";
    else titleH.innerText = "Snake";
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
    playerGrowCount = 1;
    playerCrossCount = 0;
    playerControl = STEP_LEFT;
    buffTimer = 0;
    for (let y=0; y<BOARD_HEIGHT; y++) {
      for (let x=0; x<BOARD_WIDTH; x++) {
        if (BOARD_GRID[y][x] !== BOARD_BLOCK) BOARD_GRID[y][x] = BOARD_FREE;
      }
    }
    // Generate food randomly
    let coords = returnBlankCell();
    BOARD_GRID[coords[1]][coords[0]] = BOARD_FOOD;
    intervalControlNumber = setInterval(updateGame, 1/GAME_PERIOD * 1000);
    titleH.innerText = "Snake";
    highScoreDiv.innerText = highScore.toString().padStart(2, "\xa0");
  }
  function gameInput(code) {
    let currentControl = playerSteps.length>0?playerSteps[playerSteps.length-1]:playerControl;
    if (code === "KeyW" || code === "ArrowUp") {
      playerControl = STEP_UP;
    } else if (code === "KeyA" || code === "ArrowLeft") {
      playerControl = STEP_LEFT;
    } else if (code === "KeyS" || code === "ArrowDown") {
      playerControl = STEP_DOWN;
    } else if (code === "KeyD" || code === "ArrowRight") {
      playerControl = STEP_RIGHT;
    } else if (code === "KeyR") {
      gameOver();
      newGame();
    } else if (code === "Space") {
      togglePause();
    } else return false;
    if (playerControl === STEP_OPPOSITE[currentControl]) playerControl = currentControl;
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

  newGame();
  updateDivs();
}