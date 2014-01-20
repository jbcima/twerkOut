var socket    = io.connect('/'),
    iphone    = navigator.userAgent.toLowerCase().indexOf('iphone'),
    sessionID = '',
    socketID,
    name      = '';

function joinSession() {
  sessionID = prompt("enter room number:");
  sessionID = sessionID.toString();

  if (sessionID === '') {
    location.reload();
  }
  else {
    socket.emit('join', sessionID);
    console.log(socket.id);
    socketID = socket.id;
  }
}

socket.on('joined', function(data) {
  socket.emit('named', name);
  // audio loop to keep phone screen on
  document.getElementById('audioLoop').play();
});

socket.on('end', function(data) {
});

socket.on('player-update', function(data) {
  console.log(data);
  if (socketID == socket.id) {
    // $('#points').replace(name);
  }
});

window.addEventListener('shake', function(event) {
  socket.emit('twerk', event.timeDifference);
}, false);

$(document).ready(function() {
  joinSession();
  name = prompt('enter your name:');
  $('#name').append(name);
});
