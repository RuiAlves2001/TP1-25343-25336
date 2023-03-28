import Phaser from "phaser";
import { Turret } from "../turret";
import { Player } from "../player";
import { Enemie } from "../enemie";


export class UiMenu extends Phaser.Scene {
  constructor() {
    super({ key: "UiMenu" });
  }


  preload() {
    this.load.image("btn_pause", "./assets/pause_btn.png", 270, 180);
    this.load.image("tile_grass", "assets/grass.png");
    this.load.image("bg", "assets/bg.jpg");
    this.load.image("player", "./assets/player.png");
    this.load.image("turret_body", "./assets/turret_body.png");
    this.load.image("turret_head", "./assets/turret_head.png");
    this.keyTAB = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TAB);
    this.keyESQ = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESQ);
  }

  create() {
    this.map = this.make.tilemap({ tileWidth: 64, tileHeight: 64, width: 64, height: 64 });
    this.tiles = this.map.addTilesetImage('tile_grass');
    this.layer = this.map.createBlankLayer('layer', this.tiles);
    this.layer.randomize(0, 0, 128, 128, [0, 0]); // Wall above the water



    this.data.set('money', 0);
    this.data.set('difficulty', 0);
    this.data.set('score', 0);
    this.text = this.add.text(1000, 25, '', { font: 'bold 22px Courier', fill: '#1f2120' });
    this.text.setText([
      'Money: ' + this.data.get('money') + '    ' + 'Difficulty: ' + this.data.get('difficulty') + '    ' + 'Score: ' + this.data.get('score')
    ]);
    //this.i=0;

    let hoverSprite = this.add.sprite(100, 100, "player").setScale(1).setDepth(5);
    hoverSprite.setVisible(false);

    let gameIsPaused = false

    let pause_label = this.add.image(this.game.renderer.width - 75, 10, "btn_pause").setOrigin(0).setDepth(0).setScale(0.1);
    pause_label.setInteractive();

    let returnMenu = this.add.text(this.game.renderer.width / 2, this.game.renderer.height / 2 - 100, '< Return to Menu >', { font: '30px Arial', fill: '#fff' }).setOrigin(0.5).setDepth(2);
    returnMenu.setInteractive();

    let pausa = this.add.text(this.game.renderer.width / 2, this.game.renderer.height / 2 - 220, 'PAUSA', { font: '100px Arial', fill: '#fff' }).setOrigin(0.5).setDepth(2);

    let restartGame = this.add.text(this.game.renderer.width / 2, this.game.renderer.height / 2, '< Restart the game >', { font: '30px Arial', fill: '#fff' }).setOrigin(0.5).setDepth(2);
    restartGame.setInteractive();

    let choiseLabel = this.add.text(this.game.renderer.width / 2, this.game.renderer.height / 2 + 100, '< Click to return to the game >', { font: '30px Arial', fill: '#fff' }).setOrigin(0.5).setDepth(2);
    choiseLabel.setInteractive();

    let pausaBg = this.add.image(0, 0, "bg").setOrigin(0).setDepth(1).setScale(2);
    pausaBg.alpha = 0.7;


    //Code for the pause menu

    let list = [pausaBg, choiseLabel, returnMenu, restartGame, pausa];
    list.forEach(unpause => {
      unpause.setVisible(false);
      unpause.setActive(false);
    });

    pause_label.on("pointerdown", () => {
      if (gameIsPaused == false) {
        gameIsPaused = true;
        list.forEach(unpause => {
          unpause.setVisible(true);
          unpause.setActive(true);
        })
      }
    });

    choiseLabel.on("pointerdown", () => {

      if (gameIsPaused == true) {
        gameIsPaused = false;
        list.forEach(unpause => {
          unpause.setVisible(false);
          unpause.setActive(false);
        })
      }
    });

    choiseLabel.on("pointerover", () => {
      hoverSprite.setVisible(true);
      hoverSprite.play("walk");
      hoverSprite.x = choiseLabel.x - choiseLabel.width;
      hoverSprite.y = choiseLabel.y;
    })
    choiseLabel.on("pointerout", () => {
      hoverSprite.setVisible(false);
    })

    returnMenu.on("pointerdown", () => {
      //inserir return menu
    });

    returnMenu.on("pointerover", () => {
      hoverSprite.setVisible(true);
      hoverSprite.play("walk");
      hoverSprite.x = returnMenu.x - returnMenu.width;
      hoverSprite.y = returnMenu.y;
    })
    returnMenu.on("pointerout", () => {
      hoverSprite.setVisible(false);
    })

    restartGame.on("pointerdown", () => {
      //inserir return menu
    });

    restartGame.on("pointerover", () => {
      hoverSprite.setVisible(true);
      hoverSprite.play("walk");
      hoverSprite.x = restartGame.x - restartGame.width;
      hoverSprite.y = restartGame.y;
    })
    restartGame.on("pointerout", () => {
      hoverSprite.setVisible(false);
    })
  }


  update() {
    let opentab = this.add.text(20, 20, 'TAB - Turret Screen', { font: '20px Courier', fill: '#1f2120' }).setOrigin(0).setVisible(true);
    let returntab = this.add.text(20, 20, 'TAB - Turret Screen', { font: '20px Courier', fill: '#ffffff' }).setOrigin(0).setVisible(false).setDepth(3);
    let creditsBackground = this.add.rectangle(
      150,
      450,
      300,
      900,
      '#4e8545',
      0.7
    ).setVisible(false);
    let turrethead = this.add.image(30, 30, "turret_head").setOrigin(0).setScale(3).setVisible(false).setInteractive();
    let textturrethead = this.add.text(20, 222, 'Price: 100€ | Damage: 20hp', { font: '16px Courier', fill: '#ffffff' }).setOrigin(0).setVisible(false).setDepth(3);
    let turretbody = this.add.image(54, 247, "turret_body").setOrigin(0).setScale(3).setVisible(false).setInteractive();
    let textturretbody = this.add.text(20, 439, 'Price: 200€ | Damage: 50hp', { font: '16px Courier', fill: '#ffffff' }).setOrigin(0).setVisible(false).setDepth(3);
    var keyObj = this.input.keyboard.addKey('tab');  // Get key object
    keyObj.on('down', function (event) {
      opentab.setVisible(false);
      returntab.setVisible(true);
      textturrethead.setVisible(true);
      textturretbody.setVisible(true);
      turrethead.setVisible(true);
      turretbody.setVisible(true);
      turrethead.setInteractive(true);
      turretbody.setInteractive(true);
      creditsBackground.setVisible(true);
    });
    keyObj.on('up', function (event) {
      opentab.setVisible(true);
      returntab.setVisible(false);
      textturrethead.setVisible(false);
      textturretbody.setVisible(false);
      turrethead.setVisible(false);
      turretbody.setVisible(false);
      creditsBackground.setVisible(false);
    });

    //this.data.set('money', this.i);
    //this.i++;
    this.text.x = (this.game.renderer.width - `Money:  ${this.data.get('money')}  Difficulty: ${this.data.get('difficulty')} Score: ${this.data.get('score')}`.length * 10 - 300);
    this.text.setText([
      'Money: ' + this.data.get('money') + '    ' + 'Difficulty: ' + this.data.get('difficulty') + '    ' + 'Score: ' + this.data.get('score')
    ]);
  }
}
