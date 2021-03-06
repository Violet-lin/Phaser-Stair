var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update }); // Size of stage.

function preload() {
    game.load.image('sky', 'assets/sky.png');
    game.load.image('ground', 'assets/platform.png');
    game.load.image('star', 'assets/star.png');
    game.load.spritesheet('purpleOnion', 'assets/dude.png', 32, 48);
}

var player;
var platforms;

function create() {
    //  We're going to be using physics, so enable the Arcade Physics system
    game.physics.startSystem(Phaser.Physics.ARCADE);

    //  A simple background for our game
    // game.add.sprite(0, 0, 'sky');

    //  The platforms group contains the ground and the 2 ledges we can jump on
    platforms = game.add.group();

    //  We will enable physics for any object that is created in this group
    platforms.enableBody = true;

    // Here we create the ground.
    var ground = platforms.create(0, game.world.height - 64, 'ground');

    //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
    ground.scale.setTo(2, 2);

    //  This stops it from falling away when you jump on it
    ground.body.immovable = true;

    //  Now let's create multiple ledges
    var ledge = platforms.create(150, 450, 'ground');

    ledge.body.immovable = true;

    ledge = platforms.create(250, 350, 'ground');

    ledge.body.immovable = true;

    ledge = platforms.create(350, 250, 'ground');

    ledge.body.immovable = true;

    ledge = platforms.create(450, 150, 'ground');

    ledge.body.immovable = true;

    ledge = platforms.create(550, 50, 'ground');

    ledge.body.immovable = true;

    // The player and its settings
    player = game.add.sprite(32, game.world.height - 150, 'purpleOnion'); // Starting position of player

    //  We need to enable physics on the player
    game.physics.arcade.enable(player);

    //  Player physics properties. Give the little guy a slight bounce.
    player.body.bounce.y = 0.5;            // bounciness
    player.body.gravity.y = 500;           // pwr of gravity
    player.body.collideWorldBounds = true; // if not player's falls

    //  Our two animations, walking left and right.
    player.animations.add('left', [0, 1, 2, 3], 10, true);  // L sprite set
    player.animations.add('right', [5, 6, 7, 8], 10, true); // R sprite set
}

var cursors;
function update() {
    var hitPlatform = game.physics.arcade.collide(player, platforms);
    cursors = game.input.keyboard.createCursorKeys();

    // platforms.body.velocity.y=100;

    //  Reset the players velocity (movement)
    player.body.velocity.x = 0;

    if (cursors.left.isDown)
    {
        //  Move to the left
        player.body.velocity.x = -150;

        player.animations.play('left');
    }
    else if (cursors.right.isDown)
    {
        //  Move to the right
        player.body.velocity.x = 150;

        player.animations.play('right');
    }
    else
    {
        //  Stand still
        player.animations.stop();

        player.frame = 4;
    }

    //  Allow the player to jump if they are touching the ground.
    if (cursors.up.isDown && player.body.touching.down && hitPlatform)
    {
        player.body.velocity.y = -350;
    }
}
