exports.get_score = function(delta,T,multiplier){
    Number.prototype.mod = function(n){
	return ((this%n)+n)%n;
    }
    
    function get_player_tempo(T,delta){
	return 60.*1000./(delta);
    }

    function get_accuracy(T,y){
	var damp = 5.;
	var y_mod = y.mod(T);
	if (y_mod > T/2.) {
	    return 1./(((-y).mod(T)/damp)+1);
	}
	else {
	    return 1./(y_mod/damp+1);
	}
    }
    
    function get_pre_score(T,y,accuracy,multiplier){
	return multiplier*accuracy*Math.min(2,Math.max(1,Math.round(y/T)));
    }
    
    var y = get_player_tempo(T,delta);
    var accuracy = get_accuracy(T,y);
    var pre_score = get_pre_score(T,y,accuracy,multiplier);

    //scaled score made to int, for accuracy, multiplier, message
    return [Math.round(50.*pre_score),(accuracy-.5)*9.5,accuracy/50.];
}
