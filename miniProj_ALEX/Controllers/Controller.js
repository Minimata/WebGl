/**
 * Created by alexandre on 28.09.2016.
 */

//MAIN
var canvasName = 'webgl-canvas';
var myCanvas;
var glContext = null;
var mainCamera = new Camera({pos: vec3.fromValues(0, 0, 10), front: vec3.fromValues(0, 0, -1)});

//SHADERS
var preprocessingShaderNames = [
    "preprocess-fs",
    "preprocess-vs"
];
var finalShaderNames = [
    "shader-fs",
    "shader-vs"
];

//RENDER
var tx = [];
var fbo = [];
var mainFBO;
var prg = null;
var preprocessPrg = null;
var progSkybox = null;
var skybox;
var ptr = new Object();
var NUMBER_TEXTURES = 2;
var ext;

//DRAWABLES
var oceanTileSize = 4096;
var renderFrameSize = 1;
var quadSize = 64;
var allDrawables = [];
var preprocDrawables = [];


function Controller_getDrawables() {return allDrawables}
function Controller_getPreprocDrawables() {return preprocDrawables}

$(function () {
    try {
        m_initProgram();
        m_initDrawables();
        Scene_initScene();
        m_initEventHandling();

        m_initFrameBuffers();

        //GLTools_logicLoop();
        GLTools_renderLoop();
    }
    catch (e) {
        console.error(e);
    }
});

function m_initDrawables() {
    preprocDrawables.push(new Quad({width: oceanTileSize, height: oceanTileSize}));
    allDrawables.push(new Quad({/*z:-quadSize / 2, */width: quadSize, height: quadSize}));
    //allDrawables.push(new Quad({z: quadSize / 2, width: quadSize, height: quadSize}));
    //allDrawables.push(new Quad({v1:[0, -1, -1], v2:[0, 1, -1], v3:[0, -1, 1], v4:[0, 1, 1], x: quadSize / 2, width: quadSize, height: quadSize, depth: quadSize}));
    //allDrawables.push(new Quad({v1:[0, -1, -1], v2:[0, 1, -1], v3:[0, -1, 1], v4:[0, 1, 1], x: -quadSize / 2, width: quadSize, height: quadSize, depth: quadSize}));
    //allDrawables.push(new Quad({v1:[-1, 0, 1], v2:[-1, 0, -1], v3:[1, 0, 1], v4:[1, 0, -1], y: -quadSize / 2, width: quadSize, height: quadSize, depth: quadSize}));
    //allDrawables.push(new Quad({v1:[-1, 0, 1], v2:[-1, 0, -1], v3:[1, 0, 1], v4:[1, 0, -1], y: quadSize / 2, width: quadSize, height: quadSize, depth: quadSize}));
}

function m_initEventHandling() {
    myCanvas.on("mousedown", MouseHanlding_handleMouseDown);
    $(window).on("mouseup",  MouseHandling_handleMouseUp);
    $(window).on('mousemove',  MouseHandling_handleMouseMove);
}

function m_initFrameBuffers() {
    var i;

    for(i = 0; i < NUMBER_TEXTURES; i++) {
        m_initTextureBuffer(i);
    }

    mainFBO = glContext.createFramebuffer();
    glContext.bindFramebuffer(glContext.FRAMEBUFFER, mainFBO);
    var colorArrays = [];
    for(i = 0; i < NUMBER_TEXTURES; i++) {
        glContext.framebufferTexture2D(glContext.FRAMEBUFFER, ext.COLOR_ATTACHMENT0_WEBGL + i, glContext.TEXTURE_2D, tx[i], 0);
        colorArrays.push(ext.COLOR_ATTACHMENT0_WEBGL + i);
    }
    ext.drawBuffersWEBGL(colorArrays);
}

function m_initTextureBuffer(index) {

    //TEXTURE BUFFER
    var textureCoordBuffer = glContext.createBuffer();
    glContext.bindBuffer(glContext.ARRAY_BUFFER, textureCoordBuffer);
    var tex = 1;
    var textureCoords = [
        0, 0,
        0, tex,
        tex, 0,
        tex, tex
    ];
    glContext.bufferData(glContext.ARRAY_BUFFER, new Float32Array(textureCoords), glContext.STATIC_DRAW);
    textureCoordBuffer.itemSize = 2;
    textureCoordBuffer.numItems = 4;

    glContext.bindBuffer(glContext.ARRAY_BUFFER, textureCoordBuffer);
    glContext.vertexAttribPointer(prg.textureCoordAttribute, textureCoordBuffer.itemSize, glContext.FLOAT, false, 0, 0);

    fbo[index] = glContext.createFramebuffer();
    glContext.bindFramebuffer(glContext.FRAMEBUFFER, fbo[index]);
    fbo[index].width = oceanTileSize;
    fbo[index].height = oceanTileSize;

    tx[index] = glContext.createTexture();
    glContext.bindTexture(glContext.TEXTURE_2D, tx[index]);
    glContext.texParameteri(glContext.TEXTURE_2D, glContext.TEXTURE_MIN_FILTER, glContext.NEAREST);
    glContext.texParameteri(glContext.TEXTURE_2D, glContext.TEXTURE_MAG_FILTER, glContext.NEAREST);
    glContext.texImage2D(glContext.TEXTURE_2D,
        0,
        glContext.RGBA,
        fbo[index].width,
        fbo[index].height,
        0,
        glContext.RGBA,
        glContext.UNSIGNED_BYTE,
        null);

    var renderBuffer = glContext.createRenderbuffer();
    glContext.bindRenderbuffer(glContext.RENDERBUFFER, renderBuffer);
    glContext.renderbufferStorage(glContext.RENDERBUFFER, glContext.DEPTH_COMPONENT16, fbo[index].width, fbo[index].height);
    glContext.framebufferTexture2D(glContext.FRAMEBUFFER, glContext.COLOR_ATTACHMENT0, glContext.TEXTURE_2D, tx[index], 0);
    glContext.framebufferRenderbuffer(glContext.FRAMEBUFFER, glContext.DEPTH_ATTACHMENT, glContext.RENDERBUFFER, renderBuffer);

    glContext.bindTexture(glContext.TEXTURE_2D, null);
    glContext.bindRenderbuffer(glContext.RENDERBUFFER, null);
    glContext.bindFramebuffer(glContext.FRAMEBUFFER, null);
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
    ext = glContext.getExtension( 'WEBGL_draw_buffers' ) ||
        glContext.getExtension( "GL_EXT_draw_buffers" ) ||
        glContext.getExtension( "EXT_draw_buffers" );

    for(var i = 0; i < finalShaderNames.length; i++) {
        glContext.attachShader(prg, GLTools_initShader(finalShaderNames[i], glContext));
    }

    for(i = 0; i < preprocessingShaderNames.length; i++) {
        glContext.attachShader(preprocessPrg, GLTools_initShader(preprocessingShaderNames[i], glContext));
    }

    glContext.linkProgram(prg);
    glContext.linkProgram(preprocessPrg);

    if (!glContext.getProgramParameter(prg, glContext.LINK_STATUS)) throw("Error m_initProgram - couldn't initialize shaders");

    //Selection of the 2 shader texts for the skybox
    var vertexShaderSkybox = getTextContent("shader-vs-skybox");
    var fragmentShaderSkybox = getTextContent("shader-fs-skybox");
    //Create the program for the shader
    progSkybox = createProgram(glContext,vertexShaderSkybox,fragmentShaderSkybox);

    m_initShaderParameters(prg, preprocessPrg);
    glContext.useProgram(preprocessPrg);
}

function createProgram(gl, vertexShaderSource, fragmentShaderSource) {
    var vsh = gl.createShader( gl.VERTEX_SHADER );
    gl.shaderSource(vsh,vertexShaderSource);
    gl.compileShader(vsh);
    if ( ! gl.getShaderParameter(vsh, gl.COMPILE_STATUS) ) {
        console.log("Error in vertex shader:  " + gl.getShaderInfoLog(vsh));
    }
    var fsh = gl.createShader( gl.FRAGMENT_SHADER );
    gl.shaderSource(fsh, fragmentShaderSource);
    gl.compileShader(fsh);
    if ( ! gl.getShaderParameter(fsh, gl.COMPILE_STATUS) ) {
        console.log("Error in fragment shader:  " + gl.getShaderInfoLog(fsh));
    }
    var prog = gl.createProgram();
    gl.attachShader(prog,vsh);
    gl.attachShader(prog, fsh);
    gl.linkProgram(prog);
    if ( ! gl.getProgramParameter( prog, gl.LINK_STATUS) ) {
        console.log("Link error in program:  " + gl.getProgramInfoLog(prog));
    }
    return prog;
}

function getTextContent( elementID ) {
    var element = document.getElementById(elementID);
    var fsource = "";
    var node = element.firstChild;
    var str = "";
    while (node) {
        if (node.nodeType == 3) // this is a text node
            str += node.textContent;
        node = node.nextSibling;
    }
    return str;
}

/**
 * Initialisation of the shader parameters, this very important method creates the link between the javascript and the shader.
 */
function m_initShaderParameters(prg, preprocessPrg) {

    /*******************************************
     * Inits the pointers for the skybox rendering
     *******************************************/

        //Linking the attribute for the cube map coords
    glContext.useProgram(progSkybox);
    ptr.sbCoordsAttribute = glContext.getAttribLocation(progSkybox, "aCoords");
    glContext.enableVertexAttribArray(ptr.sbCoordsAttribute);

    //Linking the uniform model view matrix for the skybox shader
    ptr.sbMVMatrixUniform = glContext.getUniformLocation(progSkybox, "uMVMatrix");
    //Linking the uniform projection matrix for the skybox shader
    ptr.sbPMatrixUniform = glContext.getUniformLocation(progSkybox, "uPMatrix");
    //Linking the uniform texture location for the first skybox
    ptr.cubeTextureUniform1 = glContext.getUniformLocation(progSkybox, "uSkybox1");
    //Linking the uniform texture location for the second skybox
    ptr.cubeTextureUniform2 = glContext.getUniformLocation(progSkybox, "uSkybox2");


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

    prg.ambientMapSampler            = glContext.getUniformLocation(prg, 'uAmbientMapSampler');
    prg.normalMapSampler            = glContext.getUniformLocation(prg, 'uNormalMapSampler');
    //prg.heightMapSampler            = glContext.getUniformLocation(prg, 'uHeightMapSampler');
    //prg.diffuseMapSampler            = glContext.getUniformLocation(prg, 'uDiffuseMapSampler');
    //prg.relNormalMapSampler            = glContext.getUniformLocation(prg, 'uRelNormalMapSampler');
    //prg.depthMapSampler            = glContext.getUniformLocation(prg, 'uDepthMapSampler');


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
