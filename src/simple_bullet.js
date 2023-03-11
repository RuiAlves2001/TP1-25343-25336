import { Physics } from "phaser";

export class Bullet extends Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y);
        this.alive = true;
    }

    isAlive() {
        return this.alive
    }

    fire(origin_x, origin_y, target) {
        console.log("FIRED")
        this.setPosition(origin_x, origin_y);
        this.direction = Math.atan( (target.x - this.x) / (target.y - this.y) );

        if (target.y >= this.y)
        {
            this.xSpeed = this.speed*Math.sin(this.direction);
            this.ySpeed = this.speed*Math.cos(this.direction);
        }
        else
        {
            this.xSpeed = -this.speed*Math.sin(this.direction);
            this.ySpeed = -this.speed*Math.cos(this.direction);
        }

        this.rotation = shooter.rotation; // angle bullet with shooters rotation
        this.born = 0; // Time since new bullet spawned
    }

    update(time, delta) {
        this.x += this.xSpeed * delta;
        this.y += this.ySpeed * delta;
        this.born += delta;
        if (this.born > 1800)
        {
            this.alive = false
            this.setActive(false);
            this.setVisible(false);
        }
    }
}