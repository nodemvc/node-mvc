// HTML helper function
var HTML = function(spec) {
	var that = {};
	
	// function returning a string for the Label
	that.label = function(target, label) {
		return "<label for=\'" + target + "\'>" + label + "</label>"
	};
	
	return that;
}

exports.HTML = HTML;