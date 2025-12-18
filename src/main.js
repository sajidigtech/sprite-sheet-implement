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



// btns

const playBtn = document.getElementById("playBtn");
const stopBtn = document.getElementById("stopBtn");

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
});


function playerjump(){
  
}
