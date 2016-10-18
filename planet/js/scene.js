/**
* scene.js - This class handles the whole scene. It contains the initialisation of the gl context, the objects displayed, handles the js interactions on the page and draws the scene
*/

//Creation of 2 global matrix for the location of the scene (mvMatrix) and for the projection (pMatrix)
var pMatrix = mat4.create();
var absoluteMatrix = mat4.create();
var mainCamera = new Camera();

/**
 * Initialisation of the shader parameters, this very important method creates the link between the javascript and the shader.
 * It is called by initProgram in webglTools.js.
 */
function initShaderParameters(prg) {
    prg.vertexPositionAttribute = glContext.getAttribLocation(prg, "aVertexPosition");
	glContext.enableVertexAttribArray(prg.vertexPositionAttribute);

	prg.colorAttribute 			= glContext.getAttribLocation(prg, "aColor");
	glContext.enableVertexAttribArray(prg.colorAttribute);

	prg.pMatrixUniform          = glContext.getUniformLocation(prg, 'uPMatrix');
	prg.mvMatrixUniform         = glContext.getUniformLocation(prg, 'uMVMatrix');
}

//Initialisation of the scene
function initScene() {
	glContext.viewport(0, 0, c_width, c_height);
	glContext.enable(glContext.DEPTH_TEST);
	glContext.clearColor(0.0, 0.0, 0.0, 1.0);

	mat4.perspective(pMatrix, degToRad(45), c_width / c_height, 0.1, 1000);
	glContext.uniformMatrix4fv(prg.pMatrixUniform, false, pMatrix);
}

function drawScene() {
	glContext.clear(glContext.COLOR_BUFFER_BIT | glContext.DEPTH_BUFFER_BIT);
	absoluteMatrix = mainCamera.move();

	$.each(getAllDrawables(), function(name, drawable) {
		drawable.draw($('#' + selectName).val(), mat4.create(), absoluteMatrix);
	});
}
