// NodeMVC controller module - can be inherited from using functional inheritance?
// A controller has a configurable router and references a view object.
// Need to allow devs to be able to add functions. When the controller is created
// it will loop through all of its functions and tie these to the view object.
// the configured router will expect that certain functions exist.
// the developer defined functions may or may not employ the model. 

var controller = function(spec) {
    var that = {};
	var url = require("url");
    var handler = function(req, res, viewData) {
		var pathname = url.parse(req.url).pathname;
		// once the controller finds the appropriate function from the dev 
		// defined model files, then we can execute the function, or run 
		// the function as a child processes. This can either be done in 
		// this file directly or it can be done in a separate file ???
		if (typeof viewData[pathname] === 'function') {
			viewData[pathname](res);
		} else {
			res.writeHead(404, {"Content-Type": "text/plain"});
			res.write("404 Not found");
			res.end();
		}
	};
	that.handle = handler
    return that;
};

module.exports = controller;