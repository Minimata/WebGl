/*******************************************************************************
 Mouse motion handling
 *******************************************************************************/

/**
 * keys handling
 *
 * document.onkeydown = function (e) {
    e = e || window.event;//Get event
    if (e.ctrlKey) {
        var c = e.which || e.keyCode;//Get key code
        switch (c) {
            case 83://Block Ctrl+S
                e.preventDefault();
                e.stopPropagation();
                console.log(c);
                break;
        }
    }
};


 $('#id').keydown(function(event){
    console.log(event.key);
    console.log(event.keyCode);
    event.preventDefault();
    event.stopPropagation();
});
 */

// get a reference to the webgl canvas
var myCanvas = document.getElementById('webgl-canvas');
myCanvas.onmousemove = handleMouseMove;
myCanvas.onmousedown = handleMouseDown;
myCanvas.onmouseup = handleMouseUp;

// this variable will tell if the mouse is being moved while pressing the button
var rotY = 0; //rotation on the Y-axis (in degrees) 
var rotX = 0; //rotation on the X-axis (in degrees) 
var dragging = false;
var oldMousePos = {x: 0, y: 0};
var mousePos;
var rotSpeed = 1.0; //rotation speed 
var mouseButton;

function handleMouseMove(event) {
    var dX, dY;
    event = event || window.event; // IE-ism
    mousePos = {
        x: event.clientX,
        y: event.clientY
    };
    if (dragging) {
        dX = mousePos.x - oldMousePos.x;
        dY = mousePos.y - oldMousePos.y;

        //console.log((mousePos.x - oldMousePos.x) + ", " + (mousePos.y - oldMousePos.y)); //--- DEBUG LINE ---

        rotY += dX > 0 ? rotSpeed : dX < 0 ? -rotSpeed : 0;
        rotX += dY > 0 ? rotSpeed : dY < 0 ? -rotSpeed : 0;
        oldMousePos = mousePos;
    }
}

function handleMouseDown(event) {
    dragging = true;
    mouseButton = event.button;
    oldMousePos.x = oldMousePos.y = 0;
}

function handleMouseUp(event) {
    dragging = false;
}

// in the next function 'currentRy' is usefull for the exercice 8-9
var currentRy = 0; //keeps the current rotation on y, used to keep the billboards orientation

function rotateModelViewMatrixUsingQuaternion(stop) {

    stop = typeof stop !== 'undefined' ? stop : false;
    //use quaternion rotations for the rotation of the object with the mouse
    /*angle = degToRad(rotY);
     currentRy += angle;
     rotYQuat = quat.create([0, Math.sin(angle/2), 0, Math.cos(angle/2)]);

     angle = degToRad(rotX);
     rotXQuat = quat4.create([Math.sin(angle/2), 0, 0, Math.cos(angle/2)]);

     myQuaternion = quat4.multiply(rotYQuat, rotXQuat);
     mvMatrix = mat4.multiply(quat4.toMat4( myQuaternion ), mvMatrix);
     */
    var rx = degToRad(rotX);
    var ry = degToRad(rotY);

    var rotXQuat = quat.create();
    quat.setAxisAngle(rotXQuat, [1, 0, 0], rx);

    var rotYQuat = quat.create();
    quat.setAxisAngle(rotYQuat, [0, 1, 0], ry);

    var myQuaternion = quat.create();
    quat.multiply(myQuaternion, rotYQuat, rotXQuat);

    var rotationMatrix = mat4.create();
    mat4.identity(rotationMatrix);
    mat4.fromQuat(rotationMatrix, myQuaternion);
    mat4.multiply(mvMatrix, rotationMatrix, mvMatrix);
    //reset rotation values, otherwise rotation accumulates
    if (stop) {
        rotX = 0.;
        rotY = 0.;
    }
}
