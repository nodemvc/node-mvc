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
	
	// adds a property by the name specified as the first argument
	var addProperty = function() {
		
		// the propertyName string is what is expected as the first parameter
		if (arguments.length === 0 || typeof arguments[0] !== "string") {
			throw new Error("addProperty: Must define a propertyName string");
		}
		
		var value = null;
		
		// add the property to the model and assign it an object
		that[arguments[0]] = {};
		
		// property attributes are defined as the second parameter
		// common attributes include; displayName, required, dataType
		// these attributes can be used by the html helpers in the view 
		if ( arguments.length > 1 ) {
			that[arguments[0]] = arguments[1];
		}
		
		// give the property a propertyName property
		// the property object needs to know its own name
		that[arguments[0]].propertyName = arguments[0];
		
		// accessor for property value
		that[arguments[0]].getValue = function() {
			return value;
		};
		
		// getter for property value
		that[arguments[0]].setValue = function(val) {
			value = val;
		};
	};
	
	that.addProperty = addProperty;
	that.bindModel = bindModel;
	return that;
};

module.exports = model;