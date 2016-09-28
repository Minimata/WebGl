/**
 * Created by alexandre on 28.09.2016.
 */

var allPlanets = {
    "Earth": new Planet("Earth", 0.5, {r:0.14,g:0.29,b:0.65}, 0.0,0.0),
    "Moon": new Planet("Moon", 0.2, {r:1.0,g:0.96,b:0.83}, -0.6,0.0),
    "Mars": new Planet("Mars", 0.4, {r:1.0,g:0.2,b:0.05}, 0.5, 0.2)
};

function initAllPlanets() {
    $.each(allPlanets, function(name, planet) {
        planet.update();
    });
}

//Initialisation of the webgl context
function initWebGL() {
    try {
        glContext = getGLContext('webgl-canvas');
        initAllPlanets();
        initProgram();
        initScene();
        renderLoop();
    }
    catch (e) {
        console.error(e);
    }
}

function updateDivisions() {
    var slider = $('#slider-divisions');
    if(!slider.attr('id')) throw new BadIdGettingException("slider-divisions");
    $.each(allPlanets, function(name, planet) {
        planet.divisions = slider[0].value;
        planet.update();
    });
}
