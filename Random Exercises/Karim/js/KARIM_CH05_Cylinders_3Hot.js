/**
 * Created by karim on 17.10.2016.
 */

var pMatrix = mat4.create();
var mvMatrix = mat4.create();
var sceneObjects = [];
var camera;

window.onload = displayTitle("Cylinder Selector");

function initScene(){
	//creation of cylinders
	var cylinder1 = new Cylinder(2,1,1,1,0);
	var cylinder2 = new Cylinder(2,1,-1,-1,0);
	sceneObjects.push(cylinder1,cylinder2);

	mat4.identity(pMatrix);
	mat4.perspective (pMatrix, degToRad(45.0), c_width / c_height, 0.1, 1000.0);

	glContext.clearColor(0.0, 0.0, 0.0, 1.0);
  	glContext.enable(glContext.DEPTH_TEST);
  	glContext.viewport(0, 0, c_width, c_height);

	camera = new Camera();
}

function initShaderParameters(prg) {
    prg.vertexPositionAttribute = glContext.getAttribLocation(prg, "aVertexPosition");
    glContext.enableVertexAttribArray(prg.vertexPositionAttribute);

    prg.colorAttribute = glContext.getAttribLocation(prg, "aColor");
    glContext.enableVertexAttribArray(prg.colorAttribute);

    prg.pMatrixUniform = glContext.getUniformLocation(prg, "uPMatrix");
    prg.mvMatrixUniform = glContext.getUniformLocation(prg, "uMVMatrix");

}

function drawScene() {
	glContext.clear(glContext.COLOR_BUFFER_BIT | glContext.DEPTH_BUFFER_BIT);
	//Calling draw for each object in our scene
	for(var i= 0;i<sceneObjects.length;i++)
	{
		//Reseting the mvMatrix
		mat4.identity(mvMatrix);
		mvMatrix = camera.move();
		//Multiplying the mvMatrix handling the camera with the object position
		mat4.multiply(mvMatrix, sceneObjects[i].mvMatrix, mvMatrix);
		//Sending the current mvMatrix to the shader
		glContext.uniformMatrix4fv(prg.mvMatrixUniform, false, mvMatrix);
		//Calling draw on the object
		sceneObjects[i].draw();
	}
}

$(function() {
    try {
        glContext = getGLContext('webgl-canvas');
        initProgram();
		initScene();
		renderLoop();
    }
    catch (e) {
        console.error(e)
    }
});
