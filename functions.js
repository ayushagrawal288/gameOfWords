// scene type variables

var reg = {};
var spacebar;
var button;
var modalOpenTime;

// level type variables

var playerSpeed = 150;
var jumpTimer = 0;
var shootTime = 0;
var fallTime = 0;
var flagNext;
var nuts;
var text;
var componentText,textGroup;
var textSprite;
var style,style1;
var scoreText;
var flagBox = 0;
var flag2 = 0;
var flagPlayer = 3;
var coins;
var coin;
var isWrongAnswer = false;
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
var wall,wall1,wall2;
var explosion;
var tunnelReverse;
var groupWords,indexWord;
var words = [];
var cloudTween;
var cloudStartX = 1000,hoardingStartX;
var completeTime = 0;
var thisLevel;
var getGame;
var enemy1;
var graphics;
var graphicsSprite;
var graphicsGroup;
var player;
var box1,box2;
var box;
var controls = {};
var shootFireTime = 0;
var score = 0;
var flag = 0;
var soundPowerUp,soundJump,enemyDie;
var soundCoin,soundDie,soundNew;
var base;
var levelData,sceneData;
var platform;
var flagEnemy = {};
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
var flagEnemyDirection = {};
var changeTime = {};
var currentLevel;
var power;
var direction = 'right';
var playerDie = false;
var playerDieTime = 0;
var flagPlayerTime = false;
var dragon;
var playerCollideDragon;
var bgMusic;
var dragonHealth,hoardingDragon,cloudDragon;
var playerText,weaponText,dragonText,noOfWeapons;
var fire,bg = {},d;
var flagHoardingFire,cloudDragonFire,hoardingDragonFire;
var mainDragon,flagShootFire,flagCloudFire;

// creates basic level structure i.e. ground and platforms and manages bgImage and size of game

function createLevelStructure(game,levelData){
	if(levelData.totalWidth % 16 != 0)
		{
			levelData.totalWidth = (levelData.totalWidth / 16 + 1) * 16;
		}
		if(levelData.totalHeight % 16 != 0)
		{
			levelData.totalHeight = (Math.floor(levelData.totalHeight / 16) + 1) * 16;
		}
		game.scale.setGameSize(levelData.viewWidth, levelData.viewHeight);
		thisLevel.world.setBounds(0,0,parseInt(levelData.totalWidth),parseInt(levelData.totalHeight));
		
	indexB = 0;
		bg.width = 0;
		widthLeft = levelData.totalWidth;
		bgImage = game.add.group();
		while(widthLeft > 0 ){
			bg = bgImage.create(bg.width*indexB,0,levelData.id+'bg');
			bg.width = thisLevel.game.height * bg.width / bg.height;
			bg.height = thisLevel.game.height;
			widthLeft -= bg.width;
			indexB++;			
		}

		ground = game.add.group();

		for(var i =0;i<parseInt(levelData.totalWidth) / 16;i++)
		{
			base = createGroupSprite(game, ground, base, 'block', 8 + 16 * i, 8);
			base = createGroupSprite(game, ground, base, 'block', 8 + 16 * i, parseInt(levelData.totalHeight) - 8);
		}
		
		for(var i =0;i<parseInt(levelData.totalHeight) / 16;i++)
		{
			base = createGroupSprite(game, ground, base, 'block', 8, 8 + 16 * i);
			base = createGroupSprite(game, ground, base, 'block',parseInt(levelData.totalWidth) - 8, 8 + 16 * i);
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
				platform = createGroupSprite(game, platforms, platform, 'block',parseInt(levelData.platform[i].startX) + 16 * j,parseInt(levelData.platform[i].startY));		
				platform.anchor.setTo(0.5);
				platform.body.setSize(8,16,4,0);
				platform.flagToching = false;
				platform.time = 0;
			}
		}
};

// create enemy of all 3 groups

function createEnemy(game,levelData){
	enemyOneGroup = game.add.group();
		thisLevel.physics.arcade.enableBody(enemyOneGroup);

	    enemyTwoGroup = game.add.group();
		thisLevel.physics.arcade.enableBody(enemyTwoGroup);

		enemyBirdGroup = game.add.group();
		thisLevel.physics.arcade.enableBody(enemyBirdGroup);

		flagEnemyDirection = {};
		changeTime = {};

		graphics = game.add.graphics(0, 0);

		dragon = game.add.group();
		thisLevel.physics.arcade.enableBody(dragon);

	    for(var i=0;i<levelData.enemy.length;i++)
	    {
	    	var arr = levelData.enemy[i];
	    	if(arr.type == "bird")
	    	{
				var enemy = EnemyBird(game,enemyBirdGroup,enemy,'bird',parseInt(arr.x), parseInt(arr.y),i.toString());
	    	}
	    	else{
	    		if(arr.type == "one")
	    		{
	    			var enemy = enemyOneGroup.create(parseInt(arr.x),parseInt(arr.y),'enemy1');
	    		}
	    		else{
	    			var enemy = enemyTwoGroup.create(parseInt(arr.x),parseInt(arr.y),'enemy2');
	    		}
	    		thisLevel.physics.arcade.enable(enemy);
				enemy.body.collideWorldBounds = true;
				enemy.name = i.toString();
				flagEnemy[i.toString()] = 0;
				enemy.body.velocity.x = parseInt(arr.velocity);
	    	}
	    	flagEnemyDirection[i.toString()] = 0;
	    	changeTime[i.toString()] = 0;
	    }

	    enemyOneGroup.callAll('animations.add', 'animations', 'run', [0,1],5,true);
	    enemyOneGroup.callAll('animations.add', 'animations', 'die', [2]);
	    enemyOneGroup.callAll('play', null, 'run');
	    
	    enemyTwoGroup.callAll('animations.add', 'animations', 'run', [0,1],2,true);
	    enemyTwoGroup.callAll('play', null, 'run');
};

// creates coins

function createCoin(game,level){
	coins = game.add.group();
	    thisLevel.physics.arcade.enableBody(coins);

	    for(i=0;i<levelData.coin.length;i++)
	    {
	    	var coin = coins.create(parseInt(levelData.coin[i].x),parseInt(levelData.coin[i].y),'coin');
		    coin.anchor.setTo(0.5);
		    thisLevel.physics.arcade.enable(coin);
		    coin.body.allowGravity = false;
		    coin.body.collideWorldBounds = true;
	    }
};

// creates player.

function createPlayer(x,y){
	thisLevel.physics.arcade.gravity.y = 1000;
	player = thisLevel.add.sprite(x,y,'player');
		player.anchor.setTo(0.5,0.5);
		player.animations.add('idle',[0,1],1,true);
		player.animations.add('jump',[2],1,true);
		player.animations.add('run',[3,4,5,6,7,8],7,true);
		thisLevel.physics.arcade.enable(player);
		player.body.collideWorldBounds = true;
		player.body.setSize(14,24,5,1);
		playerDie = false;
		player.health = 100;
		playerCollideDragon = false;
		playerX = 0;
		dragonHealth = 100;
	createSounds(getGame);
}

// creates required sounds

function createSounds(game){
	bgMusic = game.add.sound(levelData.id+'Sound',0.7,true);
	soundJump = game.add.sound('jump');
	soundPowerUp = game.add.sound('powerup');
	soundCoin = game.add.sound('soundCoin');
	soundDie = game.add.sound('soundDie');
	soundNew = game.add.sound('soundNew');
	enemyDie = game.add.sound('enemyDie');
	bgMusic.play();
}

// initialise variables required for components.

function initialiseComponentVariables(){
	indexCloud = 0;
		indexMines = 0;
		indexHoarding = 0;
		startCloudCreate = {};
		startMinesCreate = {};
		startHoardingCreate = {};
		flagHoardingStart = {};
		flagCloudStart = {};
		flagMinesStart = {};
		startCloudCreate[indexCloud] = 1;
		startMinesCreate[indexMines] = 1;
		startHoardingCreate[indexHoarding] = 1;
		flagHoardingStart[indexHoarding] = 0;
		flagCloudStart[indexCloud] = 0;
		flagMinesStart[indexMines] = 0;
}

// creates player powers.

function createNuts(game,noOfNuts){
	nuts = game.add.group();
		nuts.enableBody = true;
		nuts.physicsBodyType = Phaser.Physics.ARCADE;
		nuts.createMultiple(noOfNuts,'power');

		nuts.callAll('animations.add', 'animations', 'fire', null,4,true);

		nuts.setAll('anchor.x',0.5);
		nuts.setAll('anchor.y',0.5);

		nuts.setAll('scale.x',0.5);
		nuts.setAll('scale.y',0.5);

		nuts.setAll('outofBoundsKill',true);
		nuts.setAll('checkWorldBounds',true);
}

// creates title bar

function createBar(game){
	bar = game.add.group();
		scoreText = game.add.text(60, 36, 'Score: 0', { fontSize: '16px', fill: '#ffffff' });
		scoreText.fixedToCamera = true;
		scoreText.anchor.setTo(0.5);
		bar.addChild(scoreText);

    	heart = game.add.sprite(135,30,'heart');
    	heart.height = heart.width = 20;
    	heart.fixedToCamera = true;
		heart.anchor.setTo(0.5);
		bar.addChild(heart);

		graphics.lineStyle(2, 0x000000, 1);
    	graphics.drawRoundedRect(150, 27, 100, 8);
		graphics.lineStyle(0);
    	graphics.beginFill(0xff0000);
    	graphics.drawRoundedRect(150, 27, 100, 8);
	    graphics.endFill();
		graphics.anchor.setTo(0.5);		
		bar.addChild(graphics);
		graphics.fixedToCamera = true;

		weapon = game.add.sprite(275,33,'power');
		weapon.height = weapon.width = 20;
		weapon.anchor.setTo(0.5);
		weapon.fixedToCamera = true;
		bar.addChild(weapon);

		weaponText = game.add.text(300, 36, 'X 10', { fontSize: '16px', fill: '#ffffff' });
		weaponText.fixedToCamera = true;
		weaponText.anchor.setTo(0.5);
		noOfWeapons = 10;
		bar.addChild(weaponText);

		// dragonText = game.add.text(thisLevel.game.width - 120, 36, 'Health: 100', { fontSize: '16px', fill: '#ffffff' });
		// dragonText.fixedToCamera = true;
		// dragonText.visible = false;
		// dragonText.anchor.setTo(0.5);

		// bar.addChild(dragonText);
}

// updates player physics

function updatePlayer(){
	if(player.health <= 0){
		player.reset(70,120,100);
		// player.health = 100;

		graphics.graphicsData[1].shape.width = player.health;
	}
	if(controls.up.isDown && (player.body.onFloor() || player.body.touching.down) && thisLevel.time.now > jumpTimer){
			player.animations.play('jump');
			soundJump.play();
			player.body.velocity.y = -400;
			jumpTimer = thisLevel.time.now + 750;
		}
		else if(controls.right.isDown){
			player.animations.play('run');
			player.scale.setTo(1,1);
			player.body.velocity.x += playerSpeed;
			direction = "right";
		}
		else if(controls.left.isDown){
			player.animations.play('run');
			player.scale.setTo(-1,1);
			player.body.velocity.x -= playerSpeed;
			direction = "left";
		}
		else if(controls.down.isDown){
    		shootNut();
    	}
		else {
        	player.animations.play('idle');
    	}

    	if(playerCollideDragon == true && (playerX-20) >= (player.x))
    	{
    		playerCollideDragon = false;
    		console.log(playerX,player.x);
    	}
}

// creates component 

function createComponent(game,level){
	if(indexCloud < cloudData.length)
		{
			if(startCloudCreate[indexCloud] == 1 && flagCloudStart[indexCloud] == 0)
			{
				flagCloudStart[indexCloud] = 1;
				flagCloudStart[indexCloud + 1] = 0;
				console.log("cloud",indexCloud);
				if(cloudData[indexCloud].level == level)
				{
					componentFallingWords(game,indexCloud);				
				}
				else{
					indexCloud++;
					startCloudCreate[indexCloud] = 1;
				}
			}	
		}

		if(indexHoarding < hoardingData.length)
		{
			if(startHoardingCreate[indexHoarding] == 1 && flagHoardingStart[indexHoarding] == 0)
			{
				flagHoardingStart[indexHoarding] = 1;
				flagHoardingStart[indexHoarding + 1] = 0;
				console.log("hoarding",indexHoarding);
				if(hoardingData[indexHoarding].level == level)
				{
					componentHoarding(game,indexHoarding);				
				}
				else{
					indexHoarding++;
					startHoardingCreate[indexHoarding] = 1;
				}
			}	
		}

		if(indexMines < minesData.length)
		{
			if(startMinesCreate[indexMines] == 1 && flagMinesStart[indexMines] == 0)
			{
				flagMinesStart[indexMines] = 1;
				flagMinesStart[indexMines + 1] = 0;
				console.log("Mines",indexMines);
				if(minesData[indexMines].level == level)
				{
					componentMines(game,indexMines);				
				}
				else{
					indexMines++;
					startMinesCreate[indexMines] = 1;
				}
			}	
		}
};

// maintains component physics

function maintainComponents(game){
	thisLevel.physics.arcade.collide(player,dynamiteBoxes);
		thisLevel.physics.arcade.collide(player,handles,handleTween);
		thisLevel.physics.arcade.collide(mineEnemy,ground);
		thisLevel.physics.arcade.collide(player,wall);
		thisLevel.physics.arcade.collide(player,mineEnemy,resetPlayer);
		thisLevel.physics.arcade.overlap(player,groupWords,collectWords);
		thisLevel.physics.arcade.collide(player,box,checkAnswer);
		thisLevel.physics.arcade.collide(dragon,ground);

		if(player.x >= hoardingStartX && flagHoardingFire == true){
			shootFire(hoardingDragon,hoardingDragonFire);
		}


		if(player.x >= cloudStartX && flagPlayer == 0)
		{
			flagPlayer = 1;
			cloudTween.start();
		}

		if(indexWord == words.length)
		{
			cloudTween.stop();
			flagPlayer = 2;
		}
		if(indexWord == words.length && thisLevel.time.now > completeTime)
		{		
			startCloudCreate[getCloudI + 1] = 1;
			flagCloudFire = false;
			cloudDragon.graphicsDragon.destroy();
			dragonTween(cloudDragon);
			// cloudDragon.destroy();
			var componentText = addText(game,questionTextWords.x, thisLevel.world.centerY,'Task Completed',styleText);
			soundPowerUp.play();
			indexWord++;
		}

		if(flagPlayer == 1)
		{
			shootFire(cloudDragon,cloudDragonFire);
			startFallingWords(cloud);
		}

		if(isWrongAnswer == true)
		{
			isWrongAnswer = false;
			var componentText = addText(getGame,Math.floor(sprite.x + sprite.width / 2), Math.floor(sprite.y + sprite.height / 2 + 5),'Wrong Answer -20 Points',style);
			hoardingTaskCompleted();
		}

		if(flagBox == 1)
		{
			flagBox = 0;
			var componentText = addText(getGame,Math.floor(sprite.x + sprite.width / 2), Math.floor(sprite.y + sprite.height / 2 + 5),'Correct Answer +50 Points\nTask Completed',style);
			hoardingTaskCompleted();
		}

		if(flag2 == 1)
		{
			flag2 = 0;
			mineTaskCompleted();
		}
}

// maintains enmey physics

function updateEnemyPhysics(){
	thisLevel.physics.arcade.collide(player,enemyOneGroup,collideEnemyOne);
		thisLevel.physics.arcade.collide(enemyOneGroup,ground,changeDirection);
		thisLevel.physics.arcade.collide(enemyOneGroup,platforms,changeDirection);
		thisLevel.physics.arcade.collide(enemyTwoGroup,ground,changeDirection);
		thisLevel.physics.arcade.collide(enemyTwoGroup,platforms,changeDirection);
		thisLevel.physics.arcade.overlap(player,enemyTwoGroup,resetPlayer);
		thisLevel.physics.arcade.overlap(player,enemyBirdGroup,resetPlayer);
		thisLevel.physics.arcade.overlap(enemyBirdGroup,nuts,killEnemy);
		thisLevel.physics.arcade.overlap(enemyOneGroup,nuts,killEnemy);
		thisLevel.physics.arcade.overlap(enemyTwoGroup,nuts,killEnemy);
		thisLevel.physics.arcade.overlap(dragon,nuts,collideNuts);
		thisLevel.physics.arcade.collide(player,fire,collideFire);
		thisLevel.physics.arcade.collide(player,cloudDragonFire,collideFire);
		thisLevel.physics.arcade.collide(player,hoardingDragonFire,collideFire);
		thisLevel.physics.arcade.collide(coins,platforms,collectCoin);
		thisLevel.physics.arcade.collide(ground,dragon);
		dragon.forEach(checkIfAlive);

		if(player.x >= thisLevel.world.width - 450  && flagShootFire == true){
			shootFire(mainDragon,fire);
		}
}

// manages player being hit by dragon fire

function collideFire(player,fire)
{
	fire.destroy();
	player.damage(15);
	graphics.graphicsData[1].shape.width = player.health;
}

// manages collsiong of player power with dragon

function collideNuts(enemy,nut){
	nut.destroy();
	enemy.damage(15);
	dragonHealth -= 15;
	// tint throws cross origin error when importing dragon image from firebase
	// var tween = getGame.add.tween(enemy).to({
	// 	tint: 0xff0000
	// },500,'Linear',true,0,1,true);
	dragon.setAll('health', dragonHealth);
	enemy.graphicsDragon.graphicsData[1].shape.width = dragonHealth/2;
}

// manages overlap of player with dragon

function collideDragon(player,dragon){
	if(playerCollideDragon == false)
	{
		playerCollideDragon = true;
		playerX = player.x;
		var tween = getGame.add.tween(player).to({
			alpha: 0
		},250,'Linear',true,0,4,true);
		player.damage(30);	
		graphics.graphicsData[1].shape.width = player.health;
	}
}

// update and maintain collision and overlap of player.

function updatePlayerPhysics(){
	thisLevel.physics.arcade.collide(player,ground);
	thisLevel.physics.arcade.collide(player,platforms,tweenPlatform);
	thisLevel.physics.arcade.overlap(player,coins,getCoin);
	thisLevel.physics.arcade.overlap(player,dragon,collideDragon);
	// thisLevel.physics.arcade.overlap(player,mainDragon,collideDragon);
}

// animation when player collides with platform

function tweenPlatform(player,block){
	if(block.body.touching.down == true)
	{
		block.flagToching = true;
		block.time = thisLevel.time.now + 100;
		var blockTween = getGame.add.tween(block).to({
			y: block.y - 8
		},100,'Linear',true,0,0,true);
	}
}

// score animation

function tweenScore(sprite,change){
	var text = getGame.add.text(sprite.x,sprite.y-10,change,{ fontSize: '10px', fill: '#ffffff' });
	var scoreTween = getGame.add.tween(text).to({
		y: text.y - 50,
		alpha: 0
	},1000,'Linear',true);
}

// changes direction of enemy after colliding with ground

function changeDirection(enemy,block){
	if(enemy.body.touching.left == true || enemy.body.touching.right == true)
	{
		if(changeTime[enemy.name] <= thisLevel.time.now)
		{
			flagEnemyDirection[enemy.name] = 0;
		}
		if(flagEnemyDirection[enemy.name] == 0)
		{
			flagEnemyDirection[enemy.name] = 1;
			enemy.body.velocity.x = -1 * (levelData.enemy[parseInt(enemy.name)].velocity);
			levelData.enemy[parseInt(enemy.name)].velocity = -1 * (levelData.enemy[parseInt(enemy.name)].velocity);
			changeTime[enemy.name] = thisLevel.time.now + 100;
		}
	}
	if(block.body.touching.up == true && block.flagToching == true && block.time >= thisLevel.time.now)
	{
		tweenScore(enemy,'+20');
		enemyDie.play();
		enemy.kill();
		score += 20;
	   	scoreText.text = 'Score: ' + score;
	}
}

// collects coins just above a platform

function collectCoin(coin,block){
	if(block.flagToching == true && block.time <= thisLevel.time.now)
	{
		console.log("ho");
		getCoin(block,coin);
	}
}

// fired after player collides with enemy type 1

function collideEnemyOne(player,enemy){
		if(enemy.body.touching.up == true)
		{
			if(flagEnemy[enemy.name] == 0)
			{
				flagEnemy[enemy.name] = 1;
				enemy.animations.play('die',1,false,true);
				enemy.body.velocity.x = 0;
				score += 20;
				tweenScore(enemy,'+20');
   				scoreText.text = 'Score: ' + score;
			}
		}
		else{ 
			flagDie = true;
			resetPlayer(player,enemy);
			enemy.destroy();
		}
};

// create enemy type 3 or bird

function EnemyBird(game,group,sprite,key,x,y,name){
	    sprite = createGroupSprite(game,group,sprite,key,x,y,name);
		birdTween = game.add.tween(sprite).to({
			y: sprite.y + 25
		},2000,'Linear',true,0,50,true);
		return sprite;
};

// // en

// function enemyTweenDie(enemy,enemyTween){
// 		// console.log(enemy,enemyTween);	
// 		enemy.destroy();
// };

// enter tunnnel & changes level to next

function enterTunnel(player,tunnel){
	if(tunnel.body.touching.left == true && flagNext == true)
	{
		flagNext = false;
		soundPowerUp.play();
		bgMusic.stop();
		levelCompleted(tunnel);
		// getGame.state.start(tunnel.next);
	}
};

function levelCompleted(tunnel){
	var m = getGame.add.graphics();
    m.beginFill(0x000000, 0.7);
    m.drawRect(0, 0, thisLevel.world.width, thisLevel.world.height);
    m.endFill();
	a = getGame.add.sprite(thisLevel.game.width / 2,thisLevel.world.centerY,'modalBG');
	a.anchor.setTo(0.5);
	a.width = thisLevel.game.width / 2;
	a.height = thisLevel.game.height / 2;
	a.fixedToCamera = true;
	a.bringToTop();

	var text = getGame.add.text(a.x,a.y-a.height/4, 'Level Completed\n Score = ' + score, {
	    font: '15px Arial',
        fill: "#000000",
        stroke: "#000000",
        align: 'center',
        wordWrap: true,
        wordWrapWidth: a.width - 50
    });
	text.anchor.setTo(0.5);
	text.fixedToCamera = true;
	text.bringToTop();
	var next = getGame.add.button(a.x,a.y+a.height/4,'next',function(snap){
		getGame.state.start(tunnel.next);
	})
	next.anchor.setTo(0.5);
	next.height = next.width = a.width/6;
	next.fixedToCamera = true;
	next.bringToTop();
}

// fired when player collides with an enemy.

function resetPlayer(player,enemy){
	if(playerDieTime <= thisLevel.time.now)
	{
		playerDieTime = thisLevel.time.now + 2000;
		soundDie.play();
		var tween = getGame.add.tween(player).to({
			alpha: 0
		},250,'Linear',true,0,4,true);
		flagEnemyDie = true;
		playerDie = true;
		flagPlayerTime = true;
		player.damage(20);
		graphics.graphicsData[1].shape.width = player.health;
	}
};

// collect coins

function getCoin(player,coin){
	coin.kill();
	soundCoin.play();
	score += 10;
	tweenScore(coin,'+10');
   	scoreText.text = 'Score: ' + score;
};

// shoot power of player

function shootNut(){
	if(thisLevel.time.now > shootTime){
		nut = nuts.getFirstExists(false);
		if(nut){
			nut.reset(player.x,player.y);
			nut.body.allowGravity = false;
			// nut.body.setSize(24,24,4,4);
			// nut.width = nut.height = 32;
			if(direction == "left")
			{
				nut.body.velocity.x = -200;
			}
			else nut.body.velocity.x = 200;
			nut.play('fire');
			shootTime = thisLevel.time.now + 900;
			noOfWeapons--;
			weaponText.text = 'X ' + noOfWeapons;
		}
	}
};

// triggers falling of words from cloud

function startFallingWords(cloud){
	if(thisLevel.time.now > fallTime)
	{
		var fallText = addText(getGame,cloud.x,cloud.y+12,words[indexWord].text,styleText,groupWords);
		thisLevel.physics.arcade.enable(fallText);
		fallText.body.allowGravity = false;
		fallText.name = words[indexWord].category;
		indexWord++;
		var fallTween = getGame.add.tween(fallText).to({
			y: fallText.y + thisLevel.game.height
		},5000,'Linear',true);
		fallTime = thisLevel.time.now + 1500;
		completeTime = thisLevel.time.now + 5000;
	}
};

// collect words falling during the cloud component

function collectWords(player,sprite){
	if(sprite.name == correctCategory)
	{
		score+=10;
		tweenScore(sprite,'+10');
		scoreText.text = 'Score: ' + score;
		sprite.destroy();
	}
	else{
		score-=10;
		tweenScore(sprite,'-10');
		scoreText.text = 'Score: ' + score;
		sprite.destroy();
	}
};

// adds text with a style, and to a group

function addText(game,x,y,text,style,group){
    var textSprite = getGame.add.text(x, y, text, style,group);
    textSprite.anchor.set(0.5);
    return textSprite;
};

// check answer for hoarding task

function checkAnswer(player,box){
	if(box.body.touching.down == true)
	{
		if(flagBox==0)
		{
			if(box.name == getHoardingAnswer){
				score+=50;
				tweenScore(box,'+50');
				scoreText.text = 'Score: ' + score;
				flagBox=1;
			}
			else{
				isWrongAnswer = true;
				componentText = addText(getGame,Math.floor(sprite.x + sprite.width / 2), Math.floor(sprite.y + sprite.height + 29),'Wrong Answer! Try Again',style1,textGroup);
				score-=20;
				tweenScore(box,'-20');
				scoreText.text = 'Score: ' + score;
			}
		}
	}
};

//fired after hoarding task completes

function hoardingTaskCompleted(){
	box.destroy();
	textGroup.destroy();
	questionImage.destroy();
	soundPowerUp.play();
	flagHoardingFire = false;
	startHoardingCreate[getHoardingI + 1] = 1;
	hoardingDragon.graphicsDragon.destroy();
	dragonTween(hoardingDragon);
	// console.log(hoardingDragon);
	// hoardingDragon.destroy();
	// dragonText.visible = false;
};

// fired after mine task is completed, addes explosion animation.

function mineTaskCompleted(){
	explosion = getGame.add.sprite(mineEnemy.x - 50,thisLevel.world.centerY - 65,'explosion');
	explosion.y = thisLevel.world.height - explosion.height;
	explosion.animations.add('explode',null,7);
	explosion.play('explode',7,false,true);
	soundPowerUp.play();
	componentText = addText(getGame,Math.floor(questionbgImage.x), Math.floor(questionbgImage.y + 5),'Correct Answer +50 Points\nTask Completed',styleMines);
	startMinesCreate[getMinesI + 1] = 1;
};

// enables physics on sprite, immovable, collideworldbound and disables gravity

function enableCollisionNotGravity(game,sprite){
	game.physics.arcade.enable(sprite);
	sprite.body.immovable = true;
	sprite.body.collideWorldBounds = true;
	sprite.body.allowGravity = false;
	return sprite;
};

// creates sprite for a particular group with given name and enabling physics

function createGroupSprite(game,group,sprite,key,x,y,name){
	sprite = group.create(x,y,key);
    sprite.anchor.setTo(0.5);
    sprite = enableCollisionNotGravity(game,sprite);
	if(name!=null)
	{
		sprite.name = name;
	}
	return sprite;
};

function killEnemy(enemy1,nut){
	enemyDie.play();
	enemy1.kill();
	nut.destroy();
	score += 20;
	tweenScore(enemy1,'+20');
   	scoreText.text = 'Score: ' + score;
};

// Handles the movement of dynamite boxes handle after player collides.

function handleTween(player,sprite){
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
					tweenScore(sprite,'+50');
					mineEnemy.destroy();
					scoreText.text = 'Score: ' + score;
					questionTextMines.destroy();
					flag2=1;
					handles.destroy();
					dynamiteBoxes.destroy();
					textGroupMines.destroy();
					for(var k=0;k<4;k++)
					{
						flagHandle[optionRepresent[k.toString()]] = 1;
					}
				}
				else{
					mineEnemy.body.velocity.x = -100;
					score-=20;
					tweenScore(sprite,'-20');
					scoreText.text = 'Score: ' + score;
				}
				wall.destroy();
			}		
		}
	}
};

// Check if dragon is alive to know when to stop shooting fire..

function checkIfAlive(enemy){
	if(enemy.health<0)
	{
		if(enemy.name == 'hoarding')
		{
			flagHoardingFire = false;
		}
		else if(enemy.name == 'cloud')
		{
			flagCloudFire = false;
		}
		else{
			flagShootFire = false;
		}
		enemy.graphicsDragon.destroy();
		enemy.destroy();
	}
}

// Moves dragon back after task completes

function dragonTween(enemy){
	var tween = getGame.add.tween(enemy).to({
		x: enemy.x + 200
	},2500,'Linear',true);
	dragonTweenTime = thisLevel.time.now + 1000;
	tween.onComplete.add(function(){
		enemy.kill();
	});
}

// Create dragon fire

function createEnemyFire(fire,key,noOfPowers){
	fire.createMultiple(noOfPowers,key);

		fire.callAll('animations.add', 'animations', 'fire', null,4,true);

		fire.setAll('anchor.x',0.5);
		fire.setAll('anchor.y',0.5);

		fire.setAll('scale.x',0.5);
		fire.setAll('scale.y',0.5);

		fire.setAll('outofBoundsKill',true);
		fire.setAll('checkWorldBounds',true);
		return fire;
}

// shoot dragon fire

function shootFire(d,fire){
		if(thisLevel.time.now > shootFireTime){
			var nut = fire.getFirstExists(false);
			if(nut){
				nut.reset(d.x - d.width/4,d.y - d.height*1/8);
				nut.body.allowGravity = false;
				nut.width = nut.height = 48;
				// nut.anchor.setTo(0.5);
				if(player.x > d.x)
				{
					nut.body.velocity.x = 200;
					d.scale.setTo(-1,1);
					nut.angle = Math.atan(1) * 180 / Math.PI;
				}
				else{
					nut.body.velocity.x = -200;
					d.scale.setTo(1,1);
					nut.angle = 3*Math.atan(1) * 180 / Math.PI;
				}
				// nut.body.setSize(28,28,10,10);
				nut.body.velocity.y = 200;
				nut.play('fire');
				shootFireTime = thisLevel.time.now + 900;
			}
		}
}

// creates dragon for stage end.

function createMainDragon(noOfPower){
	mainDragon = createEnemyDragon(mainDragon,thisLevel.world.width - 150,levelData.id+'Dragon',dragon);
		mainDragon.name = 'mainDragon';
		mainDragon.health = dragonHealth;
		mainDragon.graphicsDragon.graphicsData[1].shape.width = dragonHealth/2;
		fire = getGame.add.group();
		fire.enableBody = true;
		fire.physicsBodyType = Phaser.Physics.ARCADE;

		fire = createEnemyFire(fire,levelData.id+'DragonPower',noOfPower);

		flagShootFire = true;
}

// creates dragon sprite and dragon health bar

function createEnemyDragon(d,x,key,group){
	d = getGame.add.sprite(x,thisLevel.game.height/2,key,null,group);
		thisLevel.physics.arcade.enable(d);
		d.body.allowGravity = false;
		d.body.setSize(200,200,38,18);
		d.anchor.setTo(0.5);
		d.animations.add('ho',null,8,true);
		d.play('ho');

		d.graphicsDragon = getGame.add.graphics(0, 0);
		d.graphicsDragon.lineStyle(2, 0x000000, 1);
    	d.graphicsDragon.drawRoundedRect(d.x - d.width/4,d.y - d.height*3/8, 50, 8);
		d.graphicsDragon.lineStyle(0);
    	d.graphicsDragon.beginFill(0x0000FF);
    	d.graphicsDragon.drawRoundedRect(d.x - d.width/4,d.y - d.height*3/8, 50, 8);
	    d.graphicsDragon.endFill();
		d.bringToTop();
		return d;
}

// Creates Dragon for Cloud and Hoarding components

function createDragon(x,type){
	if(type == 'cloud')
	{
		cloudDragon = createEnemyDragon(cloudDragon,x,levelData.id+'Dragon',dragon);
		cloudDragon.name = type;
		cloudDragon.health = dragonHealth;
		cloudDragon.graphicsDragon.graphicsData[1].shape.width = dragonHealth/2;
	}
	else {
		hoardingDragon = createEnemyDragon(hoardingDragon,x,levelData.id+'Dragon',dragon);
		hoardingDragon.name = type;
		hoardingDragon.health = dragonHealth;
		hoardingDragon.graphicsDragon.graphicsData[1].shape.width = dragonHealth/2;
	}
	getGame.world.bringToTop(dragon);
	// dragonText.visible = true;
}

// Creates Basic structure of Hoarding Component

function componentHoarding(game,i){
	var arr = hoardingData[i];
	hoarding = game.add.image(parseInt(arr.hoardingX),parseInt(arr.hoardingY),arr.hoardingKey);
	hoarding.width = parseInt(arr.hoardingWidth);
	hoarding.height = parseInt(arr.hoardingHeight);
	sprite = {
		x: hoarding.x + 5,
		y: hoarding.y + 7,
		width: hoarding.width * 140 / 150,
		height: hoarding.height * 80 / 150,
	}

	questionImage = game.add.image(hoarding.x + hoarding.width / 2, hoarding.y - hoarding.height/4,'white');
	questionImage.anchor.setTo(0.5);
	questionImage.width = hoarding.width * 7 /4;
	questionImage.height = hoarding.height / 3;

	textGroup = game.add.group();
	style = { font: "11px Arial", fill: "#000000", wordWrap: true, wordWrapWidth: questionImage.width, align: "center", fontWeight: 'bold'};

   	componentText = addText(game, questionImage.x, questionImage.y, arr["question"],style,textGroup);
   	componentText.anchor.setTo(0.5);

    box = game.add.group();
    thisLevel.physics.arcade.enableBody(box);

    colorList = [arr.options.colorA,arr.options.colorB,arr.options.colorC,arr.options.colorD];

    color = game.add.group();
    thisLevel.physics.arcade.enableBody(color);

    for(var j=0;j<2;j++)
    {
    	for(var n=0;n<2;n++)
    	{
    	    box2 = createGroupSprite(game,color,box2,colorList[j*2+n],sprite.x + sprite.width/2*n + sprite.width/4,sprite.y + sprite.height/2*j + sprite.height/4,optionRepresent[(j*2+n).toString()]);
    	    componentText = addText(game,box2.x,box2.y, arr.options[optionRepresent[(j*2+n).toString()]], style, textGroup);
	    	// box2.anchor.setTo(0.5);
		    box2.width = sprite.width / 2;
		    box2.height = sprite.height / 2;
    	}
    }

	hoarding.sendToBack();
	getGame.world.sendToBack(color);
	getGame.world.sendToBack(bgImage);

	// var j=0;
    for(var j=0;j<4;j++)
    {
	    box1 = createGroupSprite(game,box,box1,colorList[j] + 'Rounded',sprite.x + sprite.width/4*j + sprite.width/8,sprite.y + sprite.height + 16,optionRepresent[(j).toString()]);
	    // j++;
	    box1.anchor.setTo(0.5);
	    // box1.body.setSize(14,16,0,0);
	    box1.width = box1.height = 16;
	}

    getHoardingAnswer = arr["answer"];
    getHoardingI = i;

    createDragon(sprite.x + 350,'hoarding');
    hoardingDragonFire = getGame.add.group();
    hoardingDragonFire.enableBody = true;
	hoardingDragonFire.physicsBodyType = Phaser.Physics.ARCADE;
    createEnemyFire(hoardingDragonFire,levelData.id+'DragonPower',100);

    flagHoardingFire = true;

    hoardingStartX = hoarding.x;

    player.bringToTop();

    indexHoarding++;
};

// Creates Basic structure of Mines Component

function componentMines(game,i){
	var arr = minesData[i];
	questionbgImage = game.add.image(parseInt(arr["bgImageX"]), parseInt(arr["bgImageY"]),arr["bgImageKey"]);
	questionbgImage.anchor.setTo(0.5);
	questionbgImage.width = arr["bgImageWidth"];
	questionbgImage.height = arr["bgImageHeight"];
	handles = game.add.group();
    thisLevel.physics.arcade.enableBody(handles);
	flagHandle = {};
	// flagEnemyDie = false;

    for(var j=0;j<4;j++)
    {
	    handle = createGroupSprite(game,handles,handle,arr["handleKey"],questionbgImage.x + parseInt(arr["gap"])*j - 100,thisLevel.game.height - 44,optionRepresent[j.toString()]);
	    handle.body.setSize(24,32.4,0);
	    handle.scale.setTo(0.6);
	    flagHandle[optionRepresent[j.toString()]] = 0;
    }

	dynamiteBoxes = game.add.group();
    thisLevel.physics.arcade.enableBody(dynamiteBoxes);

    textGroupMines = game.add.group();
	styleMines = { font: "14px Arial", fill: "#000000", wordWrap: true, wordWrapWidth: questionbgImage.width, align: "center"};

   	questionTextMines = addText(game, questionbgImage.x, questionbgImage.y +- questionbgImage.height/4, arr["question"],styleMines);

	for(var j=0;j<2;j++)
    {
    	for(var n=0;n<2;n++)
    	{
    	    componentText = addText(game,questionbgImage.x + questionbgImage.width/2*n - questionbgImage.width/4,questionbgImage.y + questionbgImage.height/4*j + questionbgImage.height/8, optionRepresent[(j*2+n).toString()] + ': ' + arr.options[optionRepresent[(j*2+n).toString()]], styleMines, textGroupMines);
    	}
    }

   	for( var j=0;j<4;j++)
   	{
	    dynamiteBox = createGroupSprite(game,dynamiteBoxes,dynamiteBox,arr["dynamiteBoxKey"],questionbgImage.x + parseInt(arr["gap"])*j - 100,thisLevel.game.height - 28,optionRepresent[j.toString()]);
	    textMines = addText(game,dynamiteBox.x + 2, dynamiteBox.y + 4 ,optionRepresent[j.toString()],styleMines,textGroupMines);
	    dynamiteBox.scale.setTo(0.75);
   	}

    mineEnemy = game.add.sprite(questionbgImage.x + parseInt(arr["gap"])*5 -70,thisLevel.world.centerY,arr["mineEnemyKey"]);
    mineEnemy.anchor.setTo(0.5);
    game.physics.arcade.enable(mineEnemy);
    mineEnemy.animations.add('run',null,10,true);
    mineEnemy.play('run');

	getMinesAnswer = arr["answer"];

	wall = game.add.group();
	game.physics.arcade.enableBody(wall);

    wall1 = createGroupSprite(game,wall,wall1,arr["wallKey"],questionbgImage.x + parseInt(arr["gap"])*4 -70,thisLevel.game.height - 70);
    wall1.scale.setTo(0.75,0.85);
    wall2 = createGroupSprite(game,wall,wall2,arr["wallKey"],wall1.x + 2*parseInt(arr["gap"]),wall1.y);
    wall2.scale.setTo(0.75,0.85);

    getMinesI =i;

    player.bringToTop();

    indexMines++;
};

// Creates Basic structure of Cloud Component

function componentFallingWords(game,i){
	var arr = cloudData[i];
	styleText = { font: "14px Arial", fill: "#ffffff", wordWrap: true, wordWrapWidth: thisLevel.game.width - 100, align: "center" };

   	cloud = game.add.image(parseInt(arr.cloudX),parseInt(arr.cloudY),arr.cloudKey);

   	questionTextWords = addText(game,cloud.x + 125,cloud.y - 16, arr.question,styleText);

   	cloudTween = game.add.tween(cloud).to({
		x: cloud.x + 200
	},3000,'Linear',false,0,Number.MAX_VALUE,true);

	groupWords = game.add.group();
	thisLevel.physics.arcade.enableBody(groupWords);

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

	getCloudI = i;

	cloudStartX = cloud.x - 30;

	player.bringToTop();

	createDragon(cloud.x + 400,'cloud');
	cloudDragonFire = getGame.add.group();
	cloudDragonFire.enableBody = true;
	cloudDragonFire.physicsBodyType = Phaser.Physics.ARCADE;
    createEnemyFire(cloudDragonFire,levelData.id+'DragonPower',50);
    flagCloudFire = true;

	indexCloud++;
};

//                                                             Scene Funtions Starts here!!!


//   When user press spacebar to open an object frem scene.
function sceneButtonClicked(player,button){
	if(spacebar.space.isDown && openedModal == false)
	{
	 	getGame.world.bringToTop(getGame.modals[button.name]);
    	getGame.modals[button.name].visible = true;
	 	openModalType = button.name;
	 	openedModal = true;
	 	modalOpenTime = thisLevel.time.now + 1000;
	}
}

// Creates Modal for scene

function createBasicModal(game){
    getGame.modals = {};

    modalOpenTime = thisLevel.time.now;

	for (var i=0;i<sceneData.length;i++)
	{
		var arr = sceneData[i].modalData;
		console.log(i);
		createModal(getGame,arr);
	}

	openedModal = false;

	button = game.add.group();
	thisLevel.physics.arcade.enableBody(button);

	for(i=0;i<sceneData.length;i++)
	{
		var arr = sceneData[i];
		// if(arr.isSpriteSheet == false)
		// {
		// 	var shadow = game.add.sprite(parseInt(arr.buttonX)+5,parseInt(arr.buttonY)+5, arr.buttonKey);
		// 	shadow.anchor.setTo(0.5);
		//     shadow.alpha = 0.6;
		// 	shadow.width = parseInt(arr.buttonWidth);
		// 	shadow.height = parseInt(arr.buttonHeight);
		//     // shadow.tint = 0x000000;
		// 	// shadow.scale.setTo(1.1*shadow.width,1.1*shadow.height);
		// }
	    // console.log("yo");
		var m1 = createGroupSprite(game,button,m1,arr.buttonKey,parseInt(arr.buttonX), parseInt(arr.buttonY),arr.modalData.type);
		m1.anchor.setTo(0.5);
		m1.animations.add('start',null,5,true);
		m1.play('start');
		m1.width = parseInt(arr.buttonWidth);
		m1.height = parseInt(arr.buttonHeight);
	}

	game.world.bringToTop(button);
}

// Updates and Manages Player Physics, Controls and player & object overlap.

function updateScenePhysics(){
	thisLevel.physics.arcade.overlap(player,button,sceneButtonClicked);
	player.body.velocity.x = 0;
	if(controls.up.isDown){
		player.animations.play('jump');
		soundJump.play();
		player.body.velocity.y = -400;
		jumpTimer = thisLevel.time.now + 750;
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
	else {
       	player.animations.play('idle');
    }
    if(spacebar.space.isDown && openedModal == true && modalOpenTime <= thisLevel.time.now)
    {
    	hideModal(openModalType);
    	openedModal = false;
    }
}

// creates individual modal for each obtion by taking input modalData

function createModal(game,options) {
    var type = options.type || ''; // must be unique
    var includeBackground = options.includeBackground; // maybe not optional
    var backgroundColor = options.backgroundColor || "0x000000";
    var backgroundOpacity = options.backgroundOpacity || 0.7;
    var modalCloseOnInput = options.modalCloseOnInput || false;
    var modalBackgroundCallback = options.modalBackgroundCallback || false;
    var vCenter = options.vCenter || true;
    var hCenter = options.hCenter || true;
    var itemsArr = options.itemsArr || [];
    var fixedToCamera = options.fixedToCamera || false;

    var modal;
    var modalGroup = game.add.group();
    if (fixedToCamera === true) {
        modalGroup.fixedToCamera = true;
        modalGroup.cameraOffset.x = 0;
        modalGroup.cameraOffset.y = 0;
    }

    if (includeBackground === true) {
        modal = game.add.graphics(game.width, game.height);
        modal.beginFill(backgroundColor, backgroundOpacity);
        modal.x = 0;
        modal.y = 0;

        modal.drawRect(0, 0, game.width, game.height);

        if (modalCloseOnInput === true) {
            var innerModal = game.add.sprite(0, 0);
            innerModal.inputEnabled = true;
            innerModal.width = game.width;
            innerModal.height = game.height;
            innerModal.type = type;
            innerModal.input.priorityID = 0;
            innerModal.events.onInputDown.add(function (e, pointer) {
                hideModal(e.type);
            });

            modalGroup.add(innerModal);
        } 
        else {
            modalBackgroundCallback = true;
        }
    }

    if (modalBackgroundCallback) {
        var innerModal = game.add.sprite(0, 0);
        innerModal.inputEnabled = true;
        innerModal.width = game.width;
        innerModal.height = game.height;
        innerModal.type = type;
        innerModal.input.priorityID = 0;

        modalGroup.add(innerModal);
    }
            // add the bg
    if (includeBackground) {
        modalGroup.add(modal);
    }

    var centerX = game.width / 2;
    var centerY = game.height / 2;

    var bgKey = options.bgKey;
    var bgHeight = parseInt(options.bgHeight) || null;
    var bgWidth = parseInt(options.bgWidth) || null;
    var bgOffsetX = parseInt(options.bgOffsetX) || 0;
    var bgOffsetY = parseInt(options.bgOffsetY) || 0;
    var itemFontfamily = options.fontFamily || 'Arial';
    var titleText = options.titleText;
    var titleOffsetX = parseInt(options.titleOffsetX) || 0;
    var titleOffsetY = parseInt(options.titleOffsetY) || 0;
    var titleFontSize = parseInt(options.titleFontSize) || 32;
    var descText = options.descriptionText;
    var descOffsetX = parseInt(options.descriptionOffsetX) || 0;
    var descOffsetY = parseInt(options.descriptionOffsetY) || 0;
    var descFontSize = parseInt(options.descriptionFontSize) || 32;
    var itemwordWrapWidth = parseInt(options.wordWrapWidth) || null;

    var modalBG = game.add.image(0, 0, bgKey);
    modalBG.contentType = 'image';
    if(bgHeight != null)
    {
        modalBG.height = bgHeight;
    }
    if(bgWidth != null)
    {
        modalBG.width = bgWidth;
    }
    modalBG.x = (centerX - ((modalBG.width) / 2)) + bgOffsetX;
    modalBG.y = (centerY - ((modalBG.height) / 2)) + bgOffsetY;

    modalBG.offsetX = bgOffsetX;
    modalBG.offsetY = bgOffsetY;

    modalBG.bringToTop();
    modalGroup.add(modalBG);
    modalBG.bringToTop();
    modalGroup.bringToTop(modalBG);

    var modalTitle = game.add.text(0, 0, titleText, {
	    font: titleFontSize + 'px ' + itemFontfamily,
        fill: "#000000",
        stroke: "#000000",
        align: 'center',
        wordWrap: true,
        wordWrapWidth: itemwordWrapWidth
    });
    modalTitle.contentType = 'text';
    modalTitle.update();
    modalTitle.x = ((game.width / 2) - (modalTitle.width / 2)) + titleOffsetX;
    modalTitle.y = ((game.height / 2) - (modalTitle.height / 2)) + titleOffsetY;

    modalTitle.offsetX = titleOffsetX;
    modalTitle.offsetY = titleOffsetY;

    modalTitle.bringToTop();
    modalGroup.add(modalTitle);
    modalTitle.bringToTop();
    modalGroup.bringToTop(modalTitle);                

    var modalDesc = game.add.text(0, 0, descText, {
        font: descFontSize + 'px ' + itemFontfamily,
        fill: "#000000",
        stroke: "#000000",
        align: 'center',
        wordWrap: true,
        wordWrapWidth: itemwordWrapWidth
    });
    modalDesc.contentType = 'text';
    modalDesc.update();
    modalDesc.x = ((game.width / 2) - (modalDesc.width / 2)) + descOffsetX;
    modalDesc.y = ((game.height / 2) - (modalDesc.height / 2)) + descOffsetY;

    modalDesc.offsetX = descOffsetX;
    modalDesc.offsetY = descOffsetY;

    modalDesc.bringToTop();
    modalGroup.add(modalDesc);
    modalDesc.bringToTop();
    modalGroup.bringToTop(modalDesc);

    modalGroup.visible = false;
    game.modals[type] = modalGroup;
}

// hides the modal on space clicked

function hideModal(type) {
    getGame.modals[type].visible = false;
}