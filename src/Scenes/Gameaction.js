class Gameaction extends Phaser.Scene {
    constructor() {
      super("Gameaction");
      this.vfx = {};  // Initialize the vfx object
    }
    init() {
      this.physics.world.gravity.y = 500;
      this.PARTICLE_VELOCITY = 500;
    }
    preload() {
      this.load.setPath("./assets/");
      this.load.image('background', 'images/background.png');
      this.load.atlas("platformer_characters", "images/tilemap-characters-packed.png", "images/tilemap-characters-packed.json");
      this.load.image('tiles1', 'tilesets/tilemap_packed.png');
      this.load.image('tiles2', 'images/box.png');
      this.load.tilemapTiledJSON('map-tmj', 'tilemaps/level1.json');
      this.load.image('p1', 'dirt_01.png');
      this.load.image('p2', 'smoke_10.png');
      this.load.audio("box_sound", "confirmation_001.ogg");
      this.load.audio("walk_sound", "footstep00.ogg");
    }
  
    create() {
      const backgroundImage = this.add.image(0, 0, 'background').setOrigin(0, 0);
      this.physics.world.setBounds(0, 0, 2160, 900);
      backgroundImage.setScale(4, 1);
  
      const map = this.make.tilemap({ key: 'map-tmj' });
      const tileset1 = map.addTilesetImage('game_3', 'tiles1');
      const platforms = map.createStaticLayer('platform', tileset1, 0, 240);
      const water = map.createStaticLayer('water', tileset1, 0, 240);
      const building = map.createStaticLayer('building', tileset1, 0, 240);
  
      platforms.setCollisionByExclusion(-1, true);
      water.setCollisionByExclusion(-1, true);
  
      this.player = this.physics.add.sprite(50, 400, 'platformer_characters', "tile_0006.png");
      this.player.setBounce(0.1);
      this.player.setCollideWorldBounds(true);
      this.physics.add.collider(this.player, platforms);
  
      this.boxes = this.physics.add.group();
  
      const boxObjects = map.getObjectLayer('Objects').objects;
      boxObjects.forEach(boxObject => {
        const box = this.add.sprite(boxObject.x, boxObject.y + 230, 'tiles2');
        this.physics.add.existing(box);
        box.body.setImmovable(true);
        box.body.moves = false;
        this.boxes.add(box);
      });
  
      let scoreText = this.add.text(16, 16, 'Box: 0 / 13', { fontSize: '32px', fill: "black" }).setScrollFactor(0);
      const playerCollideBox = (player, box) => {
        box.destroy();
        score += 1;
        console.log(score);
        scoreText.setText('Box: ' + score + ' / 13');
        if(score + 1) {
          this.sound.play("box_sound");
        }
        if (score >= 13) {
          this.scene.start('Gameover');
        }
      };
  
      this.physics.add.collider(this.player, this.boxes, playerCollideBox, null, this);
  
      this.anims.create({
        key: 'walk',
        frames: this.anims.generateFrameNames('platformer_characters', {
          prefix: "tile_",
          start: 6,
          end: 7,
          suffix: ".png",
          zeroPad: 4
        }),
        frameRate: 15,
        repeat: -1
      });
  
      this.anims.create({
        key: 'idle',
        defaultTextureKey: "platformer_characters",
        frames: [
          { frame: "tile_0006.png" }
        ],
        repeat: -1
      });
  
      this.anims.create({
        key: 'jump',
        defaultTextureKey: "platformer_characters",
        frames: [
          { frame: "tile_0007.png" }
        ],
      });
  
      this.cursors = this.input.keyboard.createCursorKeys();
  
      const playerHit = (player, water) => {
        player.setVelocity(0, 0);
        player.setX(50);
        player.setY(400);
        player.play('idle', true);
        player.setAlpha(0);
        this.tweens.add({
          targets: player,
          alpha: 1,
          duration: 100,
          ease: 'Linear',
          repeat: 5,
        });
      };
  
      this.physics.add.collider(this.player, water, playerHit, null, this);
  
      this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
      this.cameras.main.startFollow(this.player, true, 0.25, 0.25);
      this.cameras.main.setDeadzone(50, 50);
      this.cameras.main.setZoom(1);
  
      var particles = this.add.particles("p1");
      this.emitter = particles.createEmitter({
        speed: 0,
        scale: {start: 0.03, end: 0.1},
        frequency: 100,
        lifespan: 50
      });
      var on_jump = this.add.particles("p2");
      this.jump_emitter = on_jump.createEmitter({
        speed: 0,
        scale: {start: 0.03, end: 0.1},
        frequency: 100,
        lifespan: 50
      });
  
      this.emitter.stop();
      this.jump_emitter.stop();
    }
  
    update() {
      if (this.cursors.left.isDown) {
        this.emitter.start();
        this.player.setVelocityX(-200);
        this.emitter.startFollow(this.player, this.player.displayWidth-20, this.player.displayHeight-15, false);
        if (this.player.body.onFloor()) {
          this.player.play('walk', true);
        }
        if (this.player.body.blocked.down) {
          this.emitter.start();
        } else {
          this.emitter.stop();
        }
      } else if (this.cursors.right.isDown) {
        this.emitter.start();
        this.player.setVelocityX(200);
        this.emitter.startFollow(this.player, this.player.displayWidth-30, this.player.displayHeight-15, false);
  
        if (this.player.body.onFloor()) {
          this.player.play('walk', true);
        }
        if (this.player.body.blocked.down) {
          this.emitter.start();
        } else {
          this.emitter.stop();
        }
      } else {
        this.player.setVelocityX(0);
        if (this.player.body.onFloor()) {
          this.emitter.stop();
          this.player.play('idle', true);
        }
      }
  
      if ((this.cursors.space.isDown || this.cursors.up.isDown) && this.player.body.onFloor()) {
        this.jump_emitter.start();
        this.player.setVelocityY(-350);
        this.jump_emitter.startFollow(this.player, this.player.displayWidth-30, this.player.displayHeight-15, false);
        this.player.play('jump', true);
      }
  
      if (!this.player.body.onFloor()) {
        this.jump_emitter.start();
      } else {
        this.jump_emitter.stop();
      }
  
      if (this.player.body.velocity.x < 0) {
        this.player.setFlipX(false);
      } else if (this.player.body.velocity.x > 0) {
        this.player.setFlipX(true);
      }
    }
  }
  