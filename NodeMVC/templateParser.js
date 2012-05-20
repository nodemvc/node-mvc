var fs = require('fs');

var viewData = {
	'hello':'<b>Hello, World!</b>\n',
	'jello':' This is an Obvious Simulation \n'
}

// Template Parser assumes that it has viewData in scope
var templateParser = (

function  () {
	var that = {};
	
	var helper = function() {
	
	}
	
	that.render = function(htmlFileName) {
		try {
			var content = fs.readFileSync(htmlFileName, 'ascii');
			var newContent = "";	
			var lines = content.split('\n');;
			
			// <% myObject %>
			var i;
			
			// used global because there could be more than one special tag on one line
			var parse_line = /<%\s*([a-z0-9_]+)\s*%>/gi;
			for( i = 0; i < lines.length - 1; i += 1) {
				var result = parse_line.exec(lines[i]);
				if (result) {
					var matchedString = result[1];
					
					var newLine = viewData[matchedString];
					newContent += newLine;
				} 
				else {
					newContent += lines[i] + '\n';
				}
			}
			
			console.log(content);
			console.log(newContent); 
			return newContent;
		}
		catch (err) {
			console.log(err + ': File not found');
			return 'File Not Found';
		}
	}
	
	
	return that;
}

)();

module.exports = templateParser;