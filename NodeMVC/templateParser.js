var fs = require('fs');
var HTML = require('./HTML.js');

//var viewData = {
//	'hello':function() { return '<b>Hello, World!</b>'; },
//	'jello':function() { return ' This is an Obvious Simulation'; }
//}

// The template parser object has one method: 
//
//		render(htmlDocument) 
//
// where htmlDocument is a string representing the name of the HTML document. The method 
// parses the HTML document for special markups <% nameOfObject %>. For each
// markup it finds, it'll replace the markup with the return value of nameOfObject, 
// whatever that may be.
var templateParser = (function () {
	var that = {};

	// Parses html document for special markups and grabs those markups requested via 
	// accessing the html document. The render function assumes that there is only one 
	// model for each view template.
	that.render = function(htmlFileName, model, viewData) {		
		try {
			var content = fs.readFileSync(htmlFileName, 'ascii');
			var newHTMLContent = content;
			
			// The regular expression matches the pattern "<% (any alphanumeric 
			// and underscore character one or more times) %>".
			// This regular expression stores whatever pattern is matched inside the 
			// parenthesis in the result object that is returned when the regular 
			// expression is executed on a string. The result 
			// object has the following properties:
			// 		0: contains the matched string
			//		1: contains whatever is matched inside the parentheses
			//		input: the input line
			//		index: index of the matched string in the original input string
			var parse_line = /<%\s*([a-z0-9_\.]+)\s*%>/gi;
			
			// The regular expression parses for <%= HTML.functionName( JSON-Notation ) %>.
			// JSON notation can span several lines and include tabs and spaces. 
			var parse_html_helper = /<%=\s*HTML\.([\w]+)\(\s*([{\s}\n\t\w:\"\,]*)\s*\)\s*%>/g 

			// 			
			var isJSON = /\s*{[\w\s:\"\,]+}\s*/
			
			var result = parse_line.exec(content);
			if (result) {
				do {
					console.log("replacing: " + result[0])
					console.log("with     : " + viewData[result[1]]() + '\n');
					newHTMLContent = newHTMLContent.replace(result[0], viewData[result[1]]());
					result = parse_line.exec(content);
				} while (result);
			}
			
			result = parse_html_helper.exec(content);		
			if (result) {
				do {
					console.log("found: \n" + result + '\n');				
					var htmlHelperFuncName = result[1];
					
					var htmlHelperFuncArguments = null;
					if (result[2]) {
						console.log("HTML: Found args");
						var isJSONresult = isJSON.exec(result[2]);
						if (isJSONresult) {
							console.log("Args: is JSON"); 
							htmlHelperFuncArguments = JSON.parse(result[2]);
						} 
						else {
							console.log("Args: regular obj");
							htmlHelperFuncArguments = model;
						}
					}
					
					// arguments can be null. this is for HTML.functions that take no arguments
					var htmlHelperFuncReturn = HTML[htmlHelperFuncName](htmlHelperFuncArguments);
					newHTMLContent = newHTMLContent.replace(result[0], htmlHelperFuncReturn);
					
					result = parse_html_helper.exec(content);
				} while(result)
			}
			
			console.log("template:\n" + content);
			console.log("\nnew HTML:\n" + newHTMLContent);
			return newHTMLContent;
		}
		catch (err) {
			console.log("Error Parsing HTML template:\n" + err);
			// logs error and throws error back to the controller
			throw err;
		}
	}
	return that;
})();

module.exports = templateParser;