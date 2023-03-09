import Phaser, { Game, Physics } from 'phaser';

export class Turret extends Physics.Arcade.Sprite {
    constructor(scene, x, y, range) {
        super(scene, x, y);

        this.sprite_head = scene.add.sprite(x, y, 'turret_head');
        this.sprite_body = scene.add.sprite(x, y, 'turret_body');
        this.sprite_head.setDepth(1);
        this.sprite_body.setDepth(0);
        this.graphics = scene.add.graphics({ lineStyle: { width: 4, color: 0xaa00aa } });
        this.aim_line = new Phaser.Geom.Line(322, 1000, 100, 100);
        this.area_of_attack = new Phaser.Geom.Circle(x, y, range);
        this.range = range   
        // this.aim_line = scene.add.line(x, y, 0, 0, 140, 0, 0xff33ffff);
        scene.add.existing(this);
        scene.physics.add.existing(this);
    }

    update() {
    }
    
    look_at_target(target) {
        if(Math.abs((target.x + target.y) - (this.sprite_body.x + this.sprite_body.y)) < this.range) {
            let angleToPointer = Phaser.Math.Angle.Between(this.sprite_head.x, this.sprite_head.y, target.x, target.y);
            this.sprite_head.rotation = angleToPointer;
            this.graphics.clear();
            this.graphics.strokeCircleShape(this.area_of_attack);
            this.aim_line.x1 = this.sprite_body.x;
            this.aim_line.y1 = this.sprite_body.y;
            this.aim_line.x2 = target.x + 16;
            this.aim_line.y2 = target.y + 16;
            this.graphics.strokeLineShape(this.aim_line);
        }
    }
}