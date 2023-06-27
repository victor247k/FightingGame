const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;

c.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.7;

const background = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  imageSrc: "img/background.png",
});

const shop = new Sprite({
  position: {
    x: 620,
    y: 128,
  },
  imageSrc: "img/shop.png",
  scale: 2.75,
  frameRate: 6,
});

const player = new Fighter({
  position: {
    x: 50,
    y: 0,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  offset: {
    x: 0,
    y: 0,
  },
  imageSrc: "img/samuraiMack/Idle.png",
  frameRate: 8,
  scale: 2.5,
  offset: {
    x: 215,
    y: 157,
  },
  sprites: {
    idle: {
      imageSrc: "img/samuraiMack/Idle.png",
      frameRate: 8,
    },
    run: {
      imageSrc: "img/samuraiMack/Run.png",
      frameRate: 8,
    },
    jump: {
      imageSrc: "img/samuraiMack/Jump.png",
      frameRate: 2,
    },
    fall: {
      imageSrc: "img/samuraiMack/Fall.png",
      frameRate: 2,
    },
    attack1: {
      imageSrc: "img/samuraiMack/Attack1.png",
      frameRate: 6,
    },
    takeHit: {
      imageSrc: "img/samuraiMack/Take Hit - white silhouette.png",
      frameRate: 4,
    },
    death: {
      imageSrc: "img/samuraiMack/Death.png",
      frameRate: 6,
    },
  },
  attackBox: {
    offset: {
      x: 100,
      y: 30,
    },
    width: 150,
    height: 60,
  },
});

const enemy = new Fighter({
  position: {
    x: canvas.width - 100,
    y: 100,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  offset: {
    x: -50,
    y: 0,
  },
  imageSrc: "img/kenji/Idle.png",
  frameRate: 4,
  scale: 2.5,
  offset: {
    x: 215,
    y: 170,
  },
  sprites: {
    idle: {
      imageSrc: "img/kenji/Idle.png",
      frameRate: 4,
    },
    run: {
      imageSrc: "img/kenji/Run.png",
      frameRate: 8,
    },
    jump: {
      imageSrc: "img/kenji/Jump.png",
      frameRate: 2,
    },
    fall: {
      imageSrc: "img/kenji/Fall.png",
      frameRate: 2,
    },
    attack1: {
      imageSrc: "img/kenji/Attack1.png",
      frameRate: 4,
    },
    takeHit: {
      imageSrc: "img/kenji/Take hit.png",
      frameRate: 3,
    },
    death: {
      imageSrc: "img/kenji/Death.png",
      frameRate: 7,
    },
  },
  attackBox: {
    offset: {
      x: -170,
      y: 40,
    },
    width: 170,
    height: 60,
  },
});

const keys = {
  a: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
  ArrowLeft: {
    pressed: false,
  },
  ArrowRight: {
    pressed: false,
  },
};

decreaseTimer();

function animate() {
  requestAnimationFrame(animate);
  c.fillStyle = "black";
  c.fillRect(0, 0, canvas.width, canvas.height);

  background.update();
  shop.update();
  c.fillStyle = "rgba(221, 214, 254, 0.1)"
  c.fillRect(0, 0, canvas.width, canvas.height)
  player.update();
  enemy.update();
  // player movement
  player.velocity.x = 0;

  if (keys.a.pressed && player.lastKey === "a") {
    player.velocity.x = -5;
    player.switchSprite("run");
  } else if (keys.d.pressed && player.lastKey === "d") {
    player.velocity.x = 5;
    player.switchSprite("run");
  } else {
    player.switchSprite("idle");
  }

  if (player.velocity.y < 0) {
    player.switchSprite("jump");
  } else if (player.velocity.y > 0) {
    player.switchSprite("fall");
  }
  // enemy movement
  enemy.velocity.x = 0;

  if (keys.ArrowLeft.pressed && enemy.lastKey === "ArrowLeft") {
    enemy.velocity.x = -5;
    enemy.switchSprite("run");
  } else if (keys.ArrowRight.pressed && enemy.lastKey === "ArrowRight") {
    enemy.velocity.x = 5;
    enemy.switchSprite("run");
  } else {
    enemy.switchSprite("idle");
  }

  if (enemy.velocity.y < 0) {
    enemy.switchSprite("jump");
  } else if (enemy.velocity.y > 0) {
    enemy.switchSprite("fall");
  }

  //   detect for collisions

  if (
    rectangularCollision({
      rectangle1: player,
      rectangle2: enemy,
    }) &&
    player.isAttacking &&
    player.currentFrame === 4
  ) {
    player.isAttacking = false;
    enemy.takeHit();
    gsap.to('#enemyHealth', {
      width: enemy.health + "%"
    })
  }

  // player misses

  if (player.isAttacking && player.currentFrame === 4) {
    player.isAttacking = false;
  }

  if (
    rectangularCollision({
      rectangle1: enemy,
      rectangle2: player,
    }) &&
    enemy.isAttacking &&
    enemy.lastKey !== "ArrowDown"
  ) {
    enemy.isAttacking = false;
    player.takeHit();

    gsap.to('#playerHealth', {
      width: player.health + "%"
    })
  }
  if (enemy.isAttacking && enemy.currentFrame === 2) {
    enemy.isAttacking = false;
  }

  //   end the game based on health
  if (enemy.health <= 0 || player.health <= 0) {
    determineWinner({ player, enemy, timerId });
  }
}

animate();

window.addEventListener("keydown", keyDownFunc);
window.addEventListener("keyup", keyUpFunc);
