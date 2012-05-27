// HTML helper function
var HTML = (function(spec) {
	var that = {};
	
	var standardAttribute = {
		
	};
	
	// function returning a string for the Label
	that.label = function(args) {
		return "<label for=\"" + args.target + "\">" + args.label + "</label>"
	};
	
	that.submitButton = function(args) {
		return '<input type="submit" value="' + args.buttonName + '"/>';
	};
	
	// Supports all attributes from this link: http://www.w3schools.com/tags/tag_textarea.asp
	that.textArea = function(args) {
		//TODO:
		return '';
	};
	
	that.textBox = function(args) {
		var action = args.action || '';
		var txtAreaName = args.areaName;
		var txtBoxCol = args.col || '40';
		var rowsEnabled = args.rows || 'Y';
		var initialTxt = args.text || '';
		//var inputType = args.inputType;
		var buttonName = args.buttonName || 'Submit';
				
		return '<form method=\"post\" action=\"' + action +'\">\n' +
			'<textarea name=\"' + txtAreaName + '\" cols=\"' + txtBoxCol + '\" rows=\"' + rowsEnabled + '\">\n' +
			initialTxt + '\n' +
			'</textarea><br>\n' +

			that.submitButton(buttonName) + 
			'</form>\n';
	};
	
	return that;
})();

module.exports = HTML;