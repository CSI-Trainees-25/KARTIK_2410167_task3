const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 800;
canvas.height = window.innerHeight;

const speed = 3;
let offset = 0; 
let gameStarted = false;

function drawRoad() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

 
  // Road edges 
  const roadWidth = canvas.width * 0.6; 
  const roadTopWidth = canvas.width * 0.25; 

  const roadBottomLeft = {x: (canvas.width - roadWidth) / 2, y: canvas.height};
  const roadBottomRight = {x: (canvas.width + roadWidth) / 2, y: canvas.height};
  const roadTopLeft = {x: (canvas.width - roadTopWidth) / 2, y: 0};
  const roadTopRight = {x: (canvas.width + roadTopWidth) / 2, y: 0};

  // Draw road 
  
  ctx.beginPath();
  ctx.moveTo(roadTopLeft.x, roadTopLeft.y);
  ctx.lineTo(roadTopRight.x, roadTopRight.y);
  ctx.lineTo(roadBottomRight.x, roadBottomRight.y);
  ctx.lineTo(roadBottomLeft.x, roadBottomLeft.y);
  ctx.closePath();
  ctx.fillStyle = "#444";
  ctx.fill(); 

  // Grass left
  ctx.fillStyle = "green";
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(roadTopLeft.x, roadTopLeft.y);
  ctx.lineTo(roadBottomLeft.x, roadBottomLeft.y);
  ctx.lineTo(0, canvas.height);
  ctx.closePath();
  ctx.fill();

  // Grass right
 
  ctx.beginPath();
  ctx.moveTo(canvas.width, 0);
  ctx.lineTo(roadTopRight.x, roadTopRight.y);
  ctx.lineTo(roadBottomRight.x, roadBottomRight.y);
  ctx.lineTo(canvas.width, canvas.height);
  ctx.closePath();
   ctx.fillStyle = "green";
  ctx.fill();

  // Side walls 
  
  ctx.beginPath();
  ctx.moveTo(roadTopLeft.x, roadTopLeft.y);
  ctx.lineTo(roadTopLeft.x + 5, 0);
  ctx.lineTo(roadBottomLeft.x + 5, roadBottomLeft.y);
  ctx.lineTo(roadBottomLeft.x, roadBottomLeft.y);
  ctx.closePath();
  ctx.fillStyle = "#d2b48c";
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(roadTopRight.x, roadTopRight.y);
  ctx.lineTo(roadTopRight.x - 5, 0);
  ctx.lineTo(roadBottomRight.x - 5, roadBottomRight.y);
  ctx.lineTo(roadBottomRight.x, roadBottomRight.y);
  ctx.closePath();
  ctx.fill();

  // Lane markings for 3 lanes 
  ctx.strokeStyle = "white";
  

  // lane moving
  for (let i = 0; i < 15; i++) {
    let t = i * 80 + offset; 
    let y = t % canvas.height; 
    let progress = y / canvas.height; 
    
    if (y >= 0 && y <= canvas.height) {
      
      let roadWidthBottom = roadBottomRight.x - roadBottomLeft.x;
      let roadWidthTop = roadTopRight.x - roadTopLeft.x;
      let roadWidth = roadWidthTop + (roadWidthBottom - roadWidthTop) * progress;
      
      let roadLeftBottom = roadBottomLeft.x;
      let roadLeftTop = roadTopLeft.x;
      let roadLeft = roadLeftTop + (roadLeftBottom - roadLeftTop) * progress;
      
      //  3 lanes
      let laneWidth = roadWidth / 3;
      
      //  (lane between lane 1 and 2)
      let leftDividerX = roadLeft + laneWidth;
      ctx.lineWidth = Math.max(1, 4 * progress); 
      ctx.beginPath();
      ctx.moveTo(leftDividerX, y);
      ctx.lineTo(leftDividerX, y + 25 * progress);
      ctx.stroke();
      
      //  ( lane between lane 2 and 3)
      let rightDividerX = roadLeft + 2 * laneWidth;
      ctx.beginPath();
      ctx.moveTo(rightDividerX, y);
      ctx.lineTo(rightDividerX, y + 25 * progress); 
      ctx.stroke();
    }
  }

  // edge lines
  ctx.strokeStyle = "yellow";
  ctx.lineWidth = 2;
  
  // Left edge line
  ctx.beginPath();
  ctx.moveTo(roadTopLeft.x, roadTopLeft.y);
  ctx.lineTo(roadBottomLeft.x, roadBottomLeft.y);
  ctx.stroke();
  
  // Right edge line
  ctx.beginPath();
  ctx.moveTo(roadTopRight.x, roadTopRight.y);
  ctx.lineTo(roadBottomRight.x, roadBottomRight.y);
  ctx.stroke();

  offset += speed;
  if (offset > 80) offset = 0;
}

const carImg = new Image();
carImg.src = "car2.png";
// Car setup
let carWidth = canvas.width * 0.2, carHeight = canvas.width * 0.15;
let carX = canvas.width / 2 - carWidth / 2;
let carY = canvas.height - carHeight - 40;
let carSpeed = 5;

let keys = {};
document.addEventListener("keydown", e => keys[e.key] = true);
document.addEventListener("keyup", e => keys[e.key] = false);

// Obstacle setup
const obstacleImg = new Image();
obstacleImg.src = "obstacle.png";

let obstacles = [];
let lastObstacleTime = 0;
const obstacleInterval = 800; 

function createObstacle() {
  if(!gameStarted) return;

  const now = Date.now();
  if (now - lastObstacleTime > obstacleInterval) {
    
    const lane = Math.floor(Math.random() * 3);
    
    
    const roadTopWidth = canvas.width * 0.25;
    const laneWidth = roadTopWidth / 3;
    const obstacleX = (canvas.width - roadTopWidth) / 2 + lane * laneWidth + laneWidth / 2;
    
    obstacles.push({
      x: obstacleX,
      y: 0,
      lane: lane
    });
    
    lastObstacleTime = now;
  }
}

function updateObstacles() {
  
  for (let i = obstacles.length - 1; i >= 0; i--) {
    let obstacle = obstacles[i];
    let obstacleSpeed = 7 + (Math.floor(score / 300) * 2);
    obstacle.y += obstacleSpeed;
  
    if (!passedObstacles.has(obstacle) && obstacle.y > carY + carHeight) {
      passedObstacles.add(obstacle);
      score += 10;
     
    }
    
    
    let progress = obstacle.y / canvas.height;
    
    if (progress <= 1) {
      
      const roadWidthBottom = canvas.width * 0.6;
      const roadWidthTop = canvas.width * 0.25;
      const roadWidth = roadWidthTop + (roadWidthBottom - roadWidthTop) * progress;
      
      const roadLeft = (canvas.width - roadWidth) / 2;
      const laneWidth = roadWidth / 3;
      
      obstacle.x = roadLeft + obstacle.lane * laneWidth + laneWidth / 2 - obstacle.width / 2;
      obstacle.width = canvas.width * 0.06 * (0.5 + progress * 0.5); 
      obstacle.height = obstacle.width;
    }
    
   
    if (obstacle.y > canvas.height) {
      obstacles.splice(i, 1);
    }
   
  }
}

function drawObstacles() {
  for (let obstacle of obstacles) {
    if (obstacleImg.complete) {
      ctx.drawImage(obstacleImg, obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    }
  }
}


// Collision 
let gameOver = false;
let showBlast = false;
let blastStartTime = 0;

const blastImg = new Image();
blastImg.src = "blast.png";

function checkCollision() {
  if (gameOver) return;
  
  for (let obstacle of obstacles) {
    
    if (carX < obstacle.x + obstacle.width &&
        carX + carWidth > obstacle.x &&
        carY < obstacle.y + obstacle.height &&
        carY + carHeight > obstacle.y) {
      
      // Collision detected!
      gameOver = true;
      showBlast = true;
      blastStartTime = Date.now();
     
      obstacles = [];
      
      break; 
    }
  }
}


// coin setup
const coinImg = new Image();
coinImg.src = "coin.png";

let coins = [];
let lastCoinTime = 0;
const coinInterval = 4700;

function createCoin() {
  if(!gameStarted) return;

  const now = Date.now();
  if (now - lastCoinTime > coinInterval) {

    const lane = Math.floor(Math.random() * 3);

    
    const roadTopWidth = canvas.width * 0.25;
    const laneWidth = roadTopWidth / 3;
    const coinX = (canvas.width - roadTopWidth) / 2 + lane * laneWidth + laneWidth / 2;

    coins.push({
      x: coinX,
      y: 0,
      lane: lane
    });

    lastCoinTime = now;
  }
}
let passedCoins = new Set(); 
function updateCoins() {

  for (let i = coins.length - 1; i >= 0; i--) {
    let coin = coins[i];
    coin.y += speed * 1.8;
    
    if (!passedCoins.has(coin) && coin.y > carY + carHeight) {
      passedCoins.add(coin);
      score += 10;
     
    }


    let progress = coin.y / canvas.height;

    if (progress <= 1) {
      
      const roadWidthBottom = canvas.width * 0.6;
      const roadWidthTop = canvas.width * 0.25;
      const roadWidth = roadWidthTop + (roadWidthBottom - roadWidthTop) * progress;
      
      const roadLeft = (canvas.width - roadWidth) / 2;
      const laneWidth = roadWidth / 3;

      coin.x = roadLeft + coin.lane * laneWidth + laneWidth / 2 - coin.width / 2;
      coin.width = canvas.width * 0.06 * (0.5 + progress * 0.5);
      coin.height = coin.width;
    }
    
   
    if (coin.y > canvas.height) {
      coins.splice(i, 1);
    }
   
  }
}

function drawCoins() {
  for (let coin of coins) {
    if (coinImg.complete) {
      ctx.drawImage(coinImg, coin.x, coin.y, coin.width, coin.height);
    }
  }
}



// Score system
let score = 0;
let passedObstacles = new Set(); 

function drawScore() {
 
  const roadTopWidth = canvas.width * 0.25;
  const scoreX = canvas.width / 2;
  const scoreY = 50;
  
  
  ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
  ctx.fillRect(scoreX - 80, scoreY - 30, 160, 40);
  
 
  ctx.fillStyle = "white";
  ctx.font = "24px Arial";
  ctx.textAlign = "center";
  ctx.fillText(`Score: ${score}`, scoreX, scoreY);

    // Highest score 
  let highestScore = parseInt(localStorage.getItem('highestScore')) || 0;
  highestScore = Math.max(highestScore, score);
  localStorage.setItem('highestScore', highestScore);
  
  ctx.fillStyle = "white";
  ctx.font = "18px Arial";
  ctx.textAlign = "center";
  ctx.fillText(`Highest Score: ${highestScore}`, 100, 25);
}

function checkCoinCollision() {
  if (gameOver) return;

  for (let coin of coins) {

    if (carX < coin.x + coin.width &&
        carX + carWidth > coin.x &&
        carY < coin.y + coin.height &&
        carY + carHeight > coin.y) {

      score += 50; // Increase score by 50 for collecting a coin
      coins.splice(coins.indexOf(coin), 1);
      passedCoins.delete(coin); 

      coins = [];

      break;
    }
  }
}


function gameLoop() {
  if (!gameOver) {
    drawRoad();
    
    
    createObstacle();
    updateObstacles();
    createCoin();
    updateCoins();
    
    const carProgress = carY / canvas.height; 
    const roadWidth = canvas.width * 0.6; 
    const roadTopWidth = canvas.width * 0.25;
    const roadWidthAtCar = roadTopWidth + (roadWidth - roadTopWidth) * carProgress;
    const roadLeftAtCar = (canvas.width - roadWidthAtCar) / 2 - 20;
    const roadRightAtCar = (canvas.width + roadWidthAtCar) / 2 + 20;


    // Update car speed based on score

    carSpeed = 5 + (Math.floor(score / 200) * 2);

    if (keys["ArrowLeft"] && carX > roadLeftAtCar) carX -= carSpeed;
    if (keys["ArrowRight"] && carX + carWidth < roadRightAtCar) carX += carSpeed;

   
    checkCollision();
    checkCoinCollision();
   
    drawObstacles();
    drawCoins();

    drawScore();
  } else {
  
   
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    
    const roadWidth = canvas.width * 0.6; 
    const roadTopWidth = canvas.width * 0.25; 
    const roadBottomLeft = {x: (canvas.width - roadWidth) / 2, y: canvas.height};
    const roadBottomRight = {x: (canvas.width + roadWidth) / 2, y: canvas.height};
    const roadTopLeft = {x: (canvas.width - roadTopWidth) / 2, y: 0};
    const roadTopRight = {x: (canvas.width + roadTopWidth) / 2, y: 0};

    ctx.beginPath();
    ctx.moveTo(roadTopLeft.x, roadTopLeft.y);
    ctx.lineTo(roadTopRight.x, roadTopRight.y);
    ctx.lineTo(roadBottomRight.x, roadBottomRight.y);
    ctx.lineTo(roadBottomLeft.x, roadBottomLeft.y);
    ctx.closePath();
    ctx.fillStyle = "#444";
    ctx.fill();

      // Grass left
  ctx.fillStyle = "green";
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(roadTopLeft.x, roadTopLeft.y);
  ctx.lineTo(roadBottomLeft.x, roadBottomLeft.y);
  ctx.lineTo(0, canvas.height);
  ctx.closePath();
  ctx.fill();

  // Grass right
 
  ctx.beginPath();
  ctx.moveTo(canvas.width, 0);
  ctx.lineTo(roadTopRight.x, roadTopRight.y);
  ctx.lineTo(roadBottomRight.x, roadBottomRight.y);
  ctx.lineTo(canvas.width, canvas.height);
  ctx.closePath();
   ctx.fillStyle = "green";
  ctx.fill();

   // edge lines
  ctx.strokeStyle = "yellow";
  ctx.lineWidth = 2;
  
  // Left edge line
  ctx.beginPath();
  ctx.moveTo(roadTopLeft.x, roadTopLeft.y);
  ctx.lineTo(roadBottomLeft.x, roadBottomLeft.y);
  ctx.stroke();
  
  // Right edge line
  ctx.beginPath();
  ctx.moveTo(roadTopRight.x, roadTopRight.y);
  ctx.lineTo(roadBottomRight.x, roadBottomRight.y);
  ctx.stroke();
  }
  

  
  if (showBlast) {
   
    if (Date.now() - blastStartTime < 500) {
      if (blastImg.complete) {
        ctx.drawImage(blastImg, carX, carY, carWidth, carHeight);
      } 
    } else {
      showBlast = false; 
    }
  } else if (!gameOver) {
    
    if (carImg.complete) ctx.drawImage(carImg, carX, carY, carWidth, carHeight);
  }

  
  if (gameOver && !showBlast) {
    drawRoad();
    //  drawScore();

    ctx.fillStyle = "red";
    ctx.font = "48px Arial";
    ctx.textAlign = "center";
    ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2);
    
    ctx.fillStyle = "yellow";
    ctx.font = "48px Arial";
    ctx.textAlign = "center";
    ctx.fillText("SCORE : " + score, canvas.width / 2, canvas.height / 2 + 50);

    ctx.fillStyle = "white";
    ctx.font = "24px Arial";
    ctx.fillText("Press R to Restart", canvas.width / 2, canvas.height / 2 + 100);
  }
  if (!gameStarted && !gameOver) {
     ctx.fillStyle = "yellow";
    ctx.font = "48px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Press any key to Start", canvas.width / 2, canvas.height / 2 + 50);
  }
  
  requestAnimationFrame(gameLoop);
}


document.addEventListener("keydown", e => {
  keys[e.key] = true;

   if (!gameStarted && !gameOver) {
    gameStarted = true;
  }
  
  // Restart game 
  if (e.key === 'r' || e.key === 'R') {
    if (gameOver) {
     
      gameStarted = false;
      gameOver = false;
      showBlast = false;
      obstacles = [];
      passedObstacles.clear();
      coins = [];
      passedCoins.clear();
      score = 0;
      carX = canvas.width / 2 - carWidth / 2;
      carSpeed = 10; 
      offset = 0;
      lastObstacleTime = 0;
    }
  }
});

 gameLoop();
