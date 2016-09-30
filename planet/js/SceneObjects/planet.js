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

        Object.assign(this._renderingMethods, {
            LINES: this.LINES,
            TRIANGLES: this.TRIANGLES
        })
    }

    get divisions   ()      {return this._divisions}
    set divisions   (div)   {this._divisions = div}
    get radius      ()      {return this._radius}
    set radius      (r)     {this._radius = r}

    draw(render = this._renderingMethod) {
        super.draw(render);
    }

    LINES() {
        return glContext.drawElements(glContext.LINES, this._obj.indices.length, glContext.UNSIGNED_SHORT, 0);
    }

    TRIANGLES() {
        return glContext.drawElements(glContext.TRIANGLES, this._obj.indices.length, glContext.UNSIGNED_SHORT, 0);
    }
}


