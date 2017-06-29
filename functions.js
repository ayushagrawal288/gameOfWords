function createLevelStructure(game,levelData){
	if(levelData.width % 16 != 0)
		{
			levelData.width = (levelData.width / 16 + 1) * 16;
		}
		if(levelData.height % 16 != 0)
		{
			levelData.height = (Math.floor(levelData.height / 16) + 1) * 16;
		}
		thisLevel.world.setBounds(0,0,levelData.width,levelData.height);
		
		ground = game.add.group();

		for(var i =0;i<parseInt(levelData.width) / 16;i++)
		{
			base = createGroupSprite(game, ground, base, 'block', 8 + 16 * i, 8);
			base = createGroupSprite(game, ground, base, 'block', 8 + 16 * i, parseInt(levelData.height) - 8);
		}
		
		for(var i =0;i<parseInt(levelData.height) / 16;i++)
		{
			base = createGroupSprite(game, ground, base, 'block', 8, 8 + 16 * i);
			base = createGroupSprite(game, ground, base, 'block',parseInt(levelData.width) - 8, 8 + 16 * i);
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
				platform = createGroupSprite(game, platforms, platform, 'block',parseInt(levelData.platform[i].startX) + 8 + 16 * j,parseInt(levelData.platform[i].startY));		
				platform.body.setSize(8,16.4,0);
			}
		}
};

function createEnemy(game,level){
	enemyOneGroup = game.add.group();
		thisLevel.physics.arcade.enableBody(enemyOneGroup);

	    enemyTwoGroup = game.add.group();
		thisLevel.physics.arcade.enableBody(enemyTwoGroup);

		enemyBirdGroup = game.add.group();
		thisLevel.physics.arcade.enableBody(enemyBirdGroup);

		flagEnemyDirection = {};
		changeTime = {};

		dragon = game.add.group();
		thisLevel.physics.arcade.enableBody(dragon);

	    for(var i=0;i<enemyData[level].length;i++)
	    {
	    	var arr = enemyData[level][i];
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

function createCoin(game,level){
	coins = game.add.group();
	    thisLevel.physics.arcade.enableBody(coins);

	    for(i=0;i<coinData[level].length;i++)
	    {
		    coin = createGroupSprite(game,coins,coin,'coin',parseInt(coinData[level][i].x),parseInt(coinData[level][i].y));	
	    }
};

function createPlayer(x,y){
	player = thisLevel.add.sprite(x,y,'player');
		player.anchor.setTo(0.5,0.5);
		player.animations.add('idle',[0,1],1,true);
		player.animations.add('jump',[2],1,true);
		player.animations.add('run',[3,4,5,6,7,8],7,true);
		thisLevel.physics.arcade.enable(player);
		player.body.collideWorldBounds = true;
		playerDie = false;
		player.health = 100;
		playerCollideDragon = false;
		playerX = 0;
	createSounds(getGame);
}

function createSounds(game){
	soundJump = game.add.sound('jump');
	soundPowerUp = game.add.sound('powerup');
	soundCoin = game.add.sound('soundCoin');
	soundDie = game.add.sound('soundDie');
	soundNew = game.add.sound('soundNew');
	enemyDie = game.add.sound('enemyDie');
}

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

function createNuts(game){
	nuts = game.add.group();
		nuts.enableBody = true;
		nuts.physicsBodyType = Phaser.Physics.ARCADE;
		nuts.createMultiple(5,'power');

		nuts.callAll('animations.add', 'animations', 'fire', null,4,true);

		nuts.setAll('anchor.x',0.5);
		nuts.setAll('anchor.y',0.5);

		nuts.setAll('scale.x',0.5);
		nuts.setAll('scale.y',0.5);

		nuts.setAll('outofBoundsKill',true);
		nuts.setAll('checkWorldBounds',true);
		// nuts.setAll('allowGravity',false);
}

function updatePlayer(){
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

function maintainComponents(game){
	thisLevel.physics.arcade.collide(player,dynamiteBoxes);
		thisLevel.physics.arcade.collide(player,handles,handleTween);
		thisLevel.physics.arcade.collide(mineEnemy,ground);
		thisLevel.physics.arcade.collide(player,wall);
		thisLevel.physics.arcade.collide(player,mineEnemy,resetPlayer);
		thisLevel.physics.arcade.overlap(player,groupWords,collectWords);
				thisLevel.physics.arcade.collide(player,box,checkAnswer);
		thisLevel.physics.arcade.collide(dragon,ground);


	if(player.x >= startX && flagPlayer == 0)
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
			cloudDragon.destroy();
			var componentText = addText(game,questionTextWords.x, thisLevel.world.centerY,'Task Completed',styleText);
			soundPowerUp.play();
			indexWord++;
		}

		if(flagPlayer == 1)
		{
			startFallingWords(cloud);
		}

		if(isWrongAnswer == true)
		{
			isWrongAnswer = false;
			// componentText = addText(getGame,Math.floor(sprite.x + sprite.width / 2), Math.floor(sprite.y + sprite.height + 29),'Wrong Answer! Try Again',style1,textGroup);
		}

		if(flagBox == 1)
		{
			flagBox = 0;
			hoardingTaskCompleted();
		}

		if(flag2 == 1)
		{
			flag2 = 0;
			mineTaskCompleted();
		}
}

function updateEnemyPhysics(){
	thisLevel.physics.arcade.collide(player,enemyOneGroup,collideEnemyOne);
		thisLevel.physics.arcade.collide(enemyOneGroup,ground,changeDirection);
		thisLevel.physics.arcade.collide(enemyOneGroup,platforms,changeDirection);
		thisLevel.physics.arcade.collide(enemyTwoGroup,ground,changeDirection);
		thisLevel.physics.arcade.collide(enemyTwoGroup,platforms,changeDirection);
		thisLevel.physics.arcade.collide(player,enemyTwoGroup,resetPlayer);
		thisLevel.physics.arcade.collide(player,enemyBirdGroup,resetPlayer);
		thisLevel.physics.arcade.overlap(enemyBirdGroup,nuts,killEnemy);
		thisLevel.physics.arcade.overlap(enemyOneGroup,nuts,killEnemy);
		thisLevel.physics.arcade.overlap(enemyTwoGroup,nuts,killEnemy);
		thisLevel.physics.arcade.collide(dragon,nuts,collideNuts);
}

function collideNuts(dragon,nut){
	nut.destroy();
	dragon.damage(15);
	console.log(dragon.health);
}

function collideDragon(player,dragon){
	if(playerCollideDragon == false)
	{
		playerCollideDragon = true;
		playerX = player.x;
		console.log(player.health);
		if(player.health <= 15)
		{
			player.reset(70,120);
			player.health = 100;
		}
		else player.damage(30);	
	}
}

function updatePlayerPhysics(){
	if(playerDie == false)
	{
		if(flagPlayerTime == false)
		{
			thisLevel.physics.arcade.collide(player,ground);
			thisLevel.physics.arcade.collide(player,platforms,tweenPlatform);
			thisLevel.physics.arcade.overlap(player,coins,getCoin);
			thisLevel.physics.arcade.collide(player,dragon,collideDragon);
		}
	}
	else{
		playerDieTime = thisLevel.time.now + 1500;
		player.body.collideWorldBounds = false;
		playerDie = false;
	}
	if(thisLevel.time.now >= playerDieTime && flagPlayerTime == true)
	{
		flagPlayerTime = false;
		player.reset(70,200);
		playerDie = false;
		// player.body.collideWorldBounds = true;
		console.log("player reset");
	}
}

function tweenPlatform(player,block){
	if(block.body.touching.down == true)
	{
		var blockTween = getGame.add.tween(block).to({
			y: block.y - 8
		},100,'Linear',true,0,0,true);
	}
}

function changeDirection(enemy,block){
	if(enemy.body.touching.left == true || enemy.body.touching.right == true)
	{
		if(changeTime[enemy.name] <= thisLevel.time.now)
		{
			flagEnemyDirection[enemy.name] = 0;
			// console.log("change",enemy.name);
		}
		if(flagEnemyDirection[enemy.name] == 0)
		{
			flagEnemyDirection[enemy.name] = 1;
			// console.log("yo! Collided and velocity inversed");
			enemy.body.velocity.x = -1 * (enemyData[currentLevel][parseInt(enemy.name)].velocity);
			enemyData[currentLevel][parseInt(enemy.name)].velocity = -1 * (enemyData[currentLevel][parseInt(enemy.name)].velocity);
			changeTime[enemy.name] = thisLevel.time.now + 100;
			// if(enemy.body.velocity.x == (enemyData[currentLevel][parseInt(enemy.name)].velocity && thisLevel.time.now >= changeTime))
			// {
			// 	flagEnemyDirection[enemy.name] = 0;
			// 	console.log("yo");
			// }
			// console.log(enemyData[currentLevel][parseInt(enemy.name)].velocity,enemyData[currentLevel][parseInt(enemy.name)],enemyData[currentLevel]);
		}
	}
}

function collideEnemyOne(player,enemy){
		if(enemy.body.touching.up == true)
		{
			if(flagEnemy[enemy.name] == 0)
			{
				flagEnemy[enemy.name] = 1;
				enemy.animations.play('die',1,false,true);
				enemy.body.velocity.x = 0;
				score += 20;
   				scoreText.text = 'Score: ' + score;
			}
		}
		else{ 
			flagDie = true;
			resetPlayer(player,enemy);
			enemy.destroy();
		}
};

function EnemyBird(game,group,sprite,key,x,y,name){
	    sprite = createGroupSprite(game,group,sprite,key,x,y,name);
		birdTween = game.add.tween(sprite).to({
			y: sprite.y + 25
		},2000,'Linear',true,0,50,true);
		return sprite;
};

function enemyTweenDie(enemy,enemyTween){
		console.log(enemy,enemyTween);	
		enemy.destroy();
};

function enterTunnel(player,tunnel){
	if(tunnel.body.touching.left == true)
	{
		soundPowerUp.play();
		getGame.state.start(tunnel.next);
	}
};

function resetPlayer(player,enemy){
	soundDie.play();
	enemy.destroy();
	flagEnemyDie = true;
	player.body.velocity.y = -350;
	playerDie = true;
	flagPlayerTime = true;
	player.damage(20);
};

function getCoin(player,coin){
	coin.kill();
	soundCoin.play();
	score += 10;
   	scoreText.text = 'Score: ' + score;
};

function shootNut(){
	if(thisLevel.time.now > shootTime){
		nut = nuts.getFirstExists(false);
		if(nut){
			nut.reset(player.x,player.y);
			// console.log(nut,nuts);
			nut.body.allowGravity = false;
			nut.body.setSize(24,24,4,4);
			if(direction == "left")
			{
				nut.body.velocity.x = -200;
			}
			else nut.body.velocity.x = 200;
			nut.play('fire');
			shootTime = thisLevel.time.now + 900;
		}
	}
};


function startFallingWords(cloud){
	if(thisLevel.time.now > fallTime)
	{
		var fallText = addText(getGame,cloud.x,cloud.y+12,words[indexWord].text,styleText,groupWords);
		thisLevel.physics.arcade.enable(fallText);
		fallText.body.allowGravity = false;
		fallText.name = words[indexWord].category;
		indexWord++;
		var fallTween = getGame.add.tween(fallText).to({
			y: fallText.y + 200
		},5000,'Linear',true);
		fallTime = thisLevel.time.now + 1500;
		completeTime = thisLevel.time.now + 5000;
	}
};

function collectWords(player,sprite){
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
};

function addText(game,x,y,text,style,group){
    var textSprite = getGame.add.text(x, y, text, style,group);
    textSprite.anchor.set(0.5);
    return textSprite;
};

function checkAnswer(player,box){
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
				componentText = addText(getGame,Math.floor(sprite.x + sprite.width / 2), Math.floor(sprite.y + sprite.height + 29),'Wrong Answer! Try Again',style1,textGroup);
				// box.play('boxCollided');
				score-=20;
				scoreText.text = 'Score: ' + score;
			}
		}
	}
};

function hoardingTaskCompleted(){
	box.destroy();
	textGroup.destroy();
	questionImage.destroy();
	soundPowerUp.play();
	componentText = addText(getGame,Math.floor(sprite.x + sprite.width / 2), Math.floor(sprite.y + sprite.height / 2 + 5),'Correct Answer +50 Points\nTask Completed',style);
	startHoardingCreate[getHoardingI + 1] = 1;
	hoardingDragon.destroy();
};

function mineTaskCompleted(){
	explosion = getGame.add.sprite(mineEnemy.x - 50,thisLevel.world.centerY - 65,'explosion');
	explosion.animations.add('explode',null,7);
	explosion.play('explode',7,false,true);
	flag3 = 1;
	soundPowerUp.play();
	componentText = addText(getGame,Math.floor(questionbgImage.x), Math.floor(questionbgImage.y + 5),'Correct Answer +50 Points\nTask Completed',styleMines);
	startMinesCreate[getMinesI + 1] = 1;
};

function enableCollisionNotGravity(game,sprite){
	game.physics.arcade.enable(sprite);
	sprite.body.immovable = true;
	sprite.body.collideWorldBounds = true;
	sprite.body.allowGravity = false;
	return sprite;
};

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
   	scoreText.text = 'Score: ' + score;
};

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
					mineEnemy.destroy();
					scoreText.text = 'Score: ' + score;
					questionTextMines.destroy();
					flag2=1;
					handles.destroy();
					dynamiteBoxes.destroy();
					textGroupMines.destroy();
					// flagEnemyDie = false;
					for(var k=0;k<4;k++)
					{
						flagHandle[optionRepresent[k.toString()]] = 1;
					}
				}
				else{
					// if(flagEnemyDie == false)
					{
						mineEnemy.body.velocity.x = -100;
						// console.log("yo");
					}
					isWrongAnswer = true;
					score-=20;
					scoreText.text = 'Score: ' + score;
				}
				wall.destroy();
			}		
		}
	}
};

function createDragon(x,type){
	if(type == 'cloud')
	{
		cloudDragon = dragon.create(x,0,'dragon');
		cloudDragon.anchor.setTo(0.5);
		thisLevel.physics.arcade.enable(cloudDragon);
		cloudDragon.body.immovable = true;
		cloudDragon.body.collideWorldBounds = true;
		cloudDragon.width = 150;
		cloudDragon.height = 135;
		cloudDragon.health = 100;
	}
	else {
		hoardingDragon = dragon.create(x,0,'dragon');
		hoardingDragon.anchor.setTo(0.5);
		thisLevel.physics.arcade.enable(hoardingDragon);
		hoardingDragon.body.immovable = true;
		hoardingDragon.body.collideWorldBounds = true;
		hoardingDragon.width = 150;
		hoardingDragon.height = 135;
		hoardingDragon.health = 100;
	}
	getGame.world.bringToTop(dragon);
}

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

	questionImage = game.add.image(hoarding.x + hoarding.width / 2, 50,'white');
	questionImage.anchor.setTo(0.5);
	questionImage.width = hoarding.width * 7 /4;
	questionImage.height = hoarding.height / 3;

	textGroup = game.add.group();
	style = { font: "11px Arial", fill: "#000000", wordWrap: true, wordWrapWidth: questionImage.width, align: "center", fontWeight: 'bold'};

   	componentText = addText(game, questionImage.x, questionImage.y, arr["question"],style,textGroup);
   	componentText.anchor.setTo(0.5);

    box = game.add.group();
    thisLevel.physics.arcade.enableBody(box);

    colorList = ['red','blue','green','orange'];

    color = game.add.group();
    thisLevel.physics.arcade.enableBody(color);

    for(var j=0;j<2;j++)
    {
    	for(var n=0;n<2;n++)
    	{
    	    box2 = createGroupSprite(game,color,box2,colorList[j*2+n] + 'Box',sprite.x + sprite.width/2*n + sprite.width/4,sprite.y + sprite.height/2*j + sprite.height/4,optionRepresent[(j*2+n).toString()]);
    	    componentText = addText(game,box2.x,box2.y, arr.options[optionRepresent[(j*2+n).toString()]], style, textGroup);
	    	// box1.anchor.setTo(0.5);
		    box2.width = sprite.width / 2;
		    box2.height = sprite.height / 2;
    	}
    }

	hoarding.sendToBack();
	getGame.world.sendToBack(color);

	var j=0;
    for(var k in arr.options)
    {
	    box1 = createGroupSprite(game,box,box1,colorList[j],sprite.x + sprite.width/4*j + sprite.width/8,sprite.y + sprite.height + 16,k);
	    j++;
	    box1.width = box1.height = 16;
	}

    getHoardingAnswer = arr["answer"];
    getHoardingI = i;

    createDragon(sprite.x + 300,'hoarding');

    player.bringToTop();

    indexHoarding++;
};

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

    for(var j=0;j<arr["noOfOptions"];j++)
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

   	questionTextMines = addText(game, Math.floor(questionbgImage.x), Math.floor(questionbgImage.y + 5), arr["question"] + "\n" + arr["options"],styleMines);

   	for( var j=0;j<arr["noOfOptions"];j++)
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

	startX = cloud.x - 30;

	player.bringToTop();

	createDragon(cloud.x+350,'cloud');

	indexCloud++;
};

//                                                             Scene Funtions Starts here!!!

function sceneButtonClicked(player,button){
	if(spacebar.space.isDown && openedModal == false)
	{
	 	reg.modal.showModal(button.name);
	 	openModalType = button.name;
	 	openedModal = true;
	}
}

function createModal(game){
	reg = {};
	reg.modal = new gameModal(game);

	for (var i=0;i<levelData.length;i++)
	{
		var arr = levelData[i].modalData;
		console.log(arr,i);
		reg.modal.createModal(arr);
	}

	openedModal = false;

	button = game.add.group();
	thisLevel.physics.arcade.enableBody(button);

	for(i=0;i<levelData.length;i++)
	{
		var arr = levelData[i];
		var shadow = game.add.sprite(parseInt(arr.buttonX) + 2,parseInt(arr.buttonY) + 2, arr.buttonKey);
		shadow.anchor.setTo(0.5);
	    shadow.tint = parseInt(arr.shadowColor);
	    shadow.alpha = 0.6;
	    // console.log("yo",shadow);
		var m1 = createGroupSprite(game,button,m1,arr.buttonKey,parseInt(arr.buttonX), parseInt(arr.buttonY),arr.modalData.type);
		m1.anchor.setTo(0.5);
		shadow.width = m1.width = parseInt(arr.buttonWidth);
		shadow.height = m1.height = parseInt(arr.buttonHeight);
	}

	game.world.bringToTop(button);
}

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
    if(enter.enter.isDown && openedModal == true)
    {
    	reg.modal.hideModal(openModalType);
    	openedModal = false;
    }
}