import Phaser from "phaser"
import { get_turrets } from "../utils";

export class SideScene extends Phaser.Scene {
  constructor() {
    super({ key: "SideScene" })
    this.currently_selected = 0;
  }

  init(data) {
    this.currently_selected = data.id;
  }

  create() {
    this.scene.pause("MainScene");
    const turret_configs = get_turrets()
    // this.input.manager.canvas.style.cursor = "pointer";
    let bg = this.add.rectangle(
      150,
      450,
      300,
      900,
      '#4e8545',
      0.7
    );

    let text_padding_left = 20
    let image_padding_left = 10
    let image_size = 128
    let distante_between = 40

    let turret_one = this.add.image(image_padding_left, 60, "v_wood").setOrigin(0).setScale(4).setInteractive();
    let turret_one_text = this.add.text(text_padding_left, image_size*1+30+distante_between, `${turret_configs[0].name}\n ${turret_configs[0].price}`, { font: '16px Courier', fill: '#ffffff', align: 'left' }).setOrigin(0).setDepth(3);
    let turret_two = this.add.image(image_padding_left, 
      30+(image_size*1)+(distante_between*2)
      , "v_flame").setOrigin(0).setScale(4).setInteractive();
    let turret_two_text = this.add.text(text_padding_left, 
      30+(image_size*2)+(distante_between*3)      
      , `${turret_configs[1].name}\n ${turret_configs[1].price}`, { font: '16px Courier', fill: '#ffffff', align: 'left' }).setOrigin(0).setDepth(3);
    let turret_three = this.add.image(image_padding_left, 
      30+(image_size*2)+(distante_between*4)  
      , "v_laser").setOrigin(0).setScale(4).setInteractive();
    let turret_three_text = this.add.text(text_padding_left, 
      30+(image_size*3)+(distante_between*5)  
      , `${turret_configs[2].name}\n ${turret_configs[2].price}`, { font: '16px Courier', fill: '#ffffff', align: 'left' }).setOrigin(0).setDepth(3);
    let turret_four = this.add.image(image_padding_left, 
      30+(image_size*3)+(distante_between*6)
      , "v_sniper").setOrigin(0).setScale(4).setInteractive();
    let turret_four_text = this.add.text(text_padding_left, 
      30+(image_size*4)+(distante_between*7)
      , `${turret_configs[3].name}\n ${turret_configs[3].price}`, { font: '16px Courier', fill: '#ffffff', align: 'left' }).setOrigin(0).setDepth(3);
    switch (this.currently_selected) {
      case 0: turret_one_text.setColor('#95ff00');
        break;
      case 1: turret_two_text.setColor('#95ff00');
        break;
      case 2: turret_three_text.setColor('#95ff00');
        break;
      case 3: turret_four_text.setColor('#95ff00');
        break;
    }
    const reset = () => {
        turret_one_text.setColor('#fff');
        turret_two_text.setColor('#fff');
        turret_three_text.setColor('#fff');
        turret_four_text.setColor('#fff');
      }

    const exit = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.T);
    exit.on("down", () => {
      this.scene.resume("MainScene", {selected: this.currently_selected});
      this.scene.stop(this)
    })

    turret_one.on("pointerdown", () => {
      this.scene.resume("MainScene", {selected: 0});
      this.scene.stop(this)
    });
    turret_two.on("pointerdown", () => {
      this.scene.resume("MainScene", {selected: 1});
      this.scene.stop(this)
    });
    turret_three.on("pointerdown", () => {
      this.scene.resume("MainScene", {selected: 2});
      this.scene.stop(this)
    });
    turret_four.on("pointerdown", () => {
      this.scene.resume("MainScene", {selected: 3});
      this.scene.stop(this)
    });
  }

}