// NodeMVC model extension ???

var childProcess = require('child_process');

// for running model functions (business logic) asynchronously
// should send in the file that needs to be required, and function name that it needs
var runWorkerAsync = function(response) {
	
	var childCallback = function (m) {
		// its probably more appropriate to return the data to the controller
		// and the controller assigns it to the view. response not used here
		response.writeHead(200, {"Content-Type": "text/plain"});
		response.write(m.returnValue);
		response.end();
    }
	// create a child worker process 
	var worker = childProcess.fork(process.cwd() + '/worker.js');
	worker.on('message', childCallback);
	// send should send in the file that needs to be 
	// required and the function that needs to be executed
	worker.send({ action: 'start' });
};

// this would be as if the user defined it 
var runWorker = function(response) {
	// its probably more appropriate to return the data to the controller
	// and the controller assigns it to the view. response not used here
	response.writeHead(200, {"Content-Type": "text/plain"});
	response.write("Hello Worker");
	response.end();
};

exports.runWorker = runWorker;
exports.runWorkerAsync = runWorkerAsync;