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
let ENEMIE_SPAWN_TIMER = 50;
const MAX_SCROLL = 3
const MIN_SCROLL = 0.5


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
    this.load.image('smoke', 'assets/smoke.png');
    this.load.image('enemie', 'assets/Slime.png');
    this.load.image('turret_fire', 'assets/fire_turret_head.png');
    this.load.image('fire', 'assets/fire.png');
    this.load.image('canon', 'assets/canon.png')
    this.load.image('crossair', 'assets/crossair.png')
    this.load.image("btn_pause", "./assets/pause_btn.png", 270, 180);
  }

  create() {
    // ------ BACKGROUND / MAP RELATED ------
    this.map = this.make.tilemap({ tileWidth: 64, tileHeight: 64, width: 64, height: 64 });
    this.tiles = this.map.addTilesetImage('tile_grass');
    this.layer = this.map.createBlankLayer('layer', this.tiles);
    this.layer.randomize(0, 0, 32, 32, [0, 0]); // Wall above the water
    // ------ GAME OBJECT RELATED ------
    this.turrets = this.physics.add.group()
    this.player = new Player(this, 150, 150);
    this.camera_ui = this.cameras.add(0, 0, 1600, 900);
    this.camera = this.cameras.main;
    // this.cameras.main.setViewport(0,0,1600,900);
    this.castle = this.physics.add.sprite(800, 400, "castle");
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
      0.9
    ).setVisible(false);
    let turrethead = this.add.image(30, 20, "turret_head").setOrigin(0).setScale(3).setVisible(false).setInteractive();
    let textturrethead = this.add.text(65, 192, 'basic turrent\n100€ | 20hp | 30dm', { font: '16px Courier', fill: '#ffffff',align: 'center' }).setOrigin(0).setVisible(false).setDepth(3);
    let turretbody = this.add.image(54, 217, "turret_body").setOrigin(0).setScale(3).setVisible(false).setInteractive();
    let textturretbody = this.add.text(65, 409, 'gas turrent\n200€ | 60hp | 40dm', { font: '16px Courier', fill: '#ffffff',align: 'center' }).setOrigin(0).setVisible(false).setDepth(3);
    let turrethead1 = this.add.image(30, 449, "turret_head").setOrigin(0).setScale(3).setVisible(false).setInteractive();
    let textturrethead1 = this.add.text(65, 631, 'basic turrent\n100€ | 20hp | 30dm', { font: '16px Courier', fill: '#ffffff',align: 'center' }).setOrigin(0).setVisible(false).setDepth(3);
    let turretbody1 = this.add.image(54, 671, "turret_body").setOrigin(0).setScale(3).setVisible(false).setInteractive();
    let textturretbody1 = this.add.text(65, 853, 'gas turrent\n200€ | 60hp | 40dm', { font: '16px Courier', fill: '#ffffff',align: 'center' }).setOrigin(0).setVisible(false).setDepth(3);
    var keyObj = this.input.keyboard.addKey('t');  // Get key object
    this.ui_menu_group.addMultiple([turrethead, textturrethead, turretbody, textturretbody,turrethead1, textturrethead1, turretbody1, textturretbody1, opentab, returntab, creditsBackground])
    keyObj.on('down', function (event) {
      opentab.setVisible(false);
      returntab.setVisible(true);
      textturrethead.setVisible(true);
      textturretbody.setVisible(true);
      turrethead.setVisible(true);
      turretbody.setVisible(true);
      turrethead.setInteractive(true);
      turretbody.setInteractive(true);

      textturrethead1.setVisible(true);
      textturretbody1.setVisible(true);
      turrethead1.setVisible(true);
      turretbody1.setVisible(true);
      turrethead1.setInteractive(true);
      turretbody1.setInteractive(true);
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

    let hoverSprite = this.add.sprite(100, 100, "player").setScale(1).setDepth(5);
    hoverSprite.setVisible(false);

    let gameIsPaused = false

    let pause_label = this.add.image(this.game.renderer.width - 75, 10, "btn_pause").setOrigin(0).setDepth(0).setScale(0.1);
    pause_label.setInteractive();

    let returnMenu = this.add.text(this.game.renderer.width / 2, this.game.renderer.height / 2 - 100, '< Return to Menu >', { font: '30px Arial', fill: '#fff' }).setOrigin(0.5).setDepth(2);
    returnMenu.setInteractive();

    let pausa = this.add.text(this.game.renderer.width / 2, this.game.renderer.height / 2 - 220, 'PAUSA', { font: '100px Arial', fill: '#fff' }).setOrigin(0.5).setDepth(2);

    let restartGame = this.add.text(this.game.renderer.width / 2, this.game.renderer.height / 2, '< Restart the game >', { font: '30px Arial', fill: '#fff' }).setOrigin(0.5).setDepth(2);
    restartGame.setInteractive();

    let choiseLabel = this.add.text(this.game.renderer.width / 2, this.game.renderer.height / 2 + 100, '< Click to return to the game >', { font: '30px Arial', fill: '#fff' }).setOrigin(0.5).setDepth(2);
    choiseLabel.setInteractive();

    let pausaBg = this.add.image(0, 0, "bg").setOrigin(0).setDepth(1).setScale(2);
    pausaBg.alpha = 0.7;

    this.ui_menu_group.addMultiple([hoverSprite, pause_label, returnMenu, pausa, restartGame, choiseLabel, pausaBg])

    // Code for the pause menu

    let list = [pausaBg, choiseLabel, returnMenu, restartGame, pausa];
    list.forEach(unpause => {
      unpause.setVisible(false);
      unpause.setActive(false);
    });

    pause_label.on("pointerdown", () => {
      if (gameIsPaused == false) {
        gameIsPaused = true;
        list.forEach(unpause => {
          unpause.setVisible(true);
          unpause.setActive(true);
        })
      }
    });

    choiseLabel.on("pointerdown", () => {

      if (gameIsPaused == true) {
        gameIsPaused = false;
        list.forEach(unpause => {
          unpause.setVisible(false);
          unpause.setActive(false);
        })
      }
    });

    choiseLabel.on("pointerover", () => {
      hoverSprite.setVisible(true);
      hoverSprite.play("walk");
      hoverSprite.x = choiseLabel.x - choiseLabel.width;
      hoverSprite.y = choiseLabel.y;
    })
    choiseLabel.on("pointerout", () => {
      hoverSprite.setVisible(false);
    })

    returnMenu.on("pointerdown", () => {
      //inserir return menu
    });

    returnMenu.on("pointerover", () => {
      hoverSprite.setVisible(true);
      hoverSprite.play("walk");
      hoverSprite.x = returnMenu.x - returnMenu.width;
      hoverSprite.y = returnMenu.y;
    })
    returnMenu.on("pointerout", () => {
      hoverSprite.setVisible(false);
    })

    restartGame.on("pointerdown", () => {
      //inserir return menu
    });

    restartGame.on("pointerover", () => {
      hoverSprite.setVisible(true);
      hoverSprite.play("walk");
      hoverSprite.x = restartGame.x - restartGame.width;
      hoverSprite.y = restartGame.y;
    })
    restartGame.on("pointerout", () => {
      hoverSprite.setVisible(false);
    })

    this.camera.ignore(this.ui_menu_group)

    // ---- END OF UI ----

  }

  update() {
    this.data.set('enemies', this.enemies_group.getLength());
    this.scene_info.setText([
      'Spawn Rate:' + ENEMIE_SPAWN_TIMER,
      'Nº Enemies: ' + this.data.get('enemies')
    ])
    if (MODE === MODES.RunNGun) {
      this.input.activePointer.updateWorldPoint(this.cameras.main);

      this.player.update();
      let t = this.player.spawn_turret();
      this.crossair.x = this.input.activePointer.worldX
      this.crossair.y = this.input.activePointer.worldY
      if (t) {
        this.camera.shake(100, 0.001)
        this.turrets.add(t)
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
    if (this.enemie_creation_timer > Math.random() * ENEMIE_SPAWN_TIMER * 2) {
      ENEMIE_SPAWN_TIMER -= Math.min(ENEMIE_SPAWN_TIMER, 0.05);
      this.enemies_amount++
      let position = {};

      switch (Math.ceil(Math.random() * 4)) {
        case 1:
          position['x'] = -TILE_SIZE
          position['y'] = Math.ceil(Math.random() * this.camera.height)
          break;
        case 2:
          position['x'] = TILE_SIZE
          position['y'] = Math.ceil(Math.random() * this.camera.height)
          break;
        case 3:
          position['y'] = -TILE_SIZE
          position['x'] = Math.ceil(Math.random() * this.window.width)
          break;
        default:
          position['y'] = TILE_SIZE
          position['x'] = Math.ceil(Math.random() * this.window.width)
          break;
      }

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

  }
}