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
    console.log('HudCtrli');
  };

  $scope.init();

  $scope.playerUpdate = function (data) {
    $scope.players = data;
    console.log(data);
  };

});

// app.controller('HudCtrl', function ($scope) {});
// app.controller('StatsCtrl', function ($scope) {});