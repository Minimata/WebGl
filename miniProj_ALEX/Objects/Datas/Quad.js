/**
 * Created by alexandre on 21.10.2016.
 */

class Quad extends Drawable {
    constructor(...args) {
        super(args);
        var {
            width = 1,
            height = 1
            } = GLTools_extractObjects(args);

        this._width = width;
        this._height = height;
    }
}