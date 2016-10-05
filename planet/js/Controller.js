/**
 * Created by alexandre on 28.09.2016.
 */

var canvasName = 'webgl-canvas';
var myCanvas;
var selectName = "switchRenderMethod";
var planetInt = new PlanetInterface();

var allPositions = {
    "Earth": {x: 1.0, y:0.0, z:0.0},
    "Moon": {x: -1.0, y:0.0, z:0.0},
    "Mars": {x: 0.5, y:0.2, z:0.0}
};

var allColors = {
    "Earth": {r: 0.14, g: 0.29, b: 0.65, a: 1.0},
    "Moon": {r: 1.0, g: 0.96, b: 0.83, a: 1.0},
    "Mars": {r: 1.0, g: 0.2, b: 0.0, a: 1.0}
};

var allPlanetProperties = {
    "Earth": {radius: 0.8, divisions: 100, rotateSpeed: 1},
    "Moon": {radius: 0.2, divisions: 100, rotateSpeed: 5},
    "Mars": {radius: 0.6, divisions: 100, rotateSpeed: 1}
};

var renderMethods = [
    "TRIANGLES",
    "LINES",
    "TRIANGLE_FAN"
];

var allDrawables = {
    "Earth": new Planet("Earth",
        renderMethods["TRIANGLES"],
        allColors["Earth"],
        allPositions["Earth"],
        allPlanetProperties["Earth"],
        {children: {
            "Moon": new Planet("Moon",
                renderMethods["TRIANGLES"],
                allColors["Moon"],
                allPositions["Moon"],
                allPlanetProperties["Moon"])
        }}),
    "Mars": new Planet("Mars",
        renderMethods["TRIANGLES"],
        allColors["Mars"],
        allPositions["Mars"],
        allPlanetProperties["Mars"])
};

window.onload = displayTitle("DEM PLANETS MAN");

$(function () {
    try {
        initSceneEssentials();
        initAllDrawables();
        initProgram();
        initScene();
        initEventHandling();
        initRenderingMethods();

        logicLoop();
        renderLoop();
    }
    catch (e) {
        console.error(e);
    }
});

function initAllDrawables() {
    updateScene();
}

function initSceneEssentials() {
    myCanvas = $('#' + canvasName);
    glContext = getGLContext(canvasName);
}

function initEventHandling() {
    $('#slider-divisions').on('input', function () {
        var numDivisions = $(this).val();
        $.each(allDrawables, function (name, planet) {
            planet["divisions"] = numDivisions;
            planetInt.update(planet);
        });
    });

    myCanvas.on("mousedown", function(e){
        handleMouseDown(e);
    });

    $(window).on("mouseup", function(e){
        handleMouseUp(e);
    });

    $(window).on('mousemove', function(e){
        handleMouseMove(e);
    })
}

function initRenderingMethods() {
    var select = $('#' + selectName);

    for(var i = 0; i < renderMethods.length; i++){
        select.append('<option value="' + renderMethods[i] + '">' + renderMethods[i] + "</option>'");
    }
    select.find('option[value="1"]').attr("selected",true);
}

function getAllDrawables() {return allDrawables}

function updateScene() {
    $.each(allDrawables, function(name, value) {
        planetInt.update(value);
        PlanetInterface.rotateAroundParent(value, [0, 0, 1], value.rotateSpeed);
    });

    rotateModelViewMatrixUsingQuaternion();
}