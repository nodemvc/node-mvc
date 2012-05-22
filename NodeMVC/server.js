// instantiate existing modules
var controllers = [];
var http = require("http");
var url = require("url");
var cluster = require('cluster');
var fs = require("fs");		// TODO is this needed?
var path = require("path");	// TODO is this needed?
var crypto = require("crypto"); // for cache control
var net = require('net');	// TODO is this needed?


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
		}
		
		var writeDataFlag = (method === "HEAD") ? false : true;
		var head = {"Content-Type": "text/plain"};
		var pathname = url.parse(request.url).pathname;
		console.log("Request for " + pathname + " received.");
		// TODO Do we still check to see if the pathname is valid?  Or is this handled
		// by the if statement:  "if (typeof controllers[0].defaultFunc === 'function')"
		
		
		// cookie - set and maintain a session-id if the client supports cookies
		var cookie = request.headers['cookie'];
		var SID = cookie;    // session id
		if (cookie == undefined) {
			SID = "SID=" + crypto.createHash('md5').update((new Date()).toLocaleTimeString()).digest('hex');
		}
		head["Set-Cookie"] = SID;    
		//console.log("SID=" + SID);
		// TODO Add support for other cookie version(s)
		
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
	
	// this can be extended to be called multiple times with different controllers?
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

module.exports = server;