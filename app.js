var express = require('express'),
    app     = express(),
    server  = require('http').createServer(app),
    io      = require('socket.io').listen(server),
    path    = require('path');

app.set('port', process.env.PORT || 8080);

app.configure('development', function() {
  var liveReloadPort = 35729;
  app.use(require('connect-livereload')({
    port: liveReloadPort
  }));
  app.use(express.errorHandler());
});

app.configure(function() {
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'views')));
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(express.bodyParser());
});

app.configure('development', function() {
  app.use(express.errorHandler());
});

var score = require('./lib/score.js');
var message = require('./lib/message.js');

// object that stores everything
var twerkOut = {};

io.sockets.on('connection', function(socket) {
  socket.on('join', function(sessionID, isBrowser) {
    socket.set('sessionID', sessionID, function() {
      if (socket.join(sessionID)) {
        if (!twerkOut[sessionID]) {
          twerkOut[sessionID]= { number: 1, players: {} };
        }

        // if a phone connects, add a player to the game
        if (!isBrowser) {
          twerkOut[sessionID].players[socket.id] = {
            id         : socket.id,
            score      : 0,
            multiplier : 1,
            acc        : 0,
            acc_array  : [0],
            message    : '',
            name       : twerkOut[sessionID].number.toString()
          };

          twerkOut[sessionID].number++;
        }

        // emit player data
        io.sockets.in(sessionID).emit('player-data', twerkOut[sessionID].players);
        socket.emit('joined', twerkOut[sessionID].players[socket.id]);
      }
    });
  });

  // on add name
  socket.on('named', function(name) {
    socket.get('sessionID', function(err, sessionID) {
      if(socket.join(sessionID)) {
        twerkOut[sessionID].players[socket.id].name = name;
        // emits to sender
        socket.emit('player-update', twerkOut[sessionID].players[socket.id]);
        // emits to everyone else (particularly browser)
        socket.broadcast.emit('player-update', twerkOut[sessionID].players[socket.id]);
      }
    });
  });

  socket.on('disconnect', function(sessionID) {
    socket.get('sessionID', function(err, sessionID) {
      if (err) {
        console.log(err);
      }
      else if (sessionID) {
        delete twerkOut[sessionID].players[socket.id];
        io.sockets.in(sessionID).emit('player-data', twerkOut[sessionID].players);
      }
      else {
        console.log('No sessionID');
      }
    });
  });

  socket.on('game-start', function(data) {
    socket.get('sessionID', function(err, sessionID) {
      if (err) {
        console.log(err);
      }
      else if (sessionID) {
        // this variable is checked before twerking yeilds points
        twerkOut[sessionID].start = 1;
      }
      else {
        console.log('No sessionID');
      }
    });
  });

  // ON TWERK
  socket.on('twerk', function(data) {
    socket.get('sessionID', function(err, sessionID) {
      if (err) {
        console.log(err);
      } 
      else if (sessionID) {
        if(twerkOut[sessionID].start) {
          var current_player = twerkOut[sessionID].players[socket.id];
          var scoring = score.get_score_vals(
            data,
            // the tempo of the nicki song on the site
            100.,
            current_player.multiplier
          );
          var score_add = scoring[0],
              acc_add   = scoring[1],
              mult_add  = scoring[2];
          current_player.score += score_add;
          current_player.acc += acc_add;
          //make sure accuracy isn't less than 0
          current_player.acc = Math.max(0,current_player.acc);
          current_player.acc_array.push(acc_add);
          current_player.multiplier += mult_add;
          var many_accs = 4;
          current_player.message = message.get_message(
            current_player.acc_array.slice(-many_accs), many_accs
          );

          // if the accuracy bar of the player reaches 100, they get a points bonus
          if (current_player.acc >= 100.) {
            // bonus state
            current_player.twerkOut = 1;
            current_player.score += Math.round(1000*current_player.multiplier);
            current_player.acc = 0;
            current_player.message = 'twerkOUT!';
          }

          socket.emit('player-update', current_player);
          socket.broadcast.emit('player-update', current_player);

          if (current_player.acc_array.length > many_accs) {
            current_player.acc_array = current_player.acc_array.slice(-many_accs);
          }
        }
      }
      else {
        console.log('No sessionID');
      }
    });
  });

  // On song end
  socket.on('game-end', function(data) {
    socket.get('sessionID', function(err, sessionID) {
      if (err) {
        console.log(err);
      }
      else if (sessionID) {
        twerkOut[sessionID].start = 0;
        io.sockets.in(sessionID).emit('final-score', twerkOut[sessionID].players);
      } 
      else {
        console.log('No sessionID');
      }
    });
  });

});


server.listen(app.get('port'));
console.log('Express server listening on port ' + app.get('port'));
