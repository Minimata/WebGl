/**
 * Created by alexandre on 28.09.2016.
 */

var canvasName = 'webgl-canvas';
var myCanvas;
var mainCamera = new Camera({pos: vec3.fromValues(0, 0, 10), front: vec3.fromValues(0, 0, -1)});
var glContext = null;
var prg = null;
var allShaderNames = [
    "shader-fs",
    "shader-vs"
];

var allDrawables = [];
function Controller_getDrawables() {return allDrawables}

$(function () {
    try {
        m_initProgram();
        Scene_initScene();
        m_initEventHandling();

        m_initDrawables();

        GLTools_logicLoop();
        GLTools_renderLoop();
    }
    catch (e) {
        console.error(e);
    }
});

function m_initDrawables() {
    allDrawables.push(new Quad({width: 1, height: 1, r: 0.0, g: 0.5, b: 1.0}));
}

function m_initEventHandling() {
    myCanvas.on("mousedown", MouseHandling_handleMouseDown);
    $(window).on("mouseup",  MouseHandling_handleMouseUp);
    $(window).on('mousemove',  MouseHandling_handleMouseMove);
}

/**
 * The program contains a series of instructions that tell the Graphic Processing Unit (GPU)
 * what to do with every vertex and fragment that we transmit.
 * The vertex shader and the fragment shaders together are called through that program.
 */
function m_initProgram() {
    myCanvas = $('#' + canvasName);
    glContext = GLTools_getGLContext(canvasName);
    prg = glContext.createProgram();

    for(var i = 0; i < allShaderNames.length; i++) {
        glContext.attachShader(prg, GLTools_initShader(allShaderNames[i], glContext));
    }

    glContext.linkProgram(prg);

    if (!glContext.getProgramParameter(prg, glContext.LINK_STATUS)) throw("Error m_initProgram - couldn't initialize shaders");
    glContext.useProgram(prg);

    m_initShaderParameters(prg);
}

/**
 * Initialisation of the shader parameters, this very important method creates the link between the javascript and the shader.
 */
function m_initShaderParameters(prg) {
    prg.vertexPositionAttribute = glContext.getAttribLocation(prg, "aVertexPosition");
    glContext.enableVertexAttribArray(prg.vertexPositionAttribute);

    prg.colorAttribute 			= glContext.getAttribLocation(prg, "aColor");
    glContext.enableVertexAttribArray(prg.colorAttribute);

    prg.pMatrixUniform          = glContext.getUniformLocation(prg, 'uPMatrix');
    prg.mvMatrixUniform         = glContext.getUniformLocation(prg, 'uMVMatrix');

    prg.uDeltaTime              = glContext.getUniformLocation(prg, 'uDeltaTime');
    prg.uFullTime               = glContext.getUniformLocation(prg, 'uFullTime');

    prg.uCameraPosition         = glContext.getUniformLocation(prg, 'uCameraPosition');
}
