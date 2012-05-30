
// NodeMVC controller module that the developer will use to inherit from.
var controller = function(spec) {
		
	var that = {};
	that.modelObj = null;
	that.action = null;
	that.session = null;
	that.viewData = [];
	that.request = null;
	that.response = null;
	var url = require('url');
		
	// This is the part that will require the html parser object
	var parserObj = require("./templateParser");
	
	// Testing Stub
	var viewfuncLogon = function (action, modelObj) { return '<form action=' + '"' + action + '"' + ' method="post">' +
		modelObj.username.displayName + ': <input type="text" name="username" /><br />' +
		modelObj.password.displayName + ': <input type="password" name="password" /><br />' +
			'<input type="submit" value="Submit" /> </form>' };
	
    // Testing Stub	
	var viewfuncInfo = function (action, modelObj) { return '<form action=' + '"' + action + '"' + ' method="get">' +
		modelObj.fname.displayName + ': <input type="text" name="fname" /><br />' +
		modelObj.lname.displayName + ': <input type="text" name="lname" /><br />' +
		modelObj.email.displayName + ': <input type="email" name="email" /><br />' +
		modelObj.subscribed.displayName + ': <input type="checkbox" name="subscribed" /><br />' +
			'<input type="submit" value="Submit" /> </form>' };
			  
	// this is the gerenal function that gets called by the router
	// the action param is the name (string) of the function to execute
	var handleReq = function(request, response, action, sid, logger) {
	
		that.request = request;
		that.response = response;
		that.action = action;
		that.session = sid;
		
		var controllerActionForGet = function() {
		
		try {
			// See if a model has been defined for the action
			if (typeof that[action].model === "function") {
				
				// create the model object to be passed to the action as a parameter
				// attempt to bind any client url parameters to the model
				// call the action on the controller passing in the model
				var modelParam = that[action].model();
				modelParam.bindModel(url.parse(request.url, true).query);
				that[action](modelParam);
				
			} else {
			
				// call the action, this leaves the response to be handled to the controller function
				that[action]();
			}
		} catch (e) {
			throw e;
		}
		
		logger(that.request, that.response, 0);
		that.response.end();
		
		}
		
		var controllerActionForPost = function() {
		
		    // the only difference in this method is the way the clientParams are extracted
		    var qs = require('querystring');
            var body = '';
			
            request.on('data', function (data) {
               body += data;
            });
			
            request.on('end', function () {

               var post = qs.parse(body);
               try {
					console.log(action)
			        // See if a model has been defined for the action
			        if (typeof that[action].model === "function") {
					
				    // create the model object to be passed to the action as a parameter
				    // attempt to bind any client url parameters to the model
				    // call the action on the controller passing in the model
				    var modelParam = that[action].model();
				    modelParam.bindModel(post);
				    that[action](modelParam);
				
			        } else {
			
				        // call the action, this leaves the response to be handled to the controller function
				        that[action]();
			        }
		        } catch (e) {
			        throw e;
		        }
				
				logger(request, response, 0);
				response.end();
				
            });
			
		}
		
		if (that.request.method == 'POST') {
		    controllerActionForPost();
		}
		
		if (that.request.method == 'GET') {
			controllerActionForGet();
		}		

	};
	
	// the developer invokes this function at the end of a function in a controller --> return that.view();
	var view = function () {
	
		try {
			// action & sid are pulled from 'handleReq' 
			//var action = arguments.callee.caller.caller.arguments[2];
			//var sid = arguments.callee.caller.caller.arguments[3];
			// a model or other params are fuller from the developer defined function
			//var modelObj = arguments.callee.caller.arguments[0];
			if (arguments.length > 0) {
				var modelObj = arguments[0];
			}			
			// TODO: This is only for testing...
			console.log(that.session + " attempting to call view file " + that.action)
		} catch (e) { 
			throw e; 
		}

		var content = null;
		// call developer defined view - currently calling a stub for testing
		if (that.action === "logon") content = viewfuncLogon(that.action, modelObj, that.viewData);
		if (that.action === "info") content = viewfuncInfo(that.action, modelObj, that.viewData);
		//content = parserObj.render(action, modelObj, that.viewData);
		that.response.setHeader("Content-Type", "text/html");
		that.response.write(content);
		that.response.statusCode = 200;
	};
	
	var redirectToAction = function(action, controller) {
		
		that.response.writeHead(302, {"Location": "/" + controller + "/" + action});
		that.response.statusCode = 302;
		that.response.end();
	};
	
	that.view = view;
	that.handleRequest = handleReq;
	that.redirectToAction = redirectToAction;
	return that;
};
	
module.exports = controller;