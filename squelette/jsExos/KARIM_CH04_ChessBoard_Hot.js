/**
 * Created by karim on 03.10.2016.
 */

var vertexBuffer = null;
var indexBuffer = null;
//var colorBuffer = null; //color buffer not needed

var indices = [];
var vertices = [];
//var colors = []; //colors not needed

var mvMatrix = mat4.create();
var pMatrix = mat4.create();
var translation = vec3.create();

window.onload = displayTitle("Ch04_ex6");


function initCamera(){
	mat4.identity(mvMatrix);
	
	mat4.perspective (pMatrix, 45.0, c_width / c_height, 0.1, 100.0);
			
	vec3.set (translation, 0.0, 0.0, -2.0);
	mat4.translate (mvMatrix, mvMatrix, translation);
}

function initScene(){
	glContext.clearColor(0.1, 0.1, 0.1, 1.0);
    glContext.enable(glContext.DEPTH_TEST);
    glContext.clear(glContext.COLOR_BUFFER_BIT | glContext.DEPTH_BUFFER_BIT);
    glContext.viewport(0, 0, c_width, c_height);
}

function initShaderParameters(prg) {
    prg.vertexPositionAttribute = glContext.getAttribLocation(prg, "aVertexPosition");
    glContext.enableVertexAttribArray(prg.vertexPositionAttribute);

	//no need for color bridge anymore
    //prg.colorAttribute = glContext.getAttribLocation(prg, "aColor");
    //glContext.enableVertexAttribArray(prg.colorAttribute);

    prg.pMatrixUniform = glContext.getUniformLocation(prg, "uPMatrix");
    prg.mvMatrixUniform = glContext.getUniformLocation(prg, "uMVMatrix");
	
}

function initBuffers() {
    createSquare();
	
    vertexBuffer = getVertexBufferWithVertices(vertices);
    //colorBuffer = getVertexBufferWithVertices(colors);
    indexBuffer = getIndexBufferWithIndices(indices);
}


function createSquare() {
    var transparency = 1.0;
	//create 4 vertices for Chessboard corners
	vertices.push(1.0,1.0,0.0);
	vertices.push(-1.0,1.0,0.0);
	vertices.push(-1.0,-1.0,0.0);
	vertices.push(1.0,-1.0,0.0);
	
	//colors not necessary anymore as they are handled by fragshader
    //colors.push(1.0, 1.0, 1.0, transparency);
    //colors.push(1.0, 1.0, 1.0, transparency);
    //colors.push(1.0, 1.0, 1.0, transparency);
    //colors.push(1.0, 1.0, 1.0, transparency);
	//pronounce triangles draw order
	indices.push(0,1,2,2,3,0);
}

function drawScene() {
	initScene();
    glContext.uniformMatrix4fv(prg.pMatrixUniform, false, pMatrix);
    glContext.uniformMatrix4fv(prg.mvMatrixUniform, false, mvMatrix);
	
    glContext.bindBuffer(glContext.ARRAY_BUFFER, vertexBuffer);
    glContext.vertexAttribPointer(prg.vertexPositionAttribute, 3, glContext.FLOAT, false, 0, 0);

    //glContext.bindBuffer(glContext.ARRAY_BUFFER, colorBuffer);
    //glContext.vertexAttribPointer(prg.colorAttribute, 4, glContext.FLOAT, false, 0, 0);

    glContext.bindBuffer(glContext.ELEMENT_ARRAY_BUFFER, indexBuffer);
    glContext.drawElements(glContext.TRIANGLES, indices.length, glContext.UNSIGNED_SHORT, 0);
}

function initWebGL() {
    try {
        glContext = getGLContext('webgl-canvas');
        initProgram();
        initCamera();
        initBuffers();
        renderLoop();
    }
    catch (e) {
        console.error(e)
    }

}