import {Application,Assets,AnimatedSprite,Rectangle,Texture} from "pixi.js"
const app = new Application();
await app.init({
  width: 400,
  height: 400,
  backgroundColor: 0x1099bb,
});
document.getElementById("canvas").appendChild(app.canvas);
const sheet = await Assets.load("/src/assets/player.json")
const player = new AnimatedSprite(sheet.animations.run);
player.animationSpeed = 0.40;
player.loop = true;
player.play();
player.anchor.set(0.5);
player.x = app.screen.width / 2;
player.y = app.screen.height / 2;
app.stage.addChild(player);


const bombSheet = await Assets.load("/src/assets/bomb.json");
const bomb = new AnimatedSprite(bombSheet.animations.blast);
bomb.animationSpeed = 0.5;
bomb.loop = true;
bomb.anchor.set(0.5);
bomb.x = player.x + 40;
bomb.y = player.y +30;
// bomb.visible = true;
bomb.play();
app.stage.addChild(bomb);

// global variables
let isJumping = false; 

// btns

const playBtn = document.getElementById("playBtn");
const stopBtn = document.getElementById("stopBtn");
const jumpBtn = document.getElementById("jumpBtn");

jumpBtn.addEventListener("click",playerJump)

playBtn.addEventListener("click", () => {
  player.play();
  bomb.visible = true;
  bomb.gotoAndPlay(0);
});
// bomb.onComplete = () => {
//   bomb.visible = false;
// };

stopBtn.addEventListener("click", () => {
  player.stop();
  bomb.stop();
  bomb.visible = false
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
