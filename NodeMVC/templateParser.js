var fs = require('fs');
var HTML = require('./HTML.js');


// The template parser object has one method: 
//
//		render(htmlDocument) 
//
// where htmlDocument is a string representing the name of the HTML document. The method 
// parses the HTML document for special markups <% nameOfObject %>. For each
// markup it finds, it'll replace the markup with the return value of nameOfObject, 
// whatever that may be.
//
// Comments revision 1.1.0:
//
// This regular expression matches the following patterns:
//
//		<% model.property %>
// 		<%= HTML.function( model.object, JSON-object %>
//
// where function is a generic representation of many functions and object is
// is a generic representation of many objects associated with the model.
// 
// model.function must appear exactly that way without any spaces between 
// any of the the characters. This holds true for HTML.function as well.
// model.object can have zero or many spaces in front of it. model.object must
// appear exactly that way without any spaces between the characters. The 
// comma and JSON-object following the model.object are optional elements and
// can span many lines.  For example, the following is a valid markup:
//
//		<%= HTML.textArea( model.object, { "rows":"4",
//										   "cols":"40"} %>
//
// @author Quy
var templateParser = (function () {
	var that = {};

	// Parses html document for special markups and grabs those markups requested via 
	// accessing the html document. The render function assumes that there is only one 
	// model for each view template.
	that.render = function(action, model, viewData) {		

		// If you want to run the runParserExample.html to test the templateParser and the
		// HTML helper functions, uncomment the viewData and model defintions.
		//
		//var viewData = {
		//	'hello':function() { return '<b>Hello, World!</b>'; },
		//	'jello':function() { return ' This is an Obvious Simulation'; },
		//	'insertScript':function() { return 'fake script/n'; }
		//}
		//
		//var model = {};
		//model.label = {};
		//model.label.propertyName = 'stuff';
		//model.label.displayName = 'Stuff I say';
		//model.form = {};
		//model.inputField={};
		//model.inputField.displayName = "stuff i say";
		//model.inputField.propertyName = "stuff";
		
		
		var debug_on = null;

		try {
			console.log('TemplateParser: Reading ' + action);
			

			var content = fs.readFileSync(action, 'ascii');
			var newHTMLContent = content;
						
			// This regular expression matches the following patterns:
			//
			//		<% model.property %>
			// 		<%= HTML.function( model.object, JSON-object %>
			//
			// where function is a generic representation of many functions and object is
			// is a generic representation of many objects associated with the model.
			// 
			// model.function must appear exactly that way without any spaces between 
			// any of the the characters. This holds true for HTML.function as well.
			// model.object can have zero or many spaces in front of it. model.object must
			// appear exactly that way without any spaces between the characters. The 
			// comma and JSON-object following the model.object are optional elements and
			// can span many lines.  For example, the following is a valid markup:
			//
			//		<%= HTML.textArea( model.object, { "rows":"4",
			//										   "cols":"40"} %>
			//
			var pattern = /<%(=*)\s*([\w_]*)\.*([\w_]*)\s*\(*\s*([\w_]*)\.*([\w_]*)\s*,*\s*({*[\w\s:\"\,]*}*)\s*\)*\s*%>/g
	
			var result = pattern.exec(content);
			if (result) {
				var HTML_HELPER_INDICATOR_INDEX = 1;
				do {
					// if the markup is <%= .+ %>, the markup is calling an HTML helper function
					if (result[HTML_HELPER_INDICATOR_INDEX] === '=') {
						var HTML_HELPER_SYNTAX_ERROR = "TemplateParser: HTML helper function syntax error.";
						var HELPER_FUNCTION_NAME = 3;
						// We're assuming that there is only one model for each view template.
						// Putting the index here in case we ever need to use it.
						var MODEL_NAME = 4;
						var MODEL_PROPERTY = 5;
						var OPTIONAL_JSON_INPUT = 6;
						
						var helperFunctionName = null;
						if (result[HELPER_FUNCTION_NAME]) {
							helperFunctionName = result[HELPER_FUNCTION_NAME];
						} 
						else {
							throw HTML_HELPER_SYNTAX_ERROR;
						}
						
						
						var modelProperty = null;
						// Will not throw an error if there isn't a model property. This is due to the fact that some functions
						// may not need or use a model.object argument such as HTML.endForm()
						if (result[MODEL_PROPERTY]) {
							modelProperty = result[MODEL_PROPERTY];
						}
						
						var jsonObject = {};
						if (result[OPTIONAL_JSON_INPUT]) {
							console.log('converting to JSON: ' + result[OPTIONAL_JSON_INPUT]);
							jsonObject = JSON.parse(result[OPTIONAL_JSON_INPUT]);
						}
						jsonObject.action = action ;
						
						var htmlHelperReturnValue = null;
						
						if (modelProperty) {
							htmlHelperReturnValue = HTML[helperFunctionName]( model[modelProperty], jsonObject ); 
						}
						else {
							// if a user doesn't define a model.object, then let the function throw the 
							// appropriate error.
							htmlHelperReturnValue = HTML[helperFunctionName]( null, jsonObject ); 
						}
						newHTMLContent = newHTMLContent.replace(result[0], htmlHelperReturnValue); 
						
						console.log("replacing: " + result[0])
						console.log("with: " + htmlHelperReturnValue);												
					}
					else {
						var MODEL_NAME_INDEX = 2;
						var MODEL_PROPERTY_INDEX = 3;
						
						var viewDataKey = null;
						//console.log(result);
						//console.log(result[MODEL_NAME_INDEX]);
						//console.log(viewData[result[MODEL_NAME_INDEX]]());
						
						if (result[MODEL_NAME_INDEX]) { 
							viewDataKey = result[MODEL_NAME_INDEX];
						}
						else {
							throw "TemplateParser: Incorrect viewData markup"; 
						}
						
						if (result[MODEL_PROPERTY_INDEX]) {
							viewDataKey += '.' + result[MODEL_PROPERTY_INDEX];
						}
						
						var viewDataReturnValue = viewData[viewDataKey]();
						newHTMLContent = newHTMLContent.replace(result[0], viewDataReturnValue);
						
						console.log("replacing: " + result[0])
						console.log("with: " + viewDataReturnValue);						
					}	
					result = pattern.exec(content);			
				} while (result)
			}
			
			console.log("template:\n" + content);
			console.log("\nnew HTML:\n" + newHTMLContent);
			return newHTMLContent;
		}
		catch (err) {
			
			console.log("Error Parsing HTML template:\n" + err);
			// logs error and throws error back to the controller
			//throw err;
			return "Error Parsing HTML template:\n" ;
		}
	}
	return that;
})();

module.exports = templateParser;