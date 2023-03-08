// Player class

class Player extends Phaser.Physics.Arcade.Srite {
  cursors = this.input.keyboard.createCursorKeys();
  constructor(scene, x, y) {
    super(scene, x, y, 'Texture');
    scene.add.existing(this);
  }

  movement_left() {
    this.body.velocity.x -= acc;
  };
  movement_right() {
    this.body.velocity.x += acc;
  };
  movement_up() {
    this.body.velocity.y -= acc;
  };
  movement_down() {
    this.body.velocity.y += acc;
  };
}
