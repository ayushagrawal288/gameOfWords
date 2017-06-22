Game.PreLevel1 = function(game){

};

var getGame;
var enemy1;
var map;
var layer;
var graphics;
var graphicsSprite;
var player;
var box1,box2;
var box;
var controls = {};
var playerSpeed = 150;
var jumpTimer = 0;
var shootTime = 0;
var nuts;
var text;
var componentText;
var textSprite;
var style;
var score = 0;
var scoreText;
var flag = 0;
var coins;
var coin;
var isWrongAnswer = false;
var soundPowerUp,soundJump,enemyDie;
var soundCoin,soundDie,soundNew;
var base;
var levelData;
var platform;
var flagEnemy = {};
// var enemyDieTime = 0;
var flagDie = false;
var enemyOne,enemyTwo;
var enemyOneGroup,enemyTwoGroup;
var thisLevel;
var indexCloud = 0;
var startCloudCreate = {};
var flagCloudStart = {};
var indexHoarding = 0;
var startHoardingCreate = {};
var flagHoardingStart = {};
var indexMines = 0;
var startMinesCreate = {};
var flagMinesStart = {};
// var flagEnemyDirection = {};
var currentLevel;

Game.PreLevel1.prototype = {
	create:function(game){
		this.stage.backgroundColor = '#3A0900';
		getGame=game;
		thisLevel = this;
		this.physics.arcade.gravity.y = 1000;

		currentLevel = 'prelevel';

		levelData = levelDimensions.prelevel; 
		createLevelStructure(game,levelData);
		createEnemy(game,'prelevel');
		createPlayer(80,210);
		createCoin(game,'preLevel');
		initialiseComponentVariables();		
		createNuts(game);

		soundJump = game.add.sound('jump');
		soundPowerUp = game.add.sound('powerup');
		soundCoin = game.add.sound('soundCoin');
		soundDie = game.add.sound('soundDie');
		soundNew = game.add.sound('soundNew');
		enemyDie = game.add.sound('enemyDie');

		style1 = { font: "6px", fill: "#ffffff", align: "center"};

		controls = this.input.keyboard.createCursorKeys();

		scoreText = game.add.text(24, 24, 'score: 0', { fontSize: '32px', fill: '#000' });
		scoreText.fixedToCamera = true;

		tunnel = game.add.sprite(levelData.width - 30,192,'tunnel');
		enableCollisionNotGravity(game,tunnel);
		tunnel.body.setSize(80,5,0,3);

		soundNew.play();
	},

	update:function(game){
		updateEnemyPhysics();
		updatePlayerPhysics();
		this.physics.arcade.collide(player,tunnel,enterTunnel);
		
		player.body.velocity.x = 0;

		game.camera.focusOnXY(player.x + 100,player.y);

		createComponent(game,'preLevel');

		maintainComponents(game);

		updatePlayer();
	}
}