import 'phaser';
import { Turret } from './turret';
import { Player } from './player';
import { MainScene } from './scenes/main_scene';
import { UiMenu } from './scenes/ui_menu';
import { MainMenuScene } from './scenes/MainMenuScene';

var config = {
  type: Phaser.AUTO,
  width: 1600,
  height: 900,
  physics: {
    default: 'arcade',
    arcade: {
      debug: false,
      gravity: { y: 0 }
    }
  },
  scene: [MainMenuScene,UiMenu,MainScene]
};

// -- Begin of variable declaration --
let game = new Phaser.Game(config);
// -- End of variable declaration --
