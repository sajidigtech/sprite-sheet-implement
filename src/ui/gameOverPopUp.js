import { Container, Graphics, Text } from "pixi.js";

export function createGameOverPopup(app) {
  const gameOverContainer = new Container();
  gameOverContainer.visible = false;

  // overlay
  const overlay = new Graphics();
  overlay.beginFill(0x000000, 0.7);
  overlay.drawRect(0, 0, app.screen.width, app.screen.height);
  overlay.endFill();

  // popup box
  const popupBox = new Graphics();
  popupBox.beginFill(0x162140);
  popupBox.drawRoundedRect(0, 0, 260, 160, 20);
  popupBox.endFill();
  popupBox.x = app.screen.width / 2 - 130;
  popupBox.y = app.screen.height / 2 - 80;

  // title
  const gameOverText = new Text({
    text: "GAME OVER",
    style: {
      fontSize: 28,
      fill: 0xff4d4d,
      fontWeight: "bold",
    },
  });
  gameOverText.anchor.set(0.5);
  gameOverText.x = popupBox.x + 130;
  gameOverText.y = popupBox.y + 35;

  // score
  const finalScoreText = new Text({
    text: "",
    style: {
      fontSize: 18,
      fill: 0xffffff,
    },
  });
  finalScoreText.anchor.set(0.5);
  finalScoreText.x = popupBox.x + 130;
  finalScoreText.y = popupBox.y + 80;

  // hint
  const restartHint = new Text({
    text: "Press Restart Button",
    style: {
      fontSize: 14,
      fill: 0xaaaaaa,
    },
  });
  restartHint.anchor.set(0.5);
  restartHint.x = popupBox.x + 130;
  restartHint.y = popupBox.y + 120;

  gameOverContainer.addChild(
    overlay,
    popupBox,
    gameOverText,
    finalScoreText,
    restartHint
  );

  // expose what main.js needs
  return {
    container: gameOverContainer,
    setScore(score) {
      finalScoreText.text = `Score: ${score}`;
    },
  };
}
