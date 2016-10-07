/*******************************************************************************
 Mouse motion handling
 *******************************************************************************/

// this variable will tell if the mouse is being moved while pressing the button
var rotY = 0; //rotation on the Y-axis (in degrees) 
var rotX = 0; //rotation on the X-axis (in degrees) 
var dragging = false;
var oldMousePos = {x: 0, y: 0};
var rotSpeed = 1.0; //rotation speed

function getMousePos(evt) {
    var rect = myCanvas[0].getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}

function handleMouseMove(event) {
    var dX, dY;
    event = event || window.event; // IE-ism
    if (dragging) {
        var {x, y} = getMousePos(event);
        dX = x - oldMousePos.x;
        dY = y - oldMousePos.y;

        //console.log(dx + ", " + dy); //--- DEBUG LINE ---

        rotY += dX > 0 ? rotSpeed : dX < 0 ? -rotSpeed : 0;
        rotX += dY > 0 ? rotSpeed : dY < 0 ? -rotSpeed : 0;
        oldMousePos = {x, y};
    }
}

function handleMouseDown() {
    dragging = true;
    oldMousePos.x = oldMousePos.y = 0;
}

function handleMouseUp() {
    dragging = false;
}

// in the next function 'currentRy' is useful for exercises 8-9
var currentRy = 0; //keeps the current rotation on y, used to keep the billboards orientation

function rotateModelViewMatrixUsingQuaternion() {
    var rx = degToRad(rotX);
    var ry = degToRad(rotY);

    var rotXQuat = quat.create();
    quat.setAxisAngle(rotXQuat, vec3.fromValues(1, 0, 0), rx);

    var rotYQuat = quat.create();
    quat.setAxisAngle(rotYQuat, vec3.fromValues(0, 1, 0), ry);

    var myQuaternion = quat.create();
    quat.multiply(myQuaternion, rotYQuat, rotXQuat);

    var rotationMatrix = mat4.create();
    mat4.fromQuat(rotationMatrix, myQuaternion);
    mat4.multiply(mvMatrix, rotationMatrix, mvMatrix);
}
