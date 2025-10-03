const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let offset = 0; 
const speed = 3;

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
  

  // lane animation
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
      
      // Draw 2 lane dividers to create 3 lanes
      let laneWidth = roadWidth / 3;
      
      //  (lane between lane 1 and 2)
      let leftDividerX = roadLeft + laneWidth;
      ctx.lineWidth = Math.max(1, 4 * progress); // thicker as it comes toward us
      ctx.beginPath();
      ctx.moveTo(leftDividerX, y);
      ctx.lineTo(leftDividerX, y + 25 * progress); // dash length based on perspective
      ctx.stroke();
      
      //  ( lane between lane 2 and 3)
      let rightDividerX = roadLeft + 2 * laneWidth;
      ctx.beginPath();
      ctx.moveTo(rightDividerX, y);
      ctx.lineTo(rightDividerX, y + 25 * progress); // dash length based on perspective
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

  // 
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


// 
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
  const now = Date.now();
  if (now - lastObstacleTime > obstacleInterval) {
    
    const lane = Math.floor(Math.random() * 3);
    
    // Calculate obstacle position based on lane
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
    obstacle.y += speed * 1.8; 
    
     // Check if obstacle has been passed (car is above obstacle)
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
      obstacle.width = canvas.width * 0.08 * (0.5 + progress * 0.5); // Scale with perspective
      obstacle.height = obstacle.width;
    }
    
    // Remove obstacles that are off screen
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


// Collision and game state
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



// Score system
let score = 0;
let passedObstacles = new Set(); 

function drawScore() {
  // Position score at top center of the road
  const roadTopWidth = canvas.width * 0.25;
  const scoreX = canvas.width / 2;
  const scoreY = 50;
  
  // Draw score background
  ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
  ctx.fillRect(scoreX - 80, scoreY - 30, 160, 40);
  
  // Draw score text
  ctx.fillStyle = "white";
  ctx.font = "24px Arial";
  ctx.textAlign = "center";
  ctx.fillText(`Score: ${score}`, scoreX, scoreY);
}

function gameLoop() {
  if (!gameOver) {
    drawRoad();
    
    
    createObstacle();
    updateObstacles();
    
    const carProgress = carY / canvas.height; 
    const roadWidth = canvas.width * 0.6; 
    const roadTopWidth = canvas.width * 0.25;
    const roadWidthAtCar = roadTopWidth + (roadWidth - roadTopWidth) * carProgress;
    const roadLeftAtCar = (canvas.width - roadWidthAtCar) / 2 - 20;
    const roadRightAtCar = (canvas.width + roadWidthAtCar) / 2 + 20;

    if (keys["ArrowLeft"] && carX > roadLeftAtCar) carX -= carSpeed;
    if (keys["ArrowRight"] && carX + carWidth < roadRightAtCar) carX += carSpeed;

   
    checkCollision();
    
   
    drawObstacles();

    drawScore();
  } else {
    // drawRoad();
   
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw static road (without moving lane markings)
    const roadWidth = canvas.width * 0.6; 
    const roadTopWidth = canvas.width * 0.25; 
    const roadBottomLeft = {x: (canvas.width - roadWidth) / 2, y: canvas.height};
    const roadBottomRight = {x: (canvas.width + roadWidth) / 2, y: canvas.height};
    const roadTopLeft = {x: (canvas.width - roadTopWidth) / 2, y: 0};
    const roadTopRight = {x: (canvas.width + roadTopWidth) / 2, y: 0};

    // Draw road surface
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
  
  requestAnimationFrame(gameLoop);
}


document.addEventListener("keydown", e => {
  keys[e.key] = true;
  
  // Restart game when R is pressed
  if (e.key === 'r' || e.key === 'R') {
    if (gameOver) {
      // Reset game data
      gameOver = false;
      showBlast = false;
      obstacles = [];
      passedObstacles.clear();
      score = 0;
      carX = canvas.width / 2 - carWidth / 2;
      offset = 0;
      lastObstacleTime = 0;
    }
  }
});

 gameLoop();

