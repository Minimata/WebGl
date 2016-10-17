/**
 * Created by karim on 03.17.2016.
 */
class Cylinder{

	constructor(height, radius, x, y, z){
		this.vertexBuffer = null;
		this.indexBuffer = null;
		this.colorBuffer = null;

		this.indices = [];
		this.vertices = [];
		this.colors = [];

		this.mvMatrix = mat4.create();

		this.division = 500;
		this.height = height;
		this.radius = radius;
		this.x = x;
		this.y = y;
		this.z = z;

		this.init();
	}

	init(){
		//this variable is used to offset the center points from exterior points
		var offset = 2;
		//define base circle center for cylinder, to be extruded upwards
		this.vertices.push(this.x,this.y,this.z)
		//define end point circle center
		this.vertices.push(this.x,this.y,this.z+this.height)
		//define rim for base circle
		for(var i = 0;i<360;i+=360/this.division)
		{
			this.vertices.push(this.radius * Math.sin(glMatrix.toRadian(i)), this.radius * Math.cos(glMatrix.toRadian(i)),this.z);
		}
		//define rim for top circle
		for(var i = 0;i<360;i+=360/this.division)
		{
			this.vertices.push(this.radius * Math.sin(glMatrix.toRadian(i)), this.radius * Math.cos(glMatrix.toRadian(i)),this.z+this.height);
		}
		//define base color for Cylinder
		for(var i =0;i<this.division*2+2;i++)
		{
			this.colors.push(0.0, 0.1, 1.0, 1.0);
		}

		//define indexes, draw bottom circle
		for(var i=offset;i<this.division+offset-1;i++)
		{
			this.indices.push(0,i,i+1);
		}
		//close first circle
		this.indices.push(0,this.division+offset-1,offset);

		//define indexes, draw top circle
		for(var i=this.division+offset;i<this.division*2+offset-1;i++)
		{
			this.indices.push(1,i,i+1);
		}
		//close second circle
		this.indices.push(1,this.division+offset,this.division*2+offset-1);

		//draw surface between circles
		for(var i = offset; i<this.division/2+offset;i++){
			this.indices.push(i,i+this.division,i+1);
			this.indices.push(i+1,i+this.division,i+this.division+1);
		}
		//close outer surface
		this.indices.push(offset,offset+this.division,this.division*2+1);
		this.indices.push(offset,this.division*2+1,offset+this.division-1);

		this.vertexBuffer = getVertexBufferWithVertices(this.vertices);
		this.colorBuffer  = getVertexBufferWithVertices(this.colors);
		this.indexBuffer  = getIndexBufferWithIndices(this.indices);
	}

	draw() {
		mat4.identity(this.mvMatrix);
		mat4.translate(this.mvMatrix, this.mvMatrix, vec3.fromValues(this.x, this.y, this.z));

    glContext.bindBuffer(glContext.ARRAY_BUFFER, this.vertexBuffer);
    glContext.vertexAttribPointer(prg.vertexPositionAttribute, 3, glContext.FLOAT, false, 0, 0);

    glContext.bindBuffer(glContext.ARRAY_BUFFER, this.colorBuffer);
    glContext.vertexAttribPointer(prg.colorAttribute, 4, glContext.FLOAT, false, 0, 0);

    glContext.bindBuffer(glContext.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    glContext.drawElements(glContext.TRIANGLES, this.indices.length, glContext.UNSIGNED_SHORT, 0);
	}
}
