// This starts the server and allows us to wire the other modules together

var controller = require("./controller");
var server = require("./server");
var model = require("./model");

// here is an example of a developer defined controller with the use of a model.
var accounts = function() {
		
	var that = controller(); // <-- inherit the base controller class
		
	// developer defines an account model object 
	var logonModel = function() {
		var that = model(); // <-- inherit the base model class
		that.addProperty("username", {displayName: "User name", required: true});
		that.addProperty("password", {displayName: "Password", required: true, dataType: "password"});
		that.addProperty("rememberme", {displayName: "Remember Me"});
		return that;
	};
		
	// developer defines a logon function for this account controller
	that.logon = function(logonModel) {
		if (logonModel.clientBound === false) {
			return that.view();
		}
		return that.redirectToAction("index" , "home");
	};
	
	// developer assigns the logonModel function object to the logon function
	that.logon.model = logonModel;
		
	return that;
};

// here is an example of a developer defined controller with the use of a model.
var userInfo = function() {
		
	var that = controller(); // <-- inherit the base controller class
		
	// developer defines an info model object 
	var infoModel = function() {
		var that = model(); // <-- inherit the base model class
		that.addProperty("username", {displayName: "User name", required: true});
		that.addProperty("password", {displayName: "Password", required: true, dataType: "password"});
		that.addProperty("rememberme", {displayName: "Remember Me"});
		return that;
	};
		
	// developer defines an info function for this userInfo controller
	that.info = function(infoModel) {
		if (infoModel.clientBound === false) {
			return that.view();
		};
		// retrieve model info for the user
		return that.view();
	};
	
	// developer assigns the infoModel function object to the infoUpdate function
	that.info.model = infoModel;
		
	return that;
};


server.addController(accounts(), "accounts");
server.run(8888);
