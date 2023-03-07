import 'phaser';

var config = {
  type: Phaser.AUTO,
  width: 860,
  height: 540,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 }
    }
  },
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};

// Constant declarations
var game = new Phaser.Game(config);
let cursors;
let player;
const acc = 200;

function preload() {
  this.load.image('sky', 'assets/sky.png');
  this.load.image('logo', 'assets/sprites/phaser3-logo.png');
  this.load.image('red', 'assets/particles/red.png');
  this.load.image('player', 'assets/player.png');
  this.load.image('fire', 'assets/fire.png');
}

function create() {
  cursors = this.input.keyboard.createCursorKeys();
  player = this.physics.add.sprite(100, 350, 'player');
  player.allowRotation = true;
  player.setMaxVelocity(300);
}

function update() {
  player.body.velocity.x = 0;
  player.body.velocity.y = 0;
  if (cursors.right.isDown) {
    player.body.velocity.x += acc;
  }
  if (cursors.left.isDown) {
    player.body.velocity.x -= acc;
  }
  if (cursors.up.isDown) {
    player.body.velocity.y -= acc;
  }
  if (cursors.down.isDown) {
    player.body.velocity.y += acc;
  }

  this.physics.world.wrap(player, 32);
}
