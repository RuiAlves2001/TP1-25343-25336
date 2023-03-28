import Phaser from "phaser";
import {get_bullet} from "./utils";
import * as config from "../assets/config/data.json";

export class Bullet extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, target, id) {
    super(scene, x, y);
    const bullet_config = get_bullet(id);
    console.log("CONFIG", bullet_config)
    this.graphics = this.scene.physics.add.sprite(x, y, bullet_config.asset);
    const speed = bullet_config.speed;
    // this.graphics.size *= bullet_config.size;
    // scene.physics.world.enableBody(this.graphics);
    // scene.physics.moveTo(this.graphics, target.x, target.y, speed);
    this.scene.add.existing(this.graphics)
  }
}
