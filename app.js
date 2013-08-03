
/**
 * Module dependencies.
 */

var express = require('express')
  , app = express()
  , server = require('http').createServer(app)
  , io = require('socket.io').listen(server)
  , port = 8080
  , routes = require('./routes')
  , http = require('http')
  , path = require('path');


if (process.env.NODE_ENV == 'production')
  port = 80;

server.listen(port);
console.log('app running at localhost:' + port);


app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'hjs');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);
app.get('/twerk', routes.twerk);


io.sockets.on('connection', function(socket){
  console.log('connection!');
  socket.on('join', function(sessionID){
    socket.set('sessionID', sessionID, function(){
      if(socket.join(sessionID))
        socket.broadcast.to(sessionID).emit('joined', sessionID);
    });
  });
  socket.on('device-motion', function(data){
    socket.get('sessionID', function(err, sessionID){
      if (err) {
        console.log(err);
      } else if (sessionID) {
        console.log(data);
        socket.broadcast.to(sessionID).emit('action', data);
      } else {
        console.log("No sessionID");
      }
    });
  });
  socket.on('testing', function(data){
    console.log(data);
  });
});



http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

