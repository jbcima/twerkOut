var socket = io.connect('/')
, angle
, angle_offset = 0
, iphone = navigator.userAgent.toLowerCase().indexOf("iphone");


var sessionID= '';

var socketID = null;

$(document).ready(function(){

    function joinSession() {
	sessionID = prompt("enter room number:");
	sessionID = sessionID.toString();
	if (sessionID === "")
	    location.reload();
	else {
	    socket.emit('join', sessionID);
	    console.log(socket.id);
	    socketID = socket.id;
	}
    }

    var name = '';
    joinSession();
    name = prompt("enter your name:"); 
    $('#name').append(name);

    socket.on('joined', function(data) {
	socket.emit('named', name);
	document.getElementById('audioLoop').play();
    });


    socket.on('end',function(data){
    });

    /*socket.on('player-update' ,function(data){
      if (socketID == socket.id) {
      //$('#name').text(data.name.toString());
      }
      });*/


    // on shake 
    window.addEventListener('shake', function(event) {
	socket.emit('twerk', event.timeDifference);
    }, false);

    window.addEventListener('fall', function(event){
	socket.emit('drop',event)
    }, false); 

    window.addEventListener('devicemotion', function(){
	// socket.emit('device-motion', { 
	// 	time: new Date().getTime(),
	// 	x: event.accelerationIncludingGravity.x, 
	// 	y: event.accelerationIncludingGravity.y, 
	// 	z: event.accelerationIncludingGravity.z
	// });
    }, false);

});
