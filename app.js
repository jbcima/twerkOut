
/**
 * Module dependencies.
 */

var express = require('express')
  , app = express()
  , server = require('http').createServer(app)
  , io = require('socket.io').listen(server)
  , routes = require('./routes')
  , path = require('path');

app.configure(function(){
  //app.set('port', process.env.PORT || 3000);

  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(require("connect-livereload")({port: 35729}));
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'views')));
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(express.bodyParser());
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);
app.get('/twerk', routes.twerk);

var score = require('./private/score.js');

// INITIAL VARIABLES
var _to = {
  players: {}
}

// (note: this is the servers connection to everything)
io.sockets.on('connection', function(socket){
  //console.log('connection!');
  socket.on('join', function(sessionID){
    socket.set('sessionID', sessionID, function(){
      if(socket.join(sessionID)) {
          _to.players[socket.id] = { score: 0 };
          io.sockets.socket(socket.id).emit("player-data", _to.players[socket.id]);
      }
    });
  });

  // ON DEVICE MOTION
  socket.on('device-motion', function(data){
    socket.get('sessionID', function(err, sessionID){
      if (err) {
        console.log(err);
      } else if (sessionID) {
        //console.log('device-motion:' + data);
            
          // put logic here used to determine what actions to emit to the browser
          //   ie. update scores
          // in a different location. have 
        socket.broadcast.to(sessionID).emit('action', data);
    
      } else {
        console.log("No sessionID");
      }
    });
  });

  // ON TWERK
  socket.on('twerk', function(data){
    socket.get('sessionID', function(err, sessionID){
      if (err) {
        console.log(err);
      } else if (sessionID) {
	_to.players[socket.id].score += score.get_score(data,80.);
	socket.broadcast.emit('player-update',{'id': socket.id, 'score':_to.players[socket.id].score});
      } else {
        console.log("No sessionID");
      }
    });
  });

});


server.listen(8080);
console.log("Express server listening on port 8080");

