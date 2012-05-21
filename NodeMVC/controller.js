
// NodeMVC controller module that the developer will use to inherit from.
var controller = function(spec) {
		
	var that = {};
		
	// This is the part that will require the html parser object
	var parserObj = require("./templateParser");
	
	// TODO: Remove the 3 lines below at some point.
	// 'viewfunc' below is just a stub for this unfinished functionality.
	// var viewfunc = function () { return 'final product from the parser ' 
	// + ' is the default.html. This could be a file explains what it do'; };
		
	// this could be what is called if a developer does not define a function
	var defaultFunction = function() {
		//viewData["defaultFunc"] = "";
		return parserObj.render("./example.html");
	};
	
	// the developer returns this object in their defined functions --> return view()
	that.view = function () {
		// there needs to be some way of knowing the name of the function 
		// which called this method. Does javascript have Reflection or something?
		// otherwise, we'll need to require view('nameOfCallingFunction') to let
		// the parsing class know which html file it needs to process and return.
		return parserObj.render("still need to work this out");
	};
	
	that.defaultFunc = defaultFunction;
	return that;
};
	
module.exports = controller;

// and so this is what it would look like when a dev wants to create a controller
//var controllerHello = function(spec) {

	//var that = require('controller');
	//that.hello = function(strName) {
		//viewData["defaultFunc"] = strName;
		//return that.view(); <-- This calls the parser object in the base controller class
	//};
//};
//module.exports = controllerHello; <-- This is a requirement