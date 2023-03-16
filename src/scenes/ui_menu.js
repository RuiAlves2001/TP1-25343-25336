import Phaser from "phaser";
import { Turret } from "../turret";
import { Player } from "../player";
import { Enemie } from "../enemie";


export class UiMenu extends Phaser.Scene {
  constructor() {
    super({ key: "UiMenu" });
  }

  preload() {
    
  }

  create() {

    this.data.set('money', 0);
    this.data.set('difficulty', 0);
    this.data.set('score', 0);
    this.text = this.add.text(1000, 20, '', { font: '20px Courier', fill: '#00ff00' });
     this.text.setText([
         'Money: ' + this.data.get('money')+'    ' + 'Difficulty: ' + this.data.get('difficulty')+'    ' +'Score: ' + this.data.get('score')
     ]);
     //this.i=0;
  }


  update() {

    // this.data.set('money', this.i);
    // this.i++;
    this.text.x = (1600 - `Money:  ${this.data.get('money')}  Difficulty: ${this.data.get('difficulty')} Score: ${this.data.get('score')}` .length * 10) - 180
    this.text.setText([
        'Money: ' + this.data.get('money')+'    ' + 'Difficulty: ' + this.data.get('difficulty')+'    ' +'Score: ' + this.data.get('score')
    ]);
}
}
