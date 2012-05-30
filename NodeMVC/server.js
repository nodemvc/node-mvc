// instantiate existing modules
var controllers = [];
var http = require("http");
var url = require("url");
var fs = require("fs");	
var crypto = require("crypto"); // for cache control
var router = require('./router');
var CRLF = "\n";

// ******* In case you dont have the logging part from HW1. Otherwise, you can delete this code *******
var log = function (req, res, bytesSent) {
	
	// e.g. 127.0.0.1 RFC 1413 frank [10/Oct/2000:13:55:36 -0700] "GET /apache_pb.gif HTTP/1.0" 200 2326
	var serverLog = req.connection.remoteAddress + ' - - ' 
	+ '[' + new Date().toUTCString() + ']' + ' "' + req.method + ' ' 
	+ req.url + ' HTTP/' + req.httpVersion + '" ' + res.statusCode + ' ' + bytesSent + CRLF;

	var writeStreamObj = fs.createWriteStream('log.txt', {'flags': 'a'}); // <-- {'flags': 'a'} will append
	writeStreamObj.end(serverLog);
};

// NodeMVC server module
var server = (function () {	
	var handleRequest = function(request, response) {
		if (request.url === '/favicon.ico') {
			return;
		}
		
		var method = request.method;
		var responseSize = 0;	// TODO - how do you get this?
		if ((method !== "HEAD") && (method !== "GET") && (method !== "POST")) {
			console.log("Unhandled method: " + method); 
			response.writeHeader(501, {"Content-Type":"text/plain"});
			response.end();
			// TODO set response size
			log(request, response, responseSize);
			return;
		}
		
		var writeDataFlag = (method === "HEAD") ? false : true;
		var head = {"Content-Type": "text/plain"};
		var pathname = url.parse(request.url).pathname;
		console.log("Request for " + pathname + " received.");
		
		// cookie - set and maintain a session-id if the client supports cookies
		var cookie = request.headers['cookie'];
		var SID = cookie;    // session id
		if (cookie == undefined) {
			SID = "SID=" + crypto.createHash('md5').update((new Date()).toLocaleTimeString()).digest('hex');
		}
		head["Set-Cookie"] = SID;    
		//console.log("SID=" + SID);

		//Route the request
		try
		{	
			
			var routerResponse = router.handleRequest(request, response, controllers, SID, log);
			
			//response.end();
			// TODO set response size
			//log(request, response, responseSize);
		}
		catch(err)
		{
			// TODO use different error status codes for different errors; for now, use a catch-all error code of 500
			console.log("Router returned an error: " + err.message);
			response.writeHead(500, head);
		        response.write("500 Interval Server Error");
			response.end();
			// TODO set response size
			log(request, response, responseSize);						
		}
	};
	
	// currently takes the port number
	var runServer = function (port) {
		http.Server(handleRequest).listen(port);
	};
	
	// adds a controller to the array of controllers
	var addController = function (controller, name) {
		// we need to be able to specify the name of a controller
		// so that when the router is looking for a controller it can access it by name
		controllers[name] = controller;
	};
	
	return { run : runServer, addController : addController };

})();


module.exports = server;