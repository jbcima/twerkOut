var socket = io.connect('/')
, angle
, angle_offset = 0
, iphone = navigator.userAgent.toLowerCase().indexOf("iphone");

function sendTwerk(action) {
  console.log(action,time_delta);
  socket.emit('device-motion', action);
};

function joinSession(sessionID) {
  if (sessionID === "")
    location.reload();
  else {
    socket.emit('join', sessionID);
    $('#sessionForm').hide();
  }
}

window.addEventListener('shake', function(event){
  console.dir(event);
  /*if (iphone === -1) {
    if(angle <= 72) {
      sendTwerk('shake');
    }
  }*/
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

$.mobile.loadingMessage = false;

$(document).bind( "mobileinit", function(event) {
  $.extend($.mobile.zoom, {locked:true,enabled:false});
});
