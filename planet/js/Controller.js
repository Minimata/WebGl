/**
 * Created by alexandre on 28.09.2016.
 */

var allPlanets = [
    new Planet("Earth", 0.5, {r:0.14,g:0.29,b:0.65}, 0.0,0.0),
    new Planet("Moon", 0.2, {r:1.0,g:0.96,b:0.83}, -0.6,0.0),
    new Planet("Mars", 0.4, {r:1.0,g:0.2,b:0.05}, 0.5, 0.2)
];

function initAllPlanets() {
    for(let i = 0; i < allPlanets.length; i++) {
        allPlanets[i].update();
    }
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
        console.log(e);
        if (e.message) console.log(e.message); //comfort of use
    }
    finally {
    }
}

function updateDivisions() {
    var slider = document.getElementById("slider-divisions");
    if(!slider) throw new BadIdGettingException("slider-divisions");
    for(let i = 0; i < allPlanets.length; i++) {
        allPlanets[i].divisions = slider.value;
        allPlanets[i].update();
    }
}
