/**
 * Created by alexandre on 28.09.2016.
 */

class Drawable {
    constructor(id = "Minimata", ...options) {
        /** This constructor allows any number of argument, and "parse" them between Objects and other types.
         *  It dispatches the arguments between needed attributes of the object.
         *  It then initialize the undefined attributes of missing parameters at 1.0.
         *
         * This loop separates objects from other types in the options array, representing parameters.
         * Object.assign is (supposedly) a ES6 method to "concatenate" objects.
         * After the loop, the parameters given with the same name as an object attribute are assigned (ES6 syntax).
         */
        var args = {};
        var numArgs = [];
        for (var index = 0; index < options.length; index++) {
            if (options[index] instanceof Object) Object.assign(args, options[index]);
            else numArgs.push(options[index]);
        }
        var {x, y, z, r, g, b, a} = args;

        this.id = id;
        this.x = x;
        this.y = y;
        this.z = z;
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;

        /**
         * This loop analyzes the still undefined attributes and assign them the number/array/[insert type here]
         * to any undefined attribute, in the order they were extracetd from the parameters.
         * If any attribute is left undefined because of lack of parameters, it is set at 1.0.
         */
        var obj = this;
        $.each(obj, function(name, value) {
            if(!value) obj[name] = numArgs.shift();
            if(!obj[name]) obj[name] = 1.0;
        });
        console.log(this);

        //Initialisation of the buffers within the object
        this.vertexBuffer = null;
        this.indexBuffer = null;
        this.colorBuffer = null;
        //Initialisation of the arrays used to construct the object
        this.indices = [];
        this.vertices = [];
        this.colors = [];

        //Creation of a movement matrix specific for the object
        this.mvMatrix = mat4.create();

        /**if (new.target === Drawable) {
            throw new TypeError("Cannot construct Abstract instances directly");
        }*/
    }

    draw() {
        //Sends the mvMatrix to the shader
        glContext.uniformMatrix4fv(prg.mvMatrixUniform, false, this.mvMatrix);
        //Links and sends the vertexBuffer to the shader, defining the format to send it as
        glContext.bindBuffer(glContext.ARRAY_BUFFER, this.vertexBuffer);
        glContext.vertexAttribPointer(prg.vertexPositionAttribute, 3, glContext.FLOAT, false, 0, 0);
        //Links and sends the colorBuffer to the shader, defining the format to send it as
        glContext.bindBuffer(glContext.ARRAY_BUFFER, this.colorBuffer);
        glContext.vertexAttribPointer(prg.colorAttribute, 4, glContext.FLOAT, false, 0, 0);
        //Links the indexBuffer with the shader
        glContext.bindBuffer(glContext.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    }
}