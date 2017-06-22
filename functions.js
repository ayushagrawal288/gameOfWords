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

		// flagEnemyDirection = {};

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
	    	// flagEnemyDirection[i.toString()] = 0;
	    	console.log(level);
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
	    	console.log(level);
		    coin = createGroupSprite(game,coins,coin,coinData.key,parseInt(coinData[level][i].x),parseInt(coinData[level][i].y));	
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
		nuts.createMultiple(5,'nut');

		nuts.setAll('anchor.x',0.5);
		nuts.setAll('anchor.y',0.5);

		nuts.setAll('scale.x',0.5);
		nuts.setAll('scale.y',0.5);

		nuts.setAll('outofBoundsKill',true);
		nuts.setAll('checkWorldBounds',true);
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
		}
		else if(controls.left.isDown){
			player.animations.play('run');
			player.scale.setTo(-1,1);
			player.body.velocity.x -= playerSpeed;
		}
		else if(controls.down.isDown){
    		shootNut();
    	}
		else {
        	player.animations.play('idle');
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
				// console.log(indexHoarding,hoardingData,startHoardingCreate,flagHoardingStart);
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
		thisLevel.physics.arcade.collide(player,mineEnemy,reset);
		thisLevel.physics.arcade.overlap(player,groupWords,collectWords);
				thisLevel.physics.arcade.collide(player,box,checkAnswer);


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

}

function updatePlayerPhysics(){
	thisLevel.physics.arcade.collide(player,ground);
		thisLevel.physics.arcade.collide(player,platforms);
		thisLevel.physics.arcade.overlap(player,coins,getCoin);
}

function changeDirection(enemy,block){
	if(enemy.body.touching.left == true || enemy.body.touching.right == true)
	{
			console.log("yo! Collided and velocity inversed");
			enemy.body.velocity.x = -1 * parseInt(enemyData[currentLevel][parseInt(enemy.name)].velocity);
			enemyData[currentLevel][parseInt(enemy.name)].velocity = -1 * parseInt(enemyData[currentLevel][parseInt(enemy.name)].velocity);
			// flagEnemyDirection[enemy.name] = 1;
			// console.log(enemyData[currentLevel][parseInt(enemy.name)].velocity,enemyData[currentLevel][parseInt(enemy.name)],enemyData[currentLevel]);
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
			resetPlayer();
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
		getGame.state.start('Scene');
	}
};

function resetPlayer(){
	soundDie.play();
	player.reset(70,200);
};

function reset(){
	soundDie.play();
	player.reset(100,180);
	mineEnemy.destroy();
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
			nut.body.velocity.y = -400;
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
				box.play('boxCollided');
				score-=20;
				scoreText.text = 'Score: ' + score;
			}
		}
	}
};

function hoardingTaskCompleted(){
	box.destroy();
	textGroup.destroy();
	soundPowerUp.play();
	componentText = addText(getGame,Math.floor(sprite.x + sprite.width / 2), Math.floor(sprite.y + sprite.height / 2 + 5),'Correct Answer +50 Points\nTask Completed',style);		
		// map.setCollision([1,2,27,57]);
		// for(var j=0;j<data[getI]["noOfOptions"];j++)
		// {
		// 	map.putTileWorldXY(27,sprite.x + 12 + data[getI]["gap"]*j,sprite.y + sprite.height + 8,16,16);
		// }
	startHoardingCreate[getHoardingI + 1] = 1;
};

function mineTaskCompleted(){
	explosion = getGame.add.sprite(mineEnemy.x - 50,thisLevel.world.centerY - 65,'explosion');
	explosion.animations.add('explode',null,7);
	explosion.play('explode',7,false,true);
	// enemyDie.play();
	console.log(startMinesCreate);
	flag3 = 1;
	soundPowerUp.play();
	componentText = addText(getGame,Math.floor(questionbgImage.x), Math.floor(questionbgImage.y + 5),'Correct Answer +50 Points\nTask Completed',styleMines);
	startMinesCreate[getMinesI + 1] = 1;
	console.log(startMinesCreate);
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
				wall.destroy();
			}		
		}
	}
};

function componentHoarding(game,i){
	var arr = hoardingData[i];
	sprite = game.add.sprite(parseInt(arr["bgImageX"]), parseInt(arr["bgImageY"]), arr["bgImageKey"]);
   	sprite.width = arr["bgImageWidth"];
   	sprite.height = arr["bgImageHeight"];
	hoarding = game.add.image(parseInt(arr.hoardingX), parseInt(arr.hoardingY),arr.hoardingKey);
	// hoarding.width = 100;
	// hoarding.height = 150;
	hoarding.sendToBack();
	sprite.sendToBack();

	textGroup = game.add.group();
	style = { font: "11px Arial", fill: "#000000", wordWrap: true, wordWrapWidth: sprite.width, align: "center", fontWeight: 'bold'};

   	componentText = addText(game, Math.floor(sprite.x + sprite.width / 2), Math.floor(sprite.y + sprite.height / 2 + 5), arr["question"] + "\n" + arr["options"],style,textGroup);

    box = game.add.group();
    thisLevel.physics.arcade.enableBody(box);

    for(var j=0;j<arr["noOfOptions"];j++)
    {
    	console.log(sprite.x, sprite.width/arr.noOfOptions*j,sprite.width/arr.noOfOptions/2);
	    box1 = createGroupSprite(game,box,box1,arr["boxKey"],sprite.x + sprite.width/arr.noOfOptions*j + sprite.width/arr.noOfOptions/2,sprite.y + sprite.height + 16,optionRepresent[j.toString()]);
	    componentText = addText(game,box1.x,box1.y - 12, optionRepresent[j.toString()], style, textGroup);
	   	box1.body.setSize(8,16.4,0);
    }
    box.callAll('animations.add', 'animations', 'box', [0],1,true);
    box.callAll('animations.add', 'animations', 'boxCollided', [1],1,true);
    box.callAll('play', null, 'box');

    getHoardingAnswer = arr["answer"];
    getHoardingI = i;
        // game.world.bringToTop(textGroup);
    // textGroup.bringToTop();

    player.bringToTop();

    indexHoarding++;
};

function componentMines(game,i){
	var arr = minesData[i];
	questionbgImage = game.add.image(parseInt(arr["bgImageX"]), parseInt(arr["bgImageY"]) - 25,arr["bgImageKey"]);
	questionbgImage.anchor.setTo(0.5);
	questionbgImage.width = arr["bgImageWidth"];
	questionbgImage.height = arr["bgImageHeight"];
	handles = game.add.group();
    thisLevel.physics.arcade.enableBody(handles);
	flagHandle = {};

    for(var j=0;j<arr["noOfOptions"];j++)
    {
	    handle = createGroupSprite(game,handles,handle,arr["handleKey"],parseInt(arr["handleX"]) + parseInt(arr["gap"])*j,parseInt(arr["handleY"]),optionRepresent[j.toString()]);
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
	    dynamiteBox = createGroupSprite(game,dynamiteBoxes,dynamiteBox,arr["dynamiteBoxKey"],parseInt(arr["handleX"]) + parseInt(arr["gap"])*j,parseInt(arr["handleY"]) + 16,optionRepresent[j.toString()]);
	    textMines = addText(game,dynamiteBox.x + 2, dynamiteBox.y + 4 ,optionRepresent[j.toString()],styleMines,textGroupMines);
	    dynamiteBox.scale.setTo(0.75);
   	}

    mineEnemy = game.add.sprite(parseInt(arr["wallX"]) + 1*parseInt(arr["wallGap"]),thisLevel.world.centerY,arr["mineEnemyKey"]);
    mineEnemy.anchor.setTo(0.5);
    game.physics.arcade.enable(mineEnemy);
		// mineEnemy.animations.add('run',[0,1,2],7,true);
		// mineEnemy.animations.play('run');

	getMinesAnswer = arr["answer"];

	wall = game.add.group();
	game.physics.arcade.enableBody(wall);

    wall1 = createGroupSprite(game,wall,wall1,arr["wallKey"],parseInt(arr["wallX"]),parseInt(arr["wallY"]));
    wall1.scale.setTo(0.75,0.85);
    wall1 = createGroupSprite(game,wall,wall1,arr["wallKey"],parseInt(arr["wallX"]) + 2*parseInt(arr["wallGap"]),parseInt(arr["wallY"]));
    wall1.scale.setTo(0.75,0.85);

    getMinesI =i;

    player.bringToTop();

    indexMines++;
};

function componentFallingWords(game,i){
	var arr = cloudData[i];
	styleText = { font: "14px Arial", fill: "#ffffff", wordWrap: true, wordWrapWidth: thisLevel.game.width - 100, align: "center" };

   	questionTextWords = addText(game,parseInt(arr.questionX),parseInt(arr.questionY), arr.question,styleText);

   	cloud = game.add.image(parseInt(arr.cloudX),parseInt(arr.cloudY),arr.cloudKey);

   	cloudTween = game.add.tween(cloud).to({
		x: cloud.x + 200
	},3000,'Linear',false,0,Number.MAX_VALUE,true);

	groupWords = game.add.group();
	thisLevel.physics.arcade.enableBody(groupWords);

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

	getCloudI = i;

	startX = parseInt(arr.componentStartX);
	console.log(startX,arr.componentStartX);

	player.bringToTop();

	indexCloud++;
}