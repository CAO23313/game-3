class Gameover extends Phaser.Scene {
    constructor() {
      super("Gameover");
    }
  
    preload() {
        this.load.image('background', 'assets/images/background.png');
        this.load.image('button', 'assets/images/buttonGreen.png');
        this.load.audio("click", "assets/click_001.ogg");
    }
  
    create() {
        const backgroundImage = this.add.image(0, 0, 'background').setOrigin(0, 0);
        backgroundImage.setScale(4);
        this.add.text(480, 100, 'Game Over', { fontSize: '64px', fill: 'black' });
    
        const startButton = this.add.image(650, 400, 'button').setInteractive();
        startButton.on('pointerdown', () => {
            score = 0;
            this.sound.play("click");
            this.scene.start('Gameaction');
        });
        this.add.text(555, 385, 'Play again', { fontSize: '32px', fill: 'black' });
    }
  
    update() {
      // Update Gameover logic
    }
  }