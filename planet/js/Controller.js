/**
 * Created by alexandre on 28.09.2016.
 */

var allDrawables = {
    "Earth": new Planet("Earth", {r: 0.14, g: 0.29, b: 0.65, a: 1.0}, {x: 0.0, y:0.0, z:0.0}, 0.5, 8),
    "Moon": new Planet("Moon", {r: 1.0, g: 0.96, b: 0.83, a: 1.0},{x: -0.6, y:0.0, z:0.0}, {radius: 0.2, divisions: 8}),
    "Mars": new Planet("Mars", 1, 0.2, 0, {x: 0.5, y:0.2, z:0.0}, 1.0, 0.3)
};
var allInterfaces = {
    "Earth": new PlanetInterface(allDrawables["Earth"]),
    "Moon": new PlanetInterface(allDrawables["Moon"]),
    "Mars": new PlanetInterface(allDrawables["Mars"])
};
var isRenderingInWireFrame = false;

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
    $.each(allInterfaces, function (name, planet) {
        planet.update();
    });
}

function initEventHandling() {
    $('#slider-divisions').on('input', function () {
        var numDivisions = $(this).val();
        $.each(allInterfaces, function (name, int) {
            allDrawables[name].divisions = numDivisions;
            int.update(allDrawables[name]);
        });
    });

    $('#switchWireFrame').click(e => isRenderingInWireFrame = !isRenderingInWireFrame);
}

function getAllDrawables() {return allDrawables}

function updateScene() {
}