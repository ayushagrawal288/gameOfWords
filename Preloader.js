Game.Preloader = function(game){
	this.preloadBar = null;
};


Game.Preloader.prototype = {
	preload:function(){
		this.preloadBar = this.add.sprite(this.world.centerX,this.world.centerY,'preloaderBar');
		this.preloadBar.anchor.setTo(0.5,0.5);
		this.time.advancedTiming = true;

		this.load.image("block","assets/block.png");
		this.load.tilemap('map',preloadData.levelMap);
		this.load.tilemap('premap',preloadData.preLevelMap);
		this.load.image('tileset',preloadData.tileset);
		this.load.setPreloadSprite(this.preloadBar);
		this.load.spritesheet('player',preloadData.player,parseInt(preloadData.playerSpriteX),parseInt(preloadData.playerSpriteY));
		this.load.image('bird', preloadData.bird);
		this.load.image('nut',preloadData.nut);
		this.load.image('coin',preloadData.coin);
		this.load.audio('powerup',preloadData.soundPowerUp);		
		this.load.audio('jump',preloadData.soundJump);
		this.load.audio('enemyDie',preloadData.soundEnemyDie);
		this.load.audio('soundCoin',preloadData.soundCoin);
		this.load.audio('soundDie',preloadData.soundDie);
		this.load.audio('soundNew',preloadData.soundNew);
		this.load.spritesheet('explosion',preloadData.explosion,parseInt(preloadData.explosionSpriteX),parseInt(preloadData.explosionSpriteY));
		this.load.image('next',preloadData.next);
		this.load.image('tunnel',preloadData.tunnel);
		this.load.image('tunnelReverse',preloadData.tunnelReverse);
		this.load.spritesheet('enemy1',"assets/enemyOne.png",16,16);
		this.load.spritesheet('enemy2',"assets/enemy2.png",16,16);
		this.load.spritesheet('power','assets/power1.png',32,32);
		this.load.image('dragon','assets/dragon.png');

		this.load.image('red','assets/h/red.png');
		this.load.image('redBox','assets/h/redBox.png');
		this.load.image('orange','assets/h/orange.png');
		this.load.image('orangeBox','assets/h/orangeBox.png');
		this.load.image('blue','assets/h/blue.png');
		this.load.image('blueBox','assets/h/blueBox.png');
		this.load.image('green','assets/h/green.png');
		this.load.image('greenBox','assets/h/greenBox.png');
		this.load.image('white','assets/h/white.png');

		for (var i=0;i<hoardingData.length;i++)
		{
			var arr2 = hoardingData[i];
			this.load.image(arr2["bgImageKey"], arr2["bgImage"]);
			this.load.image(arr2["hoardingKey"], arr2["hoardingImage"]);
			this.load.spritesheet(arr2["boxKey"], arr2["box"],parseInt(arr2["boxSpriteWidth"]),parseInt(arr2["boxSpriteHeight"]));
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

		this.load.image('background',preloadData.sceneBackground);
		this.load.image('scene2',preloadData.scene2Background);
		for(var k in sceneButtons){
			var arr2 = sceneButtons[k];
			for(i=0;i<arr2.length;i++)
			{
				this.load.image(arr2[i].buttonKey, arr2[i].button);
			}
		}
		this.load.image("modalBG",preloadData.modalBG);
	},

	create: function() {
			this.state.start('PreLevel1');
	}
};