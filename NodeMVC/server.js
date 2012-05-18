// NodeMVC server module
var server = (function () {

	//var viewData = null; dont think this is necessary here
	var controllers = [];
	var http = require('http');
	var url = require("url");
	var cluster = require('cluster');
	
	var handleRequest = function(req, res) {
		if (req.url === '/favicon.ico') return;
		var pathname = url.parse(req.url).pathname;
		console.log("Request for " + pathname + " received.");
		
		// here's where the router comes into play for finding the appropriate controller 
		// and invoking the appropriate function for a working demonstration I will 
		// just put the controller at index zero for now
		if (typeof controllers[0].defaultFunc === 'function') {
		    res.writeHead(200, {"Content-Type": "text/plain"});
			res.write(controllers[0].defaultFunc());
			res.end();
		} else {
			res.writeHead(404, {"Content-Type": "text/plain"});
			res.write("404 Not found");
			res.end();
		}
		
	};
	
	// this can be extended to be called multiple times with different controllers?
	// currently takes a controller, view, and port number.
	var runServer = function (cntrlr, vwData, port) {
	
		if (cluster.isMaster) {
			var worker = cluster.fork();
			worker.on('death', function(worker) {
				// should probably add some logic to handle restart the process?
				console.log('worker ' + worker.pid + ' died');
			});
		} else {
		
			// viewData = vwData; dont think this is necessary here.
			controllers.push(cntrlr);
			// child processes can share the same port
			http.Server(handleRequest).listen(port);
		}
	};
	
	return { run : runServer };

})();

module.exports = server;