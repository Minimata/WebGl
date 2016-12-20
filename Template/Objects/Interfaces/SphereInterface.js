/**
 * Created by alexandre on 20.12.2016.
 */


class SphereInterface extends DrawableInterface {
    constructor() {
        super();
    }

    fillArrays(drawable) {
        this.createSphere(drawable);
    }

    createSphere(drawable) {

        var i, j;
        var n = drawable.divisions;

        var indexOfSouthPole = n * n + 1;

        //pole nord
        drawable.vertices.push(0.0, 0.0, drawable.radius);
        drawable.colors.push(1.0, 1, 1.0, 1.0);

        for (i = 0; i < 360; i += 360 / n) {
            for (j = 180 / (n + 1); j < 180; j += 180 / (n + 1)) {
                drawable.vertices.push(
                    drawable.radius * Math.cos(glMatrix.toRadian(i)) * Math.sin(glMatrix.toRadian(j)),
                    drawable.radius * Math.sin(glMatrix.toRadian(i)) * Math.sin(glMatrix.toRadian(j)),
                    drawable.radius * Math.cos(glMatrix.toRadian(j))
                );
                drawable.colors.push(
                    drawable.r + (1.0 - drawable.r)*Math.abs(0.4*Math.cos(glMatrix.toRadian(j))),
                    drawable.g + (1.0 - drawable.g)*Math.abs(0.4*Math.cos(glMatrix.toRadian(j))),
                    drawable.b + (1.0 - drawable.b)*Math.abs(0.4*Math.cos(glMatrix.toRadian(j))),
                    1.0);
            }
        }

        //pole sud
        drawable.vertices.push(0.0, 0.0, -drawable.radius);
        drawable.colors.push(1.0, 1.0, 1.0, 1.0);

        //poles - triangles
        for (i = 0; i < n - 1; i++) {
            drawable.indices.push(0, i * n + 1, (i + 1) * n + 1);
            drawable.indices.push(
                indexOfSouthPole,
                (i + 1) * n,
                (i + 2) * n
            );
        }
        //join
        drawable.indices.push(0, n * (n - 1) + 1, 1);
        drawable.indices.push(indexOfSouthPole, n*n, n);

        //body - quads
        for (i = 0; i < n - 1; i++) {
            for (j = 1; j < n; j++) {
                drawable.indices.push(
                    (i * n) + j,
                    (i * n) + (j + 1),
                    ((i + 1) * n) + (j + 1)
                );

                drawable.indices.push(
                    (i * n) + j,
                    ((i + 1) * n) + j,
                    ((i + 1) * n) + (j + 1)
                );
            }
        }

        //join
        for(i = 1; i < n; i++) {
            drawable.indices.push(
                n*(n - 1) + i,
                n*(n - 1) + i + 1,
                i + 1
            );

            drawable.indices.push(
                n*(n - 1) + i,
                i,
                i + 1
            );
        }
    }
}
