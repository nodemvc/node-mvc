// HTML helper function
var HTML = (function(spec) {
	var that = {};
	
	// Returns the following string:
	//		<label id="$modelArgs.propertyName">$modelArgs.displayName</label>
	// Required:
	// 		modelArgs.displayName
	// Optional:
	//		modelArgs.propertyName
	that.label = function(modelArgs, htmlArgs) {
		if (modelArgs.displayName) {
			var label = '<label';
			
			if (modelArgs.propertyName) {
				label += 'id="' + modelArgs.propertyName + '">';
			} 
			else {
				label += '">";
			}
		
			label += modelArgs.displayName + '</label>';
			return label;
		} 
		else {
			throw "Html.label: missing displaying name for model";
		}
	}
	
	// Returns the following string:
	//		<input type="submit" value="$modelArgs.displayName>" />
	// Required:
	// 		modelArgs.displayName
	that.submitButton = function(modelArgs, htmlArgs) {
		if (modelArgs.displayName && modelArgs.propertyName) {
			var button = '<input type="submit" value="' + modelArgs.displayName + '" />';
			return button;
		} 
		else {
			throw "Html.submitButton: missing displayName or propertyName for model";
		}
	};
	
	// Returns the following string:
	//		<textarea rows="$htmlArgs.rows" cols="$htmlArgs.cols" name="modelArgs.propertyName">modelArgs.displayName</textarea>
	// Required:
	// 		modelArgs.displayName
	//		modelArgs.propertyName
	// Optional:
	//		htmlArgs.rows || 4 (defaults to 4 rows)
	//		htmlArgs.cols || 40 (defaults to 40 cols) 
	that.textArea = function(modelArgs, htmlArgs) {
		if (modelArgs.displayName && modelArgs.propertyName) {
			var textArea = '<textarea rows="';
			
			textArea += htmlArgs.rows ? (htmlArgs.rows + '" col="') : '40" col="';
			
			if (htmlArgs.rows) {
				textArea += htmlArgs.rows + '" col="';
			}
			else {
				textArea += '4" col="';
			}
			
			if (htmlArgs.cols) {
				textArea += htmlArgs.cols + '" name="';
			}
			else {
				textArea += '40" name="';
			}
			
			textArea += modelArgs.propertyName + '">' + modelArgs.displayName + '</textarea>';
			return textArea;
		} 
		else {
			throw "Html.textArea: Model is missing displayName or propertName";
		}
	};
	
	// Returns the following string:
	//		<input type="submit" value="$modelArgs.displayName>" for="$modelArgs.propertName"/>
	// Required:
	// 		modelArgs.displayName
	//		modelArgs.propertyName	
	that.inputField = function(modelArgs, htmlArgs) {
		if (modelArgs.propertyName() && modelArgs.displayName) {
			var input_field = modelArgs.displayName + ' <input type="text" name="' + 
				modelArgs.propertyName + '"/>';
				
			return input_field;
		}
		else {
			throw "Html.inputField: Model is missing displayName or propertyName";
		}
	};
	
	return that;
})();

module.exports = HTML;
