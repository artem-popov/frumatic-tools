/**
 * Frumatic JS Tools v1.0 (c) Frumatic.
 * copyright & respect to code authors.
 * 
 * List of implemented tools:
 *
 * jquery wordpress compat
 * Array.forEach
 * String.format
 * Fade2
 * Simple JavaScript Inheritance
 * Crossbrowser console.log
 *
 * Array.filter
 * 
 */

/**
 * Wordpress whants us to use jQuery function call insted $, but we're love $.
 */
if (!$)
	$ = jQuery.noConflict();

/**
 * Javascript array forEach() method calls a function for each element in the array.
 *
 * array.forEach(callback[, thisObject]);
 * @param callback : Function to test each element of the array.
 * @param thisObject : Object to use as this when executing callback.
 *
 * Follow modern ECMAScript
 * Author:http://www.tutorialspoint.com/javascript/array_foreach.htm
 */
if (!Array.prototype.forEach) {
  Array.prototype.forEach = function(fun /*, thisp*/) {
    var len = this.length;
    if (typeof fun != "function")
      throw new TypeError();

    var thisp = arguments[1];
    for (var i = 0; i < len; i++) {
      if (i in this)
        fun.call(thisp, this[i], i, this);
    }
  };
}

/**
 * Type of sprintf.
 * Author: http://technoblogia.net/2011/11/08/%D7%98%D7%99%D7%A4-%D7%A4%D7%95%D7%A0%D7%A7%D7%A6%D7%99%D7%99%D7%AA-%D7%A2%D7%96%D7%A8-%D7%91-javascript-%D7%9C%D7%A2%D7%99%D7%A6%D7%95%D7%91-%D7%9E%D7%97%D7%A8%D7%95%D7%96%D7%95%D7%AA/
 */
if (!String.prototype.format) {
	String.prototype.format = function (){
	    var args = arguments;
	    return this.replace(/\{\{|\}\}|\{(\d+)\}/g, function (curlyBrack, index) {
	        return ((curlyBrack == "{{") ? "{" : ((curlyBrack == "}}") ? "}" : args[index]));
	    });
	};
}

/**
 *  Fade without flickering for cycle plugin
 *  Author: cycle plugin modified
 */
if ($ && $.fn.cycle && $.fn.cycle.transitions ) {
	$.fn.cycle.transitions.fade2 = function($cont, $slides, opts) {
			$slides.not(':eq('+opts.currSlide+')').css('opacity',0);
			opts.before.push(function(curr,next,opts) {
				jQuery.fn.cycle.commonReset(curr,next,opts);
				opts.cssBefore.opacity = 0;
			});
			opts.animIn	   = { opacity: 1 };
			opts.animOut   = { opacity: 1 };
			opts.cssBefore = { top: 0, left: 0 };
	};
}

/* Simple JavaScript Inheritance
 * By John Resig http://ejohn.org/
 * MIT Licensed.
 */
// Inspired by base2 and Prototype
(function(){
  var initializing = false, fnTest = /xyz/.test(function(){xyz;}) ? /\b_super\b/ : /.*/;

  // The base Class implementation (does nothing)
  this.Class = function(){};
 
  // Create a new Class that inherits from this class
  Class.extend = function(prop) {
    var _super = this.prototype;
   
    // Instantiate a base class (but only create the instance,
    // don't run the init constructor)
    initializing = true;
    var prototype = new this();
    initializing = false;
   
    // Copy the properties over onto the new prototype
    for (var name in prop) {
      // Check if we're overwriting an existing function
      prototype[name] = typeof prop[name] == "function" &&
        typeof _super[name] == "function" && fnTest.test(prop[name]) ?
        (function(name, fn){
          return function() {
            var tmp = this._super;
           
            // Add a new ._super() method that is the same method
            // but on the super-class
            this._super = _super[name];
           
            // The method only need to be bound temporarily, so we
            // remove it when we're done executing
            var ret = fn.apply(this, arguments);       
            this._super = tmp;
           
            return ret;
          };
        })(name, prop[name]) :
        prop[name];
    }
   
    // The dummy class constructor
    function Class() {
      // All construction is actually done in the init method
      if ( !initializing && this.init )
        this.init.apply(this, arguments);
    }
   
    // Populate our constructed prototype object
    Class.prototype = prototype;
   
    // Enforce the constructor to be what we expect
    Class.prototype.constructor = Class;

    // And make this class extendable
    Class.extend = arguments.callee;
   
    return Class;
  };
})();


/**
 * Crossbrowser console.log 
 * Author: http://patik.com/blog/complete-cross-browser-console-log/
 */

// Tell IE9 to use its built-in console
if (Function.prototype.bind && console && typeof console.log == "object") {
	["log","info","warn","error","assert","dir","clear","profile","profileEnd"]
		.forEach(function (method) {
			console[method] = this.call(console[method], console);
		}, Function.prototype.bind);
}

// log() -- The complete, cross-browser (we don't judge!) console.log wrapper for his or her logging pleasure
if (!window.log) {
	window.log = function () {
    log.history = log.history || [];  // store logs to an array for reference
    log.history.push(arguments);
		// Modern browsers
		if (typeof console != 'undefined' && typeof console.log == 'function') {
			
			// Opera 11
			if (window.opera) {
				var i = 0;
				while (i < arguments.length) {
					console.log("Item " + (i+1) + ": " + arguments[i]);
					i++;
				}
			}
			
			// All other modern browsers
			else if ((Array.prototype.slice.call(arguments)).length == 1 && typeof Array.prototype.slice.call(arguments)[0] == 'string') {
				console.log( (Array.prototype.slice.call(arguments)).toString() );
			}
			else {
				console.log( Array.prototype.slice.call(arguments) );
			}
			
		}
		
		// IE8
		else if (!Function.prototype.bind && typeof console != 'undefined' && typeof console.log == 'object') {
			Function.prototype.call.call(console.log, console, Array.prototype.slice.call(arguments));
		}
		
		// IE7 and lower, and other old browsers
		else {
			// Inject Firebug lite
			if (!document.getElementById('firebug-lite')) {
				// Include the script
				var script = document.createElement('script');
				script.type = "text/javascript";
				script.id = 'firebug-lite';
				// If you run the script locally, point to /path/to/firebug-lite/build/firebug-lite.js
				script.src = 'https://getfirebug.com/firebug-lite.js';
				// If you want to expand the console window by default, uncomment this line
				//document.getElementsByTagName('HTML')[0].setAttribute('debug','true');
				document.getElementsByTagName('HEAD')[0].appendChild(script);
				setTimeout(function () { log( Array.prototype.slice.call(arguments) ); }, 2000);
			}
			else {
				// FBL was included but it hasn't finished loading yet, so try again momentarily
				setTimeout(function () { log( Array.prototype.slice.call(arguments) ); }, 500);
			}
		}
	}
}

/**
 * @todo Description and test this feature.
 *
 * Filter Array.
 * Returns an array of items for which the function returns true.
 *
 * array.filter( fn );
 * @param fn : Function to check each element of the array.
 */
if (!Array.prototype.filter) {
	Array.prototype.filter = function(/* function */ predicate) {
		if (typeof predicate != "function") throw new TypeError();
		var results = [], len = this.length;;
		for (var i = 0; i < len; i++){
			var e = this[i];
			if(predicate(e)) results.push(e);
		}
		return results;
	}
};

/**
 @todo array.map
 */


/**
 * Action methods implement a system of event and their calls
 */
(function(){
    action = {
        list: {},
        add: function(event, fn){
            if(arguments.length < 2) return true; // try exception
            if(this.list[event] == undefined) this.list[event] = [];
            this.list[event].push(fn);
            return true;
        },
    do: function(event){
        if(this.list.hasOwnProperty(event) && this.list[event].length){
            for(var i = 0; i < this.list[event].length; i++)
                this.list[event][i].call();
        }
        return true;
    }
};
})();