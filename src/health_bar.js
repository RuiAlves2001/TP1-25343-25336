export class HealthBar extends Phaser.GameObjects.Graphics {
    constructor(scene, x, y, maxHealth) {
      super(scene);
      this.x = x;
      this.y = y;
      this.value = maxHealth;
      this.p = 1;
      this.draw();
      scene.add.existing(this);
    }
    
    decrease(amount) {
      this.value -= amount;
      if (this.value < 0) {
        this.value = 0;
      }
      this.draw();
      return (this.value === 0);
    }
    
    draw() {
      this.clear();
      // BG
      this.fillStyle(0x000000);
      this.fillRect(this.x, this.y, 128, 8);
      // Health
      this.fillStyle(0xffffff);
      this.fillRect(this.x + 2, this.y + 2, 124, 4);
      if (this.value < 2) {
        this.fillStyle(0xff0000);
      } else {
        this.fillStyle(0x00ff00);
      }
      var d = Math.floor(this.p * this.value);
      this.fillRect(this.x + 2, this.y + 2, d, 4);
    }
    
  }
  