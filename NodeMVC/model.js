// NodeMVC model base class

var model = function () {

	var that = {};
	
	// still need state management, which might change this from a function object to something else
	
	// attempts to map the query parameters from the request to the members of the model
	var setParams = function (query) {
		
		// for all query params, see if there is a coresponding member, otherwise throw
		// an error back to the controller, so that the controller can notify the server
		for(indx in query) {
			if (that.hasOwnProperty(indx)) { 
				that[indx] = query[indx];
			} else {
				throw new Error(indx + " could not be mapped to a member of the model");
			}
		}
	};
	
	that.setParameters = setParams;
	return that;
};

module.exports = model;