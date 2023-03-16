// Player class
import { Physics } from 'phaser';

let KEYS = {
  UP: Phaser.Input.Keyboard.KeyCodes.W,
  DOWN: Phaser.Input.Keyboard.KeyCodes.S,
  LEFT: Phaser.Input.Keyboard.KeyCodes.A,
  RIGHT: Phaser.Input.Keyboard.KeyCodes.D
}

export class Player extends Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'player');
    this.cursors = scene.input.keyboard.createCursorKeys();
    
    Object.keys(KEYS).map((key) => {
      KEYS[key] = scene.input.keyboard.addKey(KEYS[key])
    })

    scene.physics.world.enableBody(this);
    scene.add.existing(this);
    this.acc = 200;
  }

  preload() {
  }

  update() {
    this.setVelocity(0,0);
    if (KEYS.UP.isDown) {
      this.movement_up();
    }
    if (KEYS.LEFT.isDown) {
      this.movement_left()
    }
    if (KEYS.DOWN.isDown) {
      this.movement_down()
    }
    if (KEYS.RIGHT.isDown) {
      this.movement_right()
    }
  }

  movement_left() {
    this.setVelocityX(-this.acc);
  };
  movement_right() {
    this.setVelocityX(this.acc);
  };
  movement_up() {
    this.setVelocityY(-this.acc);
  };
  movement_down() {
    this.setVelocityY(this.acc);
  };
}
