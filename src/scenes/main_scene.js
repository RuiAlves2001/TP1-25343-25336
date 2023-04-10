import Phaser, { GameObjects } from "phaser";
import { Turret } from "../turret";
import { Player } from "../player";
import { Enemie } from "../enemie";
import { BaseTurret } from "../base_turret";
import { UiMenu } from "./ui_menu";
import { HealthBar } from "../health_bar";
import { get_turret, get_turrets } from "../utils";

const MODES = {
  Classic: 0,
  RunNGun: 1
}

const TILE_SIZE = 64;
let MODE = MODES.Classic
let ENEMIE_SPAWN_TIMER = 50;
const MAX_SCROLL = 3
const MIN_SCROLL = 0.5
const TIME_REMAINING = 60 * 5 * 100; // 5 minutes

const KEYS = {
  INCREASE_SPAWN_RATE: Phaser.Input.Keyboard.KeyCodes.X,
  DECREASE_SPAWN_RATE: Phaser.Input.Keyboard.KeyCodes.Z,
  ADD_MONEY: Phaser.Input.Keyboard.KeyCodes.M,
  TOWER_1: Phaser.Input.Keyboard.KeyCodes.ONE,
  TOWER_2: Phaser.Input.Keyboard.KeyCodes.TWO,
  TOWER_3: Phaser.Input.Keyboard.KeyCodes.THREE,
  TOWER_4: Phaser.Input.Keyboard.KeyCodes.FOUR,
  SIDE_TAB: Phaser.Input.Keyboard.KeyCodes.T
}


export class MainScene extends Phaser.Scene {
  constructor() {
    super({ key: "MainScene" });
  }

  preload() {
    this.load.image('turret_head', 'assets/wood_tower.png');
    this.load.image('turret_body', 'assets/tower_base.png');
    this.load.image('turret_laser', 'assets/head_laser.png')
    this.load.image('player', 'assets/player_new.png')
    this.load.image('tile_grass', 'assets/grass.png')
    this.load.image('castle', 'assets/_castle.png')
    this.load.image('bullet', 'assets/bullet.png')
    this.load.image('smoke', 'assets/smoke.png');
    this.load.image('slime', 'assets/slime/slime.png');
    this.load.image('slime-1', 'assets/slime/slime_1.png');
    this.load.image('enemie_damaged', 'assets/_Slime_hit.png')
    this.load.image('turret_fire', 'assets/flame_tower.png');
    this.load.image('fire', 'assets/fire.png');
    this.load.image('canon', 'assets/canon.png')
    this.load.image('laser', 'assets/laser.png')
    this.load.image('crossair', 'assets/crossair.png')
    this.load.image("btn_pause", "assets/pause_btn.png", 270, 180);
    this.load.image("boss", "assets/bossman/boss.png");
    this.load.image("boss-4", "assets/bossman/boss_4.png");
    this.load.image("boss-3", "assets/bossman/boss_3.png");
    this.load.image("boss-2", "assets/bossman/boss_2.png");
    this.load.image("boss-1", "assets/bossman/boss_1.png");
    this.load.image("sniper", "assets/sniper_tower.png");
    this.load.image("sniper-bullet", "assets/sniper_bullet.png");
    this.load.image("sniper-trail", "assets/sniper_bullet_trail.png");
    this.load.image("v_wood", "assets/vis_wood_tower.png")
    this.load.image("v_laser", "assets/vis_laser_tower.png")
    this.load.image("v_flame", "assets/vis_flame_tower.png")
    this.load.image("v_sniper", "assets/vis_sniper_tower.png")  
  }

  init(data) {
    console.log(data)

    switch (data.id) {
      case 0:
        MODE = MODES.Classic
        break
      default:
        MODE = MODES.RunNGun
    }
  }

  create() {
    // ------ GAME VARIABLES ------
    this.money = MODE === MODES.Classic ? 40 : 0;
    this.currently_selected_tower = 0;
    this.t = 0;
    ENEMIE_SPAWN_TIMER = 50
    let ost = this.sound.play("ost");
    this.sound.volume = 0.2    

    // ------ BACKGROUND / MAP RELATED ------
    this.map = this.make.tilemap({ tileWidth: 64, tileHeight: 64, width: 512, height: 64 });
    this.tiles = this.map.addTilesetImage('tile_grass');
    this.layer = this.map.createBlankLayer('layer', this.tiles);
    this.layer.randomize(0, 0, 128, 128, [0, 1, 2, 3, 4, 5, 6, 7]); // Wall above the water
    // ------ GAME OBJECT RELATED ------
    this.turrets = this.physics.add.group()
    this.player = new Player(this, 64 * 32, 64 * 32);
    this.camera_ui = this.cameras.add(0, 0, 1600, 900);
    this.camera = this.cameras.main;
    this.camera.setBounds(0, 0, 64 * 64, 64 * 64)
    // this.cameras.main.setViewport(0,0,1600,900);
    this.castle = this.physics.add.sprite(64 * 32, 64 * 32, "castle");
    this.input.setPollAlways();
    this.window = this.sys.game.canvas;
    this.health = 124;

    Object.keys(KEYS).map((key) => {
      KEYS[key] = this.input.keyboard.addKey(KEYS[key])
    })

    this.events.on("resume", (_, f) => {
      this.currently_selected_tower = 0;
      if (f) {
        this.currently_selected_tower = f.selected 
      }
      this.player.set_tower(this.currently_selected_tower)
      this.scene_info.x = 50
    })

    // this.ui_left_tab_menu = new UiMenu(this);
    // this.ui_left_tab_menu.create();
    // this.game.config.scaleMode = Phaser.ScaleModes.NEAREST  

    this.cursor = this.game.input.activePointer
    this.graphics = this.add.graphics();
    this.cursor_x = this.cursor.x;
    this.cursor_y = this.cursor.y;
    this.enemie_creation_timer = 0;
    this.enemies_group = this.add.group()

    // ---- GAME MODE MANAGEMENT ----
    // the classic game mode has no playable character and the camera is fixed
    // the normal game mode has a controllable character that can shoot and build turrets

    this.events.on("currently_selected", (id) => {
      console.log("THIS")
      this.currently_selected_tower = id
    })

    KEYS.SIDE_TAB.on('down', () => {
      this.scene.launch('SideScene', {id: this.currently_selected_tower});
      this.scene_info.x += 270
    })

    KEYS.TOWER_1.on('down', () => {
      this.currently_selected_tower = 0
    })

    KEYS.TOWER_2.on('down', () => {
      this.currently_selected_tower = 1
    })

    KEYS.TOWER_3.on('down', () => {
      this.currently_selected_tower = 2
    })

    KEYS.TOWER_4.on('down', () => {
      this.currently_selected_tower = 3
    })

    if (MODE == MODES.Classic) {
      this.player.setVisible(false);

      this.input.on('pointerdown', (pointer) => {
        const turret_config = get_turret(this.currently_selected_tower)
        if (turret_config.price <= this.money) {
          this.money -= turret_config.price;
          let t = new BaseTurret(this.physics.world, this, pointer.x, pointer.y, 300, true, this.currently_selected_tower);
          this.turrets.add(t);
        } else {
          this.camera.shake(100, 0.005)
        }
      })
      this.camera.zoom = 1;
      this.camera_ui.setVisible(false);
      this.castle.x = this.window.width / 2;
      this.castle.y = this.window.height / 2;
      this.castle_health
      // this.camera.setViewport(this.castle.x - this.window.width, this.castle.y - this.window.height, this.window.width, this.window.height)
      //this.camera.setPosition(this.castle.x, this.castle.y);
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
    if (MODE === MODES.Classic) this.bullets.setVisible(false);
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
    const turrets = get_turrets();

    // ---- SIDE MENU TURRET ----

    // let turrethead = this.add.image(30, 20, "turret_head").setOrigin(0).setScale(3).setVisible(false).setInteractive();
    // let textturrethead = this.add.text(65, 192, 'basic turrent\n100€ | 20hp | 30dm', { font: 'bold 16px Courier', fill: '#ffffff',align: 'center' }).setOrigin(0).setVisible(false).setDepth(3);
    // let turretbody = this.add.image(54, 217, "turret_body").setOrigin(0).setScale(3).setVisible(false).setInteractive();
    // let textturretbody = this.add.text(65, 409, 'gas turrent\n200€ | 60hp | 40dm', { font: 'bold 16px Courier', fill: '#ffffff',align: 'center' }).setOrigin(0).setVisible(false).setDepth(3);
    // let turret_fire = this.add.image(100, 500, "turret_fire").setOrigin(0).setScale(3).setVisible(false).setInteractive();
    // let textturret_fire = this.add.text(65, 631, 'fire turret\n100€ | 20hp | 30dm', { font: 'bold 16px Courier', fill: '#ffffff',align: 'center' }).setOrigin(0).setVisible(false).setDepth(3);
    // let turretbody1 = this.add.image(54, 671, "turret_body").setOrigin(0).setScale(3).setVisible(false).setInteractive();
    // let textturretbody1 = this.add.text(65, 853, 'gas turrent\n200€ | 60hp | 40dm', { font: 'bold 16px Courier', fill: '#ffffff',align: 'center' }).setOrigin(0).setVisible(false).setDepth(3);
    // var keyObj = this.input.keyboard.addKey('t');  // Get key object
    // this.ui_menu_group.addMultiple([turrethead, textturrethead, turretbody, textturretbody,turret_fire, textturret_fire, turretbody1, textturretbody1, opentab, returntab, creditsBackground])
    // KEYS.SIDE_TAB.on('down', function (event) {
    //   this.scene.launch("SideScene");
    // });

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

    let pause_label = this.add.image(this.game.renderer.width - 75, 10, "btn_pause").setOrigin(0).setDepth(3).setScale(0.1);
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

    this.events.addListener("killed", function () {
      console.log("KILLED")
      incMoney();
    })

    this.events.addListener("INCREASE_SPAWN_RATE", function () {
      ENEMIE_SPAWN_TIMER = Math.max(0, ENEMIE_SPAWN_TIMER - 0.1)
    })

    this.events.addListener("DECREASE_SPAWN_RATE", function () {
      console.log("DECREASE")
      ENEMIE_SPAWN_TIMER += 1
    })

    this.events.addListener("ADD_MONEY", function () {
      incMoney();
    })

    this.castle_health = new HealthBar(this, 32 * 32 - 32, 32 * 32 + 32, 124);
    if(MODE === MODES.Classic ) {
      this.castle_health = new HealthBar(this, this.window.width/2, this.window.height/2+256, 124);
      console.log(this.castle_health)
    }

  }

  update() {
    this.t += 1;
    this.data.set('enemies', this.enemies_group.getLength());
    this.scene_info.setText([
      'Spawn Rate:' + ENEMIE_SPAWN_TIMER,
      'Nº Enemies: ' + this.data.get('enemies')
    ])
    if (MODE === MODES.RunNGun) {
      this.input.activePointer.updateWorldPoint(this.cameras.main);

      this.player.update();
      let tm = this.player.spawn_turret(this.money);
      if (tm) {
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

    // ----- CHEATS --------------

    if (KEYS.INCREASE_SPAWN_RATE.isDown) {
      console.log("+++")
      this.events.emit("INCREASE_SPAWN_RATE");
    }

    if (KEYS.DECREASE_SPAWN_RATE.isDown) {
      console.log("---")
      this.events.emit("DECREASE_SPAWN_RATE");
    }

    if (KEYS.ADD_MONEY.isDown) {
      this.events.emit("ADD_MONEY");
    }

    if (KEYS.SIDE_TAB.isDown) {
      this.scene.launch("SideMenu")
    }

    // ----- ENEMIES RELATED -----

    this.enemie_creation_timer++
    if (this.enemie_creation_timer > Math.random() * ENEMIE_SPAWN_TIMER) {
      ENEMIE_SPAWN_TIMER -= Math.min(ENEMIE_SPAWN_TIMER, 0.02);
      ENEMIE_SPAWN_TIMER = Math.max(ENEMIE_SPAWN_TIMER, 1);
      this.enemies_amount++
      let position = {};

      switch (Math.ceil(Math.random() * 4)) {
        case 1:
          position['x'] = -TILE_SIZE
          position['y'] = Math.ceil(Math.random() * 64 * 64)
          break;
        case 2:
          position['x'] = TILE_SIZE + (64 * 64)
          position['y'] = Math.ceil(Math.random() * 64 * 64)
          break;
        case 3:
          position['y'] = -TILE_SIZE
          position['x'] = Math.ceil(Math.random() * 64 * 64)
          break;
        default:
          position['y'] = TILE_SIZE + (64 * 64)
          position['x'] = Math.ceil(Math.random() * 64 * 64)
          break;
      }

      const enemie_id = (Math.round(Math.random() * 10) === 1) ? { name: "boss", life: 5 } : { name: "slime", life: 2 }
      const enemie = new Enemie(this, position['x'], position['y'], enemie_id.life, this.castle, "", enemie_id.name);
      this.physics.moveToObject(enemie, this.castle, Math.random() * 200);
      this.enemie_creation_timer -= ENEMIE_SPAWN_TIMER * 2;
      this.enemies_group.add(enemie);
      let collider = this.physics.add.overlap(enemie, this.castle, function (action) {
        action.body.stop();
        this.physics.world.removeCollider(collider);
        this.health -= 2;
        this.castle_health.decrease(2);
        this.camera.shake(100, 0.01);
        this.camera.flash(20, 255, 0, 0);
        if (this.health <= 0) {
          console.log(this.health);
          this.scene.launch("GameOver");
          this.scene.stop("MainScene")
        }
        enemie.destroy();

      }, null, this);
    }

    this.camera_ui.ignore(this.enemies_group)
    this.camera_ui.ignore(this.turrets)
    // -----------------------
    if (TIME_REMAINING - this.t <= 0) {
      this.scene.launch("wingame");
      this.scene.stop("MainScene");
    }
    this.data.set("money", this.money)
    this.data.set("time", TIME_REMAINING - this.t)
    this.text.x = (this.game.renderer.width - `Money:  ${this.data.get('money')}  Difficulty: ${this.data.get('difficulty')} Score: ${this.data.get('score')}`.length * 10 - 300);
    this.text.setText([
      'Money: ' + this.data.get('money') + '    ' + 'Time Remaining: ' + this.data.get('time')
    ]);

    // ----- CHEAT RELATED / SHORT CUTS -----


  }
}