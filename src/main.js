import {Application,Assets,AnimatedSprite,Rectangle,Texture} from "pixi.js"
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





const playerSheet = await Assets.load("/src/assets/player.json")
const player = new AnimatedSprite(playerSheet.animations.run);
player.animationSpeed = 0.40;
player.loop = true;
player.play();
player.anchor.set(0.5);
player.x = app.screen.width / 2;
player.y = app.screen.height / 2;
app.stage.addChild(player);




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

// global variables
let isJumping = false;

// btns

const playBtn = document.getElementById("playBtn");
const stopBtn = document.getElementById("stopBtn");
const jumpBtn = document.getElementById("jumpBtn");

jumpBtn.addEventListener("click",playerJump)

playBtn.addEventListener("click", () => {
  player.play();
  blast.visible = true;
  blast.gotoAndPlay(0);
});
// blast.onComplete = () => {
//   blast.visible = false;
// };

stopBtn.addEventListener("click", () => {
  player.stop();
  blast.stop();
  blast.visible = false
});




function playerJump() {
  if (isJumping) return;   // ignore click if already jumping

  isJumping = true;        // mark as jumping
  const startY = player.y; // original position
  const jumpHeight = 50;   // how high
  const duration = 500;    // total time in ms

  // Move up
  player.y = startY - jumpHeight;

  // Come back down after half duration
  setTimeout(() => {
    player.y = startY;
    isJumping = false;    // reset flag when landed
  }, duration / 2);
}
