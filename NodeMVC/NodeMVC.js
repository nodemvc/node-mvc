// This starts the server and allows us to wire the other modules together

var controller = require("./controller")();
var server = require("./server");
var model = require("./model");

var viewData = {};
viewData["/"] = model.runWorker;
viewData["/runWorker"] = model.runWorker;
viewData["/runWorkerAsync"] = model.runWorkerAsync;

server.run(controller, viewData, 8888);