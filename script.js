const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 800;
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
  

   // Draw road 
  
  ctx.beginPath();
  ctx.moveTo(roadTopLeft.x, roadTopLeft.y);
  ctx.lineTo(roadTopRight.x, roadTopRight.y);
  ctx.lineTo(roadBottomRight.x, roadBottomRight.y);
  ctx.lineTo(roadBottomLeft.x, roadBottomLeft.y);
  ctx.closePath();
  ctx.fillStyle = "#444";
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
    let t = i * 80 + offset; // spacing between dashes
    let y = t % canvas.height; // Start from top (0) and go to bottom (canvas.height)
    let progress = y / canvas.height; // 0 at top, 1 at bottom
    
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
let carSpeed = 8;

let keys = {};
document.addEventListener("keydown", e => keys[e.key] = true);
document.addEventListener("keyup", e => keys[e.key] = false);

function gameLoop() {
  
  drawRoad();
 

  const carProgress = carY / canvas.height; 

  const roadWidth = canvas.width * 0.6; 
  const roadTopWidth = canvas.width * 0.25;

  //  road width at car's position
  const roadWidthAtCar = roadTopWidth + (roadWidth - roadTopWidth) * carProgress;


  const roadLeftAtCar = (canvas.width - roadWidthAtCar) / 2 - 20;
  const roadRightAtCar = (canvas.width + roadWidthAtCar) / 2 + 20;

  if (keys["ArrowLeft"] && carX > roadLeftAtCar) carX -= carSpeed;
  if (keys["ArrowRight"] && carX + carWidth < roadRightAtCar) carX += carSpeed;

  // Draw car
  if (carImg.complete) ctx.drawImage(carImg, carX, carY, carWidth, carHeight);
  requestAnimationFrame(gameLoop);
}
 gameLoop();