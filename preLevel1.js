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

Game.PreLevel1.prototype = {
	create:function(game){
		this.stage.backgroundColor = '#3A0900';
		getGame=game;
		this.physics.arcade.gravity.y = 1000;

		levelData = levelDimensions.prelevel; 
		if(levelData.width % 16 != 0)
		{
			levelData.width = (levelData.width / 16 + 1) * 16;
		}
		if(levelData.height % 16 != 0)
		{
			levelData.height = (Math.floor(levelData.height / 16) + 1) * 16;
		}
		this.world.setBounds(0,0,levelData.width,levelData.height);
		
		ground = game.add.group();

		for(var i =0;i<parseInt(levelData.width) / 16;i++)
		{
			base = this.createGroupSprite(game, ground, base, 'block', 8 + 16 * i, 8);
			base = this.createGroupSprite(game, ground, base, 'block', 8 + 16 * i, parseInt(levelData.height) - 8);
		}
		
		for(var i =0;i<parseInt(levelData.height) / 16;i++)
		{
			base = this.createGroupSprite(game, ground, base, 'block', 8, 8 + 16 * i);
			base = this.createGroupSprite(game, ground, base, 'block',parseInt(levelData.width) - 8, 8 + 16 * i);
		}

		platforms = game.add.group();

		for (var i=0;i<levelData.platform.length;i++)
		{
			if(parseInt(levelData.platform[i].platformLength) % 16 == 0)
			{
				var l = parseInt(levelData.platform[i].platformLength) / 16;
			}
			else var l = Math.floor(parseInt(levelData.platform[i].platformLength / 16)) + 1;

			for(var j=0;j<l;j++)
			{
				platform = this.createGroupSprite(game, platforms, platform, 'block',parseInt(levelData.platform[i].startX) + 8 + 16 * j,parseInt(levelData.platform[i].startY));		
			}
		}

		enemyOneGroup = game.add.group();
		this.physics.arcade.enableBody(enemyOneGroup);

	    enemyTwoGroup = game.add.group();
		this.physics.arcade.enableBody(enemyTwoGroup);

		enemyBirdGroup = game.add.group();
		this.physics.arcade.enableBody(enemyBirdGroup);

	    for(var i=0;i<enemyData.length;i++)
	    {
	    	var arr = enemyData[i];
	    	if(arr.type == "bird")
	    	{
				enemy1 = this.EnemyBird(game,enemyBirdGroup,enemy1,'bird',parseInt(arr.x), parseInt(arr.y),i.toString());
	    	}
	    	else{
	    		if(arr.type == "one")
	    		{
	    			var enemy = enemyOneGroup.create(parseInt(arr.x),parseInt(arr.y),'enemy1');
	    		}
	    		else{
	    			var enemy = enemyTwoGroup.create(parseInt(arr.x),parseInt(arr.y),'enemy2');
	    		}
	    		this.physics.arcade.enable(enemy);
				enemy.body.collideWorldBounds = true;
				enemy.name = i.toString();
				flagEnemy[i.toString()] = 0;
				// if(arr.directionOfMovement == "left" || arr.directionOfMovement == "Left" || arr.directionOfMovement == "LEFT")
				// {
				// 	enemy.body.velocity.x = -20;
				// }
				enemy.body.velocity.x = parseInt(arr.velocity);
	    	}
	    }

	    enemyOneGroup.callAll('animations.add', 'animations', 'run', [0,1],5,true);
	    enemyOneGroup.callAll('animations.add', 'animations', 'die', [2]);
	    enemyOneGroup.callAll('play', null, 'run');
	    
	    enemyTwoGroup.callAll('animations.add', 'animations', 'run', [0,1],2,true);
	    enemyTwoGroup.callAll('play', null, 'run');

		soundJump = game.add.sound('jump');
		soundPowerUp = game.add.sound('powerup');
		soundCoin = game.add.sound('soundCoin');
		soundDie = game.add.sound('soundDie');
		soundNew = game.add.sound('soundNew');
		enemyDie = game.add.sound('enemyDie');
		
		// map = this.add.tilemap('premap',16,16);
		// tilem = map.addTilesetImage('tileset');
		// layer = map.createLayer(0);
		// layer.resizeWorld();

		// map.setCollision([1,2,57,895,27]);
		// map.setTileIndexCallback(895,this.resetPlayer,this);
		// map.setTileIndexCallback(57,this.getCoin,this);

  		// this.componentHoarding(game);

		player = this.add.sprite(Game.Params.baseWidth / 6,Game.Params.baseHeight * 3 / 4,'player');
		player.anchor.setTo(0.5,0.5);
		player.animations.add('idle',[0,1],1,true);
		player.animations.add('jump',[2],1,true);
		player.animations.add('run',[3,4,5,6,7,8],7,true);
		this.physics.arcade.enable(player);
		this.camera.follow(player);
		player.body.collideWorldBounds = true;
		
		coins = game.add.group();
	    this.physics.arcade.enableBody(coins);

	    for(i=0;i<coinData.preLevel.length;i++)
	    {
		    coin = this.createGroupSprite(game,coins,coin,coinData.key,parseInt(coinData.preLevel[i].x),parseInt(coinData.preLevel[i].y));	
	    }

		controls = this.input.keyboard.createCursorKeys();

		nuts = game.add.group();
		nuts.enableBody = true;
		nuts.physicsBodyType = Phaser.Physics.ARCADE;
		nuts.createMultiple(5,'nut');

		nuts.setAll('anchor.x',0.5);
		nuts.setAll('anchor.y',0.5);

		nuts.setAll('scale.x',0.5);
		nuts.setAll('scale.y',0.5);

		nuts.setAll('outofBoundsKill',true);
		nuts.setAll('checkWorldBounds',true);

		scoreText = game.add.text(24, 24, 'score: 0', { fontSize: '32px', fill: '#000' });
		scoreText.fixedToCamera = true;

		tunnel = game.add.sprite(560,192,'tunnel');
		this.enableCollisionNotGravity(game,tunnel);
		tunnel.body.setSize(80,5,0,3);

		soundNew.play();
	},

	update:function(){
		this.physics.arcade.collide(player,ground);
		this.physics.arcade.collide(player,platforms);
		this.physics.arcade.collide(player,box,this.checkAnswer);
		this.physics.arcade.collide(player,enemyBirdGroup,this.resetPlayer);
		this.physics.arcade.overlap(player,coins,this.getCoin);
		this.physics.arcade.overlap(enemyBirdGroup,nuts,this.killEnemy);
		this.physics.arcade.collide(player,tunnel,this.enterTunnel);
		this.physics.arcade.collide(player,enemyOneGroup,this.collideEnemyOne);
		this.physics.arcade.collide(enemyOneGroup,ground);
		this.physics.arcade.collide(enemyOneGroup,platforms);
		this.physics.arcade.collide(enemyTwoGroup,ground);
		this.physics.arcade.collide(enemyTwoGroup,platforms);
		this.physics.arcade.collide(player,enemyTwoGroup,this.resetPlayer);
		player.body.velocity.x = 0;

		if(flagDie == true)
		{
			this.resetPlayer();
		}

		if(isWrongAnswer == true)
		{
			var style1 = { font: "6px", fill: "#ffffff", align: "center", backgroundColor: "#ffff00" };
			componentText = this.addText(getGame,Math.floor(sprite.x + sprite.width / 2), Math.floor(sprite.y + sprite.height + 29),'Wrong Answer! Try Again',style1);
		}

		if(flag==1)
		{
			this.taskCompleted();
		}

		if(controls.up.isDown && (player.body.onFloor() || player.body.touching.down) && this.time.now > jumpTimer){
			player.animations.play('jump');
			soundJump.play();
			player.body.velocity.y = -400;
			jumpTimer = this.time.now + 750;
		}
		else if(controls.right.isDown){
			player.animations.play('run');
			player.scale.setTo(1,1);
			player.body.velocity.x += playerSpeed;
		}
		else if(controls.left.isDown){
			player.animations.play('run');
			player.scale.setTo(-1,1);
			player.body.velocity.x -= playerSpeed;
		}
		else if(controls.down.isDown){
    		this.shootNut();
    	}
		else {
        	player.animations.play('idle');
    	}
	},

	EnemyBird: function(game,group,sprite,key,x,y,name){
	    sprite = this.createGroupSprite(game,group,sprite,key,x,y,name);
		birdTween = game.add.tween(sprite).to({
			y: sprite.y + 25
		},2000,'Linear',true,0,50,true);
		return sprite;
	},

	resetPlayer: function(){
		flagDie = false;
		soundDie.play();
		player.reset(100,180);
	},

	collideEnemyOne: function(player,enemy){
		if(enemy.body.touching.up == true)
		{
			if(flagEnemy[enemy.name] == 0)
			{
				flagEnemy[enemy.name] = 1;
				enemy.animations.play('die',1,false,true);
				enemy.body.velocity.x = 0;
			}
		}
		else{ 
			flagDie = true;
			enemy.destroy();
		}
	},

	enemyTweenDie: function(enemy,enemyTween){
		console.log(enemy,enemyTween);	
		enemy.destroy();
	},

	enterTunnel: function(player,tunnel){
		if(tunnel.body.touching.left == true)
		{
			soundPowerUp.play();
			getGame.state.start('Scene');
		}
	},












	getCoin: function(player,coin){
		coin.kill();
		soundCoin.play();
		score += 10;
    	scoreText.text = 'Score: ' + score;
	},



	checkOverlap: function(spriteA,spriteB){
		var BoundsA = spriteA.getBounds();
		var BoundsB = spriteB.getBounds();

		return Phaser.Rectangle.intersects(BoundsA,BoundsB);
	},


	shootNut: function(){
		if(this.time.now > shootTime){
			nut = nuts.getFirstExists(false);
			if(nut){
				nut.reset(player.x,player.y);
				nut.body.velocity.y = -400;
				shootTime = this.time.now + 900;
			}
		}
	},

	addText: function(game,x,y,text,style){
	    var textSprite = getGame.add.text(x, y, text, style,textGroup);
	    textSprite.anchor.set(0.5);
	    return textSprite;
	},

	checkAnswer: function(a,b){
		if(flag==0)
		{
			if(b.name == 'A'){
				console.log('Correct Answer +50 Points');
				score+=50;
				scoreText.text = 'Score: ' + score;
				flag=1;
			}
			else{
				console.log('Wrong Answer -20 Points');
				isWrongAnswer = true;
				score-=20;
				scoreText.text = 'Score: ' + score;
			}
		}
	},

	taskCompleted: function(){
		box.destroy();
		// sprite.destroy();
		textGroup.destroy();
		textGroup = getGame.add.group();
		componentText = this.addText(getGame,Math.floor(sprite.x + sprite.width / 2), Math.floor(sprite.y + sprite.height / 2 + 5),'Correct Answer +50 Points\nTask Completed',style);		
		// map.setCollision([1,2,27,57,895]);
	},

	enableCollisionNotGravity: function(game,sprite){
		game.physics.arcade.enable(sprite);
		sprite.body.immovable = true;
		sprite.body.collideWorldBounds = true;
		sprite.body.allowGravity = false;
		return sprite;
	},

	createGroupSprite: function(game,group,sprite,key,x,y,name){
		sprite = group.create(x,y,key);
	    sprite.anchor.setTo(0.5);
	    sprite = this.enableCollisionNotGravity(game,sprite);
		if(name!=null)
		{
			sprite.name = name;
		}
		return sprite;
	},

	killEnemy: function(enemy1,nut){
		enemy1.kill();
		enemyDie.play();
		score += 20;
    	scoreText.text = 'Score: ' + score;
	},

	componentHoarding: function(game){
		sprite = game.add.sprite(380, 60, 'pic');
    	sprite.width = 120;
    	sprite.height = 100;

		textGroup = game.add.group();
		style = { font: "14px Arial", fill: "#000000", wordWrap: true, wordWrapWidth: sprite.width, align: "center" };

    	componentText = this.addText(game, Math.floor(sprite.x + sprite.width / 2), Math.floor(sprite.y + sprite.height / 2 + 5), "Question:\n4 options",style);
	
	    box = game.add.group();
	    this.physics.arcade.enableBody(box);

	    box1,componentText = this.createGroupSprite(game,box,box1,'box',sprite.x + 12,sprite.y + sprite.height + 8,'A',true,'A');
	    box1,componentText = this.createGroupSprite(game,box,box1,'box',sprite.x + 44,sprite.y + sprite.height + 8,'B',true,'B');
	    box1,componentText = this.createGroupSprite(game,box,box1,'box',sprite.x + 76,sprite.y + sprite.height + 8,'C',true,'C');
	    box1,componentText = this.createGroupSprite(game,box,box1,'box',sprite.x + 108,sprite.y + sprite.height + 8,'D',true,'D'); 
	}
}