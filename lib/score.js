// delta: time between twerks
// T: song tempo
// multiplier: player's multiplier vieo
exports.get_score_vals = function(delta,T,multiplier) {
  // gives a behavior we want where the mod of a negative number is positive
  Number.prototype.mod = function(n) {
    return ((this % n) + n) % n;
  };

  function get_player_tempo(delta) {
    // tempo = beats per minute
    return 60.*1000./(delta);
  }

  function get_accuracy(T,player_tempo) {
    console.log('player tempo: ' + player_tempo);

    // filter out non-movements
    if (player_tempo < 30) {
      return 0.;
    }

    var damp  = .9;
    // for half, normal, and double time
    var times = [2., 1., .5];
    
    var errors =  times.map(function(time) {
      return Math.abs(T - (time * player_tempo));
    });

    return 1. - damp * ((Math.min.apply(null, errors)) / T);
  }

  function get_pre_score(T,y,accuracy,multiplier){
    return multiplier * accuracy * Math.min(2, Math.max(1, Math.round(y / T)));
  }

  var player_tempo = get_player_tempo(delta);
  var acc_add = get_accuracy(T,player_tempo);

  var score_add = Math.round(50.*get_pre_score(T,player_tempo,acc_add,multiplier));
  
  // these values are then added to the multiplier and and accuracy arrays
  return [score_add, (acc_add - .5)*2, acc_add / 50.];
};
