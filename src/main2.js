import {
  Application,
  Assets,
  AnimatedSprite,
  Sprite
} from "pixi.js";

/* ---------------- APP SETUP ---------------- */

const app = new Application();
await app.init({
  width: 400,
  height: 400,
  backgroundColor: 0x1099bb,
});

document.getElementById("canvas").appendChild(app.canvas);

/* ---------------- GAME STATE ---------------- */

let gameRunning = true;
let isJumping = false;

/* ---------------- PLAYER ---------------- */

const playerSheet = await Assets.load("/src/assets/player.json");
const player = new AnimatedSprite(playerSheet.animations.run);

player.anchor.set(0.5);
player.animationSpeed = 0.4;
player.loop = true;
player.play();

player.x = app.screen.width / 2;
player.y = app.screen.height / 2;

app.stage.addChild(player);

/* ---------------- BLAST ---------------- */

const blastSheet = await Assets.load("/src/assets/blast.json");
const blast = new AnimatedSprite(blastSheet.animations.blast);

blast.anchor.set(0.5);
blast.animationSpeed = 0.5;
blast.loop = true;
blast.play();

app.stage.addChild(blast);

/* ---------------- BOMB ---------------- */

const mineBombTexture = await Assets.load("/src/assets/mineBomb.png");
const mineBomb = new Sprite(mineBombTexture);

mineBomb.anchor.set(0.5);
mineBomb.scale.set(0.07);

const groundY = app.screen.height / 2 + 90; // 🔥 important
mineBomb.y = groundY;
mineBomb.x = app.screen.width + 100;

app.stage.addChild(mineBomb);

let bombSpeed = 4;

/* ---------------- JUMP PHYSICS ---------------- */

let velocityY = 0;
const gravity = 0.8;
const jumpForce = -14;
const groundPlayerY = player.y;

/* ---------------- CONTROLS ---------------- */

const jumpBtn = document.getElementById("jumpBtn");

jumpBtn.addEventListener("click", jump);
window.addEventListener("keydown", (e) => {
  if (e.code === "Space" || e.code === "ArrowUp") {
    jump();
  }
});

function jump() {
  if (isJumping) return;
  velocityY = jumpForce;
  isJumping = true;
}

/* ---------------- COLLISION LOGIC ---------------- */

function isPlayerHit(player, bomb) {
  const playerTop = player.y - player.height / 2;
  const playerBottom = player.y + player.height / 2;

  const bombTop = bomb.y - bomb.height / 2;
  const bombBottom = bomb.y + bomb.height / 2;

  // X overlap (center based)
  const xOverlap =
    Math.abs(player.x - bomb.x) <
    player.width / 2 + bomb.width / 2;

  // 🔥 bomb agar feet ke niche hai → ignore
  if (bombTop >= playerBottom - 10) {
    return false;
  }

  const yOverlap =
    bombBottom > playerTop && bombTop < playerBottom;

  return xOverlap && yOverlap;
}

/* ---------------- GAME OVER ---------------- */

function gameOver() {
  gameRunning = false;
  player.stop();
  blast.stop();
  mineBomb.visible = false;
  blast.visible = false;
  console.log("GAME OVER");
}

/* ---------------- GAME LOOP ---------------- */

app.ticker.add(() => {
  if (!gameRunning) return;

  /* ---- Jump physics ---- */
  velocityY += gravity;
  player.y += velocityY;

  if (player.y >= groundPlayerY) {
    player.y = groundPlayerY;
    velocityY = 0;
    isJumping = false;
  }

  /* ---- Bomb movement ---- */
  mineBomb.x -= bombSpeed;

  if (mineBomb.x < -100) {
    mineBomb.x = app.screen.width + 100;
  }

  /* ---- Blast follow ---- */
  blast.x = player.x + 40;
  blast.y = player.y + 30;

  /* ---- Collision ---- */
  if (isPlayerHit(player, mineBomb)) {
    gameOver();
  }
});
