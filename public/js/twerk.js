var socket = io.connect('/')
, angle
, angle_offset = 0
, iphone = navigator.userAgent.toLowerCase().indexOf("iphone");


var sessionID= '';


function joinSession() {
    sessionID = prompt("enter room number:");
    sessionID = sessionID.toString();
    if (sessionID === "")
	location.reload();
    else {
	socket.emit('join', sessionID);
    }
}

var name = '';
function getName() {
    name = prompt("enter your name:");
}

joinSession();
getName();

socket.on('joined', function(data) {
    socket.emit('named', name);
});


socket.on('end',function(data){
    console.log(data);
});

socket.on('player-update' ,function(data){
    console.dir(data);
    $('#name').text(data.name.toString());
});


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
