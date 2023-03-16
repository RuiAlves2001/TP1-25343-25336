import Phaser from "phaser";
import {get_bullet} from "./utils";
import * as config from "../assets/config/data.json";

export class Bullet extends Phaser.Physics.Arcade.Group {
  constructor(world, scene, x, y, target, id) {
    super(world, scene);
    console.log(config)
    const bullet_config = get_bullet(id);
    const speed = bullet_config.speed;

    if (scene == null) console.log("IS NULL") // Probably never is the case

    this.graphics = scene.physics.add.sprite(x, y, 'bullet');
    this.graphics.size *= bullet_config.size;
    scene.physics.world.enableBody(this.graphics);
    scene.physics.moveTo(this.graphics, target.x, target.y, speed);
    this.add(this.graphics)
  }
}
