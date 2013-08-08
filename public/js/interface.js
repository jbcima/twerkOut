var interfaceElms = function(){};

interfaceElms.prototype = {
    options: {},
    setScoreBars: function() {
	$('#scoreboard .score-inner').width($('#scoreboard li').width());
    }
};

$(document).ready(function() {
	$(window).resize(function() {
	  interface.setScoreBars();
	});

	interface.setScoreBars();

});

var interface = new interfaceElms();
