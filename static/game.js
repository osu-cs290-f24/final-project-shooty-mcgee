// Canvas
const canvas = document.getElementById("canvas1")
const ctx = canvas.getContext('2d')
canvas.width = window.innerWidth
canvas.height = window.innerHeight

// Collision canvas
const collision = document.getElementById("collision1")
const collisionCtx = collision.getContext('2d')
collision.width = window.innerWidth
collision.height = window.innerHeight

let timeToNextEnemy = 50
let EnemyInterval = 500
let lastTime = 0

let colorTime = 15000
let bonusColor = "Blue"
let penaltyColor = "Red"

var enemies = []
let score = 0
let lives = 20

const enemyColor = ['EnemyRed.png', 'EnemyGreen.png', 'EnemyBlue.png', 'EnemyOrange.png', 'EnemyPurple.png']
const mainColor = ['Red', 'Green', 'Blue', 'Orange', 'Purple']
const soundEffect = ['pow.wav', 'pew.wav', 'pop.wav']


// Function to update the score when an enemy is hit: Made by Chloe
function on_enemy_hit(point) {
  score += point
  document.getElementById('score-display').textContent = 'Score ' + score
}


function update_lives_display() {
  document.getElementById("lives-display").querySelector('.text').textContent = `Lives : ${lives}`
}


//function to update the color every X minutes that the player will lose points for hitting: Made by Chloe
function update_bonus_color(colorText, colorID){
  // Update the background color, text content, and color bonus
  document.getElementById('bonus-color-display').style.backgroundColor = colorID
  document.getElementById('bonus-color-display').querySelector('.text').textContent = `Bonus: ${colorText}`
  bonusColor = colorText
}


function update_penalty_color(colorText, colorID){
  // Update the background color, text content, and color penalty
  document.getElementById('penalty-color-display').style.backgroundColor = colorID
  document.getElementById('penalty-color-display').querySelector('.text').textContent = `Penalty: ${colorText}`
  penaltyColor = colorText
}


//Chooses the color from color array for update_color to set the new color to
function color_timer() {
  const randomBonusColor = Math.floor(Math.random() * colors.length) // Generates a random integer from 0 to 3
  update_bonus_color(colors[randomBonusColor].colorText, colors[randomBonusColor].colorID)

  let randomPenaltyColor = Math.floor(Math.random() * colors.length)
  while (randomPenaltyColor === randomBonusColor) {
    randomPenaltyColor = Math.floor(Math.random() * colors.length)
  }
  update_penalty_color(colors[randomPenaltyColor].colorText, colors[randomPenaltyColor].colorID)

}


// Enemy object
class Enemy {
  constructor() {
    this.spriteWidth = 2000
    this.spriteHeight = 2000
    this.sizeModifier = Math.random() * .05 + .075
    this.width = this.spriteWidth * this.sizeModifier
    this.height = this.spriteHeight * this.sizeModifier
    this.x = canvas.width
    this.y = Math.random() * (canvas.height - this.height - 200)
    this.directionX = Math.random() * 5 + 3
    this.directionY = Math.random() * 5 - 2.5
    this.delete = false
    this.colorIndex = Math.floor(Math.random() * enemyColor.length)
    this.image = new Image()
    this.image.src = enemyColor[this.colorIndex]
    this.colorName = mainColor[this.colorIndex]
    this.randomColor = [Math.floor(Math.random() * 255), Math.floor(Math.random() * 255),
    Math.floor(Math.random() * 255)]
    this.color = 'rgb(' + this.randomColor[0] + ',' + this.randomColor[1] + ',' + this.randomColor[2] + ')'
  }

  update() {
    // Color bonus cause it to go faster
    if (this.colorName === bonusColor) {
      this.x -= this.directionX * 3
      this.y += this.directionY * 3
    } else {
      this.x -= this.directionX * 2
      this.y += this.directionY * 2
    }

    // Bounce off the edges
    if (this.y < 0 || this.y > canvas.height - this.height) {
      this.directionY *= -1
    }

    // Mark for deletion if it's offscreen
    if (this.x < 0 - this.width) {
      if (this.colorName == penaltyColor) {
        this.delete = true
      } else {
        this.delete = true
        lives--
        update_lives_display()
      }
    }
  }

  draw() {
    collisionCtx.fillStyle = this.color
    collisionCtx.fillRect(this.x, this.y, this.width, this.height)
    ctx.drawImage(this.image, 0, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height)
  }
}


// Hitmarker to display, can use animation
let hitmarkers = []
class Hitmarker {
  constructor(x, y, size) {
    this.image = new Image()
    this.image.src = 'hitmarker.png'
    this.spriteWidth = 613
    this.spriteHeight = 613
    this.size = size/2
    this.x = x
    this.y = y
    this.frame = 0
    this.sound = new Audio()
    this.sound.src = soundEffect[Math.floor(Math.random() * 3)]
    this.delete = false
    this.frameDuration = 100  
    this.timeSinceLastFrame = 0
  }

  update(deltaTime) {
    this.sound.play()
    this.timeSinceLastFrame += deltaTime
    if (this.timeSinceLastFrame > this.frameDuration) {
      this.delete = true
    }
  }

  draw() {
    ctx.drawImage(this.image, 0, 0, this.spriteWidth,
    this.spriteHeight, this.x, this.y, this.size, this.size)
  }
}


// Reset all the stats
function reset_game() {
  lives = 20
  score = 0
  enemies = []
  hitmarkers = []

  let div = document.getElementById("game-over")
  div.style.display = "none"

  animate()
}


// Display game over screen
function game_over() {
  let div = document.getElementById("game-over")
  div.style.display = "flex"
}


// Save score function
document.getElementById("save-score").addEventListener("click", function () {
  const playerName = document.getElementById("player-name").value.trim();
  if (!playerName) {
    alert("Please enter your name to save your score.");
    return;
  }
  fetch("/save-score", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      player: playerName,
      score: score
    })
  })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        alert("Score saved successfully!");
      } else {
        alert("Failed to save score. Please try again.");
      }
    })
    .catch(error => {
      console.error("Error saving score:", error);
      alert("Error saving score. Please try again.");
    });
});

 // Redirect to leaderboard page
document.getElementById("leaderboard").addEventListener('click', function() {
  window.location.href = '/leaderboard';
});


// Function to draw the next animation and spawn enemy based on set time
function animate(timestamp=0) {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  collisionCtx.clearRect(0, 0, canvas.width, canvas.height)
  let deltaTime = timestamp - lastTime
  lastTime = timestamp

  // Add the delta time every time it's updated, then
  // spawn an enemy after a certain amount of time have passed
  timeToNextEnemy += deltaTime
  if (timeToNextEnemy > EnemyInterval) {
    enemies.push(new Enemy())
    timeToNextEnemy = 0
    enemies.sort(function(a, b) {
      return a.width - b.width
    })
  }
  
  // Update each enemy and hitmarker
  enemies.forEach(enemy => {
    enemy.update(deltaTime)
    enemy.draw()
  })
  hitmarkers.forEach(enemy => {
    enemy.update(deltaTime)
    enemy.draw()
  })

   // Remove enemies and hitmarker that are marked to delete
  enemies = enemies.filter(enemy => !enemy.delete)
  hitmarkers = hitmarkers.filter(hitmarker => !hitmarker.delete)

  // Check if player still has lives
  if (lives > 0) {
    requestAnimationFrame(animate)
  } else {
    game_over()
  }
}


window.addEventListener('click', function(enemy) {
  const detectPixel = collisionCtx.getImageData(enemy.x, enemy.y, 1, 1)
  const pixelData = detectPixel.data
  let missed = true

  // If an enemy's collision box matches the color id of the pixel clicked
  // Very small chance of deleting multiple enemies if they have the same color id
  enemies.forEach(enemy => {
    if (enemy.randomColor[0] === pixelData[0] && enemy.randomColor[1] === pixelData[1]
    && enemy.randomColor[2] === pixelData[2]) {
      enemy.delete = true
      hitmarkers.push(new Hitmarker(enemy.x, enemy.y, enemy.width))

      if (bonusColor === enemy.colorName) {on_enemy_hit(2)}
      else if (penaltyColor === enemy.colorName) {on_enemy_hit(-1)}
      else {on_enemy_hit(1)}

      missed = false
    }
  })
  if (missed) {
    lives--
    update_lives_display()
  }
})
document.getElementById("play-again").addEventListener('click', reset_game)


//Calls color timer every 30 seconds to sec a new color
setInterval(color_timer, colorTime)
update_lives_display()


animate()
