//'use strict';
// :-(

/* Controllers */

app.controller('AppCtrl', function ($scope, socket) {

  // Socket listeners
  // ================

  socket.on('joined', function(data) {
    console.log('joined: ' + data.session + ', ' + data.socketID);
  });

  socket.on('player-data', function(data) {
    $scope.playerData(data);
  });

  socket.on('player-update', function(data) {
    $scope.playerUpdate(data);
  });
    

  // Private helpers
  // ===============

    // small functions to help 


  // Methods published to the scope
  // ==============================
  $scope.init = function () {
    // set session ID 
    $scope.sessionID = Math.round(Math.random()*1171).toString();
    console.log($scope.sessionID);

    socket.emit('join', $scope.sessionID);
  };

  $scope.init();

  $scope.playerData = function (data) {
    $scope.players = data;
    console.log(data);
  };

  $scope.playerUpdate = function (data) {
    $scope.players[data.id].score = data.score;
    console.log(data.id);
    console.log($scope.players);
  };

});

// app.controller('HudCtrl', function ($scope) {});
// app.controller('StatsCtrl', function ($scope) {});