/**
 * Created by alexandre on 28.09.2016.
 */

class Drawable {
    constructor(...args) {

        this._defaultValues = {
            id: "Minimata",
            x: 0.0,
            y: 0.0,
            z: 0.0,
            r: 1.0,
            g: 1.0,
            b: 1.0,
            a: 1.0,
            renderingMethod: "TRIANGLES"
        };

        this._id = this._defaultValues.id;
        this._x = this._defaultValues.x;
        this._y = this._defaultValues.y;
        this._z = this._defaultValues.z;
        this._r = this._defaultValues.r;
        this._g = this._defaultValues.g;
        this._b = this._defaultValues.b;
        this._a = this._defaultValues.a;
        this._renderingMethod = this._defaultValues.renderingMethod;

        this.extractObjects(this, args);

        this._renderingMethods = {
            _obj: this
        };

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

        if (new.target === Drawable) {
            throw new TypeError("Cannot construct Drawable instances directly (abstract class)");
        }
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
    get defaultValues   ()  {return this._defaultValues}
    get renderingMethods    ()  {return this._renderingMethods}
    set renderingMethods    (r) {this._renderingMethods = r}
    get vertexBuffer    ()      {return this._vertexBuffer}
    set vertexBuffer    (v)     {this._vertexBuffer = v}
    get indexBuffer     ()      {return this._indexBuffer}
    set indexBuffer     (i)     {this._indexBuffer = i}
    get colorBuffer     ()      {return this._colorBuffer}
    set colorBuffer     (c)     {this._colorBuffer = c}
    get indices         ()      {return this._indices}
    set indices         (i)     {this._indices = i}
    get vertices        ()      {return this._vertices}
    set vertices        (v)     {this._vertices = v}
    get colors          ()      {return this._colors}
    set colors          (c)     {this._colors = c}
    get mvMatrix        ()      {return this._mvMatrix}
    set mvMatrix        (m)     {this._mvMatrix = m}

    getColors   ()  {return {r: this._r, g: this._g, b: this.b, a: this._a}}
    setColors   (...args)  {
        var {r = this._r, g = this._g, b = this._b, a = this._a} = args;
        this._r = r;
        this._g = g;
        this._b = b;
        this._a = a;
    }
    getPos     ()  {return{x: this._x, y: this._y, z: this._z}}
    setPos   (...args)  {
        var {x = this._x, y = this._y, z = this._z} = args;
        this._x = x;
        this._y = y;
        this._z = z;
    }

    extractObjects(obj, args) {
        var objArgs = {};
        var numArgs = [];
        var i;
        for (i = 0; i < args.length; i++) {
            if (args[i] instanceof Object) Object.assign(objArgs, args[i]);
            else numArgs.push(args[i]);
        }
        $.each(obj._defaultValues, function(attr) {
            if(objArgs[attr] === undefined){
                (numArgs[0] === undefined) ? obj['_' + attr] = obj._defaultValues[attr] : obj['_' + attr] = numArgs.shift();
            }
            else obj['_' + attr] = objArgs[attr]
        });
    }

    draw(render = this._renderingMethod) {
        if(!render) throw ReferenceError("No rendering method defined");
        if(!this.renderingMethods[render]) throw ReferenceError("No matching rendering method to " + render);

        glContext.uniformMatrix4fv(prg.mvMatrixUniform, false, this.mvMatrix);

        glContext.bindBuffer(glContext.ARRAY_BUFFER, this.vertexBuffer);
        glContext.vertexAttribPointer(prg.vertexPositionAttribute, 3, glContext.FLOAT, false, 0, 0);

        glContext.bindBuffer(glContext.ARRAY_BUFFER, this.colorBuffer);
        glContext.vertexAttribPointer(prg.colorAttribute, 4, glContext.FLOAT, false, 0, 0);

        glContext.bindBuffer(glContext.ELEMENT_ARRAY_BUFFER, this.indexBuffer);

        return this.renderingMethods[render]();
    }
}