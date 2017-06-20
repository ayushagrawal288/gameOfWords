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
		this.load.image(coinData.key,coinData.url);
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

		for (var i=0;i<data.length;i++)
		{
			if(data[i]["type"]=="Hoarding")
			{
				this.load.image(data[i]["bgImageKey"], data[i]["bgImage"]);
				this.load.image(data[i]["hoardingKey"], data[i]["hoardingImage"]);
				this.load.image(data[i]["boxKey"], data[i]["box"]);
			}
			else if(data[i]["type"]=="Mines")
			{
				this.load.image(data[i]["bgImageKey"], data[i]["bgImage"]);
				this.load.image(data[i]["dynamiteBoxKey"],data[i]["dynamiteBox"]);
				this.load.image(data[i]["handleKey"],data[i]["handle"]);
				this.load.spritesheet(data[i]["mineEnemyKey"],data[i]["mineEnemy"],parseInt(data[i]["mineEnemySpriteWidth"]),parseInt(data[i]["mineEnemySpriteHeight"]));
				this.load.image(data[i]["wallKey"],data[i]["wall"]);
			}
			else if(data[i].type == 'FallingWords')
			{
				this.load.image(data[i].cloudKey,data[i].cloud);
			}
		}

		this.load.image('background',preloadData.sceneBackground);
		for(i=0;i<sceneButtons.length;i++)
		{
			this.load.image(sceneButtons[i].buttonKey, sceneButtons[i].button);
		}
		this.load.image("modalBG",preloadData.modalBG);
	},

	create: function() {
			this.state.start('PreLevel1');
	}
};