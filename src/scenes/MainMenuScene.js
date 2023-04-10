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
    this.load.image("player", "./assets/player_new.png");
    this.load.audio("title_music", "./assets/shuinvy-childhood.mp3")

  }

  create() {
    this.add.text(this.game.renderer.width / 2, 200, 'TOWER SURVIVORS', { font: '150px Arial', fill: '#fff' }).setOrigin(0.5).setDepth(1);
    this.add.image(0, 0, "title_bg").setOrigin(0).setDepth(0);

    let playButton = this.add.text(this.game.renderer.width / 2, this.game.renderer.height / 2, '< Start the game >', { font: '30px Arial', fill: '#fff' }).setOrigin(0.5).setDepth(1);
    playButton.setInteractive();

    let optionsButton = this.add.text(this.game.renderer.width / 2, this.game.renderer.height / 2 + 80, '< Options >', { font: '30px Arial', fill: '#fff' }).setOrigin(0.5).setDepth(1);
    optionsButton.setInteractive()

    let creditsButton = this.add.text(this.game.renderer.width / 2, this.game.renderer.height / 2 + 160, '< Credits >', { font: '30px Arial', fill: '#fff' }).setOrigin(0.5).setDepth(1);
    creditsButton.setInteractive()

    let textcredits = this.add.text(this.game.renderer.width / 2, this.game.renderer.height / 2, 'Code:\nDiogo Carvalho\nRui Alves \n\n\nMade with Phaser 3', { font: '30px Arial', fill: '#fff', align: 'center' }).setOrigin(0.5).setDepth(1);
    textcredits.setVisible(false);

    let hoverSprite = this.add.sprite(100, 100, "player").setScale(1);
    hoverSprite.setVisible(false);

    let classicmode = this.add.text(this.game.renderer.width / 2, this.game.renderer.height / 2, '< Modo classico >', { font: '30px Arial', fill: '#fff' }).setOrigin(0.5).setDepth(1);
    classicmode.setInteractive();
    classicmode.setVisible(false);

    let alternativemode = this.add.text(this.game.renderer.width / 2, this.game.renderer.height / 2 + 80, '< Modo Alternativo >', { font: '30px Arial', fill: '#fff' }).setOrigin(0.5).setDepth(1);
    alternativemode.setInteractive();
    alternativemode.setVisible(false);

    let musicmode = this.add.text(this.game.renderer.width / 2, this.game.renderer.height / 2 + 80, '< Musica ligada: On >', { font: '30px Arial', fill: '#fff' }).setOrigin(0.5).setDepth(1);
    musicmode.setInteractive();
    musicmode.setVisible(false);

    let voltarmenu = this.add.text(this.game.renderer.width / 2, this.game.renderer.height / 2 + 160, '< Voltar >', { font: '30px Arial', fill: '#fff' }).setOrigin(0.5).setDepth(1);
    voltarmenu.setInteractive();
    voltarmenu.setVisible(false);


    playButton.on("pointerdown", () => {
      optionsButton.setVisible(false);
      playButton.setVisible(false);
      creditsButton.setVisible(false);
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
      hoverSprite.y = playButton.y - 8;
    })
    playButton.on("pointerout", () => {
      hoverSprite.setVisible(false);
    })
    classicmode.on("pointerover", () => {
      hoverSprite.setVisible(true);
      hoverSprite.play("walk");
      hoverSprite.x = classicmode.x - classicmode.width;
      hoverSprite.y = classicmode.y - 8;
    })
    classicmode.on("pointerout", () => {
      hoverSprite.setVisible(false);
    })
    alternativemode.on("pointerover", () => {
      hoverSprite.setVisible(true);
      hoverSprite.play("walk");
      hoverSprite.x = alternativemode.x - alternativemode.width;
      hoverSprite.y = alternativemode.y - 8;
    })
    alternativemode.on("pointerout", () => {
      hoverSprite.setVisible(false);
    })
    alternativemode.on("pointerdown", () => {
      this.scene.launch("MainScene", {id:1});
      this.scene.stop("MainMenuScene")
    })
    classicmode.on("pointerdown", () => {
      this.scene.launch("MainScene", {id:0});
      this.scene.stop("MainMenuScene")
    })

    optionsButton.on("pointerdown", () => {
      optionsButton.setVisible(false);
      playButton.setVisible(false);
      creditsButton.setVisible(false);
      musicmode.setVisible(true);
      voltarmenu.setVisible(true);
      voltarmenu.setActive(true);
    });
    optionsButton.on("pointerover", () => {
      hoverSprite.setVisible(true);
      hoverSprite.play("walk");
      hoverSprite.x = optionsButton.x - optionsButton.width;
      hoverSprite.y = optionsButton.y - 8;
    })
    optionsButton.on("pointerout", () => {
      hoverSprite.setVisible(false);
    })


    //Botton credits
    creditsButton.on("pointerdown", () => {
      creditsButton.setVisible(false);
      optionsButton.setVisible(false);
      playButton.setVisible(false);
      voltarmenu.setVisible(true);
      voltarmenu.setActive(true);
      textcredits.setVisible(true);
    });
    creditsButton.on("pointerover", () => {
      hoverSprite.setVisible(true);
      hoverSprite.play("walk");
      hoverSprite.x = creditsButton.x - creditsButton.width;
      hoverSprite.y = creditsButton.y - 8;
    })
    creditsButton.on("pointerout", () => {
      hoverSprite.setVisible(false);
    })

    //Button voltar
    voltarmenu.on("pointerdown", () => {
      optionsButton.setVisible(true);
      optionsButton.setActive(true);
      creditsButton.setVisible(true);
      creditsButton.setActive(true);
      playButton.setVisible(true);
      playButton.setActive(true);
      musicmode.setVisible(false);
      voltarmenu.setVisible(false);
      alternativemode.setVisible(false);
      classicmode.setVisible(false);
      textcredits.setVisible(false);
    });

    voltarmenu.on("pointerover", () => {
      hoverSprite.setVisible(true);
      hoverSprite.play("walk");
      hoverSprite.x = voltarmenu.x - voltarmenu.width;
      hoverSprite.y = voltarmenu.y - 8;
    })
    voltarmenu.on("pointerout", () => {
      hoverSprite.setVisible(false);
    })


    //ativar e desativar musica

    let musictocar = this.sound.play("title_music");
    musicmode.on("pointerdown", () => {
      if (musictocar == true) {
        musicmode.setText('< Musica ligada: Off >');
        musictocar = false;
        this.sound.pauseAll("title_music");
      } else {

        musictocar = true;
        musicmode.setText('< Musica ligada: On >');
        this.sound.play("title_music");
      }
    });


    musicmode.on("pointerover", () => {
      hoverSprite.setVisible(true);
      hoverSprite.play("walk");
      hoverSprite.x = musicmode.x - musicmode.width;
      hoverSprite.y = musicmode.y - 8;
    })
    musicmode.on("pointerout", () => {
      hoverSprite.setVisible(false);
    })
  }



  update() {

  }


}