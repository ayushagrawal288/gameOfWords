Game.Level1 = function(game){

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
var fallTime = 0;
var nuts;
var text;
var componentText,textGroup;
var textSprite;
var style,style1;
// var score = 0;
var scoreText;
var flag = 0;
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
// var soundPowerUp,soundJump;
var explosion;
var taskCompleted = false;
var tunnelReverse;
var index = 0;
var startCreate = [0,0,0,0,0];
var flagStart = [0,0,0,0,0];
var groupWords,indexWord;
var words = [];
var cloudTween;
var startX = 1000;

Game.Level1.prototype = {
	create:function(game){
		game.scale.setGameSize(Game.Params.baseWidth,Game.Params.baseHeight);
		this.stage.backgroundColor = "#3A0900";
		getGame=game;
		this.physics.arcade.gravity.y = 1000;
		
		// soundJump = game.add.sound('jump');
		// soundPowerUp = game.add.sound('powerup');

		map = this.add.tilemap('map',16,16);
		map.addTilesetImage('tileset');
		layer = map.createLayer(0);
		layer.resizeWorld();

		map.setCollision([1,2,57]);

		style1 = { font: "6px", fill: "#ffffff", align: "center"};

		player = this.add.sprite(80,210,'player');
		player.anchor.setTo(0.5,0.5);
		player.animations.add('idle',[0,1],1,true);
		player.animations.add('jump',[2],1,true);
		player.animations.add('run',[3,4,5,6,7,8],7,true);
		this.physics.arcade.enable(player);
		player.body.collideWorldBounds = true;

		game.renderer.renderSession.roundPixels = true
		
		tunnelReverse = game.add.sprite(0,192,'tunnelReverse');
		this.physics.arcade.enable(tunnelReverse);
		tunnelReverse.body.allowGravity = false;
		tunnelReverse.body.immovable = true;


		coins = game.add.group();
	    this.physics.arcade.enableBody(coins);

	    coin = this.createGroupSprite(game,coins,coin,'coin',200,165);
	    coin = this.createGroupSprite(game,coins,coin,'coin',280,165);
	    coin = this.createGroupSprite(game,coins,coin,'coin',510,165);
	    coin = this.createGroupSprite(game,coins,coin,'coin',560,165);

		controls = this.input.keyboard.createCursorKeys();

		index = 0;

		startCreate[index] = 1;

		// enemy1 = this.EnemyBird(0,game,enemy1,Game.Params.baseWidth / 2 -50, Game.Params.baseHeight / 2);	

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

		scoreText = game.add.text(24, 24, 'Score:' + score, { fontSize: '32px', fill: '#000' });
		scoreText.fixedToCamera = true;

		soundNew.play();
	},

	update:function(game){
		this.physics.arcade.collide(player,layer);
		this.physics.arcade.collide(player,box,this.checkAnswer);
		// this.physics.arcade.collide(player,enemy1,this.resetPlayer);
		this.physics.arcade.overlap(player,coins,this.getCoin);
		// this.physics.arcade.overlap(enemy1,nuts,this.killEnemy);
		this.physics.arcade.collide(player,dynamiteBoxes);
		this.physics.arcade.collide(player,handles,this.handleTween);
		this.physics.arcade.collide(mineEnemy,layer);
		this.physics.arcade.collide(player,wall);
		this.physics.arcade.collide(player,mineEnemy,this.reset);
		this.physics.arcade.overlap(player,groupWords,this.collectWords);
		this.physics.arcade.collide(player,tunnelReverse);

		player.body.velocity.x = 0;

		game.camera.focusOnXY(player.x + 100,player.y);			

		if(index < data.length)
		{
			if(startCreate[index] == 1 && flagStart[index] == 0)
			{
				flagStart[index] = 1;
				// console.log(index);
				this.createComponent(game,index);
			}	
		}

		if(player.x >= startX && flagPlayer == 0)
		{
			flagPlayer = 1;
			cloudTween.start();
		}

		if(indexWord == words.length)
		{
			cloudTween.stop();
			flagPlayer = 2;
			startCreate[getI + 1] = 1;
			var componentText = this.addText(game,questionTextWords.x, this.world.centerY,'Task Completed',styleText);
			soundPowerUp.play();
			indexWord++;
		}

		if(flagPlayer == 1)
		{
			this.startFallingWords(cloud);
		}

		if(isWrongAnswer == true)
		{
			isWrongAnswer = false;
			componentText = this.addText(getGame,Math.floor(sprite.x + sprite.width / 2), Math.floor(sprite.y + sprite.height + 29),'Wrong Answer! Try Again',style1,textGroup);
		}

		if(flag == 1)
		{
			flag = 0;
			this.hoardingTaskCompleted();
		}

		if(flag2 == 1)
		{
			flag2 = 0;
			this.mineTaskCompleted();
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

	resetPlayer: function(){
		soundDie.play();
		player.reset(100,180);
	},

	reset: function(){
		soundDie.play();
		player.reset(100,180);
		mineEnemy.destroy();
	},

	getCoin: function(player,coin){
		coin.kill();
		soundCoin.play();
		score += 10;
    	scoreText.text = 'Score: ' + score;
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

	createComponent: function(game,i){
		if(data[i]["type"]=="Hoarding")
		{
			this.componentHoarding(game,i);
		}
		else if(data[i]["type"]=="Mines")
		{
			this.componentMines(game,i);
		}
		else if(data[i].type == 'FallingWords')
		{
			this.componentFallingWords(game,i);
		}
		if(index == 0)
		{
			tunnelReverse.bringToTop();
		}
		index++;
	},

	startFallingWords: function(cloud){
		if(this.time.now > fallTime)
		{
			var fallText = this.addText(getGame,cloud.x,cloud.y+12,words[indexWord].text,styleText,groupWords);
			this.physics.arcade.enable(fallText);
			fallText.body.allowGravity = false;
			fallText.name = words[indexWord].category;
			indexWord++;
			var fallTween = getGame.add.tween(fallText).to({
				y: fallText.y + 200
			},5000,'Linear',true);
			fallTime = this.time.now + 1500;
		}
	},

	collectWords: function(player,sprite){
		if(sprite.name == correctCategory)
		{
			score+=10;
			scoreText.text = 'Score: ' + score;
			sprite.destroy();
		}
		else{
			score-=10;
			scoreText.text = 'Score: ' + score;
			sprite.destroy();
		}
	},

	addText: function(game,x,y,text,style,group){
	    var textSprite = getGame.add.text(x, y, text, style,group);
	    textSprite.anchor.set(0.5);
	    return textSprite;
	},

	checkAnswer: function(player,box){
		if(box.body.touching.down == true)
		{
			if(flag==0)
			{
				if(box.name == getAnswer){
					score+=50;
					scoreText.text = 'Score: ' + score;
					flag=1;
				}
				else{
					isWrongAnswer = true;
					score-=20;
					scoreText.text = 'Score: ' + score;
				}
			}
		}
	},

	hoardingTaskCompleted: function(){
		box.destroy();
		textGroup.destroy();
		soundPowerUp.play();
		componentText = this.addText(getGame,Math.floor(sprite.x + sprite.width / 2), Math.floor(sprite.y + sprite.height / 2 + 5),'Correct Answer +50 Points\nTask Completed',style);		
		map.setCollision([1,2,27,57]);
		for(var j=0;j<data[getI]["noOfOptions"];j++)
		{
			map.putTileWorldXY(27,sprite.x + 12 + data[getI]["gap"]*j,sprite.y + sprite.height + 8,16,16);
		}
		startCreate[getI + 1] = 1;

	},

	mineTaskCompleted: function(){
		explosion = getGame.add.sprite(mineEnemy.x - 50,this.world.centerY - 65,'explosion');
		explosion.animations.add('explode',null,7);
		explosion.play('explode');
		// enemyDie.play();
		flag3 = 1;
		soundPowerUp.play();
		componentText = this.addText(getGame,Math.floor(questionbgImage.x), Math.floor(questionbgImage.y + 5),'Correct Answer +50 Points\nTask Completed',styleMines);
		startCreate[getI + 1] = 1;
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

	EnemyBird: function(index,game,sprite,x,y){
		sprite = game.add.sprite(x,y,'bird');
	    sprite.anchor.setTo(0.5);
	    sprite.name = index.toString();
		this.enableCollisionNotGravity(game,sprite);
		birdTween = game.add.tween(sprite).to({
			y: sprite.y + 25
		},2000,'Linear',true,0,50,true);
		return sprite;
	},

	killEnemy: function(enemy1,nut){
		enemyDie.play();
		enemy1.kill();
		score += 20;
    	scoreText.text = 'Score: ' + score;
	},

	componentHoarding: function(game,i){
		sprite = game.add.sprite(parseInt(data[i]["bgImageX"]), parseInt(data[i]["bgImageY"]), data[i]["bgImageKey"]);
    	sprite.width = data[i]["bgImageWidth"];
    	sprite.height = data[i]["bgImageHeight"];
		hoarding = game.add.image(380,100,data[i].hoardingKey);
		hoarding.width = 100;
		hoarding.height = 150;

		textGroup = game.add.group();
		style = { font: "11px Arial", fill: "#000000", wordWrap: true, wordWrapWidth: sprite.width, align: "center"};

    	componentText = this.addText(game, Math.floor(sprite.x + sprite.width / 2), Math.floor(sprite.y + sprite.height / 2 + 5), data[i]["question"] + "\n" + data[i]["options"],style,textGroup);
	
	    box = game.add.group();
	    this.physics.arcade.enableBody(box);

	    for(var j=0;j<data[i]["noOfOptions"];j++)
	    {
		    box1 = this.createGroupSprite(game,box,box1,data[i]["boxKey"],sprite.x + 12 + data[i]["gap"]*j,sprite.y + sprite.height + 8,optionRepresent[j.toString()]);
		    componentText = this.addText(game,sprite.x + 14 + data[i]["gap"]*j,sprite.y + sprite.height + 8 - 12, optionRepresent[j.toString()], style, textGroup);
		   	box1.body.setSize(8,16.4,0);
	    }

	    getAnswer = data[i]["answer"];
	    getI = i;

	    player.bringToTop();
	},

	handleTween: function(player,sprite){
		if(sprite.body.touching.up == true)
		{
			if(flagHandle[sprite.name] == 0)
			{
				var tween = getGame.add.tween(sprite).to({
					y: sprite.y + 15
				},1000,'Linear',true);
				flagHandle[sprite.name] = 1;
				if(flag2==0)
				{
					if(sprite.name == getAnswer){
						score+=50;
						mineEnemy.destroy();
						scoreText.text = 'Score: ' + score;
						questionTextMines.destroy();
						flag2=1;
						for(var k=0;k<4;k++)
						{
							flagHandle[optionRepresent[k.toString()]] = 1;
						}
					}
					else{
						mineEnemy.body.velocity.x = -100;
						isWrongAnswer = true;
						score-=20;
						scoreText.text = 'Score: ' + score;
					}
					// handles.destroy();
					// dynamiteBoxes.destroy();
					// textGroupMines.destroy();
					wall.destroy();
				}		
			}
		}
	},

	componentMines: function(game,i){
		
		questionbgImage = game.add.image(parseInt(data[i]["bgImageX"]), parseInt(data[i]["bgImageY"]) - 25,data[i]["bgImageKey"]);
		questionbgImage.anchor.setTo(0.5);
		questionbgImage.width = data[i]["bgImageWidth"];
		questionbgImage.height = data[i]["bgImageHeight"];
		handles = game.add.group();
	    this.physics.arcade.enableBody(handles);

	    for(var j=0;j<data[i]["noOfOptions"];j++)
	    {
		    handle = this.createGroupSprite(game,handles,handle,data[i]["handleKey"],parseInt(data[i]["handleX"]) + parseInt(data[i]["gap"])*j,parseInt(data[i]["handleY"]),optionRepresent[j.toString()]);
		    handle.body.setSize(24,32.4,0);
		    handle.scale.setTo(0.6);
	    }

		dynamiteBoxes = game.add.group();
	    this.physics.arcade.enableBody(dynamiteBoxes);

	    textGroupMines = game.add.group();
		styleMines = { font: "14px Arial", fill: "#000000", wordWrap: true, wordWrapWidth: questionbgImage.width, align: "center"};

    	questionTextMines = this.addText(game, Math.floor(questionbgImage.x), Math.floor(questionbgImage.y + 5), data[i]["question"] + "\n" + data[i]["options"],styleMines);

    	for( var j=0;j<data[i]["noOfOptions"];j++)
    	{
		    dynamiteBox = this.createGroupSprite(game,dynamiteBoxes,dynamiteBox,data[i]["dynamiteBoxKey"],parseInt(data[i]["handleX"]) + parseInt(data[i]["gap"])*j,parseInt(data[i]["handleY"]) + 16,optionRepresent[j.toString()]);
		    textMines = this.addText(game,dynamiteBox.x + 2, dynamiteBox.y + 4 ,optionRepresent[j.toString()],styleMines,textGroupMines);
		    dynamiteBox.scale.setTo(0.75);
    	}

	    mineEnemy = game.add.sprite(parseInt(data[i]["wallX"]) + 1*parseInt(data[i]["wallGap"]),this.world.centerY,data[i]["mineEnemyKey"]);
	    mineEnemy.anchor.setTo(0.5);
	    game.physics.arcade.enable(mineEnemy);
		mineEnemy.animations.add('run',null,7,true);
		mineEnemy.animations.play('run');

		getAnswer = data[i]["answer"];

		wall = game.add.group();
		game.physics.arcade.enableBody(wall);

	    wall1 = this.createGroupSprite(game,wall,wall1,data[i]["wallKey"],parseInt(data[i]["wallX"]),parseInt(data[i]["wallY"]));
	    wall1.scale.setTo(0.75,0.85);
	    wall1 = this.createGroupSprite(game,wall,wall1,data[i]["wallKey"],parseInt(data[i]["wallX"]) + 2*parseInt(data[i]["wallGap"]),parseInt(data[i]["wallY"]));
	    wall1.scale.setTo(0.75,0.85);

	    getI =i;

	    player.bringToTop();
	},

	componentFallingWords: function(game,i){
		styleText = { font: "14px Arial", fill: "#ffffff", wordWrap: true, wordWrapWidth: this.game.width - 100, align: "center" };

    	questionTextWords = this.addText(game,parseInt(data[i].questionX),parseInt(data[i].questionY), data[i].question,styleText);

    	cloud = game.add.image(parseInt(data[i].cloudX),parseInt(data[i].cloudY),data[i].cloudKey);

    	cloudTween = game.add.tween(cloud).to({
			x: cloud.x + 200
		},3000,'Linear',false,0,Number.MAX_VALUE,true);

		groupWords = game.add.group();
		this.physics.arcade.enableBody(groupWords);

		words = data[i].wordsToFall;

		indexWord = 0;

		flagPlayer = 0;

		correctCategory = data[i].correctCategory;

		// wordCategories = data[i].wordsToFallCategories;

		getI = i;

		startX = parseInt(data[i].componentStartX);

		player.bringToTop();
	}
}