// instantiate existing modules
var controllers = [];
var http = require("http");
var url = require("url");
var cluster = require('cluster');
var fs = require("fs");		// TODO is this needed? - Yes probably for writing to the log file
var path = require("path");	// TODO is this needed?
var crypto = require("crypto"); // for cache control
var net = require('net');	// TODO is this needed?

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
		if ((method !== "HEAD") && (method !== "GET")) {
			console.log("Unhandled method: " + method); 
			response.writeHeader(501, {"Content-Type":"text/plain"});
			response.end();
			return;	// TODO is this return statement needed here?
			// It probably is if you dont have anything else to do. or dont want
			// to execute any code below. Calling resp.end() does not stop code 
			// execution if thats what your getting at.
		}
		
		var writeDataFlag = (method === "HEAD") ? false : true;
		var head = {"Content-Type": "text/plain"};
		var pathname = url.parse(request.url).pathname;
		console.log("Request for " + pathname + " received.");
		// TODO Do we still check to see if the pathname is valid?  Or is this handled
		// by the if statement:  "if (typeof controllers[0].defaultFunc === 'function')"
		// This will be handled by the router and the controller. Router will tell if the 
		// pathname routes to a specific controller and function, and then the controller
		// will let the router know if the params mapped correctly inside. If an error 
		// occurs, the the router will be notified and the router should notify the server.
		// Then the server should know how to respond.
		
		
		// cookie - set and maintain a session-id if the client supports cookies
		var cookie = request.headers['cookie'];
		var SID = cookie;    // session id
		if (cookie == undefined) {
			SID = "SID=" + crypto.createHash('md5').update((new Date()).toLocaleTimeString()).digest('hex');
		}
		head["Set-Cookie"] = SID;    
		//console.log("SID=" + SID);
		// TODO Add support for other cookie version(s)
		// remember that the cookie2 RFC itself has been depricated
		
		// here's where the router comes into play for finding the appropriate controller 
		// and invoking the appropriate function for a working demonstration I will 
		// just put the controller at index zero for now
		if (typeof controllers[0].defaultFunc === 'function') {
			var respData = controllers[0].defaultFunc();
			if (respData === null) { // TODO determine correct falsy value
				response.writeHead(500, head);
		                response.write("500 Interval Server Error");
				response.end();				
			} else {
				var httpVersion = request.httpVersion;
				// chunked transfer encoding - ONLY for HTTP/1.1
				if(httpVersion == 1.1) {
					head["Transfer-Encoding"] = "chunked";
				} else {
					head["Content-Length"] = respData.length;
				}
				
				// TODO - How do we get the resource statistics? (needed for cache control)
				// TODO - How do we determine the content type?
				// I think that these items will be handled by the controller and view template
				// reference the functional spec and we will hopefully have this all worked out there
				
				// Finish up the response
				if(writeDataFlag) {
					response.write(respData);									
				}
				response.writeHead(200, head);
				response.end();
			}
		} else {
			response.writeHead(404, head);
			response.write("404 Not found");
			response.end();
		}
	};
	
	// currently takes a controller and port number.
	var runServer = function (cntrlr, port) {
	
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

	// This handleRequest calls the router to process the request
	// TODO replace old handleRequest (above) with this new one when the router is available.  Correct the router function as necessary.
/*
	var handleRequest = function(request, response) {
		if (request.url === '/favicon.ico') {
			return;
		}
		
		var method = request.method;
		var responseSize = 0;	// TODO - how do you get this?
		if ((method !== "HEAD") && (method !== "GET")) {
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
		
		// call router to process request
		try {
			var routerResponse = router.processRequest(request, response, SID); // TODO use correct router function and return type/value
			response.end();
			// TODO set response size
			log(request, response, responseSize);
		} catch (e) {
			console.log("Router returned an error: " + e.message);
			response.writeHead(500, head);
		        response.write("500 Interval Server Error");
			response.end();
			// TODO set response size
			log(request, response, responseSize);			
		}
	};
*/


module.exports = server;