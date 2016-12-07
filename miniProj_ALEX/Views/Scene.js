/**
* scene.js - This class handles the whole scene. It contains the initialisation of the gl context, the objects displayed, handles the js interactions on the page and draws the scene
*/

//Creation of 2 global matrix for the location of the scene (mvMatrix) and for the projection (pMatrix)
var pMatrix = mat4.create();
var fullTimeMilliseconds;
var absoluteMatrix;

//Initialisation of the scene
function Scene_initScene() {
	fullTimeMilliseconds = 0;

	glContext.viewport(0, 0, c_width, c_height);
	glContext.enable(glContext.DEPTH_TEST);
	glContext.clearColor(0.0, 0.0, 0.0, 1.0);
}

function Scene_drawScene(deltaTime) {
	//Setting up logical variables
	var updater = new QuadInterface();
	fullTimeMilliseconds += deltaTime;
	var fullTimeSeconds = fullTimeMilliseconds / 1000;

	//Changing shaders and output buffers for preprocessing
	glContext.bindFramebuffer(glContext.FRAMEBUFFER, mainFBO);
	glContext.useProgram(preprocessPrg);

	//Sending data to shaders
	glContext.uniform1f(preprocessPrg.uDeltaTime, deltaTime);
	glContext.uniform1f(preprocessPrg.uFullTime, fullTimeSeconds);
	//Sending datas do shaders. Camera pos must be scaled between the 2 shader spaces
	//TEMPORARY SOLUTION THESE UGLY FACTORS
	glContext.uniform3f(preprocessPrg.uCameraPosition,
		1.33*mainCamera.pos[0] * renderFrameSize / quadSize,
		0.83*mainCamera.pos[1] * renderFrameSize / quadSize,
		-mainCamera.pos[2]);

	//Rendering the preprocessed shaders
	glContext.viewport(0, 0, oceanTileSize, oceanTileSize);
	glContext.clear(glContext.COLOR_BUFFER_BIT | glContext.DEPTH_BUFFER_BIT);
	absoluteMatrix = mat4.create();
	mat4.ortho(absoluteMatrix, -renderFrameSize, renderFrameSize, -renderFrameSize, renderFrameSize,
	0, 1000);
	glContext.uniformMatrix4fv(preprocessPrg.pMatrix, false, pMatrix);

	var toDraw = Controller_getPreprocDrawables();
	for(var i = 0; i < toDraw.length; i++) {
		updater.update(toDraw[i], fullTimeSeconds, deltaTime);
		toDraw[i].draw(absoluteMatrix, preprocessPrg);
	}

	//Coming back to default shaders and output
	glContext.bindFramebuffer(glContext.FRAMEBUFFER, null);
	glContext.useProgram(prg);
	glContext.clear(glContext.COLOR_BUFFER_BIT | glContext.DEPTH_BUFFER_BIT);


	//Setting up rendering
	glContext.viewport(0, 0, c_width, c_height);
	mat4.perspective(pMatrix, GLTools_degToRad(45), c_width / c_height, 0.1, 10000);
	glContext.uniformMatrix4fv(prg.pMatrixUniform, false, pMatrix);
	absoluteMatrix = mainCamera.update();

	var allPRGSamplerLocations = [
		prg.ambientMapSampler,
		prg.diffuseMapSampler,
		prg.normalMapSampler,
		prg.heightMapSampler,
		prg.relNormalMapSampler
	];

	//Sampling the render of the first pass and update space
	for(i = 0; i < NUMBER_TEXTURES; i++) {
		glContext.activeTexture(glContext.TEXTURE0 + i);
		glContext.bindTexture(glContext.TEXTURE_2D, tx[i]);
		glContext.uniform1i(allPRGSamplerLocations[i], i);
	}

	toDraw = Controller_getDrawables();
	for(i = 0; i < toDraw.length; i++) {
		updater.update(toDraw[i], fullTimeSeconds, deltaTime);
		toDraw[i].draw(absoluteMatrix, prg);
	}
}

function Scene_updateScene(deltaTime) {
	fullTimeMilliseconds += deltaTime;
	var fullTimeSeconds = fullTimeMilliseconds / 1000;

	var updater = new QuadInterface();
	var toUpdate = [];
	toUpdate.push(Controller_getPreprocDrawables());
	toUpdate.push(Controller_getDrawables());
	for(var i = 0; i < toUpdate.length; i++) {
		for(var j = 0; j < toUpdate[i].length; j++) {
			updater.update(toUpdate[i][j]);
		}
	}
}