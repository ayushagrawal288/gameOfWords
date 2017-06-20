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
// var soundPowerUp,soundJump;
var explosion;
var taskCompleted = false;
var tunnelReverse;
var indexCloud = 0;
var startCloudCreate = {};
var flagCloudStart = {};
var indexHoarding = 0;
var startHoardingCreate = {};
var flagHoardingStart = {};
var indexMines = 0;
var startMinesCreate = {};
var flagMinesStart = {};
var groupWords,indexWord;
var words = [];
var cloudTween;
var startX = 1000;
var completeTime = 0;

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

		startCloudCreate[indexCloud] = 1;
		startMinesCreate[indexMines] = 1;
		startHoardingCreate[indexHoarding] = 1;
		flagHoardingStart[indexHoarding] = 0;
		flagCloudStart[indexCloud] = 0;
		flagMinesStart[indexMines] = 0;

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

		if(indexCloud < cloudData.length)
		{
			if(startCloudCreate[indexCloud] == 1 && flagCloudStart[indexCloud] == 0)
			{
				flagCloudStart[indexCloud] = 1;
				flagCloudStart[indexCloud + 1] = 0;
				// console.log(index);
				this.componentFallingWords(game,indexCloud);
				console.log("cloud",indexCloud);
			}	
		}

		if(indexHoarding < hoardingData.length)
		{
			if(startHoardingCreate[indexHoarding] == 1 && flagHoardingStart[indexHoarding] == 0)
			{
				flagHoardingStart[indexHoarding] = 1;
				flagHoardingStart[indexHoarding + 1] = 0;
				console.log(indexHoarding,hoardingData,startHoardingCreate,flagHoardingStart);
				// console.log(index);

				this.componentHoarding(game,indexHoarding);
				console.log("hoarding",indexHoarding);
			}	
		}

		if(indexMines < minesData.length)
		{
			if(startMinesCreate[indexMines] == 1 && flagMinesStart[indexMines] == 0)
			{
				flagMinesStart[indexMines] = 1;
				flagMinesStart[indexMines + 1] = 0;
				// console.log(index);
				this.componentMines(game,indexMines);
				console.log("Mines",indexMines);
			}	
		}

		if(player.x >= startX && flagPlayer == 0)
		{
			flagPlayer = 1;
			console.log(player.x,flagPlayer);
			cloudTween.start();
		}

		if(indexWord == words.length)
		{
			cloudTween.stop();
			flagPlayer = 2;
		}
		if(indexWord == words.length && this.time.now > completeTime)
		{		
			startCloudCreate[getI + 1] = 1;
			var componentText = this.addText(game,questionTextWords.x, this.world.centerY,'Task Completed',styleText);
			soundPowerUp.play();
			indexWord++;
		}

		if(flagPlayer == 1)
		{
			// console.log("yo");
			this.startFallingWords(cloud);
		}

		if(isWrongAnswer == true)
		{
			isWrongAnswer = false;
			componentText = this.addText(getGame,Math.floor(sprite.x + sprite.width / 2), Math.floor(sprite.y + sprite.height + 29),'Wrong Answer! Try Again',style1,textGroup);
		}

		if(flagBox == 1)
		{
			flagBox = 0;
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
			completeTime = this.time.now + 5000;
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
			if(flagBox==0)
			{
				if(box.name == getHoardingAnswer){
					score+=50;
					scoreText.text = 'Score: ' + score;
					flagBox=1;
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
		startHoardingCreate[getI + 1] = 1;

	},

	mineTaskCompleted: function(){
		explosion = getGame.add.sprite(mineEnemy.x - 50,this.world.centerY - 65,'explosion');
		explosion.animations.add('explode',null,7);
		explosion.play('explode',7,false,true);
		// enemyDie.play();
		flag3 = 1;
		soundPowerUp.play();
		componentText = this.addText(getGame,Math.floor(questionbgImage.x), Math.floor(questionbgImage.y + 5),'Correct Answer +50 Points\nTask Completed',styleMines);
		startMinesCreate[getI + 1] = 1;
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
					if(sprite.name == getMinesAnswer){
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

	componentHoarding: function(game,i){
		var arr = hoardingData[i];
		sprite = game.add.sprite(parseInt(arr["bgImageX"]), parseInt(arr["bgImageY"]), arr["bgImageKey"]);
    	sprite.width = arr["bgImageWidth"];
    	sprite.height = arr["bgImageHeight"];
		// hoarding = game.add.image(380,100,arr.hoardingKey);
		// hoarding.width = 100;
		// hoarding.height = 150;

		textGroup = game.add.group();
		style = { font: "11px Arial", fill: "#000000", wordWrap: true, wordWrapWidth: sprite.width, align: "center"};

    	componentText = this.addText(game, Math.floor(sprite.x + sprite.width / 2), Math.floor(sprite.y + sprite.height / 2 + 5), arr["question"] + "\n" + arr["options"],style,textGroup);
	
	    box = game.add.group();
	    this.physics.arcade.enableBody(box);

	    for(var j=0;j<arr["noOfOptions"];j++)
	    {
		    box1 = this.createGroupSprite(game,box,box1,arr["boxKey"],sprite.x + 12 + arr["gap"]*j,sprite.y + sprite.height + 8,optionRepresent[j.toString()]);
		    componentText = this.addText(game,sprite.x + 14 + arr["gap"]*j,sprite.y + sprite.height + 8 - 12, optionRepresent[j.toString()], style, textGroup);
		   	box1.body.setSize(8,16.4,0);
	    }

	    getHoardingAnswer = arr["answer"];
	    getI = i;

	    player.bringToTop();

	    indexHoarding++;
	},

	componentMines: function(game,i){
		var arr = minesData[i];
		questionbgImage = game.add.image(parseInt(arr["bgImageX"]), parseInt(arr["bgImageY"]) - 25,arr["bgImageKey"]);
		questionbgImage.anchor.setTo(0.5);
		questionbgImage.width = arr["bgImageWidth"];
		questionbgImage.height = arr["bgImageHeight"];
		handles = game.add.group();
	    this.physics.arcade.enableBody(handles);

	    for(var j=0;j<arr["noOfOptions"];j++)
	    {
		    handle = this.createGroupSprite(game,handles,handle,arr["handleKey"],parseInt(arr["handleX"]) + parseInt(arr["gap"])*j,parseInt(arr["handleY"]),optionRepresent[j.toString()]);
		    handle.body.setSize(24,32.4,0);
		    handle.scale.setTo(0.6);
	    }

		dynamiteBoxes = game.add.group();
	    this.physics.arcade.enableBody(dynamiteBoxes);

	    textGroupMines = game.add.group();
		styleMines = { font: "14px Arial", fill: "#000000", wordWrap: true, wordWrapWidth: questionbgImage.width, align: "center"};

    	questionTextMines = this.addText(game, Math.floor(questionbgImage.x), Math.floor(questionbgImage.y + 5), arr["question"] + "\n" + arr["options"],styleMines);

    	for( var j=0;j<arr["noOfOptions"];j++)
    	{
		    dynamiteBox = this.createGroupSprite(game,dynamiteBoxes,dynamiteBox,arr["dynamiteBoxKey"],parseInt(arr["handleX"]) + parseInt(arr["gap"])*j,parseInt(arr["handleY"]) + 16,optionRepresent[j.toString()]);
		    textMines = this.addText(game,dynamiteBox.x + 2, dynamiteBox.y + 4 ,optionRepresent[j.toString()],styleMines,textGroupMines);
		    dynamiteBox.scale.setTo(0.75);
    	}

	    mineEnemy = game.add.sprite(parseInt(arr["wallX"]) + 1*parseInt(arr["wallGap"]),this.world.centerY,arr["mineEnemyKey"]);
	    mineEnemy.anchor.setTo(0.5);
	    game.physics.arcade.enable(mineEnemy);
		// mineEnemy.animations.add('run',[0,1,2],7,true);
		// mineEnemy.animations.play('run');

		getMinesAnswer = arr["answer"];

		wall = game.add.group();
		game.physics.arcade.enableBody(wall);

	    wall1 = this.createGroupSprite(game,wall,wall1,arr["wallKey"],parseInt(arr["wallX"]),parseInt(arr["wallY"]));
	    wall1.scale.setTo(0.75,0.85);
	    wall1 = this.createGroupSprite(game,wall,wall1,arr["wallKey"],parseInt(arr["wallX"]) + 2*parseInt(arr["wallGap"]),parseInt(arr["wallY"]));
	    wall1.scale.setTo(0.75,0.85);

	    getI =i;

	    player.bringToTop();

	    indexMines++;
	},

	componentFallingWords: function(game,i){
		var arr = cloudData[i];
		styleText = { font: "14px Arial", fill: "#ffffff", wordWrap: true, wordWrapWidth: this.game.width - 100, align: "center" };

    	questionTextWords = this.addText(game,parseInt(arr.questionX),parseInt(arr.questionY), arr.question,styleText);

    	cloud = game.add.image(parseInt(arr.cloudX),parseInt(arr.cloudY),arr.cloudKey);

    	cloudTween = game.add.tween(cloud).to({
			x: cloud.x + 200
		},3000,'Linear',false,0,Number.MAX_VALUE,true);

		groupWords = game.add.group();
		this.physics.arcade.enableBody(groupWords);

		// console.log(wordsToFall);

		correctCategory = arr.correctCategory;
		words = [];

		var totalWordsToFall = arr.totalWordsToFall;
		var correctWordsToFall = arr.correctWordsToFall;

		for(var j=0;j<wordsToFall.length;j++)
		{
			var arr1 = wordsToFall[j];
			if(arr1.category == correctCategory)
			{
				correctWordsToFall--;
			}
			totalWordsToFall--;
			words.push(arr1);
		}

		indexWord = 0;

		flagPlayer = 0;

		getI = i;

		startX = parseInt(arr.componentStartX);
		console.log(startX,arr.componentStartX);

		player.bringToTop();

		indexCloud++;
	}
}