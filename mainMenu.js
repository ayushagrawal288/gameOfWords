Game.MainMenu = function(game){

}

Game.MainMenu.prototype = {
	create: function(game){
		var image = game.add.image(0,0,'mainMenuBG');
		image.width = this.game.width;
		image.height = this.game.height;

		var text = game.add.text(this.game.width/2,this.game.height/4, preloadData.mainMenuTitle, { fontSize: '32px', fill: '#ffffff' });
		text.anchor.setTo(0.5);

		bgMusic = game.add.sound('mainMenuSound',0.7,true);
		bgMusic.play();

		var button = game.add.button(this.game.width/2,this.game.height*3/4,'playNow',function(snap){
			bgMusic.stop();
			game.state.start('PreLevel1');
		});


		button.anchor.setTo(0.5);
		button.width = this.game.width/4;
		button.height = this.game.height/6;
	}
}