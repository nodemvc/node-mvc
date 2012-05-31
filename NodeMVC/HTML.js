// HTML helper function
var HTML = (function(spec) {
	var that = {};
	
	that.beginFieldSet = function(modelArgs, htmlArgs) {
		return '<fieldset>';	
	};
	
	that.endFieldSet = function(modelArgs, htmlArgs) {
		return '</fieldset>';	
	};

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
		console.log('form action = "' + action + '"');
		if (!action) {
			throw "form tag missing required attribute 'action'";
		}

		formStr = formStr + " action=\'" + action + "\'"; 

		// Optional attributes	
		var accept = htmlArgs["accept"];
		if (accept) {
			formStr = formStr +  " accept=\'" + accept + "\'";
		}
		
		var acceptCharset = htmlArgs["accept-charset"];
		if (acceptCharset) {
			formStr = formStr +  " accept-charset=\'" + acceptCharset + "\'";
		}

		var enctype = htmlArgs["enctype"];
		if (enctype) {
			formStr = formStr +  " enctype=\'" + enctype + "\'";
		}

		var method = htmlArgs["method"];
		if(method) {
			formStr = formStr +  " method=\'" + method + "\'";
		}

		var name = htmlArgs["name"];
		if (name) {
			formStr = formStr +  " name=\'" + name + "\'";
		}

		var target = htmlArgs["target"];
		if(target) {
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
				label += ' for="' + modelArgs.propertyName + '" id="' + modelArgs.propertyName + '">';
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
		var ckbxStr = "<input type='checkbox'";
		
		// Required attributes
		console.log('1');
		var name = modelArgs.propertyName;
		if (name === null) {
			throw "checkBox missing required attribute 'name'";
		}
		console.log('2');
		ckbxStr = ckbxStr + " name=\'" + name + "\'";
console.log('3');
		var isChecked = modelArgs.getValue() ? "yes" : "no";
		console.log('4');
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
	that.endForm = function(modelArgs, htmlArgs) {
		return "</form>";
	};
	
	// Returns the following string:
	//		<input type="submit" value="Submit"> />
	// Required:
	// 		None
	that.submitButton = function(modelArgs, htmlArgs) {
		var button = '<input type="submit" value="Submit" />';
		return button;
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
	//		<input type="submit" value="$modelArgs.displayName>" for="$modelArgsds.propertName"/>
	// Required:
	// 		modelArgs.displayName
	//		modelArgs.propertyName
	// Optional:
	//		modelArgs.getValue() -- Displays getValue() in the input field	
	that.inputField = function(modelArgs, htmlArgs) {
		if (modelArgs.propertyName && modelArgs.displayName) {
			var input_field = '<input name="' + modelArgs.propertyName + '" id="' + modelArgs.propertyName + '" ';
			
			if (modelArgs.getValue()) {
				input_field += 'value="' + modelArgs.getValue() + '" ';
			}
			
			if (htmlArgs.type) {
				input_field += 'type="' + htmlArgs.type + '" ';
			}
			
			input_field += '/>';
			
			return input_field;
		}
		else {
			throw "Html.inputField: Model is missing displayName or propertyName";
		}
	};
	
	return that;
})();

module.exports = HTML;

