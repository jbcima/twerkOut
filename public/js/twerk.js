var socket = io.connect('/')
, angle
, angle_offset = 0
, iphone = navigator.userAgent.toLowerCase().indexOf("iphone");


var sessionID= '';


function joinSession() {
sessionID = prompt("ENTER SESSION ID:");
sessionID = sessionID.toString();

  if (sessionID === "")
    location.reload();
  else {
    socket.emit('join', sessionID);
  }
}

joinSession();


socket.on('joined', function(data) {
  $('#number').text(data);
});


socket.on('end',function(data){
  console.log(data);
});

socket.on('player-data' ,function(data){
	console.dir(data);
});


// on shake 
window.addEventListener('shake', function(event) {
	socket.emit('twerk', event.timeDifference);
}, false);

window.addEventListener('devicemotion', function(){
		
	socket.emit('device-motion', { 
		time: new Date().getTime(),
		x: event.accelerationIncludingGravity.x, 
		y: event.accelerationIncludingGravity.y, 
		z: event.accelerationIncludingGravity.z
	});


}, false); 
