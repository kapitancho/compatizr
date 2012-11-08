/*
 * compatizr.js: A set of Cross-browser JavaScript polyfills.
 * 2012-11-08
 *
 * By Marian Kostadinov, http://github.com/kapitancho
 * NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.
 */

;(function() {

	var compatizrPath = (window.Compatizr && window.Compatizr.path) || 'compatizr';
	
	//A bunch of utility function used for content loading. 
	var util = {};
	
	/**
	 * Load an HTML page in an IFRAME.
	 * 
	 * @param String src the path to the HTML page.
	 * @param Boolean isCompatizrPath true if the loaded content 
	 *     can be found in the compatizr script folder. 
	 */
	util.loadIFrame = function (src, isCompatizrPath) {
		var ifr = document.createElement ('iframe');
		
		ifr.onreadystatechange = function() {
			if (ifr.readyState == 'complete') {
				setTimeout (function() {
					delete queue[src];
					ifr.contentWindow.init && ifr.contentWindow.init();
					callHandlers();					
				}, 1000);
			}
		};		
		ifr.onload = function() {
			delete queue[src];
			//callHandlers();
		}
		ifr.src = (isCompatizrPath ? compatizrPath + '/' : '') + src;
		head.appendChild (ifr);		
		iframe = ifr;
		queue[src] = true;
	};
	
	/**
	 * Load a JavaScript file.
	 * 
	 * @param String script the path to the JavaScript file.
	 * @param Boolean isCompatizrPath true if the loaded content 
	 *     can be found in the compatizr script folder. 
	 */
	util.loadScript = function (script, isCompatizrPath) {
		var el = document.createElement ('script');
		el.type = 'text/javascript';
		if (isCompatizrPath) {
			el.onreadystatechange = function() {
				el.onload();
			};
			el.onload = function() {
				delete queue[script];
				callHandlers();
			};
			queue[script] = true;
		}
		el.src = (isCompatizrPath ? compatizrPath + '/' : '') + script;
		head.appendChild (el);
	};
	
	/**
	 * Add an inline style to the page
	 * 
	 * @param String style the style to be added
	 */
	util.addInlineStyle = function (style) {
		var el = document.createElement ('style');
		el.type = 'text/css';
		if (el.styleSheet) {
			el.styleSheet.cssText = style;
		} else {
			el.appendChild (document.createTextNode (style))
		}
		head.appendChild (el);		
	};
	
	util.getCompatizrPath = function() {
		return compatizrPath;
	}
	
	var compatizr = {
		util : util	
	};
	
	/**
	 * Register a callback function that will be called when 
	 * all compatibility scripts are executed.
	 * 
	 * @param function handler a function that will be called 
	 */
	compatizr.onload = function (handler) {
		handlers.push (handler);
	};
		
	/**
	 * A list of callback functions that will get called when
	 * all compatibility scripts are executed.
	 */
	var handlers = [];
	
	/**
	 * An internal variable that stores a reference to an IFRAME element.
	 */
	var iframe = false;	
	
	/**
	 * An internal variable that shows the page load status.
	 */
	var isLoaded = false;	
	
	/**
	 * An internal variable that marks if the handlers have been called or not.
	 */
	var handlersCalled = false;
	
	/**
	 * A cached reference to the document HEAD element.
	 */
	var head = document.getElementsByTagName ('HEAD')[0];
	
	/**
	 * An object that keeps track of the external resources that are still loading.
	 */
	var queue = {};
	
	/**
	 * A method, called whenever a resource gets loaded. It checks if the loading
	 * queue is empty and notifies all the listeners when the queue is empty.
	 */
	var callHandlers = function() {
		if (isLoaded && !handlersCalled) {
			for (var q in queue) return;
			handlersCalled = true;
			for (var i = 0; i < handlers.length; i++) {
				handlers[i]();
			}
		}
	};
	
	/**
	 * An internal function that is called when the DOM content is loaded.
	 */
	var startLoading = function() {
		isLoaded = true;
		callHandlers();
	};
	
	if (document.addEventListener) {
		document.addEventListener ("DOMContentLoaded", function() {
		    document.removeEventListener( "DOMContentLoaded", arguments.callee, false);
		    startLoading();
		}, false);
	} else if ( document.attachEvent ) {
		document.attachEvent ("onreadystatechange", function(){
			if (document.readyState == "complete") {
				document.detachEvent( "onreadystatechange", arguments.callee );
				startLoading();
		    }
		});
	}
	
	/**
	 * All supported compatibility fixes are stored here.
	 */
	var usages = compatizr.load = {};
	
	/**
	 * Fix for missing window.matchMedia funtion.
	 */
	usages.matchMedia = function() {
		if (!window.matchMedia) {
			util.loadScript ('matchMedia.js', true);
		}		
	};
	
	/**
	 * Fix for missing Function.prototype.bind, Object.keys and String.prototype.trim.
	 */
	usages.jsCore = function() {
		if (!Function.prototype.bind) Function.prototype.bind=function(a,b){b=this;return function(){b.apply(a,arguments)}};
		Object.keys=Object.keys||function(o,k,r){r=[];for(k in o)r.hasOwnProperty.call(o,k)&&r.push(k);return r};	
		String.prototype.trim = String.prototype.trim || function () {return this.replace(/^\s+|\s+$/g, "");};		
	};
	
	/**
	 * Add styling support for the new HTML5 elements in IE6-8.
	 */
	usages.html5 = function() {
		"article,aside,footer,header,hgroup,nav,menu,figure,figcaption".replace (/\b\w+\b/g, function (t) {
			document.createElement(t);
		});
	};
	
	/**
	 * Add missing window.JSON for IE6-7,FF-3,Saf-3.2,Opera-10.1,mSaf-3.2.
	 */
	usages.json = function() {
		if (!window.JSON) {
			util.loadScript ('json.js', true);
		}
	};

	/*
	 * Add missing window.localStorage for IE6,7
	 */	
	usages.localStorage = function() {
		if (!window.localStorage) {
			util.loadIFrame ('localStorage.html', true);
		}
	};

	/*
	 * Add missing window.sessionStorage for IE6,7
	 */	
	usages.sessionStorage = function() {
		if (!window.sessionStorage) {
			util.loadScript ('sessionStorage.js', true);
		}
	};
	
	/*
	 * Add support for element.classList, element.addEventListener, 
	 * element.querySelector and element.querySelectorAll.
	 * 
	 */	
	usages.elementMethods = function() {
		var hasElementPrototype = window.Element ? true : false;
		window.Element = window.Element || function(){};
		//Add addEventListener to IE5+
		window.Element.prototype.addEventListener = window.Element.prototype.addEventListener || 
			function(type, listener, useCapture) {
				this.attachEvent('on' + type, listener);			
			};
			
		//Add classList to every DOM element.
		if (!('classList' in document.documentElement)) {
			util.loadScript ('classList.js', true);
		}
		
		//IE8 method should be overridden in order to provide full CSS3 support.
		var brokenIE8 = navigator.appVersion.match (/MSIE\s*8/);
		
		//Add querySelector and querySelectorAll				
		if (!document.querySelector || brokenIE8) {
			util.loadScript ('querySelector.js', true);
		}
		
		if (!hasElementPrototype) {
			util.addInlineStyle ('* { behavior:url(' + util.getCompatizrPath() + '/dom.htc); }');
		}

	}; 
	
	/**
	 * Execute all compatibility scripts.
	 *  
	 */
	compatizr.executeAll = function() {
		for (var feature in usages) {
			usages[feature]();
		}
	};
	
	/**
	 * Load a feature or a set of features.
	 * 
	 * @param mixed feature There are multiple options supported:
	 * 1. String - a single feature will be loaded
	 * 2. Array - all features from the array will be loaded
	 * 3. Object - object keys are the names of the features and the
	 * corresponding values are true/false values. The feature is loaded
	 * only when the corresponding value is true.  
	 */
	compatizr.execute = function (feature) {
		var i, f;
		
		if (feature === true) {
			//By default, localStorage and elementMethods are not loaded.
			feature = ['matchMedia', 'jsCore', 'html5', 'json', 'sessionStorage'];
		}
		
		if (typeof feature == 'string') {
			usages[feature] && usages[feature]();
		} else if (feature instanceof Array) {
			for (i = 0; i < feature.length; i++) {
				f = usages[feature[i]];
				f && f();
			}
		} else if (typeof feature == 'object') {
			for (i in feature) {
				f = usages[i];
				feature[i] && f && f();
			}
		}
	};
	
	/**
	 * Autoload for the selected features.
	 */
	var loadMode = window.Compatizr && window.Compatizr.load;

	if (loadMode === 'all') {
		compatizr.executeAll();
	} else if (loadMode) {
		compatizr.execute (loadMode);
	}
	
	/**
	 * Expose the compatizr object globally.
	 */
	window.Compatizr = compatizr;

})();
