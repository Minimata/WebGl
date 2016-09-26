/**
 * Created by alexandre on 21.09.2016.
 */

var vertexBuffer = null;
var indexBuffer = null;
var colorBuffer = null;
var indices = [];
var vertices = [];
var colors = [];
var mvMatrix = mat4.create();
var pMatrix = mat4.create();

window.onload = displayTitle("Ch04_ex1");

function initShaderParameters(prg) {
    prg.vertexPositionAttribute = glContext.getAttribLocation(prg, "aVertexPosition");
    glContext.enableVertexAttribArray(prg.vertexPositionAttribute);

    prg.colorAttribute = glContext.getAttribLocation(prg, "aColor");
    glContext.enableVertexAttribArray(prg.colorAttribute);

    prg.pMatrixUniform = glContext.getUniformLocation(prg, 'uPMatrix');
    prg.mvMatrixUniform = glContext.getUniformLocation(prg, 'uMVMatrix');
}

function initBuffers() {
    //createCheckBoard(8);
    triangleFractal();

    //DEBUG HELP
    if(vertices.length != (colors.length - (vertices.length/3))){
        throw new BadInitBufferException("Vertices and colors need to be the same length");
    }

    vertexBuffer = getVertexBufferWithVertices(vertices);
    colorBuffer = getVertexBufferWithVertices(colors);
    indexBuffer = getIndexBufferWithIndices(indices);
}

function triangleFractal() {
    vertices.push(-1.0, -1.0, 0.0);
    vertices.push(1.0, -1.0, 0.0);
    vertices.push(0.0, 1.0, 0.0);
    colors.push(1.0, 0.0, 0.0, 1.0);
    colors.push(0.0, 1.0, 0.0, 1.0);
    colors.push(0.0, 0.0, 1.0, 1.0);

    for(var i = 1; i<= 100; i++) {
        var Apoint = [vertices[9*i-9], vertices[9*i-8], vertices[9*i-7]];
        var Bpoint = [vertices[9*i-6], vertices[9*i-5], vertices[9*i-4]];
        var Cpoint = [vertices[9*i-3], vertices[9*i-2], vertices[9*i-1]];
        var newA = midPoint(Apoint, Bpoint, 2);
        var newB = midPoint(Bpoint, Cpoint, 2);
        var newC = midPoint(Cpoint, Apoint, 2);
        vertices.push(newA[0], newA[1], newA[2]-(0.1));
        vertices.push(newB[0], newB[1], newB[2]-(0.1));
        vertices.push(newC[0], newC[1], newC[2]-(0.1));

        var x = i%3, y = (i+1)%3, z = (i+2)%3;
        if(x==1) {
            y=0;
            z=0;
        }
        else if(y==1) {
            x=0;
            z=0;
        }
        else if(z==1) {
            x=0;
            y=0;
        }

        colors.push(x, y, z, 1.0);
        colors.push(z, x, y, 1.0);
        colors.push(y, z, x, 1.0);

        indices.push(i-1);
    }
}

function midPoint(A, B, portion)
{
    return [(A[0] + B[0])/portion, (A[1] + B[1])/portion, (A[2] + B[2])/portion];
}

function createCheckBoard(numberOfSquaresBySide) {
    var squareSize = 2.0 / numberOfSquaresBySide;
    var posX = -1.0, posY = -1.0;
    for(var numSquareX = 0; numSquareX < numberOfSquaresBySide; numSquareX++){
        posY = -1.0;
        for(var numSquareY = 0; numSquareY < numberOfSquaresBySide; numSquareY++){
            if(((numSquareX + numSquareY) % 2) == 0) {
                createSquare(posX, posY, squareSize);
            }
            posY += squareSize;
        }
        posX += squareSize;
    }

    for (var i = 0; i < vertices.length / 3; i++) {
        indices.push(i);
    }
}

function createSquare(botLeftX, botLeftY, size) {
    var transparency = 1.0;

    vertices.push(botLeftX, botLeftY, 0.0);
    vertices.push(botLeftX + size, botLeftY, 0.0);
    vertices.push(botLeftX + size, botLeftY + size, 0.0);
    colors.push(botLeftX, 0.0, botLeftY, transparency);
    colors.push(botLeftX + size, 0.0, botLeftY, transparency);
    colors.push(botLeftX + size, 0.0, botLeftY + size, transparency);

    vertices.push(botLeftX, botLeftY, 0.0);
    vertices.push(botLeftX, botLeftY + size, 0.0);
    vertices.push(botLeftX + size, botLeftY + size, 0.0);
    colors.push(botLeftX, 0.0, botLeftY, transparency);
    colors.push(botLeftX, 0.0, botLeftY + size, transparency);
    colors.push(botLeftX + size, 0.0, botLeftY + size, transparency);
}

function drawScene() {
    glContext.clearColor(0.9, 0.9, 0.9, 1.0);
    glContext.enable(glContext.DEPTH_TEST);
    glContext.clear(glContext.COLOR_BUFFER_BIT | glContext.DEPTH_BUFFER_BIT);
    glContext.viewport(0, 0, c_width, c_height);

    mat4.identity(pMatrix);
    mat4.identity(mvMatrix);

    glContext.uniformMatrix4fv(prg.pMatrixUniform, false, pMatrix);
    glContext.uniformMatrix4fv(prg.mvMatrixUniform, false, mvMatrix);

    glContext.bindBuffer(glContext.ARRAY_BUFFER, vertexBuffer);
    glContext.vertexAttribPointer(prg.vertexPositionAttribute, 3, glContext.FLOAT, false, 0, 0);

    glContext.bindBuffer(glContext.ARRAY_BUFFER, colorBuffer);
    glContext.vertexAttribPointer(prg.colorAttribute, 4, glContext.FLOAT, false, 0, 0);

    glContext.bindBuffer(glContext.ELEMENT_ARRAY_BUFFER, indexBuffer);
    glContext.drawElements(glContext.TRIANGLES,indices.length, glContext.UNSIGNED_SHORT,0);
}

function initWebGL() {
    try {
        glContext = getGLContext('webgl-canvas');
        initProgram();
        initBuffers();
        renderLoop(60.0);
    }
    catch (e) {
        console.log(e);
        if(e.message) console.log(e.message); //comfort of use
    }
    finally {
    }
}
