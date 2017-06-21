var database = firebase.database().ref();
var storage = firebase.storage().ref();

var flag = 0;
var data = [];
database.child("Data").on("value", function(snapshot) {
  	data = snapshot.val();
	flag++;
	_getEvent()
});

var levelDimensions = [];
database.child("Config").on("value", function(snapshot) {
  	levelDimensions = snapshot.val();
	flag++;
	_getEvent()
});


var coinData = [];
database.child("Coin").on("value", function(snapshot) {
  	coinData = snapshot.val();
	flag++;
	_getEvent()
});

var enemyData = [];
database.child("Enemy").on("value", function(snapshot) {
  	enemyData = snapshot.val();
	flag++;
	_getEvent()
});

var wordsToFall = [];
database.child("Words").on("value", function(snapshot) {
  	wordsToFall = snapshot.val();
	flag++;
	_getEvent()
});

var sceneButtons = [];
database.child("Scene").on("value", function(snapshot) {
	flag++;
	sceneButtons = snapshot.val();
	_getEvent()
});

var preloadData = [];
database.child("PreloadData").on("value", function(snapshot) {
	flag++;
	preloadData = snapshot.val();
	_getEvent()
});

var cloudData = [];
database.child("Cloud").on("value", function(snapshot) {
	flag++;
	cloudData = snapshot.val();
	_getEvent()
});

var hoardingData = [];
database.child("Hoarding").on("value", function(snapshot) {
	flag++;
	hoardingData = snapshot.val();
	_getEvent()
});

var minesData = [];
database.child("Mines").on("value", function(snapshot) {
	flag++;
	minesData = snapshot.val();
	_getEvent()
});

function _getEvent() {
	if(flag == 9){
	var game = new Phaser.Game(Game.Params.baseWidth,Game.Params.baseHeight,Phaser.CANVAS,'');
			game.state.add('Boot',Game.Boot);
			game.state.add('Preloader',Game.Preloader);
			game.state.add('Level1',Game.Level1);
			game.state.add('PreLevel1',Game.PreLevel1);
			game.state.add('Scene',Game.Scene);
			
			game.state.start('Boot');
		}
}