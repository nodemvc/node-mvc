var HTML = function(spec) {
	var that = {};
	
	// function returning a string for the Label
	that.label = function(target, label) {
		return "<label for=\'" + target + "\'>" + label + "</label>";
	};
	
	//
	// Supports all required and optional attributes from this link:  http://www.w3schools.com/tags/tag_form.asp
	// Required:
	//	htmlArgs[action]	--> 	action
	// throws exception if a required attribute is missing
	//
	that.beginForm(modelArgs, htmlArgs) {
		var formStr = "<form";
		
		// Required attributes
		var action = htmlArgs.action;
		if (action === null) {
			throw "form tag missing required attribute 'action'";
		}
		formStr = formStr + " action=\'" + action + "\'"; 

		// Optional attributes	
		var accept = htmlArgs.accept;
		if (accept !== null) {
			formStr = formStr +  " accept=\'" + accept + "\'";
		}
		var accept-charset = htmlArgs.accept-charset;
		if (accept-charset !== null) {
			formStr = formStr +  " accept-charset=\'" + accept-charset + "\'";
		}
		var enctype = htmlArgs.enctype;
		if (enctype !== null) {
			formStr = formStr +  " enctype=\'" + enctype + "\'";
		}
		var method = htmlArgs.method;
		if(method !== null) {
			formStr = formStr +  " method=\'" + method + "\'";
		}
		var name = htmlArgs.name;
		if (name !== null) {
			formStr = formStr +  " name=\'" + name + "\'";
		}
		var target = htmlArgs.target;
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
	//	modelArgs.displayName	-> value
	//
	// throws exception if a required attribute(s) is missing
	//
	that.checkBox(modelArgs, htmlArgs) {
		var ckbxStr = "<input type=\'" + "checkbox";
		// Required attributes
		var name = modelArgs.propertyName;
		if (name === null) {
			throw "checkBox tag missing required attribute 'name'";
		}
		ckbxStr = ckbxStr + " name=\'" + name + "\'";
		
		var value = modelArgs.displayName;	// TODO (RCP) I'm not sure if this is the correct field to use
		if (value === null) {
			throw "checkBox tag missing required attribute 'value'";
		}
		ckbxStr = ckbxStr + " value=\'" + value + "\'";
		
		// Optional attributes
		var checked = modelArgs.getValue();
		if (checked !== null) {
			var isChecked = checked ? "yes" : "no";
			ckbxStr = ckbxStr + " checked=\'" + isChecked + "\'";
		}
		
		ckbxStr = ckbxStr + " />";
		return ckbxStr;
	};

	that.actionLink(modelArgs, htmlArgs) {
		// example:  <a href="/Account/LogOn">Log On</a> 
		var action = htmlArgs.action;
		if (action === null) {
			throw "actionLink tag missing required attribute 'action'";
		}
		
		var linkDisplayName = htmlArgs.name;
		if (linkDisplayName === null) {
			throw "actionLink tag missing required attribute 'name'";
		}

		var actionLinkStr = "<a href=\'" + action + "\'" + ">" + linkDisplayName + "</a>" ;
		return actionLinkStr;
	}
	
	
	that.dropDownList(args) {
		//TODO:
	};

	// Returns form end tag
	that.endForm(args) {
		return "</form>";
	};
	
	return that;
}

exports.HTML = HTML;