/**
 * Created by alexandre on 28.09.2016.
 */

function updateDrawable() {
    this.vertices = [];
    this.colors = [];
    this.indices = [];

    //Defining the center point of the circle
    this.vertices.push(0.0, 0.0, 0.0);

    //Based on division, generates the various vertices for the circle
    for (let i = 0; i < 360; i += 360 / this.division) {
        this.vertices.push(
            this.radius * Math.sin(glMatrix.toRadian(i)),
            this.radius * Math.cos(glMatrix.toRadian(i)),
            this.z
        );
    }

    //And defines the same color for each of the vertices
    for (let i = 0; i < this.division + 1; i++) {
        this.colors.push(this.color.r, this.color.g, this.color.b, 1.0);
    }

    //Definies the indexes for the objects, used to link each point
    for (let i = 0; i < this.division - 1; i++) {
        this.indices.push(0, i + 1, i + 2);
    }
    //and links the last vertices
    this.indices.push(0, this.division, 1);

    //Converts the values to buffers
    this.vertexBuffer = getVertexBufferWithVertices(this.vertices);
    this.colorBuffer = getVertexBufferWithVertices(this.colors);
    this.indexBuffer = getIndexBufferWithIndices(this.indices);

    //Defines the position matrix of the object
    mat4.identity(this.mvMatrix);
    mat4.translate(this.mvMatrix, this.mvMatrix, vec3.fromValues(this.x, this.y, this.z));
}