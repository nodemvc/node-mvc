// ******************************************************
//  Rochelle Palting
//  CPSC 593 Web Application Development, Assignment 1
//  April 12, 2012
// ******************************************************

// instantiate existing modules
var http = require("http");
var url = require("url");
var fs = require("fs");
var path = require("path");
var crypto = require("crypto"); // for cache control
var net = require('net');

// mappying of resource extension to content type/subtype
var contentTypeMap = {
    txt : "text/plain", html : "text/html" , css : "text/css" , js : "text/javascript" ,
    jpg : "image/jpeg", png : "image/png", gif : "image/gif", xml : "text/xml"};

// log to Common Log Format
var logToCommonLogFormat = function(request, response) {
    var clientIp = request.connection.remoteAddress;    // IP address of client/remote host
    var clientRfcId = '-';                              // RFC 1413 identifity of the client; undefined
    var clientId = '-';                                 // userid of person requesting the document; undefined since no authorization supported
    var respTime = '[' + new Date().toUTCString() + ']' // date, time, and timezone when server finished processing the request
    var reqLine = '"' + request.method + ' ' + request.url + ' HTTP/' + request.httpVersion + '"';   // request line
    var respCode = response.statusCode;                 // HTTP status code
    var respSize = '-'                                  // response size; TODO:  how to set this?  download file and then get size?
    
    var logEntry = clientIp + ' ' + clientRfcId + ' ' + clientId + ' ' + respTime + ' ' + reqLine + ' ' + respCode + ' ' + respSize;
    console.log(logEntry);
};

// processes a resource request and updates response as necessary
var serveResource = function(request, response, writeDataFlag) {
    var pathname = url.parse( request.url ).pathname.substring(1);  // remove prefix "/"    
    var head = {"Content-Type": "text/plain"};
    console.log("Request for " + pathname + " received.");  
    
    // cookie - set and maintain a session-id if the client supports cookies
    var cookie = request.headers['cookie'];
    var SID = cookie;    // session id
    if(cookie == undefined) {
        SID = "SID=" + crypto.createHash('md5').update((new Date()).toLocaleTimeString()).digest('hex');
    }
    head["Set-Cookie"] = SID;    
    console.log("SID=" + SID);       
    
    // check if resource exists
    var exists;
    path.exists(pathname, function (exists) {
        if(!exists) {
            response.writeHead(404, head);
            response.write("404 Error:  Resource Not Found - The server cannot find the resource " + pathname);
            response.end();
            logToCommonLogFormat(request, response);
        } else {  
            console.log("Resource found for " + pathname);
            // read resource
            var err;
            var respData;
            fs.readFile(pathname, function (err, respData) {
                if(err) {
                    response.writeHead(500, head);
                    response.write("500 Error:  Server failed to read resource " + pathname);
                    response.end();
                    logToCommonLogFormat(request, response);
                } else {                            
                    var fsErr, stats;
                    fs.stat(pathname, function (fsErr, stats) {
                        if(fsErr) {
                            response.writeHead(500, head);
                            response.write("500 Error:  Unable to read statistics for resource " + pathname);
                            response.end();
                            logToCommonLogFormat(request, response);
                        } else {
                            var httpVersion = request.httpVersion;

                            // cache control
                            var resourceNew = true;
                            var resourceNewerThanLastModDate = true;
                            var lastModDate = stats.mtime;
                            var modSinceDate = request.headers['if-modified-since'];
                            // check for If-Modified-Since conditional first (for HTTP/1.0 and HTTP/1.1)
                            if(modSinceDate != undefined) {
                                modSinceDate = new Date(modSinceDate);
                                console.log("httpVersion=" + httpVersion + ", modSince=" + modSinceDate.getTime() + ",lastMod=" + lastModDate.getTime());
                                resourceNewerThanLastModDate = (modSinceDate.getTime() < lastModDate.getTime());
                                resourceNew = resourceNewerThanLastModDate;
                            } else {
                                console.log("httpVersion=" + httpVersion + ", modSince=undefined" + ",lastMod=" + lastModDate.getTime());
                            }
                            head["Last-Modified"] = lastModDate;
                            
                            // if HTTP/1.1, also check for ETag If-None-Match conditional
                            var resourceNewerThanIfNoneMatch = true;
                            if(httpVersion == "1.1") {
                                var ifNoneMatch = request.headers['if-none-match'];
                                var etag = crypto.createHash('md5').update(respData).digest('hex');
                                if(ifNoneMatch != undefined) { 
                                    console.log("etag=" + etag + ", ifNoneMatch=" + ifNoneMatch);
                                    resourceNewerThanIfNoneMatch = (etag != ifNoneMatch)
                                }
                                console.log("httpVersion=1.1, " + "ifNoneMatch=" + ifNoneMatch + ", etag=" + etag);
                                // resource can only be declared unmodified if both lastModDate is before/less than the ifModSince date AND
                                // etag != ifNoneMatch
                                resourceNew = ( ((modSinceDate != undefined) && resourceNewerThanLastModDate) || resourceNewerThanIfNoneMatch );
                                head["ETag"] = etag;
                            }
                            
                            // chunked transfer encoding - ONLY for HTTP/1.1
                            if(httpVersion == 1.1) {
                                head["Transfer-Encoding"] = "chunked";
                            } else {
                                head["Content-Length"] = respData.length;
                            }
                            
                            // content type
                            var ext = path.extname(pathname).substring(1).toLowerCase();
                            head["ContentType"] = contentTypeMap[ext];
                            
                            // complete response
                            if(!resourceNew) {
                                console.log("Content not modified");
                                response.writeHead(304, head);
                                response.end();
                                logToCommonLogFormat(request, response);
                            } else {
                                if(writeDataFlag)
                                    response.write(respData);
                                response.writeHead(200, head);
                                response.end();
                                logToCommonLogFormat(request, response);
                            }
                        } // end else (successful fs.stat)
                    }); // end fs.stat()                 
                } // end else (successful fs.readFile)                                               
            }); // end fs.readFile()
        } // end else (path exists)
    }); // end path.exists()
}

// creates server and handles request
http.createServer(function(request, response) {                                    
    // for now, just handle GET and HEAD requests
    var method = request.method;
    switch(method) {
        case "GET":
            console.info("Handling GET");
            serveResource(request, response, true);
            break;
        case "HEAD":
            console.info("Handling HEAD");
            serveResource(request, response, false);
            break;    
        default:
            console.info("Unhandled method: " + method); 
            response.writeHeader(501, {"Content-Type":"text/plain"});
            response.end();
            logToCommonLogFormat(request, response);
    }
}).listen(8000);

console.log('Server running at http://localhost:8000/');