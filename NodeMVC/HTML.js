// HTML helper function
var HTML = (function(spec) {
	var that = {};
	var standAttribute = {
		accesskey:"accesskey=",
		class:"class=",
		dir:"dir=",
		id:"id=",
		lang:"lang=",
		style:"style=",
		tabindex:"tabindex=",
		title:"title=",
		xmllang:"xml:lang="
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

	that.label = function(args) {
		return "<label for=\"" + args.target + "\">" + args.label + "</label>";
	};
	
	that.submitButton = function(args) {
		return '<input type="submit" value="' + args.buttonName + '"/>';
	};
	
	// Supports all attributes from this link: http://www.w3schools.com/tags/tag_textarea.asp
	that.textArea = function(args) {
		
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
	
	that.test = function() {
		return 'nothing'
	}
	
	return that;
})();

module.exports = HTML;
