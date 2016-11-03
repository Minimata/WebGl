/**
 * Created by alexandre on 29.09.2016.
 */

class PlanetInterface extends DrawableInterface {
    constructor(drawable = null) {
        super(drawable);
    }

    fillArrays(drawable) {
        //this.createCircle(drawable);
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

        //console.log(indexOfSouthPole, drawable.vertices.length / 3 - 1)

        //throw new Error("bite");

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

    createCircle(drawable) {
        var i;
        drawable.vertices.push(0, 0, 0);
        drawable.colors.push(1, 1, 1, 1.0);

        for (i = 0; i < 360; i += 360 / drawable.divisions) {
            drawable.vertices.push(
                drawable.radius * Math.sin(glMatrix.toRadian(i)),
                drawable.radius * Math.cos(glMatrix.toRadian(i)),
                0.0
            );
            drawable.colors.push(drawable.r, drawable.g, drawable.b, 1.0);
        }

        for (i = 0; i < drawable.divisions - 1; i++) {
            drawable.indices.push(0, i + 1, i + 2);
        }

        drawable.indices.push(0, drawable.divisions, 1);
    }

    static rotateAroundParent(drawable, axis, step) {
        PlanetInterface.rotateAroundPoint(drawable, drawable.getPosAsVec(), axis, step);
    }

    static rotateAroundPoint(drawable, transVec, axis, step) {
        step = degToRad(step);
        var rotQuat, rotVec, transMat;

        rotQuat = quat.create();
        quat.setAxisAngle(rotQuat, axis, step);

        rotVec = vec3.create();
        vec3.set(rotVec, drawable.x, drawable.y, drawable.z);
        vec3.transformQuat(rotVec, rotVec, rotQuat);

        transMat = mat4.create();
        mat4.fromTranslation(transMat, transVec);

        drawable.setPosFromVec(rotVec);

        if (drawable.children) {
            $.each(drawable.children, function (name, value) {
                PlanetInterface.rotateAroundParent(value, axis, value.rotateSpeed);
            })
        }
    }
}