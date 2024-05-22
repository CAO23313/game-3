class Mainmenu extends Phaser.Scene {
    constructor() {
        super("Mainmenu");
    }

    preload() {
        // Load assets for Mainmenu
        this.load.image('background', 'assets/images/background.png');
        this.load.image('button', 'assets/images/buttonGreen.png');
        this.load.audio("click", "assets/click_001.ogg");
    }

    create() {
        const backgroundImage = this.add.image(0, 0, 'background').setOrigin(0, 0);
        backgroundImage.setScale(4); // Set scaling factor for both x and y axes
        this.add.text(485, 100, 'Main Menu', { fontSize: '64px', fill: 'black' });

        // Adding a button to start the game
        const startButton = this.add.image(650, 400, 'button').setInteractive();
        startButton.on('pointerdown', () => {
            this.sound.play("click");
            this.scene.start('Gameaction');
        });
        this.add.text(600, 385, 'Start', { fontSize: '32px', fill: 'black' });
    }

    update() {
    }
}