EnemyBird = function(index,game,x,y){
	this.bird = game.add.sprite(x,y,'bird');
	this.bird.anchor.setTo(0.5,0.5);
	this.bird.name = index.toString();
	game.physics.enable(this.bird,Phaser.Physics.ARCADE);
	this.bird.body.immovable = true;
	this.bird.body.collideWorldBounds = true;
	this.bird.body.allowGravity = false;

	this.birdTween = game.add.tween(this.bird).to({
		y: this.bird.y + 100
	},2000,'Linear',true,0,100,true);
}

var enemy1;

Game.Level1 = function(){

};

var map;
var layer;

var player;
var controls = {};
var playerSpeed = 150;
var jumpTimer = 0;

var shootTime = 0;
var nuts;

Game.Level1.prototype = {
	create:function(game){
		this.stage.backgroundColor = '#3A0900';

		this.physics.arcade.gravity.y = 1400;

		map = this.add.tilemap('map1',64,64);
		map.addTilesetImage('tileset1');
		layer = map.createLayer(0);
		layer.resizeWorld();

		map.setCollisionBetween(0,0);
		map.setTileIndexCallback(1,this.resetPlayer,this);
		map.setTileIndexCallback(2,this.getCoin,this);

		player = this.add.sprite(100,500,'player');
		player.anchor.setTo(0.5,0.5);

		player.animations.add('idle',[0,1],1,true);
		player.animations.add('jump',[2],1,true);
		player.animations.add('run',[3,4,5,6,7,8],7,true);
		this.physics.arcade.enable(player);
		this.camera.follow(player);
		player.body.collideWorldBounds = true;

		controls = this.input.keyboard.createCursorKeys();
		// {
		// 	right: this.input.keyboard.addkey(Phaser.Keyboard.D),
		// 	left: this.input.keyboard.addkey(Phaser.Keyboard.A),
		// 	up: this.input.keyboard.addkey(Phaser.Keyboard.W),
		// };

		// shoot: this.input.keyboard.addkey(Phaser.Keyboard.W)

		enemy1 = new EnemyBird(0,game,player.x+500,player.y-200);	

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

		var button = game.add.button(500,this.world.centerY,'next',function(){
			game.state.start('Level2');
		});
	},

	update:function(){
		this.physics.arcade.collide(player,layer);
		this.physics.arcade.collide(player,enemy1.bird,this.resetPlayer);

		player.body.velocity.x = 0;

		// if(controls.up.isDown){
		// }

    	if(controls.down.isDown){
    		this.shootNut();
    	}

    	if(this.checkOverlap(nuts,enemy1.bird)){
    		enemy1.bird.kill();
    	}

		if(controls.up.isDown && (player.body.onFloor() || player.body.touching.down) && this.time.now > jumpTimer){
			player.animations.play('jump');
			player.body.velocity.y = -800;
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

	// nextState:function(){
	// 		},

	// create: function() {
	// },

	resetPlayer: function(){
		player.reset(100,500);
	},

	getCoin: function(){
		map.putTile(-1,layer.getTileX(player.x),layer.getTileY(player.y));
	},

	checkOverlap: function(spriteA,spriteB){
		var BoundsA = spriteA.getBounds();
		var BoundsB = spriteB.getBounds();

		return Phaser.Rectangle.intersects(BoundsA,BoundsB);
	},

	shootNut: function(){
		if(this.time.now > shootTime){
			nut = nuts.getFirstExists(false);
			if(nut){
				nut.reset(player.x,player.y);
				nut.body.velocity.y = -600;
				shootTime = this.time.now + 900;
			}
		}
	}
}