import Phaser from "phaser";
import { Turret } from "../turret";
import { Player } from "../player";

const TILE_SIZE = 64;

export class MainScene extends Phaser.Scene {
    constructor () {
        super({key:"MainScene"});
    }

    preload() {
        this.load.image('turret_head', 'assets/turret_head.png');
        this.load.image('turret_body', 'assets/turret_body.png');
        this.load.image('player', 'assets/player.png')
        this.load.image('tile_grass', 'assets/grass.png')
    }

    create() {
        this.map = this.make.tilemap({ tileWidth: 64, tileHeight: 64, width: 64, height: 64});
        //this.tiles = this.map.addTilesetImage('tile_grass');
        //this.layer = this.map.createBlankLayer('layer', this.tiles);
        //this.layer.randomize(0, 0, 64, 64, [ 0, 0 ]); // Wall above the water
        this.turrets = [new Turret(this, 100, 100, 400)]
        this.player = new Player(this, 150, 150);

        this.cursor = this.game.input.activePointer
        this.graphics = this.add.graphics();
        this.cursor_x = this.cursor.x;
        this.cursor_y = this.cursor.y;

        this.input.on('pointerdown', (pointer) => {
            let t = new Turret(this, pointer.x, pointer.y, 300);
            this.turrets.push(t);
        })
    }
    
    update() {
        this.player.update();
    // the towers update is not doing anything at this point
        this.turrets.map((turret) => {
            turret.update();
            turret.look_at_target(this.player.body);
        })
        this.graphics.clear();
        this.graphics.fillStyle(0x00ff00, 0.5);

        this.cursor_x = Math.floor(this.cursor.x, this.cursor.x - TILE_SIZE);
        this.cursor_y = Math.floor(this.cursor.y, this.cursor.y - TILE_SIZE);
        console.log(this.cursor_x, this.cursor_y)
        this.graphics.fillCircle(this.cursor_x, this.cursor_y, TILE_SIZE/2, TILE_SIZE/2);
    }
}
