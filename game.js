const HEIGHT = 400;
const WIDTH = 500;

const randomX = () => {
  return Math.ceil(Math.random() * WIDTH);
};

const isTouching = (a, b) => {
  return (Math.abs(a.x - b.x) < 20) && (Math.abs(a.y - b.y) < 20);
};

class Rock {
  constructor(symbol, x) {
    this.symbol = symbol;
    this.x = x;
    this.y = 50;
  }

  render(ctx) {
    ctx.font = '40px serif'
    ctx.fillText(this.symbol, this.x, this.y)
  }

  fall(diff) {
    this.y += diff;
  }
}

class Ship {
  constructor(symbol, x) {
    this.symbol = symbol;
    this.x = x;
    this.y = HEIGHT - 5;
    this.bullets = [];
  }

  render(ctx) {
    ctx.font = '40px serif'
    ctx.fillText(this.symbol, this.x, this.y)

  }

  moveTo(x) {
    if (x <= WIDTH - 40) {
      this.x = x;
    }
  }

  moveLeft() {
    this.x -= 10;
  }

  moveRight() {
    this.x += 10;
  }

  fireBullet() {
    this.bullets.push(new Bullet(this.x));
  }
}

class Bullet {
  constructor(x) {
    this.x = x;
    this.y = HEIGHT - 5;
  }

  render(ctx) {
    ctx.font = '40px serif'
    ctx.fillText('🧨', this.x, this.y)
  }

  move() {
    this.y -= 10;
  }
}

class Game {
  constructor(canvas, ship, difficulty, difficultyDelta) {
    this.score = 0;
    this.canvas = canvas;
    this.ship = ship;
    this.ctx = canvas.getContext("2d");
    this.rocks = [];
    this.difficulty = difficulty;
    this.difficultyDelta = difficultyDelta;

    this.rocksInterval = setInterval(() => {
      this.dropRocks(Math.ceil(this.difficulty));
      // this.dropRocks(1);
      this.difficulty += this.difficultyDelta;
    }, 1500);

    this.gameInterval = setInterval(() => {
      if(!this.isGameOver()) {
        this.didBulletHit();
        this.render();
      } else {
        clearInterval(this.gameInterval);
        clearInterval(this.rocksInterval);
      }
    }, 50);
  }

  didBulletHit() {
    let b = 0, r = 0;
    if(this.ship.bullets.length == 0){
      return false;
    }

    while(b < this.ship.bullets.length) {
      while(r < this.rocks.length) {
        const bullet = this.ship.bullets[b];
        const rock = this.rocks[r];
        if(bullet && rock && isTouching(bullet, rock)) {
          this.ship.bullets.splice(b, 1);
          this.rocks.splice(r, 1);
          r -= 1;
          b -= 1;
          console.log(bullet, rock);
        }
        r+=1;
      }
      b+=1;
    }
  }

  isGameOver() {
    for(var rock of this.rocks) {
      if(isTouching(rock, ship)) {
        return true;
      }
    }
    return false;
  }

  dropRocks(n) {
    const rocks = ['🔴', '🔥', '🌎', '🗑']
    const numRocks = Math.ceil(Math.random() * n)
    for(let i = 0; i < numRocks; i++) {
      this.rocks.push(new Rock(rocks[Math.floor(Math.random() * rocks.length)], randomX()));
    }
  }

  renderBullets() {
    this.ship.bullets.forEach((b) => {
      b.move()
      b.render(this.ctx)
    });
  }

  renderSpace() {
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(0, 0, WIDTH, HEIGHT);
  }

  renderScoreboard() {
    this.ctx.font = '20px serif'
    this.ctx.fillStyle = "white";
    this.ctx.fillText(`Score: ${Math.ceil(this.difficulty)}`, 10, 30)
  }

  render() {
    this.renderSpace();
    this.renderBullets();
    this.ship.render(this.ctx);
    this.rocks.forEach((r) => {
      r.fall(this.difficulty);
      r.render(this.ctx)
    })
    this.renderScoreboard();
  }
}

var canvas = document.getElementById("game-canvas");

const ships = ['🐛']
const ship = new Ship(ships[Math.floor(ships.length * Math.random())], randomX());
const game = new Game(canvas, ship, 5, 0.1);

canvas.onmousemove = (e) => {
  ship.moveTo(e.clientX);
}

document.addEventListener('keydown', (e) => {
  if(e.key === 'ArrowLeft') {
    ship.moveLeft();
  }
  if(e.key === 'ArrowRight') {
    ship.moveRight();
  }
  if(e.key === ' ') {
    ship.fireBullet();
  }
});
