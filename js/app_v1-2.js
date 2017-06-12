// var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update }); // Size of stage.
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update });

//===============
// Player
//===============

var player;
var dataPlayer = {
    gravity:500,                            // pwr of gravity
    bouce: 0.1,                             // bounciness
    spdWalk:100,                            // Speed for walking
    spdJump:230,                            // Speed for Jumping
    startX: 32,                             // start position of player
    startY: 600 - 150,                      // start position of player
    active:false,                           // is the player active?
};

//===============
// Stairs
//===============

var stairRoll = false;
var delayMillis = 5000;                     // stairs start moving after delay
var rollingTime;
var platforms;
var steps = [];                             // stair
var dataSteps = {
    spd:1,                                  // spd of steps
    noOfSteps : 30                          // number of steps
    }

//===============
// Games
//===============
var groupButtons,                           // start button
    cursors;                                // Key input


var start = false;                          // is the game already started?

//======= End of Declaration ========

function preload() {
    game.load.spritesheet('button', 'assets/button_sprite_sheet.png', 193, 71);
    game.load.image('sky', 'assets/sky.png');
    game.load.image('ground', 'assets/platform.png');
    game.load.image('star', 'assets/star.png');
    game.load.spritesheet('purpleOnion', 'assets/mini-char_04_full.png', 32, 48);
}

function create() {
    // background
    game.add.sprite(0, 0, 'sky');

    // start button actions --------

    groupButtons = game.add.group();

    var button = game.make.button(game.world.centerX - 95, 400, 'button', actionOnClick, this, 2, 1, 0);

    window.rich = button;

    button.onInputOver.add(over, this);
    button.onInputOut.add(out, this);

    groupButtons.add(button);

    // -----------------------------

    //  We're going to be using physics, so enable the Arcade Physics system

    game.physics.startSystem(Phaser.Physics.ARCADE);

    createBorder();
    createPlatform();

}

function update() {

    cursors = game.input.keyboard.createCursorKeys();

    // if game was started --------

    if (start){

        // if player is active, key control behaviour as follows.

        if (dataPlayer.active){
                var hitPlatform = game.physics.arcade.collide(player, platforms);
                player.body.velocity.x = 0;

            if (cursors.left.isDown)
            {
                //  Move to the left
                player.body.velocity.x = -dataPlayer.spdWalk;

                player.animations.play('left');
            }
            else if (cursors.right.isDown)
            {
                //  Move to the right
                player.body.velocity.x = dataPlayer.spdWalk;

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
                player.body.velocity.y = -dataPlayer.spdJump;
            }
        }

        if (stairRoll){
            rollingTime = setTimeout(function() {
                //move platform after 5 seconds
                movePlatform();
            }, delayMillis);
        }
        checkOutofScreen()

    }
}

function reset(){
    platforms.alpha = 1;
    createPlayer();
    start = true;

}

function createGround(){

    // Here we create the ground.
    var ground = platforms.create(0, game.world.height - 64, 'ground');

    //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
    ground.scale.setTo(2, 2);

    //  This stops it from falling away when you jump on it
    ground.body.immovable = true;

}

function createBorder(){
    var borderThickness = 2;
    // var border =
    var graphics = game.add.graphics(0, 0);
    graphics.beginFill(0xFFFF00, 1);
    graphics.drawRect(0, 0, 800, borderThickness);
    graphics.drawRect(0, 0, borderThickness, game.world.height);
    graphics.drawRect(game.world.width-borderThickness, 0, borderThickness, game.world.height);
     graphics.drawRect(0, game.world.height-borderThickness, game.world.width, borderThickness);
}


function createPlatform(){

    //  The platforms group contains the ground and the multiple stepss we can jump on
    platforms = game.add.group();

    //  We will enable physics for any object that is created in this group
    platforms.enableBody = true;

    //  Now let's create multiple stepss

    for (i=0; i<dataSteps.noOfSteps; i++){ //steps.length
        steps[i] = platforms.create((i*100)+50, 550-(i*50), 'ground');
        steps[i].body.immovable = true;
        console.log("i");

    }

    platforms.alpha=0;

}

function movePlatform(){
    platforms.y+=dataSteps.spd;
    platforms.x-=dataSteps.spd;
}

function createPlayer(){
    player = game.add.sprite(dataPlayer.startX, dataPlayer.startY, 'purpleOnion'); // Starting position of player

    //  We need to enable physics on the player
    game.physics.arcade.enable(player);

    //  Player physics properties. Give the little guy a slight bounce.
    player.body.bounce.y = dataPlayer.bouce;

    player.body.gravity.y = dataPlayer.gravity;

    player.body.collideWorldBounds = false; // if not player's falls

    //  Our two animations, walking left and right.
    player.animations.add('left', [0, 1, 2, 3], 10, true);  // L sprite set
    player.animations.add('right', [6, 7, 8, 9], 10, true); // R sprite set

    dataPlayer.active = true;
}

function removeGroup() {
    game.world.remove(groupButtons);
    groupButtons.destroy();

}

function checkOutofScreen(){
    if (player.body.y>game.world.height){
         console.log(player.body.y);
         endGame();
    }
}

function endGame() {

    // pause platform
    clearTimeout(rollingTime);
    // pause player
    player.animations.stop();
    // retry button appears
    console.log("end")
}

function over() {
    console.log('button over');
}

function out() {
    console.log('button out');
}

function actionOnClick () {
    removeGroup();
    reset();
    console.log('button clicked');

}
