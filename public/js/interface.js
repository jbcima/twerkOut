$(document).ready(function() {
	$(window).resize(function() {
	  setScoreBars();
	});

	function setScoreBars(){
		$('#scoreboard .score-inner').width($('#scoreboard li').width())
	}

	setScoreBars();

});