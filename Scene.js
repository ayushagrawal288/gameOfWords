Game.Scene = function(game){

}

var reg = {};

Game.Scene.prototype = {
	create: function(game){
		game.scale.setGameSize(levelDimensions.scene.width, levelDimensions.scene.height);
		sceneImage = this.add.image(this.game.width / 2, this.game.height / 2, 'background');
		sceneImage.anchor.set(0.5);
		sceneImage.width = this.game.width;
		sceneImage.height = this.game.height;

		reg.modal = new gameModal(game);

		this.createModal(game);

		for(i=0;i<sceneButtons.length;i++)
		{
			var arr = sceneButtons[i];
			// var shadow = game.add.sprite(arr.buttonX + 2,arr.buttonY + 2, arr.buttonKey);
		 //    //shadow.tint = arr.shadowColor;
		 //    shadow.alpha = 0.6;
		 //    console.log("yo");
			var m1 = this.game.add.button(arr.buttonX,arr.buttonY, arr.buttonKey, this.showModal);
			m1.width = parseInt(arr.buttonWidth);
			m1.height = parseInt(arr.buttonHeight);
		}

		var image = this.add.button(450,200, 'next',function(){
			soundPowerUp.play();
			game.state.start('Level1');
		});
		image.width = image.height = 32;

		player = this.add.sprite(80,210,'player');
		player.anchor.setTo(0.5,0.5);
		player.animations.add('idle',[0,1],1,true);
		player.animations.add('jump',[2],1,true);
		player.animations.add('run',[3,4,5,6,7,8],7,true);
		this.physics.arcade.enable(player);
		player.body.collideWorldBounds = true;

		controls = this.input.keyboard.createCursorKeys();

		soundNew.play();

		tunnelReverse = game.add.sprite(0,208,'tunnelReverse');
		this.physics.arcade.enable(tunnelReverse);
		tunnelReverse.body.allowGravity = false;
		tunnelReverse.body.immovable = true;
	},

	update: function(game){
		this.physics.arcade.collide(player,tunnelReverse);
		player.body.velocity.x = 0;
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
		else {
        	player.animations.play('idle');
    	}
	},

	showModal: function(button){
 		reg.modal.showModal(button.key);
	},

	createModal: function(game){
		for (var i=0;i<sceneButtons.length;i++)
		{
			var arr = sceneButtons[i].modalData;
			reg.modal.createModal(arr);
		}
	}
}