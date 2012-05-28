

var parseURL = require('url').parse;

//TODO remove the unnecessary method
var routes = {get:[], post:[], head:[], put:[], delete:[]};

//Map the method, url, controller and action
var map = function(dict){
    if(dict && dict.url && dict.controller){
        var method = dict.method ? dict.method.toLowerCase() : 'get';
        routes[method].push({
            u: dict.url, 
            c: dict.controller,
            a: dict.action || 'defaultAction'
        });
    }
};

//Add special configuration
map({
    method:'get',
    url: '/controller/test',
    controller: 'controller',
    action: 'logon'
});

map({
    method:'get',
    url: '/controller/logonAttempt',
    controller: 'controller',
    action: 'logonAttempt '
});

//TODO have not implemented serveral controller
exports.handleRequest = function(request,response,controllers,SID){
	
    var r = {controller:null, action:null, args:null};
    var method = request.method ? request.method.toLowerCase() : 'get';
	
	//TODO if there is no need to get the argvs, remove it
	var url_parts = parseURL(request.url,true);
	var pathname = url_parts.pathname;
    
	var m_routes = routes[method];
	
	console.log(pathname);
	//Search in the configuration
    for(var i in m_routes){
       if(m_routes[i].u === pathname)
		{
		   // If found
			r.controller = m_routes[i].c;
			r.action = m_routes[i].a;
			r.args = url_parts.query;
			break;
		}
    }
	//If not found in the configuration, then search the controller
	if(r.controller === null)
	{
		var array = pathname.split('/');
		
		if(array.length != 3)
		{
			return null;
		}

		r.controller = array[1];
		r.action = array[2]; 

		if(typeof controllers[r.controller][r.action] != 'function')
		{
			return 0;
		}
	}
	controllers[r.controller].handleRequest(request,response,r.action,SID);
	
};