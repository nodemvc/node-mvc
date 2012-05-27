// NodeMVC model base class

var model = function (spec) {
	
	var that = {};
	
	// expecting 'url.parse(request.url, true).query' url
	var bindModel = function (query) {
		for(indx in query) {
			if (that.hasOwnProperty(indx) && typeof that[indx].setValue === "function") { 
				that[indx].setValue(query[indx]); 
			} else {
				throw new Error(indx + " could not be mapped to a member of the model");
			}
		}
	};
	
	// model property is used to represent data in the model
	var mProperty = function(displayName, required, dataType) {
		var that = {};
		that.prop = "";
		// specifies the display name for the property
		that.displayName = displayName;
		// specifies that a data field value is required
		that.required = required;
		// specifies the name of an additional type to associate with a data field
		that.dataType = dataType;
	
		that.getValue = function() {
			return that.value;
		};
		
		that.setValue = function(val) {
			that.value = val;
		};
		
		return that;
	};
	that.mProperty = mProperty;
	that.bindModel = bindModel;
	return that;
};

module.exports = model;