
// NodeMVC controller module that the developer will use to inherit from.
var controller = function(spec) {
		
	var that = {};
	that.viewData = [];
	that.request = null;
	that.response = null;
	var url = require('url');
		
	// This is the part that will require the html parser object
	var parserObj = require("./templateParser");
	
	// TODO: Remove the 3 lines below at some point.
	// 'viewfunc' below is just a stub for this unfinished functionality.
	var viewfuncLogon = function (action, modelObj) { return '<form action=' + '"' + action + '"' + ' method="get">' +
		modelObj.username.displayName + ': <input type="text" name="username" /><br />' +
		  modelObj.password.displayName + ': <input type="password" name="password" /><br />' +
			'<input type="submit" value="Submit" /> </form>' };
			  
	// this is the gerenal function that gets called by the router
	// the action param is the name (string) of the function to execute
	var handleReq = function(request, response, action, sid) {
	
		// make the request & response accessible to any derived class
		that.request = request;
		that.response = response;
		var url_parts = url.parse(request.url, true);
		response.setHeader("Content-Type", "text/html");
		
		// See if a model has been defined for the action
		if (typeof that[action].model === "function") {
			// create the model object to be passed to the action as a parameter
			var modelParam = that[action].model();
			try {
				modelParam.bindModel(url_parts.query);
				modelParam.clientBound = url_parts.search.length > 0 ? true : false;
			} catch (e) {
				// the parameters could not be mapped to the model
				throw e;
			}
			// call the action passing in the model - returns html
			response.write(that[action](modelParam));
			response.statusCode = 200;
		} else {
			// call the action - returns html
			response.write(that[action]());
			response.statusCode = 200;
		}
	};
	
	// the developer invokes this function at the end of a function in a controller --> return that.view();
	that.view = function () {
	
		try {
			// action & sid are pulled from 'handleReq' 
			var action = arguments.callee.caller.caller.arguments[2];
			var sid = arguments.callee.caller.caller.arguments[3];
			// a model or other params are fuller from the developer defined function
			var modelObj = arguments.callee.caller.arguments[0];
			// TODO: This is only for testing...
			console.log(sid + " attempting to call view file " + action)
		} catch (e) { 
			throw e; 
		}
		
		// call developer defined view - currently calling a stub for testing
		if (action === "logon") return viewfuncLogon(action, modelObj, that.viewData);
		return parserObj.render(action, modelObj, that.viewData);
	};
	
	that.handleRequest = handleReq;
	return that;
};
	
module.exports = controller;