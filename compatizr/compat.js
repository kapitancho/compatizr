;(function() {		
	
	if (!window.matchMedia) {
		BOOT.loadScript ('matchMedia.js', true);
	}
	
	Function.prototype.bind=(function(){}).bind||function(a,b){b=this;return function(){b.apply(a,arguments)}};
	Object.keys=Object.keys||function(o,k,r){r=[];for(k in o)r.hasOwnProperty.call(o,k)&&r.push(k);return r};	
	String.prototype.trim = String.prototype.trim || function () {return this.replace(/^\s+|\s+$/g, "");};
	
	"article,aside,footer,header,hgroup,nav,menu".replace (/\b\w+\b/g, function (t) {
		document.createElement(t);
	});
				
	//Fix missing window.JSON for IE-7,FF-3,Saf-3.2,Opera-10.1,mSaf-3.2.
	if (!window.JSON) {
		BOOT.loadScript ('json.js', true);				
	}
	
	//Fix missing window.localStorage for IE-7
	if (!window.localStorage) {
		BOOT.loadIFrame ('localStorage.html', true);
	}
	
	//Fix missing window.localStorage for IE-7,etc
	if (!window.sessionStorage) {
		BOOT.loadScript ('sessionStorage.js', true);
	}
	
	var hasElementPrototype = window.Element ? true : false;
	window.Element = window.Element || function(){};
	//Add addEventListener to IE5+
	window.Element.prototype.addEventListener = window.Element.prototype.addEventListener || function(type, listener, useCapture) {
		this.attachEvent('on' + type, listener);			
	};
	//Add classList to every DOM element.
	if (!('classList' in document.documentElement)) {
		BOOT.loadScript ('classList.js', true);
	}
	
	if (!document.querySelector) {
		BOOT.loadScript ('querySelector.js', true);
	}
	
	if (!hasElementPrototype) {
		BOOT.addInlineStyle ('* { behavior:url(' + BOOT.getPath() + '/dom.htc); }');
	}

})();
