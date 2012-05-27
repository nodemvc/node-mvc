// HTML helper function
var HTML = (function(spec) {
	var that = {};
	
	// function returning a string for the Label
	that.label = function(args) {
		return "<label for=\"" + args.target + "\">" + args.label + "</label>"
	};
	
	that.textBox = function(action, txtAreaName, txtBoxCol, rowsEnabled, initialTxt, inputType, inputValue) {
		action = action || '';
		txtBoxCol = txtBoxCol || '40';
		rowsEnabled = rowsEnabled || 'Y';
		initialTxt = initialTxt || '';
		//inputType
		inputValue = inputValue || 'Submit';
				
		return '<form method=\"post\" action=\"' + action +'\">\n' +
			'<textarea name=\"' + txtAreaName + '\" cols=\"' + txtBoxCol + '\" rows=\"' + rowsEnabled + '\">\n' +
			initialTxt + '\n' +
			'</textarea><br>\n' +
			'<input type=\"' + inputType + '\" value=\"' + inputValue + '\" />\n' +
			'</form>\n';
	};
	
	
	return that;
})();

module.exports = HTML;