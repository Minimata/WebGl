/**
* scene.js - This class handles the whole scene. It contains the initialisation of the gl context, the objects displayed, handles the js interactions on the page and draws the scene
*/

//Creation of 2 global matrix for the location of the scene (mvMatrix) and for the projection (pMatrix)
var mvMatrix = mat4.create();
var pMatrix = mat4.create();
var translationMat = mat4.create();

var translateVector = vec3.create();

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
	var a = 0, b = 0, c = -2;
	glContext.viewport(0, 0, c_width, c_height);
	mat4.identity(pMatrix);
	mat4.perspective(pMatrix, degToRad(60), c_width / c_height, 0.1, 10000);
	vec3.set(translateVector, a, b, c);
	mat4.identity(translationMat);
	mat4.translate(translationMat, translationMat, translateVector);
	mat4.multiply(mvMatrix, translationMat, mvMatrix);

	glContext.uniformMatrix4fv(prg.pMatrixUniform, false, pMatrix);
	glContext.enable(glContext.DEPTH_TEST);
	glContext.clearColor(0.0, 0.0, 0.0, 1.0);
}

function drawScene() {
	glContext.clear(glContext.COLOR_BUFFER_BIT | glContext.DEPTH_BUFFER_BIT);
	$.each(getAllDrawables(), function(name, drawable) {
		if(!renderMethod) drawable.draw();
		else drawable.draw(renderMethods[renderMethod%renderMethods.length]);
	});
}

