Game.Level1 = function(game){

};

Game.Level1.prototype = {
	create:function(game){
		game.scale.setGameSize(Game.Params.baseWidth,Game.Params.baseHeight);
		this.stage.backgroundColor = "#3A0900";
		getGame=game;
		thisLevel = this;

		currentLevel = 'level1';

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
		
		tunnelReverse = game.add.sprite(0,this.world.height - 48,'tunnelReverse');
		enableCollisionNotGravity(game,tunnelReverse);

		tunnel = game.add.sprite(this.world.width - 30,this.world.height - 48,'tunnel');
		enableCollisionNotGravity(game,tunnel);
		tunnel.next = 'Scene2';
		flagNext = true;

		controls = this.input.keyboard.createCursorKeys();

		soundNew.play();
	},

	update:function(game){
		updateEnemyPhysics();
		updatePlayerPhysics();
		this.physics.arcade.collide(player,tunnelReverse);
		this.physics.arcade.collide(player,tunnel,enterTunnel);

		player.body.velocity.x = 0;

		game.camera.focusOnXY(player.x + 100,player.y);

		tunnelReverse.bringToTop();

		createComponent(game,'Level');

		maintainComponents(game);

		updatePlayer();
	},
}