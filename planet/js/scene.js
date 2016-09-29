/**
* scene.js - This class handles the whole scene. It contains the initialisation of the gl context, the objects displayed, handles the js interactions on the page and draws the scene
*/

//Creation of 2 global matrix for the location of the scene (mvMatrix) and for the projection (pMatrix)
var mvMatrix = mat4.create();
var pMatrix = mat4.create();

/**
 * Initialisation of the shader parameters, this very important method creates the link between the javascript and the shader.
 * It is called by initProgran in webglTools.js.
 */
function initShaderParameters(prg) {
	//Linking of the attribute "vertex position"
    prg.vertexPositionAttribute = glContext.getAttribLocation(prg, "aVertexPosition");
	glContext.enableVertexAttribArray(prg.vertexPositionAttribute);
	//Linking of the attribute "color"
	prg.colorAttribute 			= glContext.getAttribLocation(prg, "aColor");
	glContext.enableVertexAttribArray(prg.colorAttribute);
	//Linking of the uniform [mat4] for the projection matrix
	prg.pMatrixUniform          = glContext.getUniformLocation(prg, 'uPMatrix');
	//Linking of the uniform [mat4] for the movement matrix
	prg.mvMatrixUniform         = glContext.getUniformLocation(prg, 'uMVMatrix');
}

//Initialisation of the scene
function initScene() {
	glContext.viewport(0, 0, c_width, c_height);
	mat4.identity(pMatrix);
	glContext.uniformMatrix4fv(prg.pMatrixUniform, false, pMatrix);
	glContext.enable(glContext.DEPTH_TEST);
	glContext.clearColor(0.0, 0.0, 0.0, 1.0);
}

function drawScene() {
	glContext.clear(glContext.COLOR_BUFFER_BIT | glContext.DEPTH_BUFFER_BIT);
	$.each(getAllDrawables(), function(name, drawable) {
		drawable.draw();
	});
}

