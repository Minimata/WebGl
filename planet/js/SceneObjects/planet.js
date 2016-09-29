/**
 *    planet.js - class handling the Planet object
 */


class Planet extends Drawable{
    constructor(id = "MinimataPlanet", ...args) {
        super(id, ...args);

        var objArgs = {};
        var numArgs = [];
        this.extractObjects(args, objArgs, numArgs);
        var {radius, divisions} = objArgs;

        this._radius = radius;
        this._divisions = divisions;

        /**
         * Broken
         */
        //this.assignNumericArgs(this, numArgs, 3);

        console.log(this);
    }

    get divisions   ()      {return this._divisions}
    set divisions   (div)   {this._divisions = div}
    get radius      ()      {return this._radius}
    set radius      (r)   {this._radius = r}

    draw() {
        super.draw();
        if (isRenderingInWireFrame) {
            glContext.drawElements(glContext.LINES, this.indices.length, glContext.UNSIGNED_SHORT, 0);
        }
        else {
            glContext.drawElements(glContext.TRIANGLES, this.indices.length, glContext.UNSIGNED_SHORT, 0);
        }
    }
}


