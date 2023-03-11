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
  }

  create() {
    this.map = this.make.tilemap({ tileWidth: 64, tileHeight: 64, width: 64, height: 64 });
    this.tiles = this.map.addTilesetImage('tile_grass');
    this.layer = this.map.createBlankLayer('layer', this.tiles);
    this.layer.randomize(0, 0, 128, 128, [0, 0]); // Wall above the water
    this.turrets = [new Turret(this, 100, 100, 400, true)]
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
      let t = new Turret(this, pointer.x, pointer.y, 300, true);
      this.turrets.push(t);
    })
  }

  update() {
    this.player.update();
    // the towers update is not doing anything at this point
    this.turrets.map((turret) => {
      turret.update();
      turret.look_at_target(this.enemies);
    })
    this.graphics.clear();
    this.graphics.fillStyle(0x00ff00, 0.5);

    this.cursor_x = Math.floor(this.cursor.x, this.cursor.x - TILE_SIZE);
    this.cursor_y = Math.floor(this.cursor.y, this.cursor.y - TILE_SIZE);
    this.graphics.fillCircle(this.cursor_x, this.cursor_y, TILE_SIZE / 2, TILE_SIZE / 2);

    this.enemie_creation_timer++
    if (this.enemie_creation_timer > ENEMIE_SPAWN_TIMER) {
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
        
    }, null, this);
    }
  }
}
