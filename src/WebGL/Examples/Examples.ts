/**
 * WebGL Examples Static Abstact Class
 * 
 * - Shader Source Code Examples
 *  - Vertex Shader
 *  - Fragment Shader
 * 
 * - Light Normals
 *  - Default Cube Normals
 */
export abstract class GL_Examples {
    /** 
     * @returns A Vertex Source Code Sample 
     */
    static getVSourceSample(): string {
        return `
            attribute vec4 aVertexPosition;
            attribute vec4 aVertexColor;
            attribute vec2 aTextureCoord;

            uniform mat4 uModelViewMatrix;
            uniform mat4 uProjectionMatrix;

            varying lowp vec4 vColor;
            varying highp vec2 vTextureCoord;

            void main() {
                gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
                vColor = aVertexColor;
                vTextureCoord = aTextureCoord;
            }
        `;
    }

    /**
     * @returns A Fragment Source Code Sample 
     */
    static getFSourceSample(): string {
        return `
            varying lowp vec4 vColor;
            varying highp vec2 vTextureCoord;

            uniform sampler2D uSampler;
            uniform bool isColor;

            void main() {
                if(isColor) {
                    gl_FragColor = vColor;
                }

                else {
                    gl_FragColor = texture2D(uSampler, vTextureCoord);
                }
            }
        `;
    }

    /**
     * Returns 1D Lighting Normals Array
     * @returns 1D Array of Normals for a Cube
     */
    static getLightNormals(): number[] {
        const cubeNormals = [
            // Front
            0.0,  0.0,  1.0,
            0.0,  0.0,  1.0,
            0.0,  0.0,  1.0,
            0.0,  0.0,  1.0,

            // Back
            0.0,  0.0, -1.0,
            0.0,  0.0, -1.0,
            0.0,  0.0, -1.0,
            0.0,  0.0, -1.0,

            // Top
            0.0,  1.0,  0.0,
            0.0,  1.0,  0.0,
            0.0,  1.0,  0.0,
            0.0,  1.0,  0.0,

            // Bottom
            0.0, -1.0,  0.0,
            0.0, -1.0,  0.0,
            0.0, -1.0,  0.0,
            0.0, -1.0,  0.0,

            // Right
            1.0,  0.0,  0.0,
            1.0,  0.0,  0.0,
            1.0,  0.0,  0.0,
            1.0,  0.0,  0.0,

            // Left
            -1.0,  0.0,  0.0,
            -1.0,  0.0,  0.0,
            -1.0,  0.0,  0.0,
            -1.0,  0.0,  0.0
        ];

        return cubeNormals;
    }
}