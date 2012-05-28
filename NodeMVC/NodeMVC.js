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
		that.addProperty("fname", {displayName: "First Name", required: true});
		that.addProperty("lname", {displayName: "Last Name", required: true});
		that.addProperty("password", {displayName: "Password", required: true, dataType: "password"});
		return that;
	};
		
	// developer defines a logon function for this account controller
	that.logon = function() {
		return that.view();
	};
		
	// developer defines a logon attempt function for this account controller
	that.logonAttempt = function(accountModel) {
		// logic to validate the user would go here  
		console.log("validating " + accountModel.fname.getValue() + ', ' + accountModel.lname.getValue());
		return that.view();
	};
		
	// developer assigns the accountModel function object to the logonAttempt function
	that.logonAttempt.model = accountModel;
	return that;
};

server.addController(accounts(), "accounts");
server.run(8888);
