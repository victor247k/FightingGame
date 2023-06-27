class Sprite {
  constructor({
    position,
    imageSrc,
    scale = 1,
    frameRate = 1,
    offset = { x: 0, y: 0 },
    frameBuffer = 10,
  }) {
    (this.position = position),
      (this.width = 50),
      (this.height = 150),
      (this.image = new Image()),
      (this.image.src = imageSrc),
      (this.scale = scale);
    (this.frameRate = frameRate),
      (this.currentFrame = 0),
      (this.framesElapsed = 0),
      (this.frameBuffer = frameBuffer),
      (this.offset = offset);
  }

  draw() {
    c.drawImage(
      this.image,
      (this.image.width / this.frameRate) * this.currentFrame,
      0,
      this.image.width / this.frameRate,
      this.image.height,

      this.position.x - this.offset.x,
      this.position.y - this.offset.y,
      (this.image.width / this.frameRate) * this.scale,
      this.image.height * this.scale
    );
  }

  update() {
    this.draw();
    this.updateFrames();
  }
  updateFrames() {
    if (this.framesElapsed % this.frameBuffer === 0) {
      if (this.currentFrame < this.frameRate - 1) this.currentFrame++;
      else this.currentFrame = 0;
    }

    this.framesElapsed++;
  }
}

class Fighter extends Sprite {
  constructor({
    position,
    velocity,
    color = "red",
    imageSrc,
    frameRate,
    scale,
    offset = { x: 0, y: 0 },
    sprites,
    frameBuffer = 10,
    attackBox = { offset: {}, width: undefined, health: undefined },
  }) {
    super({
      position,
      imageSrc,
      frameRate,
      scale,
      offset,
      frameBuffer,
    }),
      (this.velocity = velocity),
      (this.width = 50),
      (this.height = 150),
      this.lastKey,
      (this.attackBox = {
        position: {
          x: this.position.x,
          y: this.position.y,
        },
        offset: attackBox.offset,
        width: attackBox.width,
        height: attackBox.height,
      }),
      (this.color = color),
      this.isAttacking;
    this.health = 100;
    (this.dead = false),
      (this.currentFrame = 0),
      (this.framesElapsed = 0),
      (this.frameBuffer = frameBuffer),
      (this.sprites = sprites);

    for (const sprite in this.sprites) {
      this.sprites[sprite].image = new Image();
      this.sprites[sprite].image.src = this.sprites[sprite].imageSrc;
    }
  }

  update() {
    this.draw();
    if (!this.dead) this.updateFrames();

    this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
    this.attackBox.position.y = this.position.y + this.attackBox.offset.y;

    // c.fillRect(this.attackBox.position.x, this.attackBox.position.y, this.attackBox.width, this.attackBox.height)

    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    // gravity function
    if (this.position.y + this.height + this.velocity.y >= canvas.height - 96) {
      this.velocity.y = 0;
      this.position.y = 330;
    } else this.velocity.y += gravity;
  }

  attack() {
    this.switchSprite("attack1");
    this.isAttacking = true;
    // setTimeout(() => {
    //   this.isAttacking = false;
    // }, 1000);
  }

  takeHit() {
    this.health -= 20;

    if (this.health <= 0) {
      this.switchSprite("death");
    } else {
      this.switchSprite("takeHit");
    }
  }

  switchSprite(sprite) {
    if (this.image === this.sprites.death.image) {
      if (this.currentFrame === this.sprites.death.frameRate - 1) {
        this.dead = true;
      }
      return;
    }

    if (
      this.image === this.sprites.attack1.image &&
      this.currentFrame < this.sprites.attack1.frameRate - 1
    )
      return;

    if (
      this.image === this.sprites.takeHit.image &&
      this.currentFrame < this.sprites.takeHit.frameRate - 1
    ) {
      return;
    }
    switch (sprite) {
      case "idle":
        if (this.image !== this.sprites.idle.image) {
          this.image = this.sprites.idle.image;
          this.frameRate = this.sprites.idle.frameRate;
          this.currentFrame = 0;
        }

        break;
      case "run":
        if (this.image !== this.sprites.run.image) {
          this.image = this.sprites.run.image;
          this.frameRate = this.sprites.run.frameRate;
          this.currentFrame = 0;
        }
        break;
      case "jump":
        if (this.image !== this.sprites.jump.image) {
          this.image = this.sprites.jump.image;
          this.frameRate = this.sprites.jump.frameRate;
          this.currentFrame = 0;
        }

        break;
      case "fall":
        if (this.image !== this.sprites.fall.image) {
          this.image = this.sprites.fall.image;
          this.frameRate = this.sprites.fall.frameRate;
          this.currentFrame = 0;
        }
        break;
      case "attack1":
        if (this.image !== this.sprites.attack1.image) {
          this.image = this.sprites.attack1.image;
          this.frameRate = this.sprites.attack1.frameRate;
          this.currentFrame = 0;
        }
        break;
      case "takeHit":
        if (this.image !== this.sprites.takeHit.image) {
          this.image = this.sprites.takeHit.image;
          this.frameRate = this.sprites.takeHit.frameRate;
          this.currentFrame = 0;
        }
        break;
      case "death":
        if (this.image !== this.sprites.death.image) {
          this.image = this.sprites.death.image;
          this.frameRate = this.sprites.death.frameRate;
          this.currentFrame = 0;
        }
        break;
    }
  }
}
