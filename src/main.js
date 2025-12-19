import {Application,Assets,AnimatedSprite,Rectangle,Texture, Sprite, Text} from "pixi.js"
// imports of various pixijs classes 

const app = new Application();
// app object created



await app.init({
  width: 400,
  height: 400,
  backgroundColor: 0x1099bb,
});
// app initiated



document.getElementById("canvas").appendChild(app.canvas);
// canvas added to body (canvas id )


// global variables
let isJumping = false;
let score = 0;




const playerSheet = await Assets.load("/src/assets/player.json")
const player = new AnimatedSprite(playerSheet.animations.run);
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
blast.animationSpeed = 0.5;
blast.loop = true;
blast.anchor.set(0.5);
blast.x = player.x + 40;
blast.y = player.y +30;
// blast.visible = true;
blast.play();
app.stage.addChild(blast);

// blast sheet implementation to display blast of bomb



const mineBombTexture = await Assets.load("src/assets/mineBomb.png");
const mineBomb = new Sprite(mineBombTexture);
mineBomb.anchor.set(0.5);
mineBomb.x = app.screen.width / 2 + 50;  // adjust as needed
mineBomb.y = app.screen.height / 2 + 40;
mineBomb.scale.set(0.07);
app.stage.addChild(mineBomb);

// first imported texture and then used as sprites and added to stage

let bombSpeed = 4; // normal speed
app.ticker.add(() => {
  // move bomb from right to left
  mineBomb.x -= bombSpeed??2;

  // jab bomb left side se bahar chala jaye
  if (mineBomb.x < -mineBomb.width) {
    mineBomb.x = app.screen.width + mineBomb.width;
  }
});








// button selection by dom for event handling
const playBtn = document.getElementById("playBtn");
const stopBtn = document.getElementById("stopBtn");
const jumpBtn = document.getElementById("jumpBtn");

jumpBtn.addEventListener("click",playerJump)
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

window.addEventListener("keyup", (e)=>{
  if (e.code === "Space" || e.code === "ArrowUp") {
    playerJump();
  }

})




function playerJump() {
  if (isJumping) return;   // ignore click if already jumping

  isJumping = true;        // mark as jumping
  const startY = player.y; // original position
  const jumpHeight = 60;   // how high
  const duration = 600;    // total time in ms

  // Move up
  player.y = startY - jumpHeight;

  // Come back down after half duration
  setTimeout(() => {
    player.y = startY;
    isJumping = false;    // reset flag when landed
  }, duration / 2);
}
