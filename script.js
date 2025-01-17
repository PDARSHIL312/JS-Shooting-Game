window.addEventListener("load", function () {
  // canvas setup
  const canvas = this.document.getElementById("canvas1");
  const ctx = canvas.getContext("2d");
  canvas.width = 1500;
  canvas.height = 500;

  class InputHandler {
    // this will control control of the game
    // Consider adding methods to handle user input
    constructor(game) {
      this.game = game;
      window.addEventListener(
        "keydown",
        function (e) {
          if (
            (e.key === "ArrowUp" || e.key === "ArrowDown") &&
            this.game.keys.indexOf("ArrowUp") === -1 &&
            this.game.keys.indexOf("ArrowDown") === -1
          ) {
            this.game.keys.push(e.key); // Use e.key, not e.keys
          } else if (e.key === " ") {
            this.game.player.shootTop();
          } else if (e.key === "d") {
            this.game.debug = !this.game.debug;
          }
          console.log(this.game.keys);
        }.bind(this),
        false
      ); //  here this need to do cause here in event listner class "this keyword refers to the globsl not to the whom we anted or either i can use arrow function to do so likeseee   it means here in event listner does not remember to whom this keyword refers to
      /*
            window.addEventListener("keydown", (e) => {
          if (e.key === "ArrowUp") {
              this.game.keys.push(e.keys);
          }
          console.log(this.game.keys);
      
      */
      window.addEventListener("keyup", (e) => {
        if (this.game.keys.indexOf(e.key) > -1) {
          this.game.keys.splice(this.game.keys.indexOf(e.key), 1);
        }
        console.log(this.game.keys);
      });
    }
  }

  class Projectile {
    // will handle projectiles that can be used by main char means shooting ammo stuff
    constructor(game, x, y) {
      this.game = game;
      this.x = x;
      this.y = y;
      this.width = 10;
      this.height = 3;
      this.speed = 3;
      this.markForDeletion = false;
    }
    update() {
      this.x += this.speed;
      if (this.x > this.game.width * 0.8) this.markForDeletion = true;
    }
    draw(context) {
      context.fillStyle = "yellow";
      context.fillRect(this.x, this.y, this.width, this.height);
    }
  }

  class Particle {
    // this handles the exhaust mechanism from the enemy machine part
  }

  class Player {
    // main character
    constructor(game) {
      this.game = game;
      this.width = 120;
      this.height = 190;
      this.frameX = 0;
      this.frameY = 0;
      this.x = 20;
      this.y = 100;
      this.speedY = 0;
      this.maxFrame = 37;
      this.maxSpeed = 2;
      this.projectiles = [];
      this.image = document.getElementById("player");
      this.powerUp = false;
      this.powerUpTimer = 0;
      this.powerUpLimit = 10000;
    }
    update(deltaTime) {
      if (this.game.keys.includes("ArrowUp")) this.speedY = -this.maxSpeed;
      else if (this.game.keys.includes("ArrowDown")) {
        this.speedY = this.maxSpeed;
      } else this.speedY = 0;
      this.y += this.speedY;

      // handle Projectile
      this.projectiles.forEach((Projectile) => {
        Projectile.update();
      });
      this.projectiles.filter((Projectile) => {
        !Projectile.markForDeletion;
      });
      if (this.frameX <= this.maxFrame) {
        this.frameX++;
      } else {
        this.frameX = 0;
      }
      //Power Up
      if (this.powerUp) {
        if (this.powerUpTimer > this.powerUpLimit) {
          this.powerUpTimer = 0;
          this.powerUp = false;
          this.frameY = 0;
        } else {
          this.powerUpTimer += deltaTime;
          this.frameY = 1;
          this.game.ammo += 0.1;
        }
      }
    }
    draw(context) {
      // context.fillStyle = "transparent";
      if (this.game.debug)
        context.strokeRect(this.x, this.y, this.width, this.height);
      this.projectiles.forEach((Projectile) => Projectile.draw(context));
      context.drawImage(
        this.image,
        this.frameX * this.width, // thius is the origin point ofthe given frmae like suppose from
        this.frameY * this.height,
        this.width,
        this.height,
        this.x,
        this.y,
        this.width,
        this.height
      );
    }
    shootTop() {
      if (this.game.ammo > 0) {
        this.projectiles.push(
          new Projectile(this.game, this.x + 80, this.y + 30)
        );
        // console.log(this.projectiles);
        this.game.ammo--;
      }

      if (this.powerUp) this.shootBottom();
    }
    shootBottom() {
      if (this.game.ammo > 0) {
        this.projectiles.push(
          new Projectile(this.game, this.x + 80, this.y + 175)
        );
      }
    }
    enterPowerUp() {
      this.powerUpTimer = 0;
      this.powerUp = true;
      this.game.ammo = this.game.maxAmmo;
    }
  }

  class Enemy {
    constructor(game) {
      this.game = game;
      this.x = this.game.width;
      this.speedX = Math.random() * -1.5 - 0.5;
      this.markedForDeletion = false;
      this.frameX = 0;
      this.frameY = 0;
      this.maxFrame = 37;
    }
    update() {
      this.x += this.speedX - this.game.speed;
      if (this.x + this.width < 0) this.markedForDeletion = true;
      if (this.frameX <= this.maxFrame) this.frameX++;
      else this.frameX = 0;
    }
    draw(context) {
      // context.fillstyle = "red";
      if (this.game.debug) {
        context.strokeRect(this.x, this.y, this.width, this.height);
        context.font = "20px Helvetica";
        context.fillText(this.lives, this.x, this.y);
      }
      context.drawImage(
        this.image,
        this.frameX * this.width, // in the frame of the image gif provided in which , which you wnated to selected img phase will come here suppose which img phase from 37 phase you want to select will be that x coordinatehere
        this.frameY * this.height, //  same here but here it will select the y frame remaining description will be same as the x in wriiterm suppose their are multiple img here and you want to select frmae according to ambience of the  atomshpher  so you can shift frames
        this.width, // total selection of width from that image
        this.height, // total height selection from that image
        this.x, // at where in canvas you want to select place here that coordinate
        this.y, // at where in canvas you want to select place here that coordinate
        this.width, // total width of that location (in canvas) in the image
        this.height // total height of that location (in canvas) in the image
      );
    }
  }

  class Angler1 extends Enemy {
    constructor(game) {
      super(game);
      this.width = 228;
      this.height = 169;
      this.y = Math.random() * (this.game.height * 0.9 - this.height);
      this.image = document.getElementById("angler1");
      this.frameY = Math.floor(Math.random() * 3);
      this.lives = 2;
      this.score = this.lives;
    }
  }
  class Angler2 extends Enemy {
    constructor(game) {
      super(game);
      this.width = 213;
      this.height = 165;
      this.y = Math.random() * (this.game.height * 0.9 - this.height);
      this.image = document.getElementById("angler2");
      this.frameY = Math.floor(Math.random() * 2);
      this.lives = 3;
      this.score = this.lives;
    }
  }
  class LuckyFish extends Enemy {
    constructor(game) {
      super(game);
      this.width = 99;
      this.height = 95;
      this.y = Math.random() * (this.game.height * 0.9 - this.height);
      this.image = document.getElementById("lucky");
      this.frameY = Math.floor(Math.random() * 2);
      this.lives = 3;
      this.score = 15;
      this.type = "lucky";
    }
  }

  class Layer {
    // it will handle our multiple backgrounds here seamlessly follow the multiple backgrounds here if you know what I mean
    // this.game = game;
    constructor(game, image, speedModifier) {
      this.game = game;
      this.image = image;
      this.speedModifier = speedModifier;
      this.width = 1760;
      this.height = 500;
      this.x = 0;
      this.y = 0;
    }
    update() {
      if (this.x <= -this.width) this.x = 0;
      this.x -= this.game.speed * this.speedModifier;
    }
    draw(context) {
      context.drawImage(this.image, this.x, this.y);
      context.drawImage(this.image, this.x + this.width, this.y);
    }
  }

  class Background {
    // all layer objects of the layer will be created here so that we can make UIs
    constructor(game) {
      this.game = game;
      this.image1 = document.getElementById("layer1");
      this.image2 = document.getElementById("layer2");
      this.image3 = document.getElementById("layer3");
      this.image4 = document.getElementById("layer4");
      this.layer1 = new Layer(game, this.image1, 0.2);
      this.layer2 = new Layer(game, this.image2, 0.4);
      this.layer3 = new Layer(game, this.image3, 1);
      this.layer4 = new Layer(game, this.image4, 1.5);
      this.layers = [this.layer1, this.layer2, this.layer3];
    }
    update() {
      this.layers.forEach((elayer) => elayer.update());
    }
    draw(context) {
      this.layers.forEach((elayer) => elayer.draw(context));
    }
  }

  class UI {
    // time, score, and other information here
    constructor(game) {
      this.game = game;
      this.fontSize = 25;
      this.fontFamily = "Helvetice";
      this.color = "white";
    }
    draw(context) {
      // AMMO
      context.save();
      context.fillStyle = this.color;
      context.shadowOffsetX = 1;
      context.shadowOffsetY = 1;
      context.shadowColor = "black";
      context.font = this.fontSize + "px " + this.fontFamily;
      //score
      context.fillText("Score: " + this.game.score, 20, 40);
      //ammo
      for (let i = 0; i < this.game.ammo; i++) {
        context.fillRect(20 + 5 * i, 50, 3, 20);
      }
      context.restore();
      // here save and restore method works to gether without save restore does noting cause here restore mthod restore the previous store can vas so that here itis important
      // Timer
      const foormattedTime = (this.game.gameTime * 0.001).toFixed(1); // here see toFixed() method will formate a numberr using fixed point notaion . we can use it to define the number of digit we want to apper after the decimal point.
      context.fillStyle = "white";
      context.fillText("Timer:" + foormattedTime, 20, 100);
      //Game Over message
      if (this.game.gameOver) {
        context.textAlign = "center";
        let message1;
        let message2;
        if (this.game.score > this.game.winningScore) {
          message1 = "Congratulations! You Win!";
          message2 = "Well Done!";
        } else {
          message1 = "Game Over - You Lose!";
          message2 = "Try Again Later!";
        }
        context.font = "50px " + this.fontFamily; // Adjust font size if needed
        context.fillStyle = "white"; // Adjust color if needed
        context.fillText(
          message1,
          this.game.width * 0.5,
          this.game.height * 0.5
        );
        context.font = "25px " + this.fontFamily; // Adjust font size if needed
        context.fillText(
          message2,
          this.game.width * 0.5,
          this.game.height * 0.5 + 40
        );
      }
    }
  }

  class Game {
    constructor(width, height) {
      this.width = width;
      this.height = height;
      this.player = new Player(this);
      this.input = new InputHandler(this);
      this.background = new Background(this);
      this.ui = new UI(this);
      this.keys = [];
      this.enemies = [];
      this.ammo = 20;
      this.maxAmmo = 50;
      this.ammoTimer = 0;
      this.ammoInterval = 500;
      this.enemyTimer = 0;
      this.enemtInterval = 1000;
      this.gameOver = false;
      this.score = 0;
      this.winningScore = 15;
      this.gameTime = 0;
      this.timelimit = 15000;
      this.speed = 1;
      this.debug = true;
    }
    update(deltaTime) {
      if (!this.gameOver) this.gameTime += deltaTime;
      if (this.gameTime > this.timelimit) this.gameOver = true;
      this.background.update();
      this.background.layer4.update();
      this.player.update(deltaTime);
      if (this.ammoTimer > this.ammoInterval) {
        if (this.ammo < this.maxAmmo) {
          this.ammo++;
        }
        this.ammoTimer = 0;
      } else {
        this.ammoTimer += deltaTime;
      }

      this.enemies.forEach((enemy) => {
        enemy.update();
        if (this.checkCollision(this.player, enemy)) {
          enemy.markForDeletion = true;
          if (enemy.type == "lucky") {
            this.player.enterPowerUp();
          } else this.score--;
        }

        this.player.projectiles.forEach((projectile) => {
          if (this.checkCollision(projectile, enemy)) {
            enemy.lives--;
            projectile.markForDeletion = true;
            if (enemy.lives <= 0) {
              enemy.markForDeletion = true; // Fix the property name here
              if (!this.gameOver) this.score += enemy.score;
              if (this.score >= this.winningScore) this.gameOver = true;
            }
          }
        });
      });
      this.enemies = this.enemies.filter((enemy) => !enemy.markForDeletion);
      this.player.projectiles = this.player.projectiles.filter(
        (projectile) => !projectile.markForDeletion
      );
      if (this.enemyTimer > this.enemtInterval && !this.gameOver) {
        this.addEnemy();
        this.enemyTimer = 0;
      } else {
        this.enemyTimer += deltaTime;
      }
    }
    draw(context) {
      this.background.draw(context);
      this.player.draw(context);
      this.ui.draw(context);
      this.enemies.forEach((enemy) => {
        enemy.draw(context);
      });
      this.background.layer4.draw(context);
    }
    addEnemy() {
      const randomize = Math.random();
      if (randomize < 0.3) this.enemies.push(new Angler1(this));
      else if (randomize < 0.6) this.enemies.push(new Angler2(this));
      else this.enemies.push(new LuckyFish(this));
    }
    checkCollision(rect1, rect2) {
      return (
        rect1.x < rect2.x + rect2.width &&
        rect1.x + rect1.width > rect2.x &&
        rect1.y < rect2.y + rect2.height &&
        rect1.y + rect1.height > rect2.y
      );
    }
  }

  const game = new Game(canvas.width, canvas.height);
  let lastTime = 0;
  // animation loop
  function animate(timeStamp) {
    const deltaTime = timeStamp - lastTime;
    // console.log(deltaTime);
    lastTime = timeStamp;
    ctx.clearRect(0, 0, canvas.width, canvas.height); // this is need cause need to clear old frames first after that i can move forward here
    game.update(deltaTime);
    game.draw(ctx);
    requestAnimationFrame(animate); // 60fps
  }

  animate(0);
});
