/**
 *    planet.js - class handling the Planet object
 */


class Planet extends Drawable{
    constructor(...args) {
        super(...args);

        Object.assign(this.defaultValues, {
            radius: 0.5,
            divisions: 100
        });

        this._radius = this.defaultValues.radius;
        this._divisions = this.defaultValues.divisions;

        this.extractObjects(this, args);

        console.log(this);
    }

    get divisions   ()      {return this._divisions}
    set divisions   (div)   {this._divisions = div}
    get radius      ()      {return this._radius}
    set radius      (r)     {this._radius = r}

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


