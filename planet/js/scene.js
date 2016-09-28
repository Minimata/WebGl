/**
* scene.js - This class handles the whole scene. It contains the initialisation of the gl context, the objects displayed, handles the js interactions on the page and draws the scene
*/

//Creation of 2 global matrix for the location of the scene (mvMatrix) and for the projection (pMatrix)
var mvMatrix = mat4.create();
var pMatrix = mat4.create();

//Creation of a global array to store the objects drawn in the scene
var sceneObjects = [];

//Render swap handling, the variable render contains a value used to define if the objects should be rendered as triangles or as lines
var render = 0;
function changeRender(){
	render = render ? 0 : 1;
}

//Initialisation of the shader parameters, this very important method creates the link between the javascript and the shader. 
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
	$.each(allPlanets, function(name, planet){
		sceneObjects.push(planet);
	});
	/*for(let i = 0; i < allPlanets.length; i++) {
		sceneObjects.push(allPlanets[i]);
	}*/
	
	//Defining the viewport as the size of the canvas
	glContext.viewport(0, 0, c_width, c_height);
	//Setting the projection matrix as an identity matrix
	mat4.identity(pMatrix);	
	
	//Sending the projection matrix to the shaders
	glContext.uniformMatrix4fv(prg.pMatrixUniform, false, pMatrix);
	
	//Enabling the depth test
	glContext.enable(glContext.DEPTH_TEST);
	//Sets the color black for the clear of the scene
	glContext.clearColor(0.0, 0.0, 0.0, 1.0);
}

//Draw scene method called when the render loop is started
function drawScene() {
	//Clearing the previous render based on color and depth
	glContext.clear(glContext.COLOR_BUFFER_BIT | glContext.DEPTH_BUFFER_BIT);
	
	//Calling draw for each object in our scene
	for(let i= 0; i < sceneObjects.length; i++) {
		sceneObjects[i].draw();
	}
}

