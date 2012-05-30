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
	that.logon = function(logonModel) {
		if (logonModel.clientBound === false) {
			return that.view(logonModel);
		}
		console.log("attempting to validate " + logonModel.username.getValue());
		if (logonModel.username.getValue() !== "kevin") {
		    // incorrect user name
		    return that.view(logonModel);
		}
		return that.redirectToAction("info", "userInfo");
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
		that.addProperty("subscribed", {displayName: "Subscribed"});
		return that;
	};
		
	// developer defines an info function for this userInfo controller
	that.info = function(infoModel) {
		if (infoModel.clientBound === false) {
			return that.view(infoModel);
		};
		// retrieve model info for the user
		return that.view(infoModel);
	};
	
	// developer assigns the infoModel function object to the infoUpdate function
	that.info.model = infoModel;
		
	return that;
};

// here is an example of a developer defined controller with the use of a model.
var Content = function() {
		
	var that = controller(); // <-- inherit the base controller class
	
	// developer defines an info function for this userInfo controller
	that.SiteCss = function() {
		
		var fs = require('fs');
		fs.readFile('./Site.css', function (err, data) {
			if (err) throw err;
			that.response.setHeader('Expires', '-1');
			that.response.setHeader('Content-Type', 'css');
			return that.view(data,'');
		});
	};
		
	return that;
};

server.addController(accounts(), "accounts");
server.addController(userInfo(), "userInfo");
server.addController(Content(), "Content");
server.run(8888);
