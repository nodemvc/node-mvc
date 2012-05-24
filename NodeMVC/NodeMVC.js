// This starts the server and allows us to wire the other modules together

var controller = require("./controller");
var server = require("./server");
var model = require("./model");

// here is an example of a developer defined controller with the use of a model.
var accounts = function() {
		
	var that = controller(); // <-- inherit the base controller class
		
	// developer defines an account model object 
	var accountModel = function() {
		var that = model(); // <-- inherit the base model class
		that.fname = "";
		that.lname = "";
		that.password = "";
		return that;
	};
		
	// developer defines a logon function for this account controller
	that.logon = function() {
		return that.view();
	};
		
	// developer defines a logon attempt function for this account controller
	that.logonAttempt = function(accountModel) {
		// logic to validate the user would go here  
		console.log("validating " + accountModel.firstName + ', ' + accountModel.lastName)
		return that.view();
	};
		
	// developer assigns the accountModel function object to the logonAttempt function
	that.logonAttempt.model = accountModel;
	return that;
};

server.run(accounts(), 8888);