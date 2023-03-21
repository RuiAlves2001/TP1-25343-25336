import Phaser from "phaser"

export class MainMenuScene extends Phaser.Scene {


  constructor() {
    super({ key: "MainMenuScene" })
  }


  preload() {
    this.load.image("title_bg", "./assets/title_bg.jpg");
    this.load.image("options_button", "./assets/options_button.png");
    this.load.image("play_button", "./assets/play_button.png");
    this.load.image("logo", "./assets/logo.png");
    this.load.image("player", "./assets/player.png");
    this.load.audio("title_music", "./assets/shuinvy-childhood.mp3")

  }

  create() {
    this.add.text(this.game.renderer.width / 2, 200, 'TOWER DEFENSE', { font: '150px Arial', fill: '#fff' }).setOrigin(0.5).setDepth(1);
    this.add.image(0, 0, "title_bg").setOrigin(0).setDepth(0);

    let playButton = this.add.text(this.game.renderer.width / 2, this.game.renderer.height / 2, '< Start the game >', { font: '30px Arial', fill: '#fff' }).setOrigin(0.5).setDepth(1);
    playButton.setInteractive();

    let optionsButton = this.add.text(this.game.renderer.width / 2, this.game.renderer.height / 2 + 80, '< Options >', { font: '30px Arial', fill: '#fff' }).setOrigin(0.5).setDepth(1);
    optionsButton.setInteractive()

    let hoverSprite = this.add.sprite(100, 100, "player").setScale(1);
    hoverSprite.setVisible(false);

    let classicmode = this.add.text(this.game.renderer.width / 2, this.game.renderer.height / 2, '< Modo classico >', { font: '30px Arial', fill: '#fff' }).setOrigin(0.5).setDepth(1);
    classicmode.setInteractive();
    classicmode.setVisible(false);

    let alternativemode = this.add.text(this.game.renderer.width / 2, this.game.renderer.height / 2 + 80, '< Modo Alternativo >', { font: '30px Arial', fill: '#fff' }).setOrigin(0.5).setDepth(1);
    alternativemode.setInteractive();
    alternativemode.setVisible(false);

    let musicmode = this.add.text(this.game.renderer.width / 2, this.game.renderer.height / 2 + 80, '< Musica ligada: >', { font: '30px Arial', fill: '#fff' }).setOrigin(0.5).setDepth(1);
    musicmode.setInteractive();
    musicmode.setVisible(false);

    let voltarmenu = this.add.text(this.game.renderer.width / 2, this.game.renderer.height / 2 + 160, '< Voltar >', { font: '30px Arial', fill: '#fff' }).setOrigin(0.5).setDepth(1);
    voltarmenu.setInteractive();
    voltarmenu.setVisible(false);

    //this.pauseOnblur=false;
    //this.sound.play("title_music",{
    //  loop: true
    //})

    /*
    let listpointerover = [playButton, classicmode, alternativemode, optionsButton, voltarmenu];
    listpointerover.on("pointerover", () => {
      hoverSprite.setVisible(true);
      hoverSprite.play("walk");
      hoverSprite.x = listpointerover.x - listpointerover.width;
      hoverSprite.y = listpointerover.y;
    })
    listpointerover.on("pointerout", () => {
      hoverSprite.setVisible(false);
    })
    */


    playButton.on("pointerdown", () => {
      optionsButton.setVisible(false);
      optionsButton.setActive(false);
      playButton.setVisible(false);
      playButton.setActive(false);
      alternativemode.setVisible(true);
      alternativemode.setActive(true);
      classicmode.setVisible(true);
      classicmode.setActive(true);
      voltarmenu.setVisible(true);
      voltarmenu.setActive(true);
    })
    playButton.on("pointerover", () => {
      hoverSprite.setVisible(true);
      hoverSprite.play("walk");
      hoverSprite.x = playButton.x - playButton.width;
      hoverSprite.y = playButton.y;
    })
    playButton.on("pointerout", () => {
      hoverSprite.setVisible(false);
    })
    classicmode.on("pointerover", () => {
      hoverSprite.setVisible(true);
      hoverSprite.play("walk");
      hoverSprite.x = classicmode.x - classicmode.width;
      hoverSprite.y = classicmode.y;
    })
    classicmode.on("pointerout", () => {
      hoverSprite.setVisible(false);
    })
    alternativemode.on("pointerover", () => {
      hoverSprite.setVisible(true);
      hoverSprite.play("walk");
      hoverSprite.x = alternativemode.x - alternativemode.width;
      hoverSprite.y = alternativemode.y;
    })
    alternativemode.on("pointerout", () => {
      hoverSprite.setVisible(false);
    })

    optionsButton.on("pointerdown", () => {
      optionsButton.setVisible(false);
      optionsButton.setActive(false);
      playButton.setVisible(false);
      playButton.setActive(false);
      musicmode.setVisible(true);
      voltarmenu.setVisible(true);
      voltarmenu.setActive(true);
    });
    optionsButton.on("pointerover", () => {
      hoverSprite.setVisible(true);
      hoverSprite.play("walk");
      hoverSprite.x = optionsButton.x - optionsButton.width;
      hoverSprite.y = optionsButton.y;
    })
    optionsButton.on("pointerout", () => {
      hoverSprite.setVisible(false);
    })

    voltarmenu.on("pointerdown", () => {
      optionsButton.setVisible(true);
      optionsButton.setActive(true);
      playButton.setVisible(true);
      playButton.setActive(true);
      musicmode.setVisible(false);
      voltarmenu.setVisible(false);
      voltarmenu.setActive(false);
      alternativemode.setVisible(false);
      alternativemode.setActive(false);
      classicmode.setVisible(false);
      classicmode.setActive(false);
    });

    voltarmenu.on("pointerover", () => {
      hoverSprite.setVisible(true);
      hoverSprite.play("walk");
      hoverSprite.x = voltarmenu.x - voltarmenu.width;
      hoverSprite.y = voltarmenu.y;
    })
    voltarmenu.on("pointerout", () => {
      hoverSprite.setVisible(false);
    })
  }



  update() {

  }


}
