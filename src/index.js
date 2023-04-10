import 'phaser';
import { Turret } from './turret';
import { Player } from './player';
import { MainScene } from './scenes/main_scene';
import { UiMenu } from './scenes/ui_menu';
import { MainMenuScene } from './scenes/MainMenuScene';
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> Create_menu
import { PauseScene } from './scenes/pause';
import { SideScene } from './scenes/side_menu';
import { WinGame } from './scenes/win_scene';
import { GameOver } from './scenes/over_scene';
<<<<<<< HEAD
=======
import { GameOver } from './scenes/gameover';
import { WinGame } from './scenes/wingame';
>>>>>>> menu_principal
=======
>>>>>>> Create_menu

var config = {
  type: Phaser.AUTO,
  width: 1600,
  height: 900,
  pixelArt: true,
  physics: {
    default: 'arcade',
    arcade: {
      debug: false,
      gravity: { y: 0 }
    }
  },
<<<<<<< HEAD
<<<<<<< HEAD
  scene: [MainMenuScene, MainScene, PauseScene, SideScene, WinGame, GameOver]
=======
  scene: [WinGame, MainScene,MainMenuScene]
>>>>>>> menu_principal
=======
  scene: [MainMenuScene, MainScene, PauseScene, SideScene, WinGame, GameOver]
>>>>>>> Create_menu
};

// -- Begin of variable declaration --
let game = new Phaser.Game(config);
// -- End of variable declaration --
