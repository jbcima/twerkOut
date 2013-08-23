(function (window, document) {

    function Fall() {

        //feature detect
        this.hasDeviceMotion = 'ondevicemotion' in window;

        //use date to prevent multiple shakes firing
        this.lastTime = new Date();

	//accelerometer values
        this.lastY = null;
	this.lastVY = null;

	//y velocity
	this.vy = null;

        //create custom event
        if (typeof CustomEvent === "function") {
            this.event = new CustomEvent('fall', {
                bubbles: true,
                cancelable: true
            });
        } else if (typeof document.createEvent === "function") {
            this.event = document.createEvent('Event');
            this.event.initEvent('fall', true, true);
        } else { 
          return false;
        }
    }

    //reset timer values
    Fall.prototype.reset = function () {
        this.lastTime = new Date();
	this.vy = null;
        this.lastY = null;
	this.lastVY = null;
    };

    //start listening for devicemotion
    Fall.prototype.start = function () {
        this.reset();
        if (this.hasDeviceMotion) { window.addEventListener('devicemotion', this, false); }
    };

    //stop listening for devicemotion
    Fall.prototype.stop = function () {

        if (this.hasDeviceMotion) { window.removeEventListener('devicemotion', this, false); }
        this.reset();
    };

    //calculates if fall did occur
    Fall.prototype.devicemotion = function (e) {

        var current = e.accelerationIncludingGravity,
	    currentTime,
	    timeDifference;

        if ((this.vy == null) && (this.lastY == null) && (this.lastVY == null)) {
	    this.vy = 0;
	    this.lastY = current.y;
	    this.lastVY = this.vy;
	}

	if (Math.abs(current.y) < 1.){
	    current.y = 0.0;
	}

	if ((this.vy < 0) && (this.lastVY < 0)){
	    window.dispatchEvent(this.event);
	}

	currentTime = new Date();
        timeDifference = currentTime.getTime() - this.lastTime.getTime();
	//zomg integral!
	if (timeDifference < 60) {
	    this.vy += current.y*timeDifference;
	}

	this.lastY = current.y;
	this.lastVY = this.vy;
        this.lastTime = new Date();
    };

    //event handler
    Fall.prototype.handleEvent = function (e) {

        if (typeof (this[e.type]) === 'function') {
	    console.log('hi');
            return this[e.type](e);
        }
    };

    //create a new instance of fall.js.
    var myFallEvent = new Fall();
    myFallEvent && myFallEvent.start();

}(window, document));
