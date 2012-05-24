// NodeMVC model base class

var model = function () {

	var that = {};
	
	// still need state management, which might change this from a function object to something else
	
	// attempts to map the query parameters from the request to the members of the model
	var setParams = function (query) {
		try {
				// for all query params, see if there is a coresponding member, otherwise throw
				// an error back to the controller, so that the controller can notify the server
				for(indx in query) {
					if (this[indx]) { this[indx] = query[indx];}
				}
		} catch (e) {
			// need to define the error message here
			throw e;
		}
	
	};
	
	that.setParameters = setParams;

	return that;

};

module.exports = model;