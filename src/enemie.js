import { GameObjects, Physics } from "phaser";

export class Enemie extends Physics.Arcade.Sprite {
  constructor(scene, x, y, health, speed, target) {
    super(scene, x, y, "enemie");
    this.scale = 0.1;
    scene.physics.world.enableBody(this);
    this.health = health;
    this.target = target;
    this.speed = speed;
    scene.add.existing(this);
  }
}
