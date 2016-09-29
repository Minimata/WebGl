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

        this._id = id;
        this._x = x;
        this._y = y;
        this._z = z;
        this._r = r;
        this._g = g;
        this._b = b;
        this._a = a;

        /**
         * This loop analyzes the still undefined attributes and assign them the number/array/[insert type here]
         * to any undefined attribute, in the order they were extracetd from the parameters.
         * If any attribute is left undefined because of lack of parameters, it is set at 1.0.
         */
        var obj = this;
        $.each(obj, function (name, value) {
            if (!value) obj[name] = numArgs.shift();
            if (!obj[name]) obj[name] = 1.0;
        });
        console.log(this);

        //Initialisation of the buffers within the object
        this._vertexBuffer = null;
        this._indexBuffer = null;
        this._colorBuffer = null;
        //Initialisation of the arrays used to construct the object
        this._indices = [];
        this._vertices = [];
        this._colors = [];

        //Creation of a movement matrix specific for the object
        this._mvMatrix = mat4.create();

        /**if (new.target === Drawable) {
            throw new TypeError("Cannot construct Abstract instances directly");
        }*/
    }

    get id  ()      {return this._id;}
    set id  (id)    {this._id = id;}
    get x   ()      {return this._x}
    set x   (x)     {this._x = x}
    get y   ()      {return this._y}
    set y   (y)     {this._y = y}
    get z   ()      {return this._z}
    set z   (z)     {this._z = z}
    get r   ()      {return this._r}
    set r   (r)     {this._r = r}
    get g   ()      {return this._g}
    set g   (g)     {this._g = g}
    get b   ()      {return this._b}
    set b   (b)     {this._b = b}
    get a   ()      {return this._a}
    set a   (a)     {this._a = a}
    get vertexBuffer   ()      {return this._vertexBuffer}
    set vertexBuffer   (v)     {this._vertexBuffer = v}
    get indexBuffer   ()      {return this._indexBuffer}
    set indexBuffer   (i)     {this._indexBuffer = i}
    get colorBuffer   ()      {return this._colorBuffer}
    set colorBuffer   (c)     {this._colorBuffer = c}
    get indices   ()      {return this._indices}
    set indices   (i)     {this._indices = i}
    get vertices   ()      {return this._vertices}
    set vertices   (v)     {this._vertices = v}
    get colors   ()      {return this._colors}
    set colors   (c)     {this._colors = c}
    get mvMatrix   ()      {return this._mvMatrix}
    set mvMatrix   (m)     {this._mvMatrix = m}

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