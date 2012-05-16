// NodeMVC server module
var server = (function () {

	var viewData = null;
	var controller = null;
	var http = require('http');
	var url = require("url");
	var cluster = require('cluster');
	
	var handleRequest = function(req, res) {
		if (req.url === '/favicon.ico') return;
		var pathname = url.parse(req.url).pathname;
		console.log("Request for " + pathname + " received.");
		controller.route(req, res, viewData);
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
		
			viewData = vwData;
			controller = cntrlr;
			// child processes can share the same port
			http.Server(handleRequest).listen(port);
		}
	};
	
	return { run : runServer };

})();

module.exports = server;