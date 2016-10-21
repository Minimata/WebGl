/**
* scene.js - This class handles the whole scene. It contains the initialisation of the gl context, the objects displayed, handles the js interactions on the page and draws the scene
*/

//Creation of 2 global matrix for the location of the scene (mvMatrix) and for the projection (pMatrix)
var pMatrix = mat4.create();
var absoluteMatrix = mat4.create();

//Initialisation of the scene
function Scene_initScene() {
	glContext.viewport(0, 0, c_width, c_height);
	glContext.enable(glContext.DEPTH_TEST);
	glContext.clearColor(0.0, 0.0, 0.0, 1.0);

	mat4.perspective(pMatrix, GLTools_degToRad(45), c_width / c_height, 0.1, 1000);
	glContext.uniformMatrix4fv(prg.pMatrixUniform, false, pMatrix);
}

function Scene_drawScene() {
	glContext.clear(glContext.COLOR_BUFFER_BIT | glContext.DEPTH_BUFFER_BIT);
	absoluteMatrix = mainCamera.update();

	var toDraw = Controller_getDrawables();
	for(var i = 0; i < toDraw.length; i++) {
		toDraw[i].draw(absoluteMatrix)
	}

	var vertices = [];
	var colors = [];
	var indices = [];
	var vertexBuffer = null;
	var indexBuffer = null;
	var colorBuffer = null;

	vertices.push(
		0, 0, 0,
		1, 0, 0,
		0, 1, 0,
		1, 1, 0
	);
	colors.push(
		1, 1, 1, 1,
		1, 1, 1, 1,
		1, 1, 1, 1,
		1, 1, 1, 1
	);
	indices.push(0, 1, 2);
	indices.push(3, 2, 1);

	vertexBuffer = getVertexBufferWithVertices(vertices);
	colorBuffer = getVertexBufferWithVertices(colors);
	indexBuffer = getIndexBufferWithIndices(indices);

	glContext.uniformMatrix4fv(prg.mvMatrixUniform, false, absoluteMatrix);

	glContext.bindBuffer(glContext.ARRAY_BUFFER, vertexBuffer);
	glContext.vertexAttribPointer(prg.vertexPositionAttribute, 3, glContext.FLOAT, false, 0, 0);
	glContext.bindBuffer(glContext.ARRAY_BUFFER, colorBuffer);
	glContext.vertexAttribPointer(prg.colorAttribute, 4, glContext.FLOAT, false, 0, 0);
	glContext.bindBuffer(glContext.ELEMENT_ARRAY_BUFFER, indexBuffer);

	glContext.drawElements(glContext.TRIANGLES, indices.length, glContext.UNSIGNED_SHORT, 0);
}

function Scene_updateScene() {
	var updater = new QuadInterface();
	var toDraw = Controller_getDrawables();
	for(var i = 0; i < toDraw.length; i++) {
		updater.update(toDraw[i]);
	}
}