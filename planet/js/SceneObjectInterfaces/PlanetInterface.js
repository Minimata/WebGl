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

        //pole nord
        drawable.vertices.push(0.0, 0.0, drawable.radius);

        for (i = 0; i < 360; i += 360 / drawable.divisions) {
            for (j = 0; j < 180; j += 180 / drawable.divisions) {
                drawable.vertices.push(
                    drawable.radius * Math.cos(glMatrix.toRadian(i)) * Math.sin(glMatrix.toRadian(j)),
                    drawable.radius * Math.sin(glMatrix.toRadian(i)) * Math.cos(glMatrix.toRadian(j)),
                    drawable.radius * Math.cos(glMatrix.toRadian(j))
                );
                drawable.colors.push(drawable.r, drawable.g, drawable.b, 1.0);
            }
        }

        //pole sud
        drawable.vertices.push(0.0, 0.0, -drawable.radius);

        //poles
        for (i = 0; i < drawable.divisions; i++) {
            drawable.indices.push(0, i*drawable.divisions + 1, (i + 1) * drawable.divisions + 1);
            drawable.indices.push(
                Math.pow(drawable.divisions, 2) + 1,
                i + drawable.divisions - 1,
                i + 2*drawable.divisions - 1
            );
        }

        for (i = 0; i < 360; i += 360 / drawable.divisions) {

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
        }

        for (i = 1; i < drawable.divisions + 1; i++) {
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