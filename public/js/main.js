// if the device is booty enabled. send them to twerk.
if (screen.width <= 699) {
  document.location = "twerk";
}


var socket = io.connect('/');

var sessionID = Math.round(Math.random()*1171).toString();
socket.emit('join', sessionID);

console.log(sessionID);

socket.on('joined', function(data) {
	console.log('joined: ' + data.session + ', ' + data.socketID);
	// store player data in browser
	socket.emit('playerid', '1');

});


socket.on('player-update', function(data) {
    console.log(data);
});


socket.on('action', function(data){
  if (data === 'the-action'){
    setTimeout(function(){
    }, 40);
  }
});
	
