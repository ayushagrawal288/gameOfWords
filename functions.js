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
			enemy.destroy();
		}
		console.log("yo");
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
	player.reset(100,180);
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

function createComponent(game,i){
	if(data[i]["type"]=="Hoarding")
	{
		componentHoarding(game,i);
	}
	else if(data[i]["type"]=="Mines")
	{
		componentMines(game,i);
	}
	else if(data[i].type == 'FallingWords')
	{
		componentFallingWords(game,i);
	}
	if(index == 0)
	{
		tunnelReverse.bringToTop();
	}
	index++;
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
	// hoarding = game.add.image(380,100,arr.hoardingKey);
	// hoarding.width = 100;
	// hoarding.height = 150;

	textGroup = game.add.group();
	style = { font: "11px Arial", fill: "#000000", wordWrap: true, wordWrapWidth: sprite.width, align: "center"};

   	componentText = addText(game, Math.floor(sprite.x + sprite.width / 2), Math.floor(sprite.y + sprite.height / 2 + 5), arr["question"] + "\n" + arr["options"],style,textGroup);

    box = game.add.group();
    thisLevel.physics.arcade.enableBody(box);

    for(var j=0;j<arr["noOfOptions"];j++)
    {
	    box1 = createGroupSprite(game,box,box1,arr["boxKey"],sprite.x + 12 + arr["gap"]*j,sprite.y + sprite.height + 8,optionRepresent[j.toString()]);
	    componentText = addText(game,sprite.x + 14 + arr["gap"]*j,sprite.y + sprite.height + 8 - 12, optionRepresent[j.toString()], style, textGroup);
	   	box1.body.setSize(8,16.4,0);
    }
    box.callAll('animations.add', 'animations', 'box', [0],1,true);
    box.callAll('animations.add', 'animations', 'boxCollided', [1],1,true);
    box.callAll('play', null, 'box');

    getHoardingAnswer = arr["answer"];
    getHoardingI = i;

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