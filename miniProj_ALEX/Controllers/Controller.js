/**
 * Created by alexandre on 28.09.2016.
 */

var canvasName = 'webgl-canvas';
var myCanvas;

var mainCamera = new Camera({pos: vec3.fromValues(0, 0, 10), front: vec3.fromValues(0, 0, -1)});

var glContext = null;
var prg = null;
var preprocessPrg = null;
var preprocessingShaderNames = [
    "preprocess-fs",
    "preprocess-vs"
];
var finalShaderNames = [
    "shader-fs",
    "shader-vs"
];

var rttFrameBuffer;
var rttTexture;

var oceanTileSize = 1024;
var allDrawables = [];
function Controller_getDrawables() {return allDrawables}

$(function () {
    try {
        m_initProgram();
        Scene_initScene();
        m_initEventHandling();
        m_initTextureBuffer();

        m_initDrawables();

        GLTools_logicLoop();
        GLTools_renderLoop();
    }
    catch (e) {
        console.error(e);
    }
});

function m_initTextureBuffer() {
    //var ext = gl.getExtension('WEBGL_draw_buffers');


    //TEXTURE BUFFER
    var textureCoordBuffer = glContext.createBuffer();
    glContext.bindBuffer(glContext.ARRAY_BUFFER, textureCoordBuffer);
    var textureCoords = [
        -oceanTileSize / 2, -oceanTileSize / 2,
        -oceanTileSize / 2, oceanTileSize / 2,
        oceanTileSize / 2, oceanTileSize / 2,
        oceanTileSize / 2, -oceanTileSize / 2
    ];
    glContext.bufferData(glContext.ARRAY_BUFFER, new Float32Array(textureCoords), glContext.STATIC_DRAW);
    textureCoordBuffer.itemSize = 2;
    textureCoordBuffer.numItems = 4;

    glContext.bindBuffer(glContext.ARRAY_BUFFER, textureCoordBuffer);
    glContext.vertexAttribPointer(prg.textureCoordAttribute, textureCoordBuffer.itemSize, glContext.FLOAT, false, 0, 0);



    rttFramebuffer = glContext.createFramebuffer();
    glContext.bindFramebuffer(glContext.FRAMEBUFFER, rttFramebuffer);
    rttFramebuffer.width = oceanTileSize;
    rttFramebuffer.height = oceanTileSize;

    rttTexture = glContext.createTexture();
    glContext.bindTexture(glContext.TEXTURE_2D, rttTexture);
    glContext.texParameteri(glContext.TEXTURE_2D, glContext.TEXTURE_MIN_FILTER, glContext.NEAREST);
    glContext.texParameteri(glContext.TEXTURE_2D, glContext.TEXTURE_MAG_FILTER, glContext.NEAREST);
    glContext.texImage2D(glContext.TEXTURE_2D,
        0,
        glContext.RGBA,
        rttFramebuffer.width,
        rttFramebuffer.height,
        0,
        glContext.RGBA,
        glContext.UNSIGNED_BYTE,
        null);

    var renderBuffer = glContext.createRenderbuffer();
    glContext.bindRenderbuffer(glContext.RENDERBUFFER, renderBuffer);
    glContext.renderbufferStorage(glContext.RENDERBUFFER, glContext.DEPTH_COMPONENT16, rttFramebuffer.width, rttFramebuffer.height);
    glContext.framebufferTexture2D(glContext.FRAMEBUFFER, glContext.COLOR_ATTACHMENT0, glContext.TEXTURE_2D, rttTexture, 0);
    glContext.framebufferRenderbuffer(glContext.FRAMEBUFFER, glContext.DEPTH_ATTACHMENT, glContext.RENDERBUFFER, renderBuffer);

    glContext.bindTexture(glContext.TEXTURE_2D, null);
    glContext.bindRenderbuffer(glContext.RENDERBUFFER, null);
    glContext.bindFramebuffer(glContext.FRAMEBUFFER, null);


}

function m_initDrawables() {
    allDrawables.push(new Quad({width: oceanTileSize, height: oceanTileSize, r: 0.0, g: 0.5, b: 1.0}));
}

function m_initEventHandling() {
    myCanvas.on("mousedown", MouseHanlding_handleMouseDown);
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
    preprocessPrg = glContext.createProgram();

    for(var i = 0; i < finalShaderNames.length; i++) {
        glContext.attachShader(prg, GLTools_initShader(finalShaderNames[i], glContext));
    }

    for(i = 0; i < preprocessingShaderNames.length; i++) {
        glContext.attachShader(preprocessPrg, GLTools_initShader(preprocessingShaderNames[i], glContext));
    }

    glContext.linkProgram(prg);
    glContext.linkProgram(preprocessPrg);

    if (!glContext.getProgramParameter(prg, glContext.LINK_STATUS)) throw("Error m_initProgram - couldn't initialize shaders");

    m_initShaderParameters(prg, preprocessPrg);
    glContext.useProgram(preprocessPrg);
}

/**
 * Initialisation of the shader parameters, this very important method creates the link between the javascript and the shader.
 */
function m_initShaderParameters(prg, preprocessPrg) {
    glContext.useProgram(prg);
    prg.vertexPositionAttribute = glContext.getAttribLocation(prg, "aVertexPosition");
    glContext.enableVertexAttribArray(prg.vertexPositionAttribute);

    prg.colorAttribute 			= glContext.getAttribLocation(prg, "aColor");
    glContext.enableVertexAttribArray(prg.colorAttribute);

    prg.textureCoordAttribute = glContext.getAttribLocation(prg, 'aTextureCoord');
    glContext.enableVertexAttribArray(prg.textureCoordAttribute);

    prg.pMatrixUniform          = glContext.getUniformLocation(prg, 'uPMatrix');
    prg.mvMatrixUniform         = glContext.getUniformLocation(prg, 'uMVMatrix');

    prg.uDeltaTime              = glContext.getUniformLocation(prg, 'uDeltaTime');
    prg.uFullTime               = glContext.getUniformLocation(prg, 'uFullTime');

    prg.uCameraPosition         = glContext.getUniformLocation(prg, 'uCameraPosition');

    prg.samplerUniform            = glContext.getUniformLocation(prg, 'uSampler');


    glContext.useProgram(preprocessPrg);
    preprocessPrg.vertexPositionAttribute   = glContext.getAttribLocation(preprocessPrg, "aVertexPosition");
    glContext.enableVertexAttribArray(preprocessPrg.vertexPositionAttribute);

    preprocessPrg.colorAttribute 		    = glContext.getAttribLocation(preprocessPrg, "aColor");
    glContext.enableVertexAttribArray(preprocessPrg.colorAttribute);

    preprocessPrg.pMatrix                   = glContext.getUniformLocation(preprocessPrg, 'uPMatrix');
    preprocessPrg.mvMatrixUniform           = glContext.getUniformLocation(preprocessPrg, 'uMVMatrix');

    preprocessPrg.uDeltaTime                = glContext.getUniformLocation(preprocessPrg, 'uDeltaTime');
    preprocessPrg.uFullTime                 = glContext.getUniformLocation(preprocessPrg, 'uFullTime');

    preprocessPrg.uCameraPosition           = glContext.getUniformLocation(preprocessPrg, 'uCameraPosition');
}
