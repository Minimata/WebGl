/**
 *    planet.js - class handling the Planet object
 */


class Planet extends Drawable{
    constructor(...args) {
        super(...args);

        Object.assign(this._defaultValues, {
            radius: 0.5,
            divisions: 100
        });

        this._radius = this._defaultValues.radius;
        this._divisions = this._defaultValues.divisions;

        this.extractObjects(this, args);

        Object.assign(this._renderingMethods, {
            LINES: this.LINES,
            TRIANGLES: this.TRIANGLES,
            TRIANGLE_FAN: this.TRIANGLE_FAN
        })
    }

    get divisions   ()      {return this._divisions}
    set divisions   (div)   {this._divisions = div}
    get radius      ()      {return this._radius}
    set radius      (r)     {this._radius = r}

    LINES() {
        return glContext.drawElements(glContext.LINES, this._obj.indices.length, glContext.UNSIGNED_SHORT, 0);
    }

    TRIANGLES() {
        return glContext.drawElements(glContext.TRIANGLES, this._obj.indices.length, glContext.UNSIGNED_SHORT, 0);
    }

    TRIANGLE_FAN() {
        return glContext.drawElements(glContext.TRIANGLE_FAN, this._obj.indices.length, glContext.UNSIGNED_SHORT, 0);
    }
}


