     const canvas = document.getElementById("game");
     const ctx = canvas.getContext("2d");
     const box = 20;
     let snake, direction, food, score, game;
     let currentSpeed = 140;

     const heartImage = new Image();
     heartImage.src = "https://cdn-icons-png.flaticon.com/512/833/833472.png";

     const compliments = [
       "Nayeli, usted es una hermosa mujer 💕",
       "Nayeli, su sonrisa ilumina mi día ✨",
       "Eres la reina de mi corazón 👑",
       "Tu belleza me deja sin palabras 😍",
       "Nayeli, eres más bella que las estrellas ✨"
     ];

     function generateFood() {
       return {
         x: Math.floor(Math.random() * 15) * box,
         y: Math.floor(Math.random() * 15) * box
       };
     }

     function changeDirection(dir) {
       if (dir === "left" && direction !== "right") direction = "left";
       else if (dir === "up" && direction !== "down") direction = "up";
       else if (dir === "right" && direction !== "left") direction = "right";
       else if (dir === "down" && direction !== "up") direction = "down";
     }

     function draw() {
       ctx.clearRect(0, 0, canvas.width, canvas.height);

       for (let i = 0; i < snake.length; i++) {
         ctx.fillStyle = i === 0 ? "#ff69b4" : "#ffc0cb";
         ctx.fillRect(snake[i].x, snake[i].y, box, box);
       }

       ctx.drawImage(heartImage, food.x + 2, food.y + 2, box - 4, box - 4);

       let headX = snake[0].x;
       let headY = snake[0].y;

       if (direction === "left") headX -= box;
       if (direction === "up") headY -= box;
       if (direction === "right") headX += box;
       if (direction === "down") headY += box;

       if (headX === food.x && headY === food.y) {
         score++;
         document.getElementById("counter").innerText = `Corazones: ${score} / 20`;
         if (score >= 20) {
           clearInterval(game);
           document.getElementById("message").innerText = "🌟 ¡Has ganado, Nayeli! Eres el amor de mi vida 🌟";
           document.getElementById("restart").style.display = "inline-block";
           return;
         }
         food = generateFood();
         document.getElementById("message").innerText = "💘 Te amo Nayeli 💘";
         if (score % 5 === 0) {
           const compliment = compliments[(score / 5 - 1) % compliments.length];
           document.getElementById("message").innerText = compliment;
         }
       } else {
         snake.pop();
       }

       const newHead = { x: headX, y: headY };

       if (
         headX < 0 ||
         headX >= canvas.width ||
         headY < 0 ||
         headY >= canvas.height ||
         snake.some(segment => segment.x === headX && segment.y === headY)
       ) {
         clearInterval(game);
         document.getElementById("message").innerText = "💔 Fin del juego, Nayeli 💔";
         document.getElementById("restart").style.display = "inline-block";
         return;
       }

       snake.unshift(newHead);
     }

     function startGame(speed = 140) {
       currentSpeed = speed;
       snake = [{ x: 5 * box, y: 5 * box }];
       direction = "right";
       food = generateFood();
       score = 0;
       document.getElementById("message").innerText = "";
       document.getElementById("restart").style.display = "none";
       document.getElementById("counter").innerText = "Corazones: 0 / 20";
       clearInterval(game);
       game = setInterval(draw, speed);
     }

     function startGameWithSpeed(speed) {
       startGame(speed);
     }

     function restartGame() {
       startGame(currentSpeed);
     }

     if (heartImage.complete) {
       startGame();
     } else {
       heartImage.onload = startGame;
     }
     
