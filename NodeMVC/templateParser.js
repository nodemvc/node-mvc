var fs = require('fs');

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
	// accessing the html document.
	that.render = function(htmlFileName) {
		try {
			var content = fs.readFileSync(htmlFileName, 'ascii');
			var newHTMLContent = "";	
			var lines = content.split('\n');;
			
			// Regular expression matching the pattern <% (pattern) %>.
			// This regular expression stores whatever pattern is matched inside the 
			// parenthesis is in the result variable inside the for loop. The result 
			// object has the following properties:
			// 		0: matched string
			//		1: whatever is matched inside the parentheses
			//		input: the input line
			//		index: index of the matched string
			var parse_line = /<%\s*([a-z0-9_]+)\s*%>/gi;
			var i;
			for(i = 0; i < lines.length - 1; i += 1) {
				var result = parse_line.exec(lines[i]);
				
				// Because of the global modifier on the regular expression, the regular
				// expression will return a new match on the same string each time it is
				// executed until there aren't anymore matches at which point it'll 
				// return a falsy value.
				if (result) {
					var line = lines[i];
					do {
						line = line.replace(result[0], viewData[result[1]]());
						result = parse_line.exec(lines[i]);
					} while (result);
					newHTMLContent += line + '\n';
				} 
				else {
					newHTMLContent += lines[i] + '\n';
				}
			}
			console.log(newHTMLContent);
			return newHTMLContent;
		}
		catch (err) {
			console.log(err);
			return err;
		}
	}
	return that;
})();

module.exports = templateParser;