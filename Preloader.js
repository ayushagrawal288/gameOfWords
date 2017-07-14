Game.Preloader = function(game){
	this.preloadBar = null;
};


Game.Preloader.prototype = {
	preload:function(){
		this.preloadBar = this.add.sprite(this.world.centerX,this.world.centerY,'preloaderBar');
		this.preloadBar.anchor.setTo(0.5,0.5);
		this.time.advancedTiming = true;

		this.load.image("block",preloadData.block);
		this.load.setPreloadSprite(this.preloadBar);
		this.load.spritesheet('player',preloadData.player,parseInt(preloadData.playerSpriteWidth),parseInt(preloadData.playerSpriteHeight));
		this.load.image('bird', preloadData.bird);
		this.load.image('nut',preloadData.nut);
		this.load.image('coin',preloadData.coin);
		this.load.audio('powerup',preloadData.soundPowerUp);		
		this.load.audio('jump',preloadData.soundJump);
		this.load.audio('enemyDie',preloadData.soundEnemyDie);
		this.load.audio('soundCoin',preloadData.soundCoin);
		this.load.audio('soundDie',preloadData.soundDie);
		this.load.audio('soundNew',preloadData.soundNew);
		this.load.audio('backgroundMusic',preloadData.soundBackground);
		this.load.spritesheet('explosion',preloadData.explosion,parseInt(preloadData.explosionSpriteWidth),parseInt(preloadData.explosionSpriteHeight));
		this.load.image('tunnel',preloadData.tunnel);
		this.load.image('tunnelReverse',preloadData.tunnelReverse);
		this.load.spritesheet('enemy1',preloadData.enemyType1,preloadData.enemy1SpriteWidth,preloadData.enemy1SpriteHeight);
		this.load.spritesheet('enemy2',preloadData.enemyType2,preloadData.enemy2SpriteWidth,preloadData.enemy2SpriteHeight);
		this.load.spritesheet('power',preloadData.playerPower,preloadData.playerPowerSpriteWidth,preloadData.playerPowerSpriteHeight);
		this.load.image('playNow',preloadData.playNow);
		this.load.image('next',preloadData.next);
		this.load.image('mainMenuBG',preloadData.mainMenuBG);
		this.load.audio('mainMenuSound',preloadData.mainMenuBGMusic);

		for(var i in levelDimensions){
			var arr2 = levelDimensions[i];
			this.load.image(i+'bg',arr2.bgImage);
			this.load.audio(i+'Sound',arr2.bgMusic);
			if(arr2.type == 'level'){
				this.load.spritesheet(i+'Dragon',arr2.dragonImage,parseInt(arr2.dragonSpriteWidth),parseInt(arr2.dragonSpriteHeight));
				this.load.spritesheet(i+'DragonPower',arr2.dragonPower,parseInt(arr2.dragonPowerSpriteWidth),parseInt(arr2.dragonPowerSpriteHeight));
			}
		}

		this.load.image('heart',preloadData.heart);

		for(var i in colorData)
		{
			this.load.image(i,colorData[i]);
		}

		for (var i=0;i<hoardingData.length;i++)
		{
			var arr2 = hoardingData[i];
			this.load.image(arr2["bgImageKey"], arr2["bgImage"]);
			this.load.image(arr2["hoardingKey"], arr2["hoardingImage"]);
		}

		for(var i=0;i<minesData.length;i++)
		{
			var arr2 = minesData[i];
			this.load.image(arr2["bgImageKey"], arr2["bgImage"]);
			this.load.image(arr2["dynamiteBoxKey"],arr2["dynamiteBox"]);
			this.load.image(arr2["handleKey"],arr2["handle"]);
			this.load.spritesheet(arr2["mineEnemyKey"],arr2["mineEnemy"],parseInt(arr2["mineEnemySpriteWidth"]),parseInt(arr2["mineEnemySpriteHeight"]));
			this.load.image(arr2["wallKey"],arr2["wall"]);
		}

		for(var i=0;i<cloudData.length;i++)
		{
			var arr2 = cloudData[i];
			this.load.image(arr2.cloudKey,arr2.cloud);
		}

		for(var k in sceneButtons){
			var arr2 = sceneButtons[k];
			for(var i in arr2)
			{
				if(arr2[i].isSpriteSheet == true)
				{
					this.load.spritesheet(arr2[i].buttonKey, arr2[i].button,arr2[i].spriteWidth,arr2[i].spriteHeight);					
				}
				else this.load.image(arr2[i].buttonKey, arr2[i].button);
			}
		}
		this.load.image("modalBG",preloadData.modalBG);
	},

	create: function() {
			this.state.start('MainMenu');
	}
};