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
player.animationSpeed = 0.25;
player.loop = true;
player.play();
player.anchor.set(0.5);
player.x = app.screen.width / 2;
player.y = app.screen.height / 2;
app.stage.addChild(player);



// btns

const playBtn = document.getElementById("playBtn");
const stopBtn = document.getElementById("stopBtn");

playBtn.addEventListener("click", () => {
  player.play();
});

stopBtn.addEventListener("click", () => {
  player.stop();
});
