
process.on('message', function(m) {
  var theGlobalPyramid = demonstrateFunctionalInheritance(16, 20);
  process.send({returnValue: 'this is the return value of the model worker function'});  
});

function demonstrateFunctionalInheritance(depth, tSize) {
	depth = 16;
	tSize = 20;
	var coords = [];
	var point = function (spec) { // <-- A point has x and y coordinates, expecting { x:0, y:0 }
		var that = {}; 
		that.x = function () { return spec.x; }; // <-- returns x coordinate
		that.y = function () { return spec.y; }; // <-- returns y coordinate
		that.set_x = function (x) { spec.x = x; };
		that.set_y = function (y) { spec.y = y; };
		return that;
	};
	
	var object = function (spec) { // <-- An object has points, expecting {points:[]}
		var that = {}; 
		that.get_pnt = function (index) { return spec.points[index]; };
		that.set_pnt = function (index, x, y) { 
			spec.points[index].set_x(x);
			spec.points[index].set_y(y);
		};
		return that;
	};
	
	var triangle = function(spec) { // <-- A triangle is an object that has and expects 3 points
		//for (var i = 0; i < 3; i++) {
			//spec.points[i] = typeof spec.points[i] !== 'object' ? point({x:0,y:0}) : spec.points[i];
		//}
		spec.points = spec.points;
		var that = object(spec);
		that.val = 0;
		
		that.leftObj = null;
		that.rightObj = null;
		that.red = new Number(Math.random() * 255).toFixed(0);
		that.green = new Number(Math.random() * 255).toFixed(0);
		that.blue = new Number(Math.random() * 255).toFixed(0);
		that.topPnt = function () { return spec.points[0]; };
		that.leftPnt = function () { return spec.points[1]; };
		that.rightPnt = function () { return spec.points[2]; };
		that.set_value = function (val) { spec.val = val; }; //alert(val + ' ' + that.leftPnt().x() + ' ' + that.rightPnt().x() );};
		that.left = function (obj) { that.leftObj = obj; };
		that.right = function (obj) { that.rightObj = obj; };
		that.get_left = function () { return that.leftObj; };
		that.get_right = function () { return that.rightObj; };
		that.get_value = function () { return spec.val; };
		that.setCoords = function () {
		//alert(spec.points[0].x() + ' ' + spec.points[0].y());
		//alert(spec.points[1].x() + ' ' + spec.points[1].y());
		//alert(spec.points[2].x() + ' ' + spec.points[2].y());
		for (var tx = spec.points[1].x(); tx < spec.points[2].x(); tx++){
		for (var ty = spec.points[0].y(); ty < spec.points[2].y(); ty++){
			coords[tx][ty] = spec.val;
			//alert(tx + ' ' + ty);
		}
		}
				
			//coords[spec.points[0].x()][spec.points[0].y()] = spec.val;
			//coords[spec.points[1].x()][spec.points[1].y()] = spec.val;
			//coords[spec.points[2].x()][spec.points[2].y()] = spec.val;
		};
		that.r = function () { return that.red; };
		that.g = function () { return that.green; };
		that.b = function () { return that.blue; };
		return that;
	};
	
	var pyramid = function(depth, headTriangle) { // <-- A pyramid is a triangle and has triangles
		var that = triangle({points:[point({x: headTriangle.topPnt().x(), y: headTriangle.topPnt().y()})
		,point({x: headTriangle.leftPnt().x(), y: headTriangle.leftPnt().y( )})
		,point({x: headTriangle.rightPnt().x( ), y: headTriangle.rightPnt().y()})]});
		
		var vert = 0;
		var hori = 0;
		var scalePyramid = function () {
			vert = that.leftPnt().y() - that.topPnt().y(); // <-- the length from top to bottom
			hori = (that.rightPnt().x() - that.leftPnt().x()) / 2; // <-- the length of the bottom / 2
		};
		
		scalePyramid();
		
		// buildPyramid recursively builds the pyramid like a balanced - binary search tree
		var buildPyramid = function(depth, nodeCount, parTopPnt, parLeftPnt, parRightPnt) {
			
			if (depth < 1) return null;
			// build a new triangle head node
			var newHd = triangle({points: [parTopPnt, parLeftPnt, parRightPnt]});
			//newHd.set_value(nodeCount);
			//newHd.setCoords();
			
			newHd.left(buildPyramid(depth - 1, (nodeCount * 2)
			,point({x: parTopPnt.x() - (hori + 1), y: parTopPnt.y() + (vert + 1)})
			,point({x: parLeftPnt.x() - (hori + 1), y: parLeftPnt.y() + (vert + 1)})
			,point({x: parRightPnt.x() - (hori + 1), y: parRightPnt.y() + (vert + 1)})));
		
			newHd.right(buildPyramid(depth - 1, (nodeCount * 2) + 1
			,point({x: parTopPnt.x() + (hori + 1), y: parTopPnt.y() + (vert + 1)})
			,point({x: parLeftPnt.x() + (hori + 1), y: parLeftPnt.y() + (vert + 1)})
			,point({x: parRightPnt.x() + (hori + 1), y: parRightPnt.y() + (vert + 1)})));
			
			return newHd;
		};
		
		var topPnt1 = point({x: that.topPnt().x(), y: that.topPnt().y()});
		var leftPnt1 = point({x: that.leftPnt().x(), y: that.leftPnt().y()});
		var rightPnt1 = point({x: that.rightPnt().x(), y: that.rightPnt().y()});
		var pyr = buildPyramid(depth + 1, 1, topPnt1, leftPnt1, rightPnt1);
		that.set_pnt(0, that.topPnt().x(), that.topPnt().y() - 5);
		that.set_pnt(1, that.leftPnt().x() - ((hori + 1) * depth) - 7.5, that.leftPnt().y() + ((vert + 1) * depth) + 3.75);
		that.set_pnt(2, that.rightPnt().x() + ((hori + 1) * depth) + 7.5, that.rightPnt().y() + ((vert + 1) * depth) + 3.75);
		that.triangles = function () { return pyr };
		return that;
	};
	
	var xStart = 300; // <-- Starting point.x on the canvas
	var yStart = 10; // <-- Starting point.y on the canvas
	var tScale = .75; // <-- The triangle should be scaled like this
	var topPoint = point({x:xStart,y:yStart});
	var leftPoint = point({x:xStart - (tSize * tScale), y:(tSize * tScale)*2});
	var rightPoint = point({x:xStart + (tSize * tScale),y:(tSize * tScale)*2});
	var myTriangle = triangle({points:[topPoint, leftPoint, rightPoint]});
	return pyramid(depth +1, myTriangle);
 };

    //process.send({ instruction: 'building pyramid' });
//});