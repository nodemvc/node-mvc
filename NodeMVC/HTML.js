// HTML helper function
var HTML = (function(spec) {
	var that = {};

	that.label = function(modelArgs, htmlArgs) {
		if (modelArgs.displayName) {
			var label = '<label';
			
			if (htmlArgs.id) {
				label += 'id="' + htmlArgs.id + '">' 
			}
		
			label += modelArgs.displayName + '</label>';
			return label;
		} 
		else {
			throw "Html.label: missing displaying name for model";
		}
	}
	
	that.submitButton = function(modelArgs, htmlArgs) {
		if (modelArgs.displayName) {
			var button = '<input type="submit" value="' + modelArgs.displayName + '"/>';
			return button;
		} 
		else {
			throw "Html.submitButton: missing displaying name for model";
		}
	};
	
	// Supports all attributes from this link: http://www.w3schools.com/tags/tag_textarea.asp
	that.textArea = function(args) {
		
		return '';
	};
	
	that.inputField = function(modelArgs, htmlArgs) {
		if (modelArgs.getValue() && modelArgs.displayName) {
			var input_field = modelArgs.displayName + ' <input type="text" name="' + 
				modelArgs.getValue + '"/>';
				
			return input_field;
		}
		else {
			throw "Html.inputField: Model is missing displayName or 
		}
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
	
	that.test = function() {
		return 'nothing'
	}
	
	return that;
})();

module.exports = HTML;
