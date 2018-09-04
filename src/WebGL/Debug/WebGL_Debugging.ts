/**
 * Debugging Class
 * 
 * - Display all Active Attributes
 */
export abstract class WebGL_Debug {
    /** Console logs all Active Attributes from Shader Program
     * @param program Compiled Shader Program
     */
    static logActiveAttributes(program: WebGLProgram, gl: WebGLRenderingContext): void {
        console.log("-----List of Used Attributes-----");

        const totalAttr = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES);

        for (let x = 0; x < totalAttr; x++) {
            const attribInfo = gl.getActiveAttrib(program, x);

            if (!attribInfo) break;

            console.log(gl.getAttribLocation(program, attribInfo.name), attribInfo.name);
        }
    }
}