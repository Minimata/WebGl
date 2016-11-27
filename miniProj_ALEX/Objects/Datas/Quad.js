/**
 * Created by alexandre on 21.10.2016.
 */

class Quad extends Drawable {
    constructor(args = {}) {
        super(args);
        var {
            width = 1,
            height = 1,
            depth = 1,
            v1 = [-1, -1, 0],
            v2 = [-1, 1, 0],
            v3 = [1, -1, 0],
            v4 = [1, 1, 0],
            } = args;

        this._width = width;
        this._height = height;
        this._depth = depth;
        this._v1 = v1;
        this._v2 = v2;
        this._v3 = v3;
        this._v4 = v4;
    }

    get width() {return this._width}
    set width(w){this._width = w}
    get height() {return this._height}
    set height(h){this._height = h}
    get depth() {return this._depth}
    set depth(d){this._depth = d}
    get v1() {return this._v1;}
    set v1(v) {this._v1 = v;}
    get v2() {return this._v2;}
    set v2(v) {this._v2 = v;}
    get v3() {return this._v3;}
    set v3(v) {this._v3 = v;}
    get v4() {return this._v4;}
    set v5(v) {this._v4 = v;}
}