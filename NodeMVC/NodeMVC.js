// This starts the server and allows us to wire the other modules together

var controller = require("./controller")();
var server = require("./server");
var model = require("./model");

server.run(controller, 8888);