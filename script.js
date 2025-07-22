const player = document.getElementById('player');
const gameContainer = document.getElementById('gameContainer');
const scoreDisplay = document.getElementById('score');

let score = 0;
let bullets = [];
let enemies = [];
let playerX = 180;
let moveSpeed = 10;

document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft' && playerX > 0) {
    playerX -= moveSpeed;
  } else if (e.key === 'ArrowRight' && playerX < 360) {
    playerX += moveSpeed;
  } else if (e.key === ' ') {
    shootBullet();
  }
  player.style.left = playerX + 'px';
});

function shootBullet() {
  const bullet = document.createElement('div');
  bullet.classList.add('bullet');
  bullet.style.left = playerX + 18 + 'px';
  bullet.style.bottom = '70px';
  gameContainer.appendChild(bullet);
  bullets.push(bullet);
}

function spawnEnemy() {
  const enemy = document.createElement('div');
  enemy.classList.add('enemy');
  enemy.style.left = Math.random() * 360 + 'px';
  enemy.style.top = '0px';
  gameContainer.appendChild(enemy);
  enemies.push(enemy);
}

function updateGame() {
  // Move bullets
  bullets.forEach((bullet, index) => {
    let bottom = parseInt(bullet.style.bottom);
    bottom += 8;
    if (bottom > 600) {
      bullet.remove();
      bullets.splice(index, 1);
    } else {
      bullet.style.bottom = bottom + 'px';
    }
  });

  // Move enemies
  enemies.forEach((enemy, eIndex) => {
    let top = parseInt(enemy.style.top);
    top += 3;

    // Check for collision
    bullets.forEach((bullet, bIndex) => {
      const bulletRect = bullet.getBoundingClientRect();
      const enemyRect = enemy.getBoundingClientRect();

      if (
        bulletRect.left < enemyRect.right &&
        bulletRect.right > enemyRect.left &&
        bulletRect.top < enemyRect.bottom &&
        bulletRect.bottom > enemyRect.top
      ) {
        // Collision!
        bullet.remove();
        enemy.remove();
        bullets.splice(bIndex, 1);
        enemies.splice(eIndex, 1);
        score++;
        scoreDisplay.textContent = `Score: ${score}`;
      }
    });

    if (top > 600) {
      enemy.remove();
      enemies.splice(eIndex, 1);
    } else {
      enemy.style.top = top + 'px';
    }
  });

  requestAnimationFrame(updateGame);
}

setInterval(spawnEnemy, 1500);
updateGame();
let gameRunning = false;
let spawnInterval;

document.getElementById('startBtn').addEventListener('click', () => {
  if (!gameRunning) {
    gameRunning = true;
    score = 0;
    scoreDisplay.textContent = `Score: ${score}`;
    bullets.forEach(b => b.remove()); bullets = [];
    enemies.forEach(e => e.remove()); enemies = [];
    document.addEventListener('keydown', keyHandler);
    spawnInterval = setInterval(spawnEnemy, 1500);
    updateGame();
  }
});

document.getElementById('endBtn').addEventListener('click', endGame);
function endGame() {
  gameRunning = false;
  clearInterval(spawnInterval);
  document.removeEventListener('keydown', keyHandler);
}
 
// Button controls
document.getElementById('leftBtn').addEventListener('click', () => movePlayer(-moveSpeed));
document.getElementById('rightBtn').addEventListener('click', () => movePlayer(moveSpeed));
document.getElementById('shootBtn').addEventListener('click', shootBullet);

function keyHandler(e) {
  if (e.key === 'ArrowLeft') movePlayer(-moveSpeed);
  if (e.key === 'ArrowRight') movePlayer(moveSpeed);
  if (e.key === ' ') shootBullet();
}

function movePlayer(delta) {
  if (!gameRunning) return;
  playerX = Math.min(Math.max(playerX + delta, 0), 360);
  player.style.left = playerX + 'px';
}
