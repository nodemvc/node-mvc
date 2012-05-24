
// NodeMVC controller module that the developer will use to inherit from.
var controller = function(spec) {
		
	var that = {};
	that.request = null;
	that.response = null;
	var url = require('url');
		
	// This is the part that will require the html parser object
	var parserObj = require("./templateParser");
	
	// TODO: Remove the 3 lines below at some point.
	// 'viewfunc' below is just a stub for this unfinished functionality.
	var viewfunc = function () { return '<form action="logonAttempt " method="get">' +
			  'First name: <input type="text" name="fname" /><br />' +
			  'Last name: <input type="text" name="lname" /><br />' +
			  '<input type="submit" value="Submit" /> </form>'};
		
	// this is the gerenal function that gets called by the server / router
	var handleReq = function(request, response, action) {
	
		// make the request & response accessible to any derived class
		that.request = request;
		that.response = response;
		var url_parts = url.parse(request.url, true);
		response.setHeader("Content-Type", "text/html");
		
		// See if a model has been defined for the action
		if (typeof action.model === "function") {
			// create the model object to be passed to the action as a parameter
			var modelParam = action.model();
			try {
				modelParam.setParameters(url_parts.query)
			} catch (e) {
				// the parameters could not be mapped to the model
				response.statusCode = 200; // What status code to put here?
				response.write('Parameters could not be mapped to the model');
				response.end();
			}
			response.statusCode = 200;
			// call the action passing in the view - this is what to write
			response.write(action(modelParam));
			response.end();
		} else {
			// call the action - this is what to write
			response.write(action());
			response.statusCode = 200; // What status code to put here	
			response.end();
		}
	};
	
	// the developer returns this object in their defined functions --> return view()
	that.view = function () {
		// there needs to be some way of knowing the name of the function 
		// which called this method. Does javascript have Reflection or something?
		// otherwise, we'll need to require view('nameOfCallingFunction') to let
		// the parsing class know which html file it needs to process and return.
		//return parserObj.render("still need to work this out");
		return viewfunc();
	};
	
	that.handleRequest = handleReq;
	return that;
};
	
module.exports = controller;