// Map creation and path configuration
// Aqui deve ser criada uma classe que não só crie o mapa mas também configure
// o caminho pelo qual os inimigos irão andar

var game = new Phaser.Game(640, 480, Phaser.AUTO, 'game');

var PhaserGame = function () {

    this.bmd = null;

    this.alien = null;

    this.mode = 0;

    this.points = {
        'x': [ 0, 128, 256, 384, 512, 640 ],
        'y': [ 400, 400, 240, 240, 240, 240 ]
    };

    this.pi = 0;
    this.path = [];

};

PhaserGame.prototype = {

    init: function () {

        this.stage.backgroundColor = '#177a0c';

    },

    preload: function () {

        //  We need this because the assets are on Amazon S3
        //  Remove the next 2 lines if running locally
        this.load.baseURL = 'https://files.phaser.io.s3.amazonaws.com/codingtips/issue008/';
        this.load.crossOrigin = 'anonymous';

        this.load.image('alien', 'assets/ufo.png');
    },

    create: function () {

        this.bmd = this.add.bitmapData(this.game.width, this.game.height);
        this.bmd.addToWorld();

        this.alien = this.add.sprite(0, 0, 'alien');
        this.alien.anchor.set(0.5);

        var py = this.points.y;

        this.plot();

    },

    

    plot: function () {

        var x = 1 / game.width;

        for (var i = 0; i <= 1; i += x)
        {
            var px = this.math.catmullRomInterpolation(this.points.x, i);
            var py = this.math.catmullRomInterpolation(this.points.y, i);
            this.path.push( { x: px, y: py });
          
            //Adicionar os pontos do caminho 
            this.bmd.rect(px, py, 1, 1, 'rgba(255, 255, 255, 1)');
        }

        //Adicionar linha que liga os pontos
        for (var p = 0; p < this.points.x.length; p++)
        {
            this.bmd.rect(this.points.x[p]-3, this.points.y[p]-3, 6, 6, 'rgba(255, 0, 0, 1)');
        }

    },

    update: function () {

        this.alien.x = this.path[this.pi].x;
        this.alien.y = this.path[this.pi].y;
        this.pi++;

        if (this.pi >= this.path.length)
        {
            this.pi = 0;
        }

    }

};

game.state.add('Game', PhaserGame, true);

