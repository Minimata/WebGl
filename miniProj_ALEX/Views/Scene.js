/**
* scene.js - This class handles the whole scene. It contains the initialisation of the gl context, the objects displayed, handles the js interactions on the page and draws the scene
*/

//Creation of 2 global matrix for the location of the scene (mvMatrix) and for the projection (pMatrix)
var pMatrix = mat4.create();
var fullTimeMilliseconds;
var absoluteMatrix;
var currentPrg = null;

//Initialisation of the scene
function Scene_initScene() {
	fullTimeMilliseconds = 0;

	glContext.viewport(0, 0, c_width, c_height);
	glContext.enable(glContext.DEPTH_TEST);
	glContext.clearColor(0.0, 0.0, 0.0, 1.0);
	currentPrg = preprocessPrg;
}

function Scene_drawScene(deltaTime) {
	var updater = new QuadInterface();
	fullTimeMilliseconds += deltaTime;
	var fullTimeSeconds = fullTimeMilliseconds / 1000;

	glContext.bindFramebuffer(glContext.FRAMEBUFFER, rttFramebuffer);
	glContext.useProgram(preprocessPrg);
	currentPrg = preprocessPrg;

	glContext.uniform1f(preprocessPrg.uDeltaTime, deltaTime);
	glContext.uniform1f(preprocessPrg.uFullTime, fullTimeSeconds);

	glContext.viewport(0, 0, oceanTileSize, oceanTileSize);
	glContext.clear(glContext.COLOR_BUFFER_BIT | glContext.DEPTH_BUFFER_BIT);

	absoluteMatrix = mat4.create();
	mat4.ortho(absoluteMatrix, -renderFrameSize, renderFrameSize, -renderFrameSize, renderFrameSize,
	0, 1000);
	glContext.uniformMatrix4fv(currentPrg.pMatrix, false, pMatrix);

	var toDraw = Controller_getPreprocDrawables();
	for(var i = 0; i < toDraw.length; i++) {
		updater.update(toDraw[i], fullTimeSeconds, deltaTime);
		toDraw[i].draw(absoluteMatrix, preprocessPrg);
	}

	glContext.bindFramebuffer(glContext.FRAMEBUFFER, null);
	glContext.useProgram(prg);
	currentPrg = prg;
	glContext.clear(glContext.COLOR_BUFFER_BIT | glContext.DEPTH_BUFFER_BIT);

	glContext.viewport(0, 0, c_width, c_height);
	mat4.perspective(pMatrix, GLTools_degToRad(45), c_width / c_height, 0.1, 10000);
	glContext.uniformMatrix4fv(currentPrg.pMatrixUniform, false, pMatrix);
	absoluteMatrix = mainCamera.update();

	//TEXTURING
	glContext.activeTexture(glContext.TEXTURE0);
	glContext.bindTexture(glContext.TEXTURE_2D, rttTexture);
	glContext.uniform1i(prg.samplerUniform, 0);

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