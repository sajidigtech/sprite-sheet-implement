import { Application, Assets, AnimatedSprite, Rectangle, Texture, Sprite, Text , TilingSprite} from "pixi.js"
// imports of various pixijs classes 
import { createGameOverPopup } from "./ui/gameOverPopUp";

// pop up for game over

const app = new Application();
// app object created



await app.init({
  width: 400,
  height: 400,
  backgroundColor: 0x1099bb,

});
// app initiated
globalThis.__PIXI_APP__ = app;





document.getElementById("canvas").appendChild(app.canvas);
// canvas added to body (canvas id )
const gameOverPopup = createGameOverPopup(app);
app.stage.addChild(gameOverPopup.container);

// global variables
let isJumping = false;
let score = 0;
let gameRunning = true;


const bgTexture = await Assets.load("/src/assets/gameBG.png");
const bg = new TilingSprite(bgTexture, app.screen.width, app.screen.height);
bg.label = "background";

bg.tileScale.set(0.75,0.75)
app.stage.addChildAt(bg, 0);

app.ticker.add(() => {
  if (!gameRunning) return;  
  bg.tilePosition.x -= 5;
});




const playerSheet = await Assets.load("/src/assets/player.json")
const player = new AnimatedSprite(playerSheet.animations.run);
player.label = "player";
player.animationSpeed = 0.40;
player.loop = true;
player.play();
player.anchor.set(0.5);
player.x = app.screen.width / 2;
player.y = app.screen.height / 2;
app.stage.addChild(player);

// player sheet for displaying player animation




const blastSheet = await Assets.load("/src/assets/blast.json");
const blast = new AnimatedSprite(blastSheet.animations.blast);
blast.label = "blast"
blast.animationSpeed = 0.5;
blast.loop = true;
blast.anchor.set(0.5);
blast.x = player.x + 40;
blast.y = player.y + 30;
blast.visible = false;
// blast.play();
app.stage.addChild(blast);

// blast sheet implementation to display blast of bomb



const mineBombTexture = await Assets.load("src/assets/mineBomb.png");
const mineBomb = new Sprite(mineBombTexture);
mineBomb.label = "mineBomb"
mineBomb.anchor.set(0.5);
mineBomb.x = app.screen.width + mineBomb.width; // adjust as needed
mineBomb.y = app.screen.height / 2 + 40;
mineBomb.scale.set(0.07);
app.stage.addChild(mineBomb);

// first imported texture and then used as sprites and added to stage



const scoreText = new Text({
  text: `Score ${score}`,

  style: {
    fontSize: 24,
    fill: 0xffffff,
    fontWeight: "bold",
  },
});

scoreText.x = 15;
scoreText.y = 15;
app.stage.addChild(scoreText);

// score display

let bombSpeed = 6; // normal speed

app.ticker.add(() => {

  if (!gameRunning) return;

  // move bomb
  mineBomb.x -= bombSpeed;

  if (mineBomb.x < -mineBomb.width) {
    score += 1;
    scoreText.text = `Score: ${score}`;
    mineBomb.x = app.screen.width + mineBomb.width;
  }

  // collision AFTER movement
  if (isPlayerHit(player, mineBomb)) {
    gameOver();


  }
});








// button selection by dom for event handling
const playBtn = document.getElementById("playBtn");
const stopBtn = document.getElementById("stopBtn");
const jumpBtn = document.getElementById("jumpBtn");
const restartBtn = document.getElementById("restartBtn");

jumpBtn.addEventListener("click", playerJump)
// jumpbtn calls player jump function

playBtn.addEventListener("click", () => {
  player.play();
  blast.visible = true;
  blast.gotoAndPlay(0);
  mineBomb.visible = true
});
// blast.onComplete = () => {
//   blast.visible = false;
// };

stopBtn.addEventListener("click", () => {
  player.stop();
  blast.stop();
  blast.visible = false
  mineBomb.visible = false
});

restartBtn.addEventListener("click", restartGame)

window.addEventListener("keyup", (e) => {
  if (e.code === "Space" || e.code === "ArrowUp") {
    playerJump();
  }

})




function playerJump() {
  if (isJumping) return;   // ignore click if already jumping

  isJumping = true;        // mark as jumping
  const startY = player.y; // original position
  const jumpHeight = 100;   // how high
  const duration = 1000;    // total time in ms

  // Move up
  player.y = startY - jumpHeight;

  // Come back down after half duration
  setTimeout(() => {
    player.y = startY;
    isJumping = false;    // reset flag when landed
  }, duration / 2);
}



function isPlayerHit(player, bomb) {
  const p = player.getBounds();
  const b = bomb.getBounds();

  // X overlap
  const xOverlap =
    p.x + p.width > b.x &&
    p.x < b.x + b.width;

  //p.x means player ka left edge
  // p.width means player ka total width

  // p.x + p.width means player ka right most side
  // b.x means bomb ka left most side
  // left side of ball is less than right side of player  -> means overlap

  // p.x -> left edge of player
  // b.x + b.width -> right edge of bomb 
  // mtlb right edge of bomb greater than 



  if (!xOverlap) return false;

  // Player body limits
  const playerTop = player.y - p.height / 2 + 8;
  const playerBottom = player.y + p.height / 2 - 12;

  // Bomb limits
  const bombTop = b.y;
  const bombBottom = b.y + b.height;

  // 🔥 IMPORTANT RULE
  // Agar player jump kar raha hai
  // aur bomb feet ke niche hai → SAFE
  if (isJumping && bombTop >= playerBottom) {
    return false;
  }

  // Normal body collision
  const yOverlap =
    bombBottom > playerTop &&
    bombTop < playerBottom;

  return yOverlap;
}



async function gameOver() {
  gameRunning = false;

  player.stop();



  blast.visible = true;
  blast.play();
  mineBomb.visible = false;

  await new Promise((resolve) => setTimeout(resolve, 1500));
  blast.visible = false;
  player.visible = false;
  gameOverPopup.setScore(score);
  gameOverPopup.container.visible = true;






}

const playerdetails = player.getBounds();
console.log("player ka bounds : ", playerdetails, "ww.x ki value", playerdetails.x);

const bombDetails = mineBomb.getBounds();
console.log("bomb ka details : ", bombDetails, "")



function restartGame() {

  if (gameRunning) return;
  gameOverPopup.container.visible = false;
  player.visible = true

  // reset states
  gameRunning = true;
  isJumping = false;
  score = 0;

  // reset score text
  scoreText.text = `Score: ${score}`;

  // reset player
  player.x = app.screen.width / 2;
  player.y = app.screen.height / 2;
  player.play();

  // reset blast
  blast.stop();
  blast.visible = false;

  // reset bomb
  mineBomb.visible = true;
  mineBomb.x = app.screen.width + mineBomb.width;

  console.log("Game Restarted 🚀");
}





// ---------------------------------------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------------------------------

// pointer on player , hover krne pe player ka kuch popup show hoga esa
// player.eventMode = 'static';   // 
// player.cursor = 'pointer';

// // pointer on player


// const playerPopup = new Text("Player: Jump with Space ⬆️", {
//   fontSize: 14,
//   fill: 0xffffff,
//   fontWeight: "bold",
// });

// playerPopup.visible = false;
// playerPopup.anchor.set(0.5, 1); // bottom center
// app.stage.addChild(playerPopup);


// player.on("pointerover", () => {
//   playerPopup.visible = true;
//   playerPopup.x = player.x;
//   playerPopup.y = player.y - player.height / 2 - 10;
// });

// player.on("pointerout", () => {
//   playerPopup.visible = false;
// });

//---------------------------------------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------------------------------------

