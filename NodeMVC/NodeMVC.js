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
		return that;
	};
		
	// developer defines a logon function for this account controller
	that.logon = function(args) {
		if (args.model.clientBound === false) {
			return that.view(args);
		}
		console.log("attempting to validate " + args.model.username.getValue());
		if (args.model.username.getValue() !== "james") {
		    // incorrect user name
		    return that.view(args);
		}
		return that.redirectToAction(args, "info", "userInfo");
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
		that.addProperty("fname", {displayName: "First Name", required: true});
		that.fname.setValue("James");
		that.addProperty("lname", {displayName: "Last Name", required: true});
		that.lname.setValue("Kline");
		that.addProperty("email", {displayName: "Email Address", required: true});
		that.email.setValue("JamesKline@gmail.com");
		that.addProperty("subscribed", "no", {displayName: "Subscribed"});
		return that;
	};
		
	// developer defines an info function for this userInfo controller
	that.info = function(args) {
		if (args.model.clientBound === false) {
			return that.view(args);
		};
		
		// retrieve model info for the user
		return that.view(args);
	};
	
	// developer assigns the infoModel function object to the infoUpdate function
	that.info.model = infoModel;
		
	return that;
};

// here is an example of a developer defined controller with the use of a model.
var Content = function() {
		
	var that = controller(); // <-- inherit the base controller class
	
	// developer defines an info function for this userInfo controller
	that.SiteCss = function(args) {
		
		var fs = require('fs');
		fs.readFile('./Site.css', function (err, data) {
			if (err) throw err;
			args.response.setHeader('Expires', '-1');
			args.response.setHeader('Content-Type', 'css');
			return that.view(args, data);
		});
	};
		
	return that;
};

server.addController(accounts(), "accounts");
server.addController(userInfo(), "userInfo");
server.addController(Content(), "Content");
server.run(8888);
