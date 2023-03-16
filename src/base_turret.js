import Phaser, { Game, Physics } from 'phaser';
import { Bullet } from './basic_bullet';

export class BaseTurret extends Physics.Arcade.Group {
  constructor(game, scene, x, y, range, debug) {
    super(game, scene);
    this.x = x; this.y = y;
    console.log(game, scene)
    this.debug = debug;
    this.sprite_head = scene.physics.add.sprite(x, y, 'turret_head');
    this.sprite_body = scene.physics.add.sprite(x, y, 'turret_body');
    this.sprite_head.setDepth(1);
    this.sprite_body.setDepth(0);
    const color = new Phaser.Display.Color();
    color.random(50)
    this.graphics = scene.add.graphics({ lineStyle: { width: 2, color: color.color } });
    this.aim_line = new Phaser.Geom.Line(322, 1000, 100, 100);
    //    this.area_of_attack = new Phaser.Geom.Circle(x, y, range);
    this.range = range
    // this.aim_line = scene.add.line(x, y, 0, 0, 140, 0, 0xff33ffff);
    this.bullets = []

    this.energy = 100
    this.text = this.scene.add.text(x + 32, y, '', { font: '16px Arial', fill: '#00ff00' });
    this.sprite_head.setData('name', 'Turret');
    this.sprite_head.setData('energy', this.energy);
    this.text.setText([
      this.sprite_head.getData('name'),
      this.sprite_head.getData('energy')
    ])
    this.bullets = this.scene.physics.add.group()
    this.bullet_timer = 1;
    this.isDestroyed = false;
    this.addMultiple([this.sprite_head, this.sprite_body, this.text, this.graphics, this.bullets])
    this.scene.physics.world.enable(this);
    this.scene.physics.add.existing(this)
  }

  decrease_energy() {
    this.energy -= 1;
    this.sprite_head.setData('energy', this.energy)
    if (this.energy < 1) {
      this._destroy()
    }
  }

  _destroy() {
    this.isDestroyed = true
    this.bullets.clear()
    this.scene.physics.world.removeCollider(this.collider);
  }

  update() {
    this.bullet_timer -= 1;
    if (this.bullet_timer < 0 && this.current_selected_enemie != null) {
      this.shoot()
      this.bullet_timer += 2
    }
  }

  shoot() {
    const scene = this.scene;
    let _b = new Bullet(this.scene.physics.world, this.scene, this.x, this.y, this.current_selected_enemie, 0);
    // console.log(_b)
    // let bullet = this.scene.physics.add.sprite(this.sprite_head.x, this.sprite_head.y, 'bullet');
    // this.scene.physics.world.enableBody(bullet);
    // this.scene.physics.moveTo(bullet, this.current_selected_enemie.x, this.current_selected_enemie.y, 1000);
    this.decrease_energy();
    const particles = this.scene.add.particles('smoke');
    const emitter = particles.createEmitter({
      speed: 50,
      scale: { start: 0.2, end: 0 },
      blendMode: 'MULTIPLY'
    });

    emitter.startFollow(_b)
    this.text.setText([
      this.sprite_head.getData('name'),
      'energy: ' + this.sprite_head.getData('energy')
    ])

    this.collider = this.scene.physics.add.overlap(_b, this.current_selected_enemie, function(action) {
      action.body.stop();
      scene.physics.world.removeCollider(this.collider);
      _b.destroy();
      this.current_selected_enemie.destroy()
      particles.destroy()
    }, null, this);

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
