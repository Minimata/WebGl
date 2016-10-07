/**
 * Created by alexandre on 29.09.2016.
 */

class PlanetInterface extends DrawableInterface {
    constructor(drawable = null) {
        super(drawable);
    }

    fillArrays(drawable) {
        var i;
        drawable.vertices.push(drawable.x, drawable.y, drawable.z);
        drawable.colors.push(1, 1, 1, 1.0);

        for (i = 0; i < 360; i += 360 / drawable.divisions) {
            drawable.vertices.push(
                drawable.radius * Math.sin(glMatrix.toRadian(i)),
                drawable.radius * Math.cos(glMatrix.toRadian(i)),
                drawable.z
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
        //vec3.transformMat4(rotVec, rotVec, transMat);

        drawable.setPosFromVec(rotVec);

        if(drawable.children) {
            $.each(drawable.children, function(name, value) {
                PlanetInterface.rotateAroundParent(value, axis, value.rotateSpeed);
            })
        }
    }
}