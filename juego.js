// Variables globales
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const box = 20;
let snake = [];
let direction = "right";
let nextDirection = null;
let food = {};
let score = 0;
let game = null;
let currentSpeed = 200;
let isPaused = false;
let gameStarted = false;

// Imágenes
const heartImage = new Image();
heartImage.src = "https://cdn-icons-png.flaticon.com/512/833/833472.png";

// Mensajes especiales
const compliments = [
  "Nayeli, usted es una hermosa mujer 💕",
  "Nayeli, su sonrisa ilumina mi día ✨",
  "Eres la reina de mi corazón 👑",
  "Tu belleza me deja sin palabras 😍",
  "Nayeli, eres más bella que las estrellas ✨"
];

// Inicializar juego
function initGame() {
  canvas.width = 300;
  canvas.height = 300;
  
  // Event listeners para teclado
  document.addEventListener("keydown", handleKeyDown);
  
  // Iniciar cuando la imagen esté cargada
  if (heartImage.complete) {
    startGame();
  } else {
    heartImage.onload = startGame;
  }
}

// Manejar teclas
function handleKeyDown(e) {
  if (!gameStarted) return;
  
  switch(e.key) {
    case "ArrowLeft": changeDirection("left"); break;
    case "ArrowUp": changeDirection("up"); break;
    case "ArrowRight": changeDirection("right"); break;
    case "ArrowDown": changeDirection("down"); break;
    case " ": togglePause(); break;
    case "r": restartGame(); break;
  }
}

// Cambiar dirección
function changeDirection(dir) {
  if (isPaused) return;
  
  // Evitar movimiento inverso
  if (
    (dir === "left" && direction !== "right") ||
    (dir === "up" && direction !== "down") ||
    (dir === "right" && direction !== "left") ||
    (dir === "down" && direction !== "up")
  ) {
    nextDirection = dir;
  }
}

// Generar comida
function generateFood() {
  let newFood;
  let maxAttempts = 100;
  let validPosition = false;
  
  while (!validPosition && maxAttempts-- > 0) {
    newFood = {
      x: Math.floor(Math.random() * (canvas.width / box)) * box,
      y: Math.floor(Math.random() * (canvas.height / box)) * box
    };
    
    validPosition = !snake.some(segment => 
      segment.x === newFood.x && segment.y === newFood.y
    );
  }
  
  return newFood;
}

// Dibujar elementos
function draw() {
  if (isPaused) return;
  
  // Actualizar dirección
  if (nextDirection) {
    direction = nextDirection;
    nextDirection = null;
  }
  
  // Limpiar canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Dibujar comida
  ctx.drawImage(heartImage, food.x + 2, food.y + 2, box - 4, box - 4);
  
  // Dibujar serpiente
  drawSnake();
  
  // Mover serpiente
  moveSnake();
}

// Dibujar serpiente
function drawSnake() {
  ctx.beginPath();
  ctx.moveTo(snake[0].x + box/2, snake[0].y + box/2);
  
  for (let i = 1; i < snake.length; i++) {
    ctx.lineTo(snake[i].x + box/2, snake[i].y + box/2);
  }
  
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, "#ff69b4");
  gradient.addColorStop(1, "#ffc0cb");
  
  ctx.lineWidth = box;
  ctx.strokeStyle = gradient;
  ctx.stroke();
  
  // Dibujar cabeza
  ctx.fillStyle = "#ff1493";
  ctx.beginPath();
  ctx.arc(snake[0].x + box/2, snake[
