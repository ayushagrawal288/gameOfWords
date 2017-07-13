Game.PreLevel1 = function(game){

};

Game.PreLevel1.prototype = {
	create:function(game){
		this.stage.backgroundColor = '#3A0900';
		getGame=game;
		thisLevel = this;

		currentLevel = 'prelevel';

		levelData = levelDimensions.prelevel; 

		createLevelStructure(game,levelData);
		createEnemy(game,'prelevel');
		createPlayer(80,210);
		createCoin(game,'preLevel');
		initialiseComponentVariables();
		createNuts(game,10);
		createBar(game);
		createMainDragon(100)

		style1 = { font: "6px", fill: "#ffffff", align: "center"};

		controls = this.input.keyboard.createCursorKeys();

		tunnel = game.add.sprite(levelData.width - 30,this.game.height - 44,'tunnel');
		enableCollisionNotGravity(game,tunnel);
		// tunnel.body.setSize(80,5,0,3);
		tunnel.next = 'Scene';
		flagNext = true;

		soundNew.play();
	},

	update:function(game){
		updateEnemyPhysics();
		updatePlayerPhysics();
		this.physics.arcade.collide(player,tunnel,enterTunnel);

		game.world.bringToTop(bar);
		
		player.body.velocity.x = 0;

		game.camera.focusOnXY(player.x + 100,player.y);

		createComponent(game,'preLevel');

		maintainComponents(game);

		updatePlayer();
	},

	// render for  debugging

	// render: function(game){
	// 	game.debug.body(hoardingDragon);
	// 	game.debug.body(player);
	// 	box.forEach(function(snap){
	// 		game.debug.body(snap);
	// 	});
	// }
}