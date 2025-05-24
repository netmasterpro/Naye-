// Variables globales
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const box = 20;
let snake, direction, nextDirection, food, score, game;
let currentSpeed = 140;
let isPaused = false;

// Precargar imagen de corazón
const heartImage = new Image();
heartImage.src = "https://cdn-icons-png.flaticon.com/512/833/833472.png";

// Array de cumplidos
const compliments = [
  "Nayeli, usted es una hermosa mujer 💕",
  "Nayeli, su sonrisa ilumina mi día ✨",
  "Eres la reina de mi corazón 👑",
  "Tu belleza me deja sin palabras 😍",
  "Nayeli, eres más bella que las estrellas ✨"
];

// Generar comida en posición aleatoria
function generateFood() {
  let newFood;
  do {
    newFood = {
      x: Math.floor(Math.random() * 15) * box,
      y: Math.floor(Math.random() * 15) * box
    };
  } while (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
  
  return newFood;
}

// Cambiar dirección con buffer para evitar movimientos inversos
function changeDirection(dir) {
  if (dir === "left" && direction !== "right") nextDirection = "left";
  else if (dir === "up" && direction !== "down") nextDirection = "up";
  else if (dir === "right" && direction !== "left") nextDirection = "right";
  else if (dir === "down" && direction !== "up") nextDirection = "down";
}

// Función de pausa
function togglePause() {
  isPaused = !isPaused;
  if (isPaused) {
    clearInterval(game);
    document.getElementById("message").innerText = "⏸️ Juego en pausa";
  } else {
    game = setInterval(draw, currentSpeed);
    document.getElementById("message").innerText = "";
  }
}

// Dibujar el juego
function draw() {
  if (isPaused) return;

  // Aplicar dirección desde el buffer
  if (nextDirection) {
    direction = nextDirection;
    nextDirection = null;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Dibujar comida
  ctx.drawImage(heartImage, food.x + 2, food.y + 2, box - 4, box - 4);

  // Dibujar serpiente
  ctx.beginPath();
  ctx.moveTo(snake[0].x + box / 2, snake[0].y + box / 2);
  for (let i = 1; i < snake.length; i++) {
    ctx.lineTo(snake[i].x + box / 2, snake[i].y + box / 2);
  }

  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, "#ff69b4");
  gradient.addColorStop(1, "#ffc0cb");

  ctx.lineWidth = box;
  ctx.strokeStyle = gradient;
  ctx.stroke();

  // Mover serpiente
  let headX = snake[0].x;
  let headY = snake[0].y;

  if (direction === "left") headX -= box;
  if (direction === "up") headY -= box;
  if (direction === "right") headX += box;
  if (direction === "down") headY += box;

  // Comprobar si comió
  if (headX === food.x && headY === food.y) {
    score++;
    document.getElementById("counter").innerText = `Corazones: ${score} / 20`;
    
    if (score >= 20) {
      endGame(true);
      return;
    }
    
    food = generateFood();
    updateMessage();
  } else {
    snake.pop();
  }

  // Comprobar colisiones
  const newHead = { x: headX, y: headY };
  if (checkCollision(newHead)) {
    endGame(false);
    return;
  }

  snake.unshift(newHead);
}

// Comprobar colisiones
function checkCollision(head) {
  return (
    head.x < 0 ||
    head.x >= canvas.width ||
    head.y < 0 ||
    head.y >= canvas.height ||
    snake.some(segment => segment.x === head.x && segment.y === head.y)
  );
}

// Actualizar mensaje
function updateMessage() {
  if (score % 5 === 0) {
    const compliment = compliments[(score / 5 - 1) % compliments.length];
    document.getElementById("message").innerText = compliment;
  } else {
    document.getElementById("message").innerText = "💘 Te amo Nayeli 💘";
  }
}

// Finalizar juego
function endGame(win) {
  clearInterval(game);
  if (win) {
    document.getElementById("message").innerText = "🌟 ¡Has ganado, Nayeli! Eres el amor de mi vida 🌟";
    document.getElementById("finalImage").style.display = "block";
  } else {
    document.getElementById("message").innerText = "💔 Fin del juego, Nayeli 💔";
  }
  document.getElementById("restart").style.display = "inline-block";
}

// Iniciar juego
function startGame(speed = 140) {
  currentSpeed = speed;
  snake = [{ x: 5 * box, y: 5 * box }];
  direction = "right";
  nextDirection = null;
  food = generateFood();
  score = 0;
  isPaused = false;
  
  document.getElementById("message").innerText = "";
  document.getElementById("restart").style.display = "none";
  document.getElementById("counter").innerText = "Corazones: 0 / 20";
  document.getElementById("finalImage").style.display = "none";
  
  clearInterval(game);
  game = setInterval(draw, speed);
}

function startGameWithSpeed(speed) {
  startGame(speed);
}

function restartGame() {
  startGame(currentSpeed);
}

// Iniciar cuando la imagen esté cargada
if (heartImage.complete) {
  startGame();
} else {
  heartImage.onload = startGame;
}

// Controles de teclado
document.addEventListener("keydown", e => {
  switch(e.key) {
    case "ArrowLeft": changeDirection("left"); break;
    case "ArrowUp": changeDirection("up"); break;
    case "ArrowRight": changeDirection("right"); break;
    case "ArrowDown": changeDirection("down"); break;
    case " ": togglePause(); break;
  }
});
