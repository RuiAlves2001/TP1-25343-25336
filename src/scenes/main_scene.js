import Phaser from "phaser";
import { Turret } from "../turret";
import { Player } from "../player";

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
        this.tiles = this.map.addTilesetImage('tile_grass');
        this.layer = this.map.createBlankLayer('layer', this.tiles);
        this.layer.randomize(0, 0, 64, 64, [ 0, 0 ]); // Wall above the water
        this.turret = new Turret(this, 100, 100, 400);
        this.player = new Player(this, 150, 150);
    }
    
    update() {
        this.player.update();
        this.turret.update();
        this.turret.look_at_target(this.player.body);
    }
}