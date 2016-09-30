/**
 * Created by alexandre on 28.09.2016.
 */

var jiggle = 0;
var allPositions = {
    "Earth": {x: 0.0, y:0.0, z:0.0},
    "Moon": {x: -0.6, y:0.0, z:0.0},
    "Mars": {x: 0.5, y:0.2, z:0.0}
};

var allColors = {
    "Earth": {r: 0.14, g: 0.29, b: 0.65, a: 1.0},
    "Moon": {r: 1.0, g: 0.96, b: 0.83, a: 1.0},
    "Mars": {r: 1.0, g: 0.2, b: 0.0, a: 1.0}
};

var allPlanetProperties = {
    "Earth": {radius: 0.5, divisions: 100},
    "Moon": {radius: 0.2, divisions: 100},
    "Mars": {radius: 0.4, divisions: 100}
};

var renderMethod = 0;
var renderMethods = [
    "TRIANGLES",
    "LINES"
];

var allDrawables = {
    "Earth": new Planet("Earth",
        renderMethods[renderMethod],
        allColors["Earth"],
        allPositions["Earth"],
        allPlanetProperties["Earth"]),
    "Moon": new Planet("Moon",
        renderMethods[renderMethod],
        allColors["Moon"],
        allPositions["Moon"],
        allPlanetProperties["Moon"]),
    "Mars": new Planet("Mars",
        renderMethods[renderMethod],
        allColors["Mars"],
        allPositions["Mars"],
        allPlanetProperties["Mars"])
};

var allInterfaces = {
    "Earth": new PlanetInterface(allDrawables["Earth"]),
    "Moon": new PlanetInterface(allDrawables["Moon"]),
    "Mars": new PlanetInterface(allDrawables["Mars"])
};

window.onload = displayTitle("DEM PLANETS MAN");

$(function () {
    try {
        glContext = getGLContext('webgl-canvas');
        initAllDrawables();
        initProgram();
        initScene();
        initEventHandling();

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

function initEventHandling() {
    $('#slider-divisions').on('input', function () {
        var numDivisions = $(this).val();
        $.each(allInterfaces, function (name, planetInt) {
            allDrawables[name].divisions = numDivisions;
            planetInt.update();
        });
    });

    $('#switchWireFrame').click(function() {
        renderMethod++;
    });
}

function getAllDrawables() {return allDrawables}

function updateScene() {
    jiggle += 0.1;
    $.each(allInterfaces, function (name, planetInt) {
        allDrawables[name].x = allPositions[name].x * (1 + Math.sin(jiggle) / 10);
        planetInt.update();
    });
}