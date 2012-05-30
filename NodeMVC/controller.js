
// NodeMVC controller module that the developer will use to inherit from.
var controller = function() {
		
	var that = {};
	that.contentType = "text/html";
	that.modelObj = null;
	that.action = null;
	that.session = null;
	that.viewData = [];
	that.request = null;
	that.response = null;
	that.logger = null;
	that.url = require('url');
	that.qs = require('querystring');
		
	// This is the part that will require the html parser object
	var parserObj = require("./templateParser");
	
	// Testing Stub
	var viewfuncLogon = function (action, modelObj) { 
		return '<head><title> ' + action + '</title><link href="../Content/SiteCss" rel="stylesheet" type="text/css" />' +
		'</head><form action=' + '"' + action + '"' + ' method="post">' + '<fieldset>' +
		'<label for="username">' + modelObj.username.displayName + '</label>' +
		': <input type="text" name="username" id="username" /><br />' +
		'<label for="password">' + modelObj.password.displayName + '</label>' +
		': <input type="password" name="password" id="password" /><br /><br />' + 
		'<input type="submit" value="' + action + '" />' + '</fieldset></form>' };
	
    // Testing Stub	
	var viewfuncInfo = function (action, modelObj) { 
		return '<head><title> ' + action + '</title><link href="../Content/SiteCss" rel="stylesheet" type="text/css" />' +
		'</head><form action=' + '"' + action + '"' + ' method="post">' + '<fieldset>' +
		'<label for="fname">' + modelObj.fname.displayName + '</label>' +
		': <input type="text" name="fname" id="fname" value="' + modelObj.fname.getValue() + '" /><br />' +
		'<label for="lname">' + modelObj.lname.displayName + '</label>' +
		': <input type="text" name="lname" id="lname" value="' + modelObj.lname.getValue() + '" /><br />' +
		'<label for="email">' + modelObj.email.displayName + '</label>' +
		': <input type="email" name="email" id="email" value="' + modelObj.email.getValue() + '" /><br />' +
		'<label for="subscribed">' + modelObj.subscribed.displayName + '</label>' +
		': <input type="checkbox" name="subscribed" id="subscribed" /><br />' +
		'<input type="submit" value="' + 'update' + '" />' + '</fieldset></form>' };
			  
	// this is the gerenal function that gets called by the router
	// the action param is the name (string) of the function to execute
	var handleReq = function(request, response, action, sid, logger) {
	
		that.request = request;
		that.response = response;
		that.action = action;
		that.session = sid;
		that.logger = logger;
		
		var controllerActionForGet = function() {
		
		try {
				// See if a model has been defined for the action
				if (typeof that[action].model === "function") {
				
					// create the model object to be passed to the action as a parameter
					var modelParam = that[action].model();
					// attempt to bind any client url parameters to the model
					modelParam.bindModel(that.url.parse(request.url, true).query);
					// call the action on the controller passing in the model
					that[action](modelParam);
				
				} else {
			
					// call the action, this leaves the response to be handled to the controller function
					that[action]();
				}
			} catch (e) {
				throw e;
			}
		}
		
		// the only difference in this method is the way the clientParams are extracted
		var controllerActionForPost = function() {
		
            var body = '';
			
            request.on('data', function (data) {
               body += data;
            });
			
            request.on('end', function () {
       
               try {
			        // See if a model has been defined for the action
			        if (typeof that[action].model === "function") {
					
						// create the model object to be passed to the action as a parameter
						var modelParam = that[action].model();
						// attempt to bind any client body post parameters to the model
						modelParam.bindModel(that.qs.parse(body));
						// call the action on the controller passing in the model
						that[action](modelParam);
				
					} else {
			
				        // call the action, this leaves the response to be handled to the controller function
				        that[action]();
					}
		        } catch (e) {
			        throw e;
		        }
            });
			
		}
		
		if (that.request.method == 'POST') {
		    controllerActionForPost();
		}
		
		if (that.request.method == 'GET') {
			controllerActionForGet();
		}		

	};
	
	// handles ending the response and is only called by ultimately 
	var endResponse = function(viewContent) {
			
			if (viewContent === 302) {
				return 302;
			}
			that.response.setHeader("Content-Type", that.contentType);
			that.response.write(viewContent);
			that.response.statusCode = 200;
			that.logger(that.request, that.response, 0);
			that.response.end();
		};
	
	// A developer can invoke this function inside a controller function --> return that.view();
	// This function will return the content to be put into the body of a response
	var view = function () {
	
		try {
			if (typeof arguments[1] === 'string') endResponse(arguments[0]);
			// call developer defined view - currently calling a stub for testing arguments[0]
			// is assumed to be a model, but if undefined then this should not affect the parser
			if (that.action === "logon") endResponse(viewfuncLogon(that.action, arguments[0], that.viewData));
			if (that.action === "info") return endResponse(viewfuncInfo(that.action, arguments[0], that.viewData));
			//endResponse(parserObj.render(action, arguments[0], that.viewData));
		} catch (e) { 
			throw e; 
		}
	};
	
	// redirect currently passes 302, but this can actually be passed
	// back to the router and then the router could reroute the request
	var redirectToAction = function(action, controller) {
		
		that.response.writeHead(302, {"Location": "/" + controller + "/" + action});
		that.response.statusCode = 302;
		that.response.end();
		return 302;
	};
	
	that.view = view;
	that.handleRequest = handleReq;
	that.redirectToAction = redirectToAction;
	return that;
};
	
module.exports = controller;