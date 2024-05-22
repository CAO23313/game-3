const config = {
    type: Phaser.CANVAS,
    parent: 'game',
    width: 1300,
    height: 600,
    scale: {
      autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: [Mainmenu, Gameaction, Gameover],
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { y:0 },
        debug: false,
      },
    }
  };
  
  const game = new Phaser.Game(config);
  
  let score = 0;