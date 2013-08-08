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
    // transition views
    $scope.triggerGame = 1;

    // start video
    $scope.loadVideo();
  };

  // video 
  $scope.percentageElapsed = 0;
  // video parameters/attributes
  $scope.video = {
    params: { allowScriptAccess: "always" },
    atts: { id: "twerkoutPlayer" } 
  };
  

  $scope.loadVideo = function() {
    swfobject.embedSWF("https://www.youtube.com/apiplayer?video_id=T6j4f8cHBIM&version=3&enablejsapi=1&playerapiid=myytflashplayer&html5=1",
                     "ytapiplayer", "425", "356", "8", null, null, $scope.video.params, $scope.video.atts);
  }
  $scope.startVideo = function(ytplayer) {
    ytplayer.playVideo();
    socket.emit('video-start', 1);
  }
  $scope.videoStateChange = function(ytplayer, state, duration) {
    // if video is playing
    if(state == 1) {
      $scope.duration = duration;
      $scope.startGame(ytplayer, ytplayer.getDuration());

      setInterval(function(){
          $scope.$apply(function() {
              $scope.passCurrentTime(ytplayer.getCurrentTime());
          });
      }, 600);
  
    // if video ended
    } else if(state == 0) {
          $scope.endGame(ytplayer);
    }
  }
  $scope.passCurrentTime = function (data) {
    $scope.currentTime = data;
    $scope.percentageElapsed = $scope.currentTime / $scope.duration * 100;
  };

  // start the game
  $scope.startGame = function(ytplayer, duration) {
    socket.emit('game-start', $scope.sessionID);
  }
  $scope.endGame = function(ytplayer) {
    socket.emit('game-end', $scope.sessionID);
  }


  // GAME/SOCKET ACTIONS

  $scope.init = function () {
    // set session ID 
    $scope.sessionID = Math.round(Math.random()*1171).toString();
    //console.log($scope.sessionID);
    $('#room').text($scope.sessionID);
    socket.emit('join', $scope.sessionID, 1);

  };
  $scope.init();

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
