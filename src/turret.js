import Phaser, { Game, Physics } from 'phaser';
import { Bullet } from './simple_bullet';

export class Turret extends Physics.Arcade.Sprite {
  constructor(scene, x, y, range, debug) {
    super(scene, x, y);
    this.debug = debug;
    this.sprite_head = scene.add.sprite(x, y, 'turret_head');
    this.sprite_body = scene.add.sprite(x, y, 'turret_body');
    this.sprite_head.setDepth(1);
    this.sprite_body.setDepth(0);
    const color = new Phaser.Display.Color();
    color.random(50)
    this.graphics = scene.add.graphics({ lineStyle: { width: 4, color: color.color } });
    this.aim_line = new Phaser.Geom.Line(322, 1000, 100, 100);
    //    this.area_of_attack = new Phaser.Geom.Circle(x, y, range);
    this.range = range
    // this.aim_line = scene.add.line(x, y, 0, 0, 140, 0, 0xff33ffff);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.bullets = []

    const text = this.scene.add.text(this.x + 32, this.y, '', { font: '16px Arial', fill: '#00ff00' });
    this.setData('name', 'Turret');
    this.setData('energy', 50);
    text.setText([
      this.getData('name'),
      this.getData('energy')
    ])

    this.on('setData', function(gameObject, key, value) {
      text.setText([
        this.getData('name'),
        'energy: ' + this.getData('energy')
      ])
    })
  }

  update() {
    let bullets = this.bullets.filter((bullet) => bullet.isAlive());
    bullets.forEach((bullet) => {
      bullet.fire;
      bullet.update;
    })
  }

  look_at_target(targets) {

    if (targets.length === 0) return;
    let target; 
    let targets_distance = targets.map(t => {
     // Formula to calculate de distance between 2 points √((x2 – x1)² + (y2 – y1)²)
      return [t, Math.sqrt(Math.pow(t.x -  this.x, 2) + Math.pow(t.y - this.y, 2)) ]
    });
    
    targets_distance.sort((a, b) => {
      return a[1] - b[1];  
    })

    target = targets_distance[0][0];

    //if(Math.abs((target.x + target.y) - (this.sprite_body.x + this.sprite_body.y)) < this.range) {
    let angleToPointer = Phaser.Math.Angle.Between(this.sprite_head.x, this.sprite_head.y, target.x, target.y);
    this.sprite_head.rotation = angleToPointer;
    this.graphics.clear();
    //this.graphics.strokeCircleShape(this.area_of_attack);
    this.aim_line.x1 = this.sprite_body.x;
    this.aim_line.y1 = this.sprite_body.y;
    this.aim_line.x2 = target.x + 16;
    this.aim_line.y2 = target.y + 16;

    if (this.debug)
      this.graphics.strokeLineShape(this.aim_line);
    setTimeout(() => {
      let bullet = new Bullet(this.scene, this.x, this.y);
      this.bullets.push(bullet);
    }, 2000)
    //}
  }
}
