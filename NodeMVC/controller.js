
// NodeMVC controller module that the developer will use to inherit from.
var controller = function() {
		
	var that = {};
	that.url = require('url');
	that.qs = require('querystring');
	that.parserObj = require("./templateParser");
	
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
	var handleReq = function(request, response, action, session, logger) {

		// by default the content requested will be text/html, but the developer can specify otherwise
		response.setHeader("Content-Type", "text/html");
	
		// server args are passed into the controller action and are accessible by the view
		// function. They cannot be set as global vars because an action can run async code
		var serverArgs = { model: null, request:request, response:response, 
		action:action, session:session, logger:logger, viewData:[] };
		
		var controllerActionForGet = function() {
		
		try {
				// See if a model has been defined for the action
				if (typeof that[action].model === "function") {
				
					// create the model object to be passed to the action as a parameter
					serverArgs.model = that[action].model();
					// attempt to bind any client url parameters to the model
					serverArgs.model.bindModel(that.url.parse(request.url, true).query);
					// call the action on the controller passing in the model
					that[action](serverArgs);
				
				} else {
			
					// call the action, this leaves the response to be handled to the controller function
					that[action](serverArgs);
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
						serverArgs.model = that[action].model();
						// attempt to bind any client body post parameters to the model
						serverArgs.model.bindModel(that.qs.parse(body));
						// call the action on the controller passing in the model
						that[action](serverArgs);
				
					} else {
			
				        // call the action, this leaves the response to be handled to the controller function
				        that[action](serverArgs);
					}
		        } catch (e) {
			        throw e;
		        }
            });
			
		}
		
		if (request.method == 'POST') {
		    controllerActionForPost();
		}
		
		if (request.method == 'GET') {
			controllerActionForGet();
		}		

	};
	
	// handles ending the response and is only called by ultimately 
	var endResponse = function(viewContent, request, response, logger) {
			
			response.write(viewContent);
			response.statusCode = 200;
			logger(request, response, 0);
			response.end();
		};
	
	// A developer can invoke this function inside a controller function --> return that.view();
	// This function will return the content to be put into the body of a response
	var view = function () {
	
		try {
			
			// extract arguments that were passed into the action
			var model = arguments[0].model
			,request = arguments[0].request
			,response = arguments[0].response
			,action = arguments[0].action
			,session = arguments[0].session
			,logger = arguments[0].logger
			,viewData = arguments[0].viewData;

			// if a second argument is defined then write this data to the body and do not call the parser
			if (typeof arguments[1] !== 'undefined') {
				endResponse(arguments[1], request, response, logger);
			} else {
			
				// The stub calls below were for testing without the parser
				//if (action === "logon") endResponse(viewfuncLogon(action, model, viewData), request, response, logger);
				//if (action === "info") return endResponse(viewfuncInfo(action, model, viewData), request, response, logger);
			
				// call the parser for the specified action passing in the action, model, and viewData args
				endResponse(that.parserObj.render(action, model, viewData), request, response, logger);
			}
			
		} catch (e) { 
			throw e; 
		}
	};
	
	// redirect currently passes 302, but this can actually be passed
	// back to the router and then the router could reroute the request
	var redirectToAction = function(args, action, controller) {
		
		args.response.writeHead(302, {"Location": "/" + controller + "/" + action});
		args.response.statusCode = 302;
		args.response.end();
		// this can be what is passed back to the router to riderect instead of seding the client a 302
		return {redirect: {controller: controller, action: action} };
	};
	
	that.view = view;
	that.handleRequest = handleReq;
	that.redirectToAction = redirectToAction;
	return that;
};
	
module.exports = controller;