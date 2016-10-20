/**
 * Created by alexandre on 03.10.2016.
 */


var m_allShortcutsBehaviours = {
    65: pressedA,
    67: pressedC,
    68: pressedD,
    69: pressedE,
    81: pressedQ,
    82: pressedR,
    83: pressedS,
    87: pressedW,
    89: pressedY
};

document.onkeydown = function (e) {
    e = e || window.event;//Get event
    var c = e.which || e.keyCode;//Get key code
    //console.log(c);
    if(m_allShortcutsBehaviours.hasOwnProperty(c)){
        m_allShortcutsBehaviours[c](e);
    }
};

function pressedA(e) {
    if(e.shiftKey) mainCamera.speed = mainCamera.getFastSpeed();
    else mainCamera.speed = mainCamera.getDefaultSpeed();
    mainCamera.moveLeft();
}

function pressedW(e) {
    if(e.shiftKey) mainCamera.speed = mainCamera.getFastSpeed();
    else mainCamera.speed = mainCamera.getDefaultSpeed();
    mainCamera.moveFront();
}

function pressedS(e) {
    if(e.shiftKey) mainCamera.speed = mainCamera.getFastSpeed();
    else mainCamera.speed = mainCamera.getDefaultSpeed();
    mainCamera.moveBack();
}

function pressedD(e) {
    if(e.shiftKey) mainCamera.speed = mainCamera.getFastSpeed();
    else mainCamera.speed = mainCamera.getDefaultSpeed();
    mainCamera.moveRight();
}

function pressedQ(e) {
    if(e.shiftKey) mainCamera.speed = mainCamera.getFastSpeed();
    else mainCamera.speed = mainCamera.getDefaultSpeed();
    mainCamera.moveUp();
}

function pressedE(e) {
    if(e.shiftKey) mainCamera.speed = mainCamera.getFastSpeed();
    else mainCamera.speed = mainCamera.getDefaultSpeed();
    mainCamera.movedown();
}

function pressedY(e) {
    mainCamera.rotateLeft();
}

function pressedC(e) {
    mainCamera.rotateRight();
}

function pressedR(e) {
    mainCamera.reset();
}