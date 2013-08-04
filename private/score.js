//function get_score(delta,T,time,multiplier){
exports.get_score = function(delta,T){
    function find_player_tempo(delta){
	return 60.*1000./(delta);

    }
    
    //function score(T,y,time,multiplier){
    function score(T,y){
	//return time*multiplier*1./((y % T)+1)*Math.max(1,Math.round(y/T));
	return 1./((y % T)+1);//*Math.max(1,Math.round(y/T));
    }
    
    var y = find_player_tempo(delta);

    //return score(T,y,time,multiplier);
    return Math.round(100*score(T,y));
}
