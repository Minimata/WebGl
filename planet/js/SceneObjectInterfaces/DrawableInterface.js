/**
 * Created by alexandre on 28.09.2016.
 */

class DrawableInterface {
    constructor(drawable = null) {
        this.drawable = drawable;
        if (new.target === DrawableInterface) {
            throw new TypeError("Cannot construct DrawableInterface instances directly (abstract class)");
        }
    }

    update(drawable = this.drawable) {
        if(!drawable) throw ReferenceError("Null Drawable cannot be updated");
        drawable.vertices = [];
        drawable.colors = [];
        drawable.indices = [];

        this.fillArrays(drawable);

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
    fillArrays(drawable) {
        throw TypeError("function fillArrays shouldn't be executed from abstract class DrawableInterface.");
    }
}
