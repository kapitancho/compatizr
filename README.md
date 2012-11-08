compatizr
=========

A set of Cross-browser JavaScript polyfills that enable features such as 
sessionStorage, localStorage, querySelector, querySelectorAll, addEventListener, etc.
in all browsers. It mainly targets IE 6-9 since they have many issues but most
of the polyfills work with other old browsers.

1. sessionStorage - full support for all browsers.
2. localStorage - the compatibility script relies on behavior:url(#default#userData).
This is a proprietary IE feature. Unfortunately an IFRAME solution is used because
there is a domain + path restriction and it will store different sets of data if used 
for different paths (for example site.com/dev and site.com/dev/sub). The IFRAME
overcomes this limitation because it is always at the same position.  
3. window.matchMedia uses the popular matchMedia polyfill. Currently it relies only on the
media queries that are supported by the browser. For a complete support, include:
http://css3-mediaqueries-js.googlecode.com/svn/trunk/css3-mediaqueries.js
4. JSON.parse and JSON.stringify - full support for all browser, based on the original 
json2.js by Douglas Crockford.
5. Function.prototype.bind, String.prototype.trim and Object.keys support.
6. A quick html5 elements support for older IEs. For a complete support including page 
printing, use the popluar html5shim/shiv script.
7. querySelector, querySelectorAll, addEventListener and classList for every DOM element.
IE 6 and IE 7 have no support for DOM prototype modification but it can by simulated by
using a behavior. IE 8 has a basic support for it (window.Element.prototype).     

Usage
-----
Include this anywhere in your HEAD section: 
<script type="text/javascript" src="compatizr/compatizr.js"></script>

There are two approaches.
1. Create a Compatizr object before including the script:
### Example:
    window.Compatizr = {
        load : 'all', //The other value options are the same as those described in point 2.
        path : 'path-to-compatizr-folder'	
    };
    
2. Use any of these after the script is included:
- Compatizr.loadAll();
- Compatizr.load (true); //Loads all except localStorage and elementMethods.
- Compatizr.load ('feature-name');
- Compatizr.load (['feature1', 'feature2', ...]);
- Compatizr.load ({feature1 : false, feature2 : true, ...});

Then use Compatizr.onload (callback). "callback" will be invoked when all
compatibility script are loaded and ready to use.

### Example: 
    Compatizr.onload (function() {
        var menu = document.querySelector ('.menu');
	    menu.addEventListener ('click', function() {
            menu.classList.toggle ('visible');
        }, true);
    });

See demo.html for more details.

Credits
-------
Some of the polyfills are written by other people.
All related information is preserved within the source code.
 