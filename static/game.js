// const { response } = require("express");

const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let timeToNextEnemy = 50
let EnemyInterval = 500
let lastTime = 0

let colorTime = 30000

var enemies = []
let score = 0

// Function to update the score when an enemy is hit
document.addEventListener('DOMContentLoaded', function() {
  const scoreButton = document.getElementById('score-display');
  scoreButton.addEventListener('click', on_enemy_hit);
});

function on_enemy_hit() {
  score += 1;
  document.getElementById('score-display').textContent = 'Score ' + score;
}


//function to update the color every X minutes that the player will lose points for hitting
function update_color(colorText, colorID){

  // Update the background color and text content
  document.getElementById('color-display').style.backgroundColor = colorID;
  document.getElementById('color-display').querySelector('.text').textContent = `Color: ${colorText}`;

}

//Chooses the color from color array for update_color to set the new color to
function color_timer(){
  const randomColor = Math.floor(Math.random() * colors.length); // Generates a random integer from 0 to 3
  update_color(colors[randomColor].colorText, colors[randomColor].colorID)
  
}

//Calls color timer every 30 seconds to sec a new color
setInterval(color_timer, colorTime);

// Enemy object
class Enemy {
  constructor() {
    this.spriteWidth = 2000;
    this.spriteHeight = 2000;
    this.sizeModifier = Math.random() * 0.03 + 0.03;
    this.width = this.spriteWidth * this.sizeModifier;
    this.height = this.spriteHeight * this.sizeModifier;
    this.x = canvas.width;
    this.y = Math.random() * (canvas.height - this.height);
    this.directionX = Math.random() * 5 + 3;
    this.directionY = Math.random() * 5 - 2.5;
    this.delete = false;
    this.image = new Image();
    this.image.src = 'test.png';
    this.frame = 0;
    this.maxFrame = 4;
  }

  update() {
    this.x -= this.directionX;
    this.y += this.directionY;
    if (this.y < 0 || this.y > canvas.height - this.height) {
      this.directionY *= -1;
    }
    if (this.x < 0 - this.width) {
      this.delete = true;
    }
    if (this.frame > this.maxFrame) {
      this.frame = 0;
    } else {
      this.frame++;
    }
  }

  draw() {
    ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.drawImage(this.image, 0, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height);
  }
}

// Function to draw the next animation and spawn enemy based on set time
function animate(timestamp=0) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  let deltaTime = timestamp - lastTime;
  lastTime = timestamp;

  // Add the delta time every time it's updated, then
  // spawn an enemy after a certain amount of time have passed
  timeToNextEnemy += deltaTime;
  if (timeToNextEnemy > EnemyInterval) {
    enemies.push(new Enemy());
    timeToNextEnemy = 0;
  }
  enemies.forEach(enemy => {
    enemy.update(deltaTime);
    enemy.draw();
  });
  enemies = enemies.filter(enemy => !enemy.offScreen);
  // console.log(timestamp);
  requestAnimationFrame(animate);
}
animate()








