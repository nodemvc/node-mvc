
// NodeMVC controller module that the developer will use to inherit from.
var controller = function(spec) {
		
	var that = {};
		
	// This is the part that will require the html parser object
	var parserObj = require("./templateParser");
	
	// TODO: Remove the 3 lines below at some point.
	// 'viewfunc' below is just a stub for this unfinished functionality.
	var viewfunc = function () { return '<form action="logonAttempt " method="get">' +
			  'First name: <input type="text" name="fname" /><br />' +
			  'Last name: <input type="text" name="lname" /><br />' +
			  '<input type="submit" value="Submit" /> </form>'};
		
	// this is the gerenal function that gets called by the server / router
	var handleReq = function(req, res, action) {
	
		var request = req;
		var response = res;
		var url_parts = url.parse(request.url, true);
		response.setHeader("Content-Type", "text/html");
		// first you will need to test for a model
		if (typeof action.model === "function"){
		var modelParam = action.model();
			modelParam.setParameters(url_parts.query)
			// action returns the completed view 
			response.write(action(modelParam));
		} else {
			// below is calling a stub
			response.write(viewfunc());
		}
		
		
		response.statusCode = 200;
		response.end();
	};
	
	// the developer returns this object in their defined functions --> return view()
	that.view = function () {
		return viewfunc();
		// there needs to be some way of knowing the name of the function 
		// which called this method. Does javascript have Reflection or something?
		// otherwise, we'll need to require view('nameOfCallingFunction') to let
		// the parsing class know which html file it needs to process and return.
		//return parserObj.render("still need to work this out");
	};
	
	that.handleRequest = handleReq;
	return that;
};
	
module.exports = controller;