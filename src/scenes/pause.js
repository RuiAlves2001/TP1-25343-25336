import Phaser from "phaser"

export class PauseScene extends Phaser.Scene {
  constructor() {
    super({ key: "PauseScene" })
  }

  create() {
    console.log("PAUSED")
    this.input.manager.canvas.style.cursor = "pointer";
    let gameIsPaused = true
    let returnMenu = this.add.text(this.game.renderer.width / 2, this.game.renderer.height / 2 - 100, '< Return to Menu >', { font: '30px Arial', fill: '#fff' }).setOrigin(0.5).setDepth(2);
    returnMenu.setInteractive();
    let pausa = this.add.text(this.game.renderer.width / 2, this.game.renderer.height / 2 - 220, 'PAUSA', { font: '100px Arial', fill: '#fff' }).setOrigin(0.5).setDepth(2);
    let restartGame = this.add.text(this.game.renderer.width / 2, this.game.renderer.height / 2, '< Restart the game >', { font: '30px Arial', fill: '#fff' }).setOrigin(0.5).setDepth(2);
    restartGame.setInteractive();

    let choiseLabel = this.add.text(this.game.renderer.width / 2, this.game.renderer.height / 2 + 100, '< Click to return to the game >', { font: '30px Arial', fill: '#fff' }).setOrigin(0.5).setDepth(2);
    choiseLabel.setInteractive();

    let pausaBg = this.add.image(0, 0, "bg").setOrigin(0).setDepth(1).setScale(2);
    pausaBg.alpha = 0.7;

    // let list = [pausaBg, choiseLabel, returnMenu, restartGame, pausa];
    // list.forEach(unpause => {
    //   unpause.setVisible(false);
    //   unpause.setActive(false);
    // });

    choiseLabel.on("pointerdown", () => {
        if (gameIsPaused == true) {
            gameIsPaused = false;
            this.scene.resume("MainScene")
            this.scene.stop(this)
      }
    });

    // choiseLabel.on("pointerover", () => {
    //   hoverSprite.setVisible(true);
    //   hoverSprite.play("walk");
    //   hoverSprite.x = choiseLabel.x - choiseLabel.width;
    //   hoverSprite.y = choiseLabel.y;
    // })
    // choiseLabel.on("pointerout", () => {
    //   hoverSprite.setVisible(false);
    // })

    returnMenu.on("pointerdown", () => {
      this.scene.stop("MainScene")
      this.scene.stop("PauseScene")
      this.scene.launch("MainMenuScene");
    });

    // returnMenu.on("pointerover", () => {
    //   hoverSprite.setVisible(true);
    //   hoverSprite.play("walk");
    //   hoverSprite.x = returnMenu.x - returnMenu.width;
    //   hoverSprite.y = returnMenu.y;
    // })
    // returnMenu.on("pointerout", () => {
    //   hoverSprite.setVisible(false);
    // })

    restartGame.on("pointerdown", () => {
      this.scene.launch("MainScene");
      this.scene.stop("PauseScene")
    });

    // restartGame.on("pointerover", () => {
    //   hoverSprite.setVisible(true);
    //   hoverSprite.play("walk");
    //   hoverSprite.x = restartGame.x - restartGame.width;
    //   hoverSprite.y = restartGame.y;
    // })
    // restartGame.on("pointerout", () => {
    //   hoverSprite.setVisible(false);
    // })
  }

}