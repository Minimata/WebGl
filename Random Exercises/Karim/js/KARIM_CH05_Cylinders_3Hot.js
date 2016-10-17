/**
 * Created by karim on 17.10.2016.
 */

var mvMatrix = mat4.create();
var pMatrix = mat4.create();
var translation = vec3.create();
var sceneObjects = [];

window.onload = displayTitle("Cylinder Selector");


function initCamera(){
	mat4.identity(mvMatrix);
	mat4.identity(pMatrix);
	mat4.perspective (pMatrix, degToRad(45.0), c_width / c_height, 0.1, 100.0);
	var rotXQuat = quat.create();
  quat.setAxisAngle(rotXQuat, vec3.fromValues(1, 0, 0), degToRad(0));

  var rotZQuat = quat.create();
  quat.setAxisAngle(rotZQuat, vec3.fromValues(0, 0, 1), degToRad(0));

	var rotYQuat = quat.create();
  quat.setAxisAngle(rotYQuat, vec3.fromValues(0, 1, 0), degToRad(0));

  var myQuaternion = quat.create();
  quat.multiply(myQuaternion, rotZQuat, rotXQuat, rotYQuat);

  var rotationMatrix = mat4.create();
  mat4.fromQuat(rotationMatrix, myQuaternion);
  mat4.multiply(mvMatrix, rotationMatrix, mvMatrix);

	vec3.set (translation, -3.0, -3.0, -5.0);
	mat4.translate (mvMatrix, mvMatrix, translation);

	glContext.uniformMatrix4fv(prg.pMatrixUniform, false, pMatrix);
	glContext.uniformMatrix4fv(prg.mvMatrixUniform, false, mvMatrix);
}

function initScene(){
	//creation of cylinders
	var cylinder1 = new Cylinder(2,1,1,1,0);
	var cylinder2 = new Cylinder(2,1,-1,-1,0);
	sceneObjects.push(cylinder1,cylinder2);

	glContext.clearColor(1.0, 1.0, 1.0, 1.0);
  glContext.enable(glContext.DEPTH_TEST);
  glContext.clear(glContext.COLOR_BUFFER_BIT | glContext.DEPTH_BUFFER_BIT);
  glContext.viewport(0, 0, c_width, c_height);
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
		//Multiplying the mvMatrix handling the camera with the object position
		mat4.multiply(mvMatrix, sceneObjects[i].mvMatrix, mvMatrix );
		//Sending the current mvMatrix to the shader
		glContext.uniformMatrix4fv(prg.mvMatrixUniform, false, mvMatrix);
		//Calling draw on the object
		sceneObjects[i].draw();
	}

}

function initWebGL() {
    try {
        glContext = getGLContext('webgl-canvas');
        initProgram();
        initCamera();
				initScene();
        renderLoop();
    }
    catch (e) {
        console.error(e)
    }

}
