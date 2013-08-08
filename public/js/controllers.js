//'use strict';
// :-(

/* Controllers */

app.controller('AppCtrl', function ($scope, socket) {

  // Socket listeners
  // ================

  socket.on('joined', function(data) {
    console.log(data);
  });

  socket.on('player-data', function(data) {
    $scope.playerData(data);
  });

  socket.on('player-update', function(data) {
    $scope.playerUpdate(data);
  });
    

  // Private helpers
  // ===============
    $scope.sizeVideo = function() {
      var height = $(window).innerHeight();
      var width = $(window).innerWidth();
      // if(width > height) {
      //   $('#youtube-video').width(width);
      //   $('#youtube-video').height(width / (16/9));
      // } else {
      //   $('#youtube-video').height(height);
      //   $('#youtube-video').width(height / (16/9));
      // }
    };

    $(document).ready(function(){
      $(window).resize(function() {
        $scope.sizeVideo();
      });

    });

  // Methods published to the scope
  // ==============================

  // GAME INIT 
  $scope.loadGame = function() {

  };

  
  // GAME/SOCKET ACTIONS

  $scope.init = function () {
    // set session ID 
    $scope.sessionID = Math.round(Math.random()*1171).toString();
    //console.log($scope.sessionID);
    $('#room').text($scope.sessionID);
    socket.emit('join', $scope.sessionID, 1);

  };
  $scope.init();

  $scope.startVideo = function(ytplayer) {
    ytplayer.playVideo();
  }
  $scope.startGame = function(ytplayer, duration) {
    $scope.duration = duration;
    ytplayer.playVideo();
    socket.emit('song-start', $scope.sessionID);
  }
  $scope.endGame = function(ytplayer) {
    socket.emit('song-end', $scope.sessionID);
  }

  $scope.passCurrentTime = function (data) {
    // current time is data.
    $scope.currentTime = data;
  };

  $scope.playerData = function (data) {
    $scope.players = data;
    //console.log(data);
  };

  $scope.playerUpdate = function (data) {
    $scope.players[data.id].score = data.score;
    console.log(data.score);
    console.log($scope.players);
    $scope.players[data.id].acc = data.acc;
    $scope.players[data.id].name = data.name;
      interface.setScoreBars();
  };



});

// app.controller('HudCtrl', function ($scope) {});
// app.controller('StatsCtrl', function ($scope) {});
