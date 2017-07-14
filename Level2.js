Game.Level2 = function(game){

};

Game.Level2.prototype = {
	create:function(game){
		game.scale.setGameSize(Game.Params.baseWidth,Game.Params.baseHeight);
		this.stage.backgroundColor = "#3A0900";
		getGame=game;
		thisLevel = this;

		currentLevel = 'level2';

		levelData = levelDimensions[currentLevel];

		createLevelStructure(game,levelData);
		createEnemy(game,levelData);
		createPlayer(80,210);
		createCoin(game,levelData);
		initialiseComponentVariables();		
		createNuts(game,10);
		createBar(game);
		createMainDragon(100)

		style1 = { font: "6px", fill: "#ffffff", align: "center"};

		game.renderer.renderSession.roundPixels = true

		controls = this.input.keyboard.createCursorKeys();

		soundNew.play();
	},

	update:function(game){
		updateEnemyPhysics();
		updatePlayerPhysics();

		player.body.velocity.x = 0;

		game.camera.focusOnXY(player.x + 100,player.y);

		createComponent(game,'Level2');

		maintainComponents(game);

		updatePlayer();
	},
}