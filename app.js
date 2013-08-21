var express = require('express')
, app = express()
, server = require('http').createServer(app)
, io = require('socket.io').listen(server)
, path = require('path');

app.configure('development', function(){
    var liveReloadPort = 35729;
    app.use(require('connect-livereload')({
	port: liveReloadPort
    }));
    app.use(express.errorHandler());
});

app.configure(function(){
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(path.join(__dirname, 'views')));
    app.use(express.static(path.join(__dirname, 'public')));
    app.use(express.bodyParser());
});

app.configure('development', function(){
    app.use(express.errorHandler());
});

var score = require('./lib/score.js');
var message = require('./lib/message.js');

// INITIAL VARIABLES
var _to = {};

// (note: this is the servers connection to everything)
io.sockets.on('connection', function(socket){
    socket.on('join', function(sessionID, isBrowser){
	socket.set('sessionID', sessionID, function(){
	    if(socket.join(sessionID)) {
		if(!_to[sessionID]) { _to[sessionID]= { number: 1, players: {} }; }
		if(!isBrowser) {
		    _to[sessionID].players[socket.id] = { 
			id: socket.id,
			score: 0,
			multiplier: 1,
			acc: 0,
			acc_array: [0],
			message: '',
			name: _to[sessionID].number.toString()
		    };
		    _to[sessionID].number++;
		}
		// emit player data
		io.sockets.in(sessionID).emit("player-data", _to[sessionID].players);
		socket.emit('joined', _to[sessionID].players[socket.id]);
	    }
	});
    });

    //on add name
    socket.on('named', function(data){
	socket.get('sessionID', function(err, sessionID){
	    if(socket.join(sessionID)) {
		_to[sessionID].players[socket.id].name = data;
		socket.broadcast.emit('player-update', _to[sessionID].players[socket.id]);
	    }
	});
    });

    socket.on('disconnect', function(sessionID){
        socket.get('sessionID', function(err, sessionID){
            if (err) {
		console.log(err);
            } else if (sessionID) {
		delete _to[sessionID].players[socket.id];
		// emit player data
		io.sockets.in(sessionID).emit("player-data", _to[sessionID].players);
            } else {
		console.log("No sessionID");
            }
        });
    });

    socket.on('game-start', function(data){
	socket.get('sessionID', function(err, sessionID){
	    if (err) {
		console.log(err);
	    } else if (sessionID) {
		_to[sessionID].start = 1;

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
		if(_to[sessionID].start){
		    var current_player = _to[sessionID].players[socket.id];
		    var scoring = score.get_score(
			data.lastDifference,
			data.timeDifference,
			100.,
			current_player.multiplier
		    );
		    var score_add = scoring[0];
		    var acc_add = scoring[1];
		    if (acc_add < 0){
			acc_add /= 4;
		    }
		    var mult_add = scoring[2];
		    current_player.score += score_add;
		    current_player.acc += acc_add;
		    //make sure accuracy isn't less than 0
		    current_player.acc = Math.max(0,current_player.acc);
		    console.log(current_player.acc_array);
		    current_player.acc_array.push(acc_add);
		    current_player.multiplier += mult_add;
		    var many = 4;
		    current_player.message = message.get_message(current_player.acc_array.slice(-many),many);
		    if (current_player.acc >= 90.){
			current_player.twerkOut = 1;
			current_player.score += Math.round(1000*current_player.multiplier);
			current_player.acc = 0;
			current_player.message = 'twerkOUT!';
		    }
		    socket.broadcast.emit('player-update', current_player);
		    console.log('player: '+current_player);
		    if (current_player.acc_array.length > many){
			current_player.acc_array = current_player.acc_array.slice(-many);
		    }
		}
	    } else {
		console.log("No sessionID");
	    }
	});
    });

    /*
    // ON DROP
    socket.on('drop', function(data){
    socket.get('sessionID', function(err, sessionID){
    if (err) {
    console.log(err);
    } else if (sessionID) {
    if(_to[sessionID].drop_that){
    if(_to[sessionID].start){
    var adds = score.get_score(data,80.);
    var score_add = adds[0];
    var acc_add = adds[1];
    _to[sessionID].players[socket.id].score += score_add;
    _to[sessionID].players[socket.id].acc += acc_add;
    socket.broadcast.emit('player-update', _to[sessionID].players[socket.id]);
    }
    }
    } else {
    console.log("No sessionID");
    }
    });
    });
    */

    // On song end
    socket.on('game-end', function(data){
	socket.get('sessionID', function(err, sessionID){
	    if (err) {
		console.log(err);
	    } else if (sessionID) {
		_to[sessionID].start = 0;
		io.sockets.in(sessionID).emit("final-score", _to[sessionID].players);
	    } else {
		console.log("No sessionID");
	    }
	});
    });

});


server.listen(process.env.PORT || 8080);
console.log("Express server listening on port 8080");
