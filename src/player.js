// Player class
import { Physics } from 'phaser';
import { BaseTurret } from "./base_turret";
import { get_turret } from './utils';

let KEYS = {
  UP: Phaser.Input.Keyboard.KeyCodes.W,
  DOWN: Phaser.Input.Keyboard.KeyCodes.S,
  LEFT: Phaser.Input.Keyboard.KeyCodes.A,
  RIGHT: Phaser.Input.Keyboard.KeyCodes.D,
  ACTION: Phaser.Input.Keyboard.KeyCodes.SPACE,
  INCREASE_SPAWN_RATE: Phaser.Input.Keyboard.KeyCodes.X,
  DECREASE_SPAWN_RATE: Phaser.Input.Keyboard.KeyCodes.Z,
  ADD_MONEY: Phaser.Input.Keyboard.KeyCodes.M
}

export class Player extends Physics.Arcade.Sprite {
  constructor(scene, x, y, canShoot) {
    super(scene, x, y, 'player');
    this.cursors = scene.input.keyboard.createCursorKeys();
    this.canon = this.scene.add.sprite(x, y, 'canon');
    Object.keys(KEYS).map((key) => {
      KEYS[key] = scene.input.keyboard.addKey(KEYS[key])
    })

    scene.physics.world.enableBody(this);
    scene.add.existing(this);
    this.scene.add.existing(this.canon);
    this.setDepth(3)
    this.canon.setDepth(4)
    this.acc = 200;
    this.scene.input.activePointer.updateWorldPoint(this.scene.cameras.main);
    this.scene.input.on('pointerdown', (pointer) => {
      if(!canShoot) return
      this.shoot(this.scene.input.activePointer)
    })

    this.turret_type = 0;

    this.scene.events.on('k', this.preload, this);
  }

  set_tower(tower) {
    this.turret_type = tower
  }

  preload() {
    console.log("SPAW")
  }

  spawn_turret(money) {
    if (Phaser.Input.Keyboard.JustDown(KEYS.ACTION)) {
      let turret_data = get_turret(this.turret_type);
      if (money - turret_data.price >= 0) {
        let t = new BaseTurret(this.scene.physics.world, this.scene, this.x, this.y, 300, true, this.turret_type);
        return [t, money - turret_data.price]
      }
    }
  }

  shoot(p) {
    let _b = this.scene.physics.add.sprite(this.x, this.y, 'bullet');
    this.scene.cameras.getCamera("UICAMERA").ignore(_b);
    this.scene.physics.world.enableBody(_b);
    this.scene.physics.moveTo(_b, p.worldX, p.worldY, 1000);

    const collider = this.scene.physics.add.overlap(_b, this.scene.enemies_group, function (action, target) {
      action.body.stop();
      this.scene.physics.world.removeCollider(collider);
      _b.destroy();
      target.damage(1);
      
      // this.current_selected_enemie.destroy()
      // particles.destroy()
    }, null, this);

  }

  update() {
    this.canon.x = this.x
    this.canon.y = this.y
    this.canon.rotation = Phaser.Math.Angle.Between(this.canon.x, this.canon.y, this.scene.input.activePointer.worldX, this.scene.input.activePointer.worldY)

    this.setVelocity(0, 0);
    if (KEYS.UP.isDown) {
      this.movement_up();
    }
    if (KEYS.LEFT.isDown) {
      this.movement_left()
    }
    if (KEYS.DOWN.isDown) {
      this.movement_down()
    }
    if (KEYS.RIGHT.isDown) {
      this.movement_right()
    }

   
  }

  movement_left() {
    this.setVelocityX(-this.acc);
  };
  movement_right() {
    this.setVelocityX(this.acc);
  };
  movement_up() {
    this.setVelocityY(-this.acc);
  };
  movement_down() {
    this.setVelocityY(this.acc);
  };
}
