import { Physics } from "phaser";

export class Enemie extends Physics.Arcade.Sprite {
    constructor (scene, x, y) {
        super(scene, x, y);

        this.graphics = scene.add.sprite(x, y, "enemie_basic");
    }
}