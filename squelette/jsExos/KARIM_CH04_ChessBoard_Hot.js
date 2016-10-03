/**
 * Created by karim on 03.10.2016.
 */

var vertexBuffer = null;
var indexBuffer = null;
var colorBuffer = null;

var indices = [];
var vertices = [];
var colors = [];

var mvMatrix = mat4.create();
var pMatrix = mat4.create();
var translation = vec3.create();

window.onload = displayTitle("Ch04_ex6");


function initCamera(){
	mat4.identity(mvMatrix);
	
	mat4.perspective (45, c_width / c_height, 0.0, 100.0, pMatrix);
	
	vec3.set (translation, 0.0, 0.0, -0.1);
	mat4.translate (mvMatrix, mvMatrix, translation);
}

function initShaderParameters(prg) {
    prg.vertexPositionAttribute = glContext.getAttribLocation(prg, "aVertexPosition");
    glContext.enableVertexAttribArray(prg.vertexPositionAttribute);

    prg.colorAttribute = glContext.getAttribLocation(prg, "aColor");
    glContext.enableVertexAttribArray(prg.colorAttribute);

    prg.pMatrixUniform = glContext.getUniformLocation(prg, 'uPMatrix');
    prg.mvMatrixUniform = glContext.getUniformLocation(prg, 'uMVMatrix');
}

function initBuffers() {
    createSquare();
    //DEBUG HELP
    if (vertices.length != (colors.length - (vertices.length / 3))) {
        throw new BadInitBufferException("Vertices and colors need to be the same length");
    }

    vertexBuffer = getVertexBufferWithVertices(vertices);
    colorBuffer = getVertexBufferWithVertices(colors);
    indexBuffer = getIndexBufferWithIndices(indices);
}


function createSquare() {
    var transparency = 1.0;
	//create 4 vertices for Chessboard corners
	vertices.push(1.0,1.0,0);
	vertices.push(1.0,-1.0,0);
	vertices.push(-1.0,-1.0,0);
	vertices.push(-1.0,1.0,0);
	//generate white for each corner of the Chessboard
    colors.push(1.0, 1.0, 1.0, transparency);
    colors.push(1.0, 1.0, 1.0, transparency);
    colors.push(1.0, 1.0, 1.0, transparency);
    colors.push(1.0, 1.0, 1.0, transparency);
	//pronounce triangle strip draw order
	indices.push(0,1,2,3);
}

function drawScene() {
    
    glContext.clearColor(0.0, 0.0, 0.0, 1.0);
    glContext.enable(glContext.DEPTH_TEST);
    glContext.clear(glContext.COLOR_BUFFER_BIT | glContext.DEPTH_BUFFER_BIT);
    glContext.viewport(0, 0, c_width, c_height);

    glContext.uniformMatrix4fv(prg.pMatrixUniform, false, pMatrix);
    glContext.uniformMatrix4fv(prg.mvMatrixUniform, false, mvMatrix);

    glContext.bindBuffer(glContext.ARRAY_BUFFER, vertexBuffer);
    glContext.vertexAttribPointer(prg.vertexPositionAttribute, 3, glContext.FLOAT, false, 0, 0);

    glContext.bindBuffer(glContext.ARRAY_BUFFER, colorBuffer);
    glContext.vertexAttribPointer(prg.colorAttribute, 4, glContext.FLOAT, false, 0, 0);

    glContext.bindBuffer(glContext.ELEMENT_ARRAY_BUFFER, indexBuffer);
    glContext.drawElements(glContext.GL_TRIANGLE_STRIP, indices.length, glContext.UNSIGNED_SHORT, 0);
}

function initWebGL() {
    try{
	glContext = getGLContext('webgl-canvas');
	initProgram();
	initCamera();
	initBuffers();
	renderLoop();}
	catch(e){console.log(e)}
    
}