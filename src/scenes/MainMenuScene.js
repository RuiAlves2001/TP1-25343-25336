import Phaser from "phaser"

export class MainMenuScene extends Phaser.Scene {


  constructor() {
    super({ key: "MainMenuScene"})
  }


  preload() {
    this.load.image("title_bg","./assets/title_bg.jpg");
    this.load.image("options_button","./assets/options_button.png");
    this.load.image("play_button","./assets/play_button.png");
    this.load.image("logo","./assets/logo.png");
    this.load.image("player","./assets/player.png");
    this.load.audio("title_music","./assets/shuinvy-childhood.mp3")

  }

  create() {
    this.add.image(this.game.renderer.width / 2,this.game.renderer.height*0.20, "logo").setDepth(1);
    this.add.image(0,0, "title_bg").setOrigin(0).setDepth(0);
    let playButton = this.add.image(this.game.renderer.width / 2,this.game.renderer.height/2, "play_button").setDepth(1);
    let optionsButton = this.add.image(this.game.renderer.width / 2,this.game.renderer.height/2+100, "options_button").setDepth(1);
  
    let hoverSprite = this.add.sprite(100,100, "player");
    hoverSprite.setScale(1);
    hoverSprite.setVisible(false);

    //this.pauseOnblur=false;
    //this.sound.play("title_music",{
    //  loop: true
    //})

    playButton.setInteractive();
    playButton.on("pointerover", ()=>{
      hoverSprite.setVisible(true);
      hoverSprite.play("walk");
      hoverSprite.x = playButton.x - playButton.width;
      hoverSprite.y = playButton.y;
    })
    playButton.on("pointerout", ()=>{
      hoverSprite.setVisible(false);
    })
    playButton.on("pointerup", ()=>{
      //this.scene.start(CST.SCENES.PLAY)
    })
    optionsButton.setInteractive()

    optionsButton.on("pointerover", () => {
      hoverSprite.setVisible(true);
      hoverSprite.play("walk");
      hoverSprite.x = optionsButton.x - optionsButton.width;
      hoverSprite.y = optionsButton.y;
    })

    optionsButton.on("pointerout", () => {
      hoverSprite.setVisible(false);
    })

    optionsButton.on("pointerup", () => {
      //this.scene.launch();
    })
  }

  

  update() {
   
  }

  
}
