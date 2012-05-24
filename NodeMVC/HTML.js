var HTML = function(spec) {
	var that = {};
	
	that.Label = function(target, label) {
		return "<label for=\'" + target + "\'>" + label + "</label>"
	};
	
	return that;
}

exports.HTML = HTML;