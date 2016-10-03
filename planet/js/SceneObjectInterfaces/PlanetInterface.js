/**
 * Created by alexandre on 29.09.2016.
 */

class PlanetInterface extends DrawableInterface {
    constructor(drawable = null) {
        super(drawable);
    }

    fillArrays(drawable = this.drawable) {

        var i;
        drawable.vertices.push(0.0, 0.0, 0.0);

        for (i = 0; i < 360; i += 360 / drawable.divisions) {
            drawable.vertices.push(
                drawable.radius * Math.sin(glMatrix.toRadian(i)),
                drawable.radius * Math.cos(glMatrix.toRadian(i)),
                drawable.z
            );
        }
        for (i = 0; i < drawable.divisions + 1; i++) {
            drawable.colors.push(drawable.r, drawable.g, drawable.b, 1.0);
        }

        for (i = 0; i < drawable.divisions - 1; i++) {
            drawable.indices.push(0, i + 1, i + 2);
        }

        drawable.indices.push(0, drawable.divisions, 1);
    }
}