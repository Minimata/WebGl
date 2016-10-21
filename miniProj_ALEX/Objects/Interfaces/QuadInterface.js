/**
 * Created by alexandre on 21.10.2016.
 */

class QuadInterface extends DrawableInterface {
    constructor() {
        super();
    }

    fillArrays(quad) {
        for(var i = quad.x - quad.width / 2; i < quad.x + quad.width / 2; i += quad.width / quad.divisions) {
            for(var j = quad.y - quad.height / 2; j < quad.y + quad.height / 2; j += quad.height / quad.divisions) {
                quad.vertices.push(i, j, 0);
                quad.vertices.push(i + quad.width / quad.divisions, j, 0);
                quad.vertices.push(i, j + quad.width / quad.divisions, 0);
                quad.vertices.push(i + quad.width / quad.divisions, j + quad.width / quad.divisions, 0);

                quad.colors.push(Math.random(), Math.random(), Math.random(), quad.a);
                quad.colors.push(Math.random(), Math.random(), Math.random(), quad.a);
                quad.colors.push(Math.random(), Math.random(), Math.random(), quad.a);
                quad.colors.push(Math.random(), Math.random(), Math.random(), quad.a);
            }
        }

        for(var k = 0; k < quad.vertices.length / 3 - 2; k += 4) {
            quad.indices.push(k, k + 1, k + 2);
            quad.indices.push(k + 3, k + 2, k + 1);
        }
    }
}