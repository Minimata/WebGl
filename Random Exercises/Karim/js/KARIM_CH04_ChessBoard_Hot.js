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
//create squares vector (yes it could be an array, but i did it with a vec2)
var squares = vec2.create();

window.onload = displayTitle("Ch04_ex6: Single Quadrilateral Chessboard");

//these two functions are the call destination from the slider's onchange event
function changeX(amount){
	vec2.set(squares, amount,squares[1]);
}

function changeY(amount){
	vec2.set(squares, squares[0],amount);
}

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
	
	//bridging number of int squares
	prg.squaresAttribute = glContext.getUniformLocation(prg, "uSquares");
	
}

function initBuffers() {
    createSquare();
	
    vertexBuffer = getVertexBufferWithVertices(vertices);
    //colorBuffer = getVertexBufferWithVertices(colors); //not needed
    indexBuffer = getIndexBufferWithIndices(indices);
}


function createSquare() {
    var transparency = 1.0;
	//create 4 vertices for Chessboard corners
	vertices.push(1.0,1.0,0.0);
	vertices.push(-1.0,1.0,0.0);
	vertices.push(-1.0,-1.0,0.0);
	vertices.push(1.0,-1.0,0.0);
	
	//preset chessboard to default 8x8 matrix (look at fragment shader for why it's 4 and not 8)
	vec2.set(squares, 4,4);
	
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
	
	//refresh uSquares in vertex shader with current value of array squares
	//note that the method is [gl datatype][dimension][value type (f = float)][v = vector array]
	glContext.uniform2fv(prg.squaresAttribute, squares);
	
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