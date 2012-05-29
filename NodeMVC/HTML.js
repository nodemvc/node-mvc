// HTML helper function
var HTML = (function(spec) {
	var that = {};

	//
	// Supports all required and optional attributes from this link:  http://www.w3schools.com/tags/tag_form.asp
	// Required:
	//	htmlArgs[action]	--> 	action
	// throws exception if a required attribute is missing
	//
	that.beginForm = function(modelArgs, htmlArgs) {
		var formStr = "<form";
		
		// Required attributes
		var action = htmlArgs["action"];
		if (action === null) {
			throw "form tag missing required attribute 'action'";
		}

		formStr = formStr + " action=\'" + action + "\'"; 

		// Optional attributes	
		var accept = htmlArgs["accept"];
		if (accept !== null) {
			formStr = formStr +  " accept=\'" + accept + "\'";
		}
		
		var acceptCharset = htmlArgs["accept-charset"];
		if (acceptCharset !== null) {
			formStr = formStr +  " accept-charset=\'" + acceptCharset + "\'";
		}

		var enctype = htmlArgs["enctype"];
		if (enctype !== null) {
			formStr = formStr +  " enctype=\'" + enctype + "\'";
		}

		var method = htmlArgs["method"];
		if(method !== null) {
			formStr = formStr +  " method=\'" + method + "\'";
		}

		var name = htmlArgs["name"];
		if (name !== null) {
			formStr = formStr +  " name=\'" + name + "\'";
		}

		var target = htmlArgs["target"];
		if(target !== null) {
			formStr = formStr +  " target=\'" + target + "\'";
		}		
		// Standard attributes - not implemented
		formStr = formStr + ">\n";

		return formStr;
	};

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
				label += '">"';
			}

			label += modelArgs.displayName + '</label>';
			return label;
		} 
		else {
			throw "Html.label: missing displaying name for model";
		}
	}
	
	//
	// Required:
	//	modelArgs.propertyName	-> name
	//	modelArgs.getValue()	-> value
	//
	// throws exception if a required attribute(s) is missing
	//
	that.checkBox = function(modelArgs, htmlArgs) {
		var ckbxStr = "<input type=\'" + "checkbox";
		
		// Required attributes
		var name = modelArgs.propertyName;
		if (name === null) {
			throw "checkBox missing required attribute 'name'";
		}
		
		ckbxStr = ckbxStr + " name=\'" + name + "\'";

		var isChecked = modelArgs.getValue() ? "yes" : "no";
		ckbxStr = ckbxStr + " value=\'" + isChecked + "\'" + " checked=\'" + isChecked + "\'" + " />\n";
		return ckbxStr;
	};

	//
	// Required:
	//	modelArgs.propertyName	-> name
	//	modelArgs.getValue()	-> value
	//
	// throws exception if a required attribute(s) is missing
	//
	that.hidden = function(modelArgs, htmlArgs) {
		var htmlStr = "<input type=\'" + "hidden";
		// Required attributes
		var name = modelArgs.propertyName;
		if (name === null) {
			throw "hidden missing required attribute 'name'";
		}
		htmlStr = htmlStr + " name=\'" + name + "\'";
		
		var value = modelArgs.getValue() ? "yes" : "no";
		htmlStr = htmlStr + " value=\'" + value + "\'/>\n";
		return htmlStr;
	};
	
	that.actionLink = function(modelArgs, htmlArgs) {
		// example:  <a href="/Account/LogOn">Log On</a> 
		var action = htmlArgs["action"];
		if (action === null) {
			throw "actionLink tag missing required attribute 'action'";
		}

		var linkDisplayName = htmlArgs["name"];
		if (linkDisplayName === null) {
			throw "actionLink tag missing required attribute 'name'";
		}

		var actionLinkStr = "<a href=\'" + action + "\'" + ">" + linkDisplayName + "</a>" ;
		return actionLinkStr;
	};

	// Returns form end tag
	that.endForm = function(args) {
		return "</form>";
	};
	
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
			var input_field = modelArgs.displayName + 
				' <input type="text" name="' + modelArgs.propertyName + '"/>';
				
			return input_field;
		}
		else {
			throw "Html.inputField: Model is missing displayName or propertyName";
		}
	};
	
	return that;
})();

module.exports = HTML;

