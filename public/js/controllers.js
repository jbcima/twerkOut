//'use strict';
// :-(

/* Controllers */

app.controller('AppCtrl', function ($scope, socket) {

  // Socket listeners
  // ================

  socket.on('joined', function(data) {
    console.log('joined: ' + data.session + ', ' + data.socketID);
  });
    

  // Private helpers
  // ===============

    // small functions to help 


  // Methods published to the scope
  // ==============================
  $scope.init = function () {
    // set session ID 
    $scope.sessionID = Math.round(Math.random()*1171).toString();
    socket.emit('join', $scope.sessionID);
  };

  $scope.init();

});

// app.controller('HudCtrl', function ($scope) {});
// app.controller('StatsCtrl', function ($scope) {});