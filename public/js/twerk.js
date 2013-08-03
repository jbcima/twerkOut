var socket = io.connect('/')
, angle
, angle_offset = 0
, iphone = navigator.userAgent.toLowerCase().indexOf("iphone");


var sessionID= '';


function joinSession() {
sessionID= prompt("ENTER SESSION ID:");
sessionID = sessionID.toString();

  if (sessionID === "")
    location.reload();
  else {
    socket.emit('join', sessionID);
  }
}

joinSession();

// on shake 
window.addEventListener('shake', function(event) {
	socket.emit('device-motion', 'twerk');
	console.log('twerk');
}, false);



if(window.DeviceOrientationEvent) {
  window.addEventListener("deviceorientation", function(event) {
    var rotateDegrees = event.alpha;
    // var leftToRight = event.gamma;
    // var frontToBack = event.beta;
    angle = Math.round(rotateDegrees);
    // handleOrientationEvent(frontToBack, leftToRight,
    // rotateDegrees);
  }, false);
}



// if(window.DeviceMotionEvent) {
//   window.addEventListener("devicemotion", function(event) {
//     var rotateDegrees = event.alpha;
//     // var leftToRight = event.gamma;
//     // var frontToBack = event.beta;
//     angle = Math.round(rotateDegrees);
//     // handleOrientationEvent(frontToBack, leftToRight,
//     // rotateDegrees);
//   }, false);
// }