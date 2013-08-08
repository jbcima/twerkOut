// app.directive("gauge", function() {
// 	return {
// 		scope: true,
// 		link: function(scope, element, attrs) {
// 			var id = element.attr('id');
// 			console.log(id);
// 			var opts = {
// 			  lines: 12, // The number of lines to draw
// 			  angle: 0.15, // The length of each line
// 			  lineWidth: 0.44, // The line thickness
// 			  pointer: {
// 			    length: 0.9, // The radius of the inner circle
// 			    strokeWidth: 0.035, // The rotation offset
// 			    color: '#000000' // Fill color
// 			  },
// 			  limitMax: 'false',   // If true, the pointer will not go past the end of the gauge

// 			  colorStart: '#6FADCF',   // Colors
// 			  colorStop: '#8FC0DA',    // just experiment with them
// 			  strokeColor: '#E0E0E0',   // to see which ones work best for you
// 			  generateGradient: true
// 			};
// 			var target = id; // your canvas element
// 			var gauge = new Gauge(target).setOptions(opts); // create sexy gauge!
// 			gauge.maxValue = 90; // set max gauge value
// 			gauge.animationSpeed = 128; // set animation speed (32 is default value)
			
// 			scope.$watch('player.acc', function(newValue, oldValue) {
// 				console.log('change');
// 				gauge.set(newValue); // set actual value
// 			});
// 		}
// 	};
// });