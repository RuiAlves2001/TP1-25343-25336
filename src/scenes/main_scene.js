import Phaser, { GameObjects } from "phaser";
import { Turret } from "../turret";
import { Player } from "../player";
import { Enemie } from "../enemie";
import { BaseTurret } from "../base_turret";
import { UiMenu } from "./ui_menu";

const MODES = {
  Classic: 0,
  RunNGun: 1
}

const TILE_SIZE = 64;
const MODE = MODES.RunNGun
let ENEMIE_SPAWN_TIMER = 5;
const MAX_SCROLL = 3
const MIN_SCROLL = 0.5

const KEYS = {
  INCREASE_SPAWN_RATE: Phaser.Input.Keyboard.KeyCodes.ONE,
  DECREASE_SPAWN_RATE: Phaser.Input.Keyboard.KeyCodes.TWO,
  LEFT: Phaser.Input.Keyboard.KeyCodes.A,
  RIGHT: Phaser.Input.Keyboard.KeyCodes.D,
  ACTION: Phaser.Input.Keyboard.KeyCodes.SPACE
}


export class MainScene extends Phaser.Scene {
  constructor() {
    super({ key: "MainScene" });
  }

  preload() {
    this.load.image('turret_head', 'assets/turret_head.png');
    this.load.image('turret_body', 'assets/turret_body.png');
    this.load.image('turret_laser', 'assets/head_laser.png')
    this.load.image('player', 'assets/player_new.png')
    this.load.image('tile_grass', 'assets/grass.png')
    this.load.image('castle', 'assets/_castle.png')
    this.load.image('bullet', 'assets/bullet.png')
    this.load.image('smoke', 'assets/smoke.png');
    this.load.image('enemie', 'assets/Slime.png');
    this.load.image('turret_fire', 'assets/fire_turret_head.png');
    this.load.image('fire', 'assets/fire.png');
    this.load.image('canon', 'assets/canon.png')
    this.load.image('laser', 'assets/laser.png')
    this.load.image('crossair', 'assets/crossair.png')
    this.load.image("btn_pause", "./assets/pause_btn.png", 270, 180);
  }

  create() {
    // ------ GAME VARIABLES ------
    this.money = 200;


    // ------ BACKGROUND / MAP RELATED ------
    this.map = this.make.tilemap({ tileWidth: 64, tileHeight: 64, width: 256, height: 64 });
    this.tiles = this.map.addTilesetImage('tile_grass');
    this.layer = this.map.createBlankLayer('layer', this.tiles);
    this.layer.randomize(0, 0, 128, 128, [0, 1, 2, 3]); // Wall above the water
    // ------ GAME OBJECT RELATED ------
    this.turrets = this.physics.add.group()
    this.player = new Player(this, 64*32, 64*32);
    this.camera_ui = this.cameras.add(0, 0, 1600, 900);
    this.camera = this.cameras.main;
    this.camera.setBounds(0,0,64*64,64*64)
    // this.cameras.main.setViewport(0,0,1600,900);
    this.castle = this.physics.add.sprite(64*32, 64*32, "castle");
    this.input.setPollAlways();
    this.window = this.sys.game.canvas;


    // this.ui_left_tab_menu = new UiMenu(this);
    // this.ui_left_tab_menu.create();
    this.game.config.scaleMode = Phaser.ScaleModes.NEAREST

    this.cursor = this.game.input.activePointer
    this.graphics = this.add.graphics();
    this.cursor_x = this.cursor.x;
    this.cursor_y = this.cursor.y;
    this.enemie_creation_timer = 0;
    this.enemies_group = this.add.group()

    // ---- GAME MODE MANAGEMENT ----
    // the classic game mode has no playable character and the camera is fixed
    // the normal game mode has a controllable character that can shoot and build turrets

    if (MODE == MODES.Classic) {
      this.input.on('pointerdown', (pointer) => {
        let t = new BaseTurret(this.physics.world, this, pointer.x, pointer.y, 300, true, Math.round(Math.random()));
        this.turrets.add(t);
      })
    } else {
      this.input.manager.canvas.style.cursor = "none";
      this.input.on('wheel', (pointer, gameObjects, deltaX, deltaY, deltaZ) => {
        if ((this.camera.zoom + deltaY * 0.001 >= MIN_SCROLL) && (this.camera.zoom + deltaY * 0.001 <= MAX_SCROLL)) {
          this.camera.zoom += deltaY * 0.001
        }
      })
      this.camera.startFollow(this.player);
      this.camera.zoom = 1.5
    }
    this.crossair = this.add.sprite(0, 0, "crossair")
    if (MODE != MODES.RunNGun) this.crossair.setVisible(false)
    this.bullets = this.add.group()
    this.scene_info = this.add.text(50, this.window.height - 50, '', { font: '20px monospace', fill: '#00ff00' })

    // ---- UI ----
    // TODO: need to transfer the UIMENU scene into here
    // ui will be managed through the main_scene

    // let UI_ONLY_ELEMENTS = this.ui_left_tab_menu.get_ui_elements();
    // console.log("UI ONLY", this.enemies_group.getChildren())
    // const UI_ONLY = this.children.getAll()sd
    this.camera_ui.setName("UICAMERA")
    this.camera_ui.ignore([this.map, this.tiles, this.player, this.layer, this.graphics, this.castle, this.player.canon, this.crossair])
    this.camera_ui.visible = true

    this.ui_menu_group = this.add.group(); // TO BE USED IN CAMERA IGNORE SHENANIGANS
    this.keyT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.T);

    let opentab = this.add.text(20, 20, 'T - Turret Screen', { font: '20px Courier', fill: '#1f2120' }).setOrigin(0).setVisible(true);
    let returntab = this.add.text(20, 20, 'T - Turret Screen', { font: '20px Courier', fill: '#ffffff' }).setOrigin(0).setVisible(false).setDepth(3);
    let creditsBackground = this.add.rectangle(
      150,
      450,
      300,
      900,
      '#4e8545',
      0.7
    ).setVisible(false);
    let turrethead = this.add.image(30, 30, "turret_head").setOrigin(0).setScale(3).setVisible(false).setInteractive();
    let textturrethead = this.add.text(20, 222, 'Price: 100€ | Damage: 20hp', { font: '16px Courier', fill: '#ffffff' }).setOrigin(0).setVisible(false).setDepth(3);
    let turretbody = this.add.image(54, 247, "turret_body").setOrigin(0).setScale(3).setVisible(false).setInteractive();
    let textturretbody = this.add.text(20, 439, 'Price: 200€ | Damage: 50hp', { font: '16px Courier', fill: '#ffffff' }).setOrigin(0).setVisible(false).setDepth(3);
    var keyObj = this.input.keyboard.addKey('t');  // Get key object
    this.ui_menu_group.addMultiple([turrethead, turrethead, turretbody, textturretbody, opentab, returntab, creditsBackground])
    keyObj.on('down', function (event) {
      opentab.setVisible(false);
      returntab.setVisible(true);
      textturrethead.setVisible(true);
      textturretbody.setVisible(true);
      turrethead.setVisible(true);
      turretbody.setVisible(true);
      turrethead.setInteractive(true);
      turretbody.setInteractive(true);
      creditsBackground.setVisible(true);
    });
    keyObj.on('up', function (event) {
      opentab.setVisible(true);
      returntab.setVisible(false);
      textturrethead.setVisible(false);
      textturretbody.setVisible(false);
      turrethead.setVisible(false);
      turretbody.setVisible(false);
      creditsBackground.setVisible(false);
    });

    this.data.set('money', 0);
    this.data.set('difficulty', 0);
    this.data.set('score', 0);
    this.text = this.add.text(1000, 25, '', { font: 'bold 22px Courier', fill: '#1f2120' });
    this.text.setText([
      'Money: ' + this.data.get('money') + '    ' + 'Difficulty: ' + this.data.get('difficulty') + '    ' + 'Score: ' + this.data.get('score')
    ]);
    //this.i=0;

    // let hoverSprite = this.add.sprite(100, 100, "player").setScale(1).setDepth(5);
    // hoverSprite.setVisible(false);

    let gameIsPaused = false

    this.events.on('resume', function () {
      gameIsPaused = false
    })

    let pause_label = this.add.image(this.game.renderer.width - 75, 10, "btn_pause").setOrigin(0).setDepth(0).setScale(0.1);
    pause_label.setInteractive();
    pause_label.on("pointerdown", () => {
      if (gameIsPaused == false) {
        this.scene.pause();
        this.scene.launch('PauseScene');
        gameIsPaused = true;
        // sd
      }
    });

    this.camera.ignore(this.ui_menu_group)
    // ---- END OF UI ----

    const incMoney = () => {
      console.log("MONEY")    
      this.money += 1;
    }

    this.events.addListener("killed", function() {
      console.log("KILLED")
      incMoney();
    })

    this.events.addListener("INCREASE_SPAWN_RATE", function() {
      ENEMIE_SPAWN_TIMER = Math.max(0, ENEMIE_SPAWN_TIMER - 0.1)
    })

    this.events.addListener("DECREASE_SPAWN_RATE", function() {
      ENEMIE_SPAWN_TIMER -= Math.min(0, ENEMIE_SPAWN_TIMER - 5)
    })

  }

  update() {

    if (KEYS.INCREASE_SPAWN_RATE.isDown) {
      this.increase_spawn_rate();
    }
    if (KEYS.DECREASE_SPAWN_RATE.isDown) {
      this.decrease_spawn_rate();
    }

    this.data.set('enemies', this.enemies_group.getLength());
    this.scene_info.setText([
      'Spawn Rate:' + ENEMIE_SPAWN_TIMER,
      'Nº Enemies: ' + this.data.get('enemies')
    ])
    if (MODE === MODES.RunNGun) {
      this.input.activePointer.updateWorldPoint(this.cameras.main);

      this.player.update();
      let tm = this.player.spawn_turret(this.money);
      if(tm) {
        this.money = tm[1]
      }
      this.crossair.x = this.input.activePointer.worldX
      this.crossair.y = this.input.activePointer.worldY
      if (tm) {
        this.camera.shake(100, 0.001)
        this.turrets.add(tm[0])
      }
    } else {
      this.graphics.clear();
      this.graphics.fillStyle(0x00ff00, 0.5);
      this.cursor_x = Math.floor(this.cursor.x, this.cursor.x - TILE_SIZE);
      this.cursor_y = Math.floor(this.cursor.y, this.cursor.y - TILE_SIZE);
      this.graphics.fillCircle(this.cursor_x, this.cursor_y, TILE_SIZE / 2, TILE_SIZE / 2);
    }

    // ----- TURRETS -----
    // Check if each turret has been destroyed and
    // then remove them from memory or make them look at the target
    // and run the update which has turret update logic

    this.turrets.children.each((turret) => {
      if (turret.isDestroyed) {
        this.turrets.killAndHide(turret)
        this.turrets.remove(turret, true, true)
      } else {
        turret.look_at_target(this.enemies_group.children.getArray());
        turret.update(this.camera_ui);
      }
    })

    // ----- ENEMIES RELATED -----

    this.enemie_creation_timer++
    if (this.enemie_creation_timer > Math.random() * ENEMIE_SPAWN_TIMER) {
      ENEMIE_SPAWN_TIMER -= Math.min(ENEMIE_SPAWN_TIMER, 0.02);
      ENEMIE_SPAWN_TIMER = Math.max(ENEMIE_SPAWN_TIMER, 2);
      this.enemies_amount++
      let position = {};

      switch (Math.ceil(Math.random() * 4)) {
        case 1:
          position['x'] = -TILE_SIZE
          position['y'] = Math.ceil(Math.random() * 64*64)
          break;
        case 2:
          position['x'] = TILE_SIZE + (64*64)
          position['y'] = Math.ceil(Math.random() * 64*64)
          break;
        case 3:
          position['y'] = -TILE_SIZE
          position['x'] = Math.ceil(Math.random() * 64*64)
          break;
        default:
          position['y'] = TILE_SIZE + (64*64)
          position['x'] = Math.ceil(Math.random() * 64*64)
          break;
      }

      console.log(position)

      const enemie = new Enemie(this, position['x'], position['y'], 100, 100, this.castle);
      this.physics.moveToObject(enemie, this.castle, 50);
      this.enemie_creation_timer -= ENEMIE_SPAWN_TIMER * 2;
      this.enemies_group.add(enemie);

      let collider = this.physics.add.overlap(enemie, this.castle, function (action) {
        action.body.stop();
        this.physics.world.removeCollider(collider);
        enemie.destroy();

      }, null, this);
    }

    this.camera_ui.ignore(this.enemies_group)
    this.camera_ui.ignore(this.turrets)
    // -----------------------

    this.data.set("money", this.money)
    this.text.x = (this.game.renderer.width - `Money:  ${this.data.get('money')}  Difficulty: ${this.data.get('difficulty')} Score: ${this.data.get('score')}`.length * 10 - 300);
    this.text.setText([
      'Money: ' + this.data.get('money') + '    ' + 'Difficulty: ' + this.data.get('difficulty') + '    ' + 'Score: ' + this.data.get('score')
    ]);

    // ----- CHEAT RELATED / SHORT CUTS -----

    
  }
}