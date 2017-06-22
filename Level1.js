Game.Level1 = function(game){

};

var playerSpeed = 150;
var jumpTimer = 0;
var shootTime = 0;
var fallTime = 0;
var nuts;
var text;
var componentText,textGroup;
var textSprite;
var style,style1;
var scoreText;
var flagBox = 0;
var flag2 = 0,flag3 = 0;
var flagPlayer = 3;
var coins;
var coin;
var isWrongAnswer = false,isWrongAnswer2 = false;
var dynamiteBox,dynamiteBoxes;
var handles,handle;
var flagHandle = {
	A: 0,
	B: 0,
	C: 0,
	D: 0
};
var optionRepresent = {
	0: "A",
	1: "B",
	2: "C",
	3: "D"
};
var mineEnemy;
var wall,wall1;
var explosion;
var tunnelReverse;
var groupWords,indexWord;
var words = [];
var cloudTween;
var startX = 1000;
var completeTime = 0;
var thisLevel;

Game.Level1.prototype = {
	create:function(game){
		game.scale.setGameSize(Game.Params.baseWidth,Game.Params.baseHeight);
		this.stage.backgroundColor = "#3A0900";
		getGame=game;
		thisLevel = this;
		console.log(this,game,thisLevel,game);
		this.physics.arcade.gravity.y = 1000;

		currentLevel = 'level';

		levelData = levelDimensions.level; 

		createLevelStructure(game,levelData);
		createEnemy(game,currentLevel);
		createPlayer(80,210);
		createCoin(game,currentLevel);
		initialiseComponentVariables();		
		createNuts(game);

		var image = this.add.button(1900,200, 'next',function(){
			soundPowerUp.play();
			game.state.start('Level2');
		});
		image.width = image.height = 32;

		style1 = { font: "6px", fill: "#ffffff", align: "center"};

		game.renderer.renderSession.roundPixels = true
		
		tunnelReverse = game.add.sprite(0,192,'tunnelReverse');
		this.physics.arcade.enable(tunnelReverse);
		tunnelReverse.body.allowGravity = false;
		tunnelReverse.body.immovable = true;

		controls = this.input.keyboard.createCursorKeys();

		scoreText = game.add.text(24, 24, 'Score:' + score, { fontSize: '32px', fill: '#000' });
		scoreText.fixedToCamera = true;

		soundNew.play();
	},

	update:function(game){
		updateEnemyPhysics();
		updatePlayerPhysics();
		this.physics.arcade.collide(player,tunnelReverse);

		player.body.velocity.x = 0;

		game.camera.focusOnXY(player.x + 100,player.y);

		// if(indexCloud == 0 || indexMines == 0 || indexHoarding == 0)
		// {
			tunnelReverse.bringToTop();
		// }

		createComponent(game,'Level');

		maintainComponents(game);

		updatePlayer();
	},
}