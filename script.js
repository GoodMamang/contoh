const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const scoreElement = document.getElementById("score");
const highScoreElement = document.getElementById("high-score");

// Ukuran kotak grid dalam game
const gridSize = 15; 
const tileCount = canvas.width / gridSize;

// Inisialisasi posisi ular (mulai dari tengah)
let snake = [{ x: 10, y: 10 }];
let food = { x: 5, y: 5 };

// Kecepatan awal pergerakan (arah X dan Y)
let dx = 1;
let dy = 0;

let score = 0;
let highScore = localStorage.getItem("snakeHighScore") || 0;
highScoreElement.innerText = highScore;

// Game Loop: fungsi utama yang berjalan terus menerus setiap 100ms
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
    // Membuat kepala baru berdasarkan arah gerak (dx, dy)
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    snake.unshift(head); // Tambah kepala baru di depan
    snake.pop(); // Hapus ekor paling belakang (ular berjalan)
}

function draw() {
    // Bersihkan layar canvas terlebih dahulu
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Menggambar Ular (Warna Hitam Jadul)
    ctx.fillStyle = "#2b3a1a";
    snake.forEach((part, index) => {
        // Kepala dibuat sedikit berbeda atau sama kotak polos khas retro
        ctx.fillRect(part.x * gridSize, part.y * gridSize, gridSize - 1, gridSize - 1);
    });

    // Menggambar Makanan (Kotak Polos berkedip/hitam)
    ctx.fillStyle = "#1e2710";
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 1, gridSize - 1);
}

function checkFoodCollision() {
    // Jika koordinat kepala ular sama dengan koordinat makanan
    if (snake[0].x === food.x && snake[0].y === food.y) {
        score += 10;
        scoreElement.innerText = score;
        
        // Ular bertambah panjang (caranya dengan tidak memotong ekor di frame ini)
        snake.push({}); 

        generateFood();
        updateHighScore();
    }
}

function generateFood() {
    // Menaruh makanan acak di dalam grid canvas
    food.x = Math.floor(Math.random() * tileCount);
    food.y = Math.floor(Math.random() * tileCount);

    // Memastikan makanan tidak muncul di dalam tubuh ular
    snake.forEach(part => {
        if (part.x === food.x && part.y === food.y) {
            generateFood();
        }
    });
}

function checkGameOver() {
    // 1. Tabrak Dinding Pembatas
    if (snake[0].x < 0 || snake[0].x >= tileCount || snake[0].y < 0 || snake[0].y >= tileCount) {
        return true;
    }
    // 2. Tabrak Tubuh Sendiri
    for (let i = 1; i < snake.length; i++) {
        if (snake[0].x === snake[i].x && snake[0].y === snake[i].y) {
            return true;
        }
    }
    return false;
}

// Membaca Input Keyboard Laptop/PC
document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowUp" && dy === 0) { dx = 0; dy = -1; }
    if (e.key === "ArrowDown" && dy === 0) { dx = 0; dy = 1; }
    if (e.key === "ArrowLeft" && dx === 0) { dx = -1; dy = 0; }
    if (e.key === "ArrowRight" && dx === 0) { dx = 1; dy = 0; }
});

// Membaca Input Tombol Layar (Untuk HP)
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
