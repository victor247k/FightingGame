function rectangularCollision({ rectangle1, rectangle2 }) {
  return (
    rectangle1.attackBox.position.x + rectangle1.attackBox.width >=
      rectangle2.position.x &&
    rectangle1.attackBox.position.x <=
      rectangle2.position.x + rectangle2.width &&
    rectangle1.attackBox.position.y + rectangle1.height >=
      rectangle2.position.y &&
    rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
  );
}
let timer = 60;
let timerId;

function determineWinner({ player, enemy, timerId }) {
  clearTimeout(timerId);
  if (player.health === enemy.health) {
    document.querySelector("#displayText").textContent = "Tie";
  } else if (player.health > enemy.health) {
    document.querySelector("#displayText").textContent = "Player 1 Wins";
  } else if (player.health < enemy.health) {
    document.querySelector("#displayText").textContent = "Player 2 Wins";
  }
  window.removeEventListener("keydown", keyDownFunc);
}

function decreaseTimer() {
  if (timer > 0) {
    timerId = setTimeout(decreaseTimer, 1000);
    timer--;
    document.getElementById("timer").textContent = timer;
  }
  if (timer === 0) {
    determineWinner({ player, enemy, timerId });
  }
}

function keyDownFunc(e) {
  switch (e.key) {
    case "d":
      keys.d.pressed = true;
      player.lastKey = "d";
      break;
    case "a":
      keys.a.pressed = true;
      player.lastKey = "a";
      break;
    case "w":
      if (player.velocity.y === 0) player.velocity.y = -20;
      break;
    case " ":
      player.attack();
      break;

    // enemy keys
    case "ArrowRight":
      keys.ArrowRight.pressed = true;
      enemy.lastKey = "ArrowRight";
      break;
    case "ArrowLeft":
      keys.ArrowLeft.pressed = true;
      enemy.lastKey = "ArrowLeft";
      break;
    case "ArrowUp":
      if (enemy.velocity.y === 0) enemy.velocity.y = -20;
      break;
    case "ArrowDown":
      enemy.attack();
      break;
  }
}

function keyUpFunc(e) {
  switch (e.key) {
    case "d":
      keys.d.pressed = false;
      player.lastKey = "a";
      break;
    case "a":
      keys.a.pressed = false;
      player.lastKey = "d";
      break;

    // enemt keys
    case "ArrowRight":
      keys.ArrowRight.pressed = false;
      enemy.lastKey = "ArrowLeft";

      break;
    case "ArrowLeft":
      keys.ArrowLeft.pressed = false;
      enemy.lastKey = "ArrowRight";

      break;
  }
}
