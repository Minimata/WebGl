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
var translationMat = mat4.create();
var vector3 = vec3.create();

var withPerspective = true;
var rotationAroundZ = 0, displacement = 1;

window.onload = displayTitle("Ch04_ex1");

function cameraGiggle() {
    rotationAroundZ += 0.1;
    requestAnimationFrame(cameraGiggle);
}

function increaseTriangleDisplacement() {
    displacement += 0.02;
    if(displacement >= 18) displacement = 1;
    requestAnimationFrame(increaseTriangleDisplacement);
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
    //createCheckBoard(8);
    //triangleCeption(10, 10);

    vertices = [];
    colors = [];
    indices = [];
    triangleCeption(10, displacement);

    //DEBUG HELP
    if (vertices.length != (colors.length - (vertices.length / 3))) {
        throw new BadInitBufferException("Vertices and colors need to be the same length");
    }

    vertexBuffer = getVertexBufferWithVertices(vertices);
    colorBuffer = getVertexBufferWithVertices(colors);
    indexBuffer = getIndexBufferWithIndices(indices);
}

function triangleCeption(numberOfTriangles = 10, triangleDisplacement = 10) {
    vertices.push(-1.0, -1.0, 0.0);
    vertices.push(1.0, -1.0, 0.0);
    vertices.push(0.0, 1.0, 0.0);
    colors.push(1.0, 0.0, 0.0, 1.0);
    colors.push(0.0, 1.0, 0.0, 1.0);
    colors.push(0.0, 0.0, 1.0, 1.0);
    indices.push(0, 1, 2);

    for (let i = 1; i <= numberOfTriangles; i++) {
        var Apoint = [vertices[9 * i - 9], vertices[9 * i - 8], vertices[9 * i - 7]];
        var Bpoint = [vertices[9 * i - 6], vertices[9 * i - 5], vertices[9 * i - 4]];
        var Cpoint = [vertices[9 * i - 3], vertices[9 * i - 2], vertices[9 * i - 1]];
        var newA = midPoint(Apoint, Bpoint, triangleDisplacement);
        var newB = midPoint(Bpoint, Cpoint, triangleDisplacement);
        var newC = midPoint(Cpoint, Apoint, triangleDisplacement);
        vertices.push(newA[0], newA[1], -(i*0.1));
        vertices.push(newB[0], newB[1], -(i*0.1));
        vertices.push(newC[0], newC[1], -(i*0.1));

        colors.push(1.0 / (i+1), 0.0, 0.0, 1.0 / (i + 1));
        colors.push(0.0, 1.0 / (i+1), 0.0, 1.0 / (i + 1));
        colors.push(0.0, 0.0, 1.0 / (i+1), 1.0 / (i + 1));

        indices.push(3*i, 3*i + 1, 3*i + 2);
    }
}

function midPoint(A, B, portion) {
    var ABVector = [(B[0] - A[0]), (B[1] - A[1]), (B[2] - A[2])];
    return [(A[0] + ABVector[0] / portion), (A[1] + ABVector[1] / portion), (A[2] + ABVector[2] / portion)];
}

function createCheckBoard(numberOfSquaresBySide) {
    var squareSize = 2.0 / numberOfSquaresBySide;
    var posX = -1.0, posY = -1.0;

    for (let numSquareX = 0; numSquareX < numberOfSquaresBySide; numSquareX++) {
        posY = -1.0;
        for (let numSquareY = 0; numSquareY < numberOfSquaresBySide; numSquareY++) {
            if (((numSquareX + numSquareY) % 2) == 0) createSquare(posX, posY, squareSize);
            posY += squareSize;
        }
        posX += squareSize;
    }

    for (var i = 0; i < vertices.length / 3; i++) indices.push(i);
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
    initBuffers(); //This is for animated triangle shaping.

    var a, b, c;
    glContext.clearColor(0.9, 0.9, 0.9, 1.0);
    glContext.enable(glContext.DEPTH_TEST);
    glContext.clear(glContext.COLOR_BUFFER_BIT | glContext.DEPTH_BUFFER_BIT);
    glContext.viewport(0, 0, c_width, c_height);

    mat4.identity(pMatrix);
    mat4.identity(mvMatrix);
    vec3.set(vector3, 0, 0, 0);

    if (withPerspective) {
        mat4.perspective(pMatrix, degToRad(60), c_width / c_height, 0.1, 10000);
        a = 0.1 * Math.sin(rotationAroundZ);
        b = 0.1 * Math.cos(rotationAroundZ);
        c = -2;
        vec3.set(vector3, a, b, c);
        mat4.identity(translationMat);
        mat4.translate(translationMat, translationMat, vector3);
        mat4.multiply(mvMatrix, translationMat, mvMatrix);
        mvMatrix = mat4.rotateY(mvMatrix, mvMatrix, Math.PI);
    } else {
        mat4.identity(translationMat);
        mat4.translate(translationMat, translationMat, vector3);
        mat4.multiply(mvMatrix, translationMat, mvMatrix);
    }

    glContext.uniformMatrix4fv(prg.pMatrixUniform, false, pMatrix);
    glContext.uniformMatrix4fv(prg.mvMatrixUniform, false, mvMatrix);

    glContext.bindBuffer(glContext.ARRAY_BUFFER, vertexBuffer);
    glContext.vertexAttribPointer(prg.vertexPositionAttribute, 3, glContext.FLOAT, false, 0, 0);

    glContext.bindBuffer(glContext.ARRAY_BUFFER, colorBuffer);
    glContext.vertexAttribPointer(prg.colorAttribute, 4, glContext.FLOAT, false, 0, 0);

    glContext.bindBuffer(glContext.ELEMENT_ARRAY_BUFFER, indexBuffer);
    glContext.drawElements(glContext.TRIANGLES, indices.length, glContext.UNSIGNED_SHORT, 0);
}

function initWebGL() {
    try {
        glContext = getGLContext('webgl-canvas');
        initProgram();
        initBuffers();
        increaseTriangleDisplacement(); //for animated triangle shaping
        cameraGiggle(); //to see the perspective
        renderLoop();
    }
    catch (e) {
        console.log(e);
        if (e.message) console.log(e.message); //comfort of use
    }
    finally {
    }
}

function changeProjectionMode() {
    withPerspective = !withPerspective;
}