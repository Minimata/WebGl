/**
 * Created by alexandre on 28.09.2016.
 */

function updateDrawable(drawable) {
    drawable.vertices = [];
    drawable.colors = [];
    drawable.indices = [];

    fillArrays();

    //Converts the values to buffers
    drawable.vertexBuffer = getVertexBufferWithVertices(drawable.vertices);
    drawable.colorBuffer = getVertexBufferWithVertices(drawable.colors);
    drawable.indexBuffer = getIndexBufferWithIndices(drawable.indices);

    //Defines the position matrix of the object
    mat4.identity(drawable.mvMatrix);
    mat4.translate(drawable.mvMatrix, drawable.mvMatrix, vec3.fromValues(drawable.x, drawable.y, drawable.z));
}

/**
 * This is where the drawing logic of the children will be
 */
function fillArrays() {}