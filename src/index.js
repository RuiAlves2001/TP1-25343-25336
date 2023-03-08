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

// -- Begin of variable declaration --
let game = new Phaser.Game(config);
// -- End of variable declaration --

function preload() {
}

function create() {
}

function update() {
}
