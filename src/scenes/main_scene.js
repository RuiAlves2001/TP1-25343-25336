import Phaser from "phaser";
import { Turret } from "../turret";
import { Player } from "../player";
import { Enemie } from "../enemie";

const TILE_SIZE = 64;
const ENEMIE_SPAWN_TIMER = 100;

export class MainScene extends Phaser.Scene {
  constructor() {
    super({ key: "MainScene" });
  }

  preload() {
    this.load.image('turret_head', 'assets/turret_head.png');
    this.load.image('turret_body', 'assets/turret_body.png');
    this.load.image('player', 'assets/player.png')
    this.load.image('tile_grass', 'assets/grass.png')
    this.load.image('castle', 'assets/castle.png')
    this.load.image('bullet', 'assets/bullet.png')
    this.load.image('smoke', 'assets/smoke.png')
  }

  create() {
    this.map = this.make.tilemap({ tileWidth: 64, tileHeight: 64, width: 64, height: 64 });
    this.tiles = this.map.addTilesetImage('tile_grass');
    this.layer = this.map.createBlankLayer('layer', this.tiles);
    this.layer.randomize(0, 0, 128, 128, [0, 0]); // Wall above the water
    this.turrets = this.physics.add.group()
    this.player = new Player(this, 150, 150);
    this.camera = this.cameras.main;
    this.castle = this.physics.add.sprite(800, 400, "castle");

    this.window = this.sys.game.canvas;

    this.cursor = this.game.input.activePointer
    this.graphics = this.add.graphics();
    this.cursor_x = this.cursor.x;
    this.cursor_y = this.cursor.y;
    this.enemie_creation_timer = 0;
    this.enemies = []

    this.input.on('pointerdown', (pointer) => {
      let t = new Turret(this, pointer.x, pointer.y, 300, false);
      this.turrets.add(t);
    })
    
    this.bullets = this.add.group()
    this.enemies_amount = 0
    this.data.set('enemies', this.enemies_amount.toString());
    let scene_info = this.add.text(50, this.window.height - 50, '', { font: '20px Courier', fill: '#00ff00'}) 
    scene_info.setText([
      'Nº Enemies: ' + this.data.get('enemies')
    ])
  }


  update() {
    this.player.update();
    // the towers update is not doing anything at this point

    this.turrets.children.each((turret, i) => {
      if (turret.isDestroyed) {
        this.turrets.killAndHide(turret)
        turret.active = false
        turret.removeAllListeners()
        turret.visible = false
        this.turrets.remove(turret, true, true)
        console.log(this.turrets.children)
      } else {
        turret.look_at_target(this.enemies);
        turret.update();
      }
    })

    this.graphics.clear();
    this.graphics.fillStyle(0x00ff00, 0.5);

    this.cursor_x = Math.floor(this.cursor.x, this.cursor.x - TILE_SIZE);
    this.cursor_y = Math.floor(this.cursor.y, this.cursor.y - TILE_SIZE);
    this.graphics.fillCircle(this.cursor_x, this.cursor_y, TILE_SIZE / 2, TILE_SIZE / 2);

    this.enemie_creation_timer++
    if (this.enemie_creation_timer > ENEMIE_SPAWN_TIMER) {
      this.enemies_amount++
      let position = {};

      switch (Math.ceil(Math.random() * 4)) {
        case 1:
          position['x'] = -TILE_SIZE;
          position['y'] = Math.ceil(Math.random() * this.window.height)
          break;
        case 2:
          position['x'] = this.window.width + TILE_SIZE;
          position['y'] = Math.ceil(Math.random() * this.window.height)
          break;
        case 3:
          position['y'] = -TILE_SIZE;
          position['x'] = Math.ceil(Math.random() * this.window.width)
          break;
        default:
          position['y'] = this.window.height + TILE_SIZE;
          position['x'] = Math.ceil(Math.random() * this.window.width)
          break;
    }

      const enemie = new Enemie(this, position['x'], position['y'], 100, 100, this.castle);

      this.physics.moveToObject(enemie, this.castle, 50);

      this.enemie_creation_timer -= ENEMIE_SPAWN_TIMER;
      this.enemies.push(enemie)


    let collider = this.physics.add.overlap(enemie, this.castle, function (action)
    {
        action.body.stop();

        this.physics.world.removeCollider(collider);
        enemie.destroy();
        this.enemies_amount--;
        
    }, null, this);
    }
  }
}
