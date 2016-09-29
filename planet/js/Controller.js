/**
 * Created by alexandre on 28.09.2016.
 */

var allDrawables = {
    "Earth": new Planet("Earth", 0.5, {r: 0.14, g: 0.29, b: 0.65}, 0.0, 0.0),
    "Moon": new Planet("Moon", 0.2, {r: 1.0, g: 0.96, b: 0.83}, -0.6, 0.0),
    "Mars": new Planet("Mars", 0.4, {r: 1.0, g: 0.2, b: 0.05}, 0.5, 0.2)
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
        //Examples to test Drawable constructor
        new Drawable("Earth", 0.5, {r: 0.14, g: 0.29, b: 0.65}, {x: 0.3, y:0.4}, 12);
        new Drawable("Moon", 0.1, 0.2, 0.3, {r: 0.14, g: 0.29, b: 0.65});
        new Drawable();
        renderLoop();
    }
    catch (e) {
        console.error(e);
    }
});

function initAllDrawables() {
    $.each(allDrawables, function (name, planet) {
        planet.update();
    });
}

function initEventHandling() {
    $('#slider-divisions').on('input', function () {
        var numDivisions = $(this).val();
        $.each(allDrawables, function (name, planet) {
            planet.divisions = numDivisions;
            planet.update();
        });
    });

    $('#switchWireFrame').click(e => isRenderingInWireFrame = !isRenderingInWireFrame);
}

function getAllAdrawables() {return allDrawables}

function updateScene() {

}