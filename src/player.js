// Player class
import { Physics } from 'phaser';

export class Player extends Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'player');
    this.cursors = scene.input.keyboard.createCursorKeys();
    scene.physics.world.enableBody(this);
    scene.add.existing(this);
    this.acc = 200;
  }

  preload() {
  }

  update() {
    this.setVelocity(0,0);
    if (this.cursors.up.isDown) {
      console.log("up")
      this.movement_up();
    }
    if (this.cursors.left.isDown) {
      this.movement_left()
    }
    if (this.cursors.down.isDown) {
      console.log("down")
      this.movement_down()
    }
    if (this.cursors.right.isDown) {
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
