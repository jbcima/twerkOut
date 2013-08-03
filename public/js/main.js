// if the device is booty enabled. send them to twerk.
if (screen.width <= 699) {
  document.location = "twerk";
}


var socket = io.connect('/');

var sessionID = Math.round(Math.random()*1171).toString();
socket.emit('join', sessionID);

console.log(sessionID);

socket.on('joined', function(ID) {
  console.log('joined: ' + ID);
});


socket.on('action', function(data){
  console.log(data);
  if (data === 'the-action'){
    setTimeout(function(){
    }, 40);
  }
});
	