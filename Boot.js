var Game = {};

Game.Params = {
	baseWidth: 500,
	baseHeight: 240
};

Game.Boot = function(game){

};

Game.Boot.prototype = {
	init:function(game){
		this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		this.input.maxPointers = 1;
		this.stage.disableVisibilityChange = true;
	},

	preload:function(){
		this.load.image('preloaderBar',preloadData.preloaderBar);
	},

	create: function() {
		this.game.scale.pageAlignHorizontally = true;
        this.game.scale.pageAlignVertically = true;
        this.game.scale.refresh();

		this.state.start('Preloader');
	}
}