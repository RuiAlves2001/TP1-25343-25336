import Phaser, { Game, Physics } from 'phaser';
import { Bullet } from './basic_bullet';
import * as config from "../assets/config/data.json";
import { get_bullet, get_turret } from './utils';

export class BaseTurret extends Physics.Arcade.Group {
  constructor(game, scene, x, y, range, debug, turret_id) {
    super(game, scene);
    this.turret_config = get_turret(turret_id);
    this.bullet_config = get_bullet(this.turret_config.base_bullet);
    this.x = x; this.y = y;
    console.log(game, scene)
    this.debug = debug;
    this.sprite_head = scene.physics.add.sprite(x, y, this.turret_config.top_sprite);
    this.sprite_body = scene.physics.add.sprite(x, y, this.turret_config.bottom_sprite);
    this.sprite_head.setDepth(1);
    this.sprite_body.setDepth(0);
    const color = new Phaser.Display.Color();
    color.random(50)
    this.graphics = scene.add.graphics({ lineStyle: { width: 2, color: color.color }, color: "#4433ffff" });
    this.aim_line = new Phaser.Geom.Line(322, 1000, 100, 100);
    //    this.area_of_attack = new Phaser.Geom.Circle(x, y, range);
    this.range = range
    //this.aim_line = scene.add.line(x, y, 0, 0, 140, 0, 0xff33ffff);
    this.bullets = []

    this.energy = this.turret_config.energy
    this.text = this.scene.add.text(x + 32, y, '', { font: '16px Arial', fill: '#00ff00' });
    this.sprite_head.setData('name', this.turret_config.name);
    this.sprite_head.setData('energy', this.energy);
    this.text.setText([
      this.sprite_head.getData('name'),
      this.sprite_head.getData('energy')
    ])
    this.bullets = this.scene.physics.add.group()
    this.bullet_timer = 1;
    this.isDestroyed = false;
    //this.circle = new Phaser.Geom.Circle(x,y,range)

    this.addMultiple([this.sprite_head, this.sprite_body, this.text, this.graphics, this.bullets])
    this.scene.physics.world.enable(this);
    this.scene.physics.add.existing(this);
  }

  decrease_energy() {
    this.energy -= 1;
    this.sprite_head.setData('energy', this.energy)
    if (this.energy < 1) {
      this._destroy()
    }
  }

  _destroy() {
    this.scene.events.emit("killed");
    this.isDestroyed = true
    this.bullets.clear()
    this.scene.physics.world.removeCollider(this.collider);
  }

  update(ignore) {
    this.graphics.clear()
    //this.graphics.fillCircleShape(this.circle)
    this.bullet_timer -= 1;
    if (this.bullet_timer < 0 && this.current_selected_enemie != null) {
      this.shoot(ignore)
      this.bullet_timer += this.turret_config.fire_rate
    }
  }

  shoot(ignore) {
    const scene = this.scene;
    // let _b = new Bullet(this.scene, this.x, this.y, this.current_selected_enemie, 0);
    // this.scene.add.existing(_b)
    // console.log(_b)
    let _b = this.scene.physics.add.sprite(this.sprite_head.x, this.sprite_head.y, this.bullet_config.asset);
    _b.scale = this.bullet_config.size;
    this.scene.physics.world.enableBody(_b);
    this.scene.physics.moveTo(_b, this.current_selected_enemie.x + Math.random() * this.bullet_config.spread * -1, this.current_selected_enemie.y + Math.random() * this.bullet_config.spread, this.bullet_config.speed);
    this.decrease_energy();
    const particles = this.scene.add.particles(this.bullet_config.particles.asset);
    const emitter = particles.createEmitter({
      speed: this.bullet_config.particles.speed,
      scale: { start: this.bullet_config.particles.size, end: 0 },
      blendMode: 'MULTIPLY'
    });

    emitter.startFollow(_b)
    this.text.setText([
      this.sprite_head.getData('name'),
      'energy: ' + this.sprite_head.getData('energy')
    ])

    this.collider = scene.physics.add.overlap(_b, scene.enemies_group, function(action, target) {
      action.body.stop();
      scene.physics.world.removeCollider(this.collider);
      _b.destroy();
      target.damage(this.bullet_config.damage)
      particles.destroy()
    }, null, this);

    this.scene.time.addEvent({delay: this.bullet_config.lifetime, callback: () => {
      scene.physics.world.removeCollider(this.collider);
      _b.destroy()
      particles.destroy()
    }, callbackScope: this.scene, loop: false})

    ignore.ignore([emitter, particles, _b])
  }

  look_at_target(targets) {
    if (targets.length === 0) return;
    let target;
    let targets_distance = targets.map(t => {

      // Formula to calculate de distance between 2 points √((x2 – x1)² + (y2 – y1)²)
      return [t, Math.sqrt(Math.pow(t.x - this.sprite_head.x, 2) + Math.pow(t.y - this.sprite_head.y, 2))]
    });

    targets_distance.sort((a, b) => {
      return a[1] - b[1];
    })

    if(targets_distance[0][0] > this.turret_config.range) return
    target = targets_distance[0][0];

    //if(Math.abs((target.x + target.y) - (this.sprite_body.x + this.sprite_body.y)) < this.range) {
    let angleToPointer = Phaser.Math.Angle.Between(this.sprite_head.x, this.sprite_head.y, target.x, target.y);

    this.current_selected_enemie = target;
    this.sprite_head.rotation = angleToPointer;
    this.graphics.clear();
    //this.graphics.strokeCircleShape(this.area_of_attack);
    this.aim_line.x1 = this.sprite_body.x;
    this.aim_line.y1 = this.sprite_body.y;
    this.aim_line.x2 = target.x + 16;
    this.aim_line.y2 = target.y + 16;

    if (this.debug)
      this.graphics.strokeLineShape(this.aim_line);
    //}
  }


}
