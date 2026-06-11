const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const scoreElement = document.getElementById("score");
const highScoreElement = document.getElementById("high-score");

const gridSize = 15; 
const tileCount = canvas.width / gridSize;

let snake = [{ x: 10, y: 10 }];
let food = { x: 5, y: 5 };

let dx = 1;
let dy = 0;

let score = 0;
let highScore = localStorage.getItem("snakeHighScore") || 0;
highScoreElement.innerText = highScore;

let gameInterval = setInterval(updateGame, 100);

function updateGame() {
    moveSnake();
    
    if (checkGameOver()) {
        alert("GAME OVER! Skor Anda: " + score);
        resetGame();
        return;
    }

    checkFoodCollision();
    draw();
}

function moveSnake() {
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    snake.unshift(head); 
    snake.pop(); 
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#2b3a1a";
    snake.forEach((part) => {
        ctx.fillRect(part.x * gridSize, part.y * gridSize, gridSize - 1, gridSize - 1);
    });

    ctx.fillStyle = "#1e2710";
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 1, gridSize - 1);
}

function checkFoodCollision() {
    if (snake[0].x === food.x && snake[0].y === food.y) {
        score += 10;
        scoreElement.innerText = score;
        snake.push({}); 
        generateFood();
        updateHighScore();
    }
}

function generateFood() {
    food.x = Math.floor(Math.random() * tileCount);
    food.y = Math.floor(Math.random() * tileCount);

    snake.forEach(part => {
        if (part.x === food.x && part.y === food.y) {
            generateFood();
        }
    });
}

function checkGameOver() {
    if (snake[0].x < 0 || snake[0].x >= tileCount || snake[0].y < 0 || snake[0].y >= tileCount) {
        return true;
    }
    for (let i = 1; i < snake.length; i++) {
        if (snake[0].x === snake[i].x && snake[0].y === snake[i].y) {
            return true;
        }
    }
    return false;
}

document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowUp" && dy === 0) { dx = 0; dy = -1; }
    if (e.key === "ArrowDown" && dy === 0) { dx = 0; dy = 1; }
    if (e.key === "ArrowLeft" && dx === 0) { dx = -1; dy = 0; }
    if (e.key === "ArrowRight" && dx === 0) { dx = 1; dy = 0; }
});

function changeDirection(direction) {
    if (direction === "UP" && dy === 0) { dx = 0; dy = -1; }
    if (direction === "DOWN" && dy === 0) { dx = 0; dy = 1; }
    if (direction === "LEFT" && dx === 0) { dx = -1; dy = 0; }
    if (direction === "RIGHT" && dx === 0) { dx = 1; dy = 0; }
}

function updateHighScore() {
    if (score > highScore) {
        highScore = score;
        highScoreElement.innerText = highScore;
        localStorage.setItem("snakeHighScore", highScore);
    }
}

function resetGame() {
    snake = [{ x: 10, y: 10 }];
    generateFood();
    dx = 1;
    dy = 0;
    score = 0;
    scoreElement.innerText = score;
}
