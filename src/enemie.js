import { GameObjects, Physics } from "phaser";
import { HealthBar } from "./health_bar";

export class Enemie extends Physics.Arcade.Sprite {
  constructor(scene, x, y, health, speed, target, id) {
    super(scene, x, y, "boss");
    this.setTexture(id)
    scene.physics.world.enableBody(this);
    this.id = id;
    this.health = health;
    this.target = target;
    this.speed = speed;
    this.isDead = false
    scene.add.existing(this);
  }

  damage(amount) {
    this.health -= amount;
    this.setTexture(`${this.id}-${this.health}`);
    if(this.health <= 0) {
      this.is_dead()
    }
  }

  is_dead() {
    this.scene.events.emit("killed");
    this.destroy();
  }
}
