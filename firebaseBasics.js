
var database = firebase.database().ref();
var storage = firebase.storage().ref();

// var mapImage,flagImage = 0;

// var url = storage.child("assets/game.csv").getDownloadURL().then(function(snapshot){
// 	mapImage = snapshot;
// 	// console.log(mapImage,url);
// 	flagImage++;
// 	_getEvent();
// });

// var flagImage = 1;


var flag = [];
var flagData = 0, flagModal = 1, flagButton = 0, flagPreload = 0;
var data = [];
database.child("Data").on("value", function(snapshot) {
  	data = snapshot.val();
	flagData++;
	_getEvent()
});

// var modalData = [];
// database.child("Modal").on("value", function(snapshot) {
//   	modalData = snapshot.val();
//   	flagModal++;
// 	_getEvent()
// });

var sceneButtons = [];
database.child("Scene").on("value", function(snapshot) {
	flagButton++;
	sceneButtons = snapshot.val();
	_getEvent()
});

var preloadData = [];
database.child("PreloadData").on("value", function(snapshot) {
	flagPreload++;
	preloadData = snapshot.val();
	_getEvent()
});

function _getEvent() {
	if(flagData == 1 && flagButton == 1 && flagModal == 1 && flagPreload == 1){
	var game = new Phaser.Game(Game.Params.baseWidth,Game.Params.baseHeight,Phaser.CANVAS,'');
			game.state.add('Boot',Game.Boot);
			game.state.add('Preloader',Game.Preloader);
			game.state.add('Level1',Game.Level1);
			game.state.add('PreLevel1',Game.PreLevel1);
			game.state.add('Scene',Game.Scene);
			
			game.state.start('Boot');
		}
}