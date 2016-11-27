/**
 * Created by alexandre on 21.10.2016.
 */

class QuadInterface extends DrawableInterface {
    constructor() {
        super();
    }

    fillArrays(quad) {
        quad.vertices.push(quad.v1[0]*quad.width / 2, quad.v1[1]*quad.height / 2, quad.v1[2]*quad.depth / 2);
        quad.vertices.push(quad.v2[0]*quad.width / 2, quad.v2[1]*quad.height / 2, quad.v2[2]*quad.depth / 2);
        quad.vertices.push(quad.v3[0]*quad.width / 2, quad.v3[1]*quad.height / 2, quad.v3[2]*quad.depth / 2);
        quad.vertices.push(quad.v4[0]*quad.width / 2, quad.v4[1]*quad.height / 2, quad.v4[2]*quad.depth / 2);
        for(var i = 0; i < quad.vertices.length / 3; i++) {
            quad.colors.push(quad.r, quad.g, quad.b, 1);
        }

        quad.indices.push(0, 1, 2);
        quad.indices.push(3, 2, 1);
    }
}