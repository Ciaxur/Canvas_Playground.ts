import { gl } from "../../Canavs/Canvas";
import { LightingTypes } from "../Global/Types";
import { LightingData } from "../Global/Interfaces";

/**
 * Lighting Class on 3D Objects
 * 
 * METHODS
 * - Keeps track of Lighting Types from Shader
 * - Returns Lighting Data
 * - Set Lighting Type
 * - Execute Lighting Instructions
 * 
 * STATIC METHODS
 * - Generate Normals for the Verticies
 * 
 * 
 */
export class Lighting {
// Private Variables
    private lightingType: LightingTypes;            // Keep track of the Lighting Type Used
    private lightingData: LightingData;             // Keep Lighting Data Locations
    private shaderProgram: WebGLProgram;            // The Shader Program Being Used
    

// METHODS
    /** Initiate Default WebGL Lighting
     * Init Default WebGL Lighting
     * 
     * @param shaderProgram The WebGL Program Being Used
     */
    constructor(shaderProgram: WebGLProgram) {
        // Default Lighting Type
        this.lightingType = "default";

        // Set Shadder Program
        this.shaderProgram = shaderProgram;

        // Initiate Lighting Data Locations
        this.lightingData = {
            uniform: {
                ambientData:    gl.getUniformLocation(this.shaderProgram, "isAmbientLighting"),
                diffuseData:    gl.getUniformLocation(this.shaderProgram, "isDiffuseLighting"),
                specularData:   gl.getUniformLocation(this.shaderProgram, "isSpecularLighting"),
                phongData:      gl.getUniformLocation(this.shaderProgram, "isPhong"),
                experimental:   gl.getUniformLocation(this.shaderProgram, "isExperimental")
            }
        };
    }

    /** Sets Lighting Type 
     * 
     * @param type The New Lighting Type
     * @param update Boolean State to Update Shader Settings or not (Optional -> Default = true)
     */
    public setType(type: LightingTypes, update?: boolean): void {
        // Check 'update' State
        // Set Default Value if Undefined
        if (update === undefined) {
            update = true;
        }
        
        // Reset Lighting States
        this.resetLightingStates();

        // Set Lighting Type being used
        this.lightingType = type;

        // Update the Lighting
        if (update) {
            this.update();
        }
    }

    /** Updates the Lighting to Shader */
    public update(): void {
        // Activate Lighting type from Lighting Data Location
        // If not default then go throught and activate which ever it is
        if (this.lightingType !== "default") {
            if (this.lightingType === "ambient") {
                gl.uniform1f(this.lightingData.uniform.ambientData, 1);
            }
    
            else if (this.lightingType === "diffuse") {
                gl.uniform1f(this.lightingData.uniform.diffuseData, 1);
            }
    
            else if (this.lightingType === "specular") {
                gl.uniform1f(this.lightingData.uniform.specularData, 1);
            }
    
            else if (this.lightingType === "phong") {
                gl.uniform1f(this.lightingData.uniform.phongData, 1);
            }

            else if (this.lightingType === "experimental") {
                gl.uniform1f(this.lightingData.uniform.experimental, 1);
            }
        }
    }


// PRIVATE METHODS
    /** Resets all State to False */
    private resetLightingStates(): void {
        gl.useProgram(this.shaderProgram);
        gl.uniform1f(this.lightingData.uniform.ambientData, 0);
        gl.uniform1f(this.lightingData.uniform.diffuseData, 0);
        gl.uniform1f(this.lightingData.uniform.specularData, 0);
        gl.uniform1f(this.lightingData.uniform.phongData, 0);
        gl.uniform1f(this.lightingData.uniform.experimental, 0);
    }


// STATIC METHODS
    /** Generates a Normals Buffer
     * Default -> Creates a Normals Buffer for a Cube
     * 
     * @param verticies The Verticies 1D Array that will be used to generate Normals
     * @param normalsArr The Normals 1D Array that will be binded into buffer (Optional -> Default Algorithmically Generated Based on Faces)
     * @returns a WebGL Buffer for Normals
    */
    static generateNormals(verticies: number[], normalsArr?: number[]): WebGLBuffer {
        // Create & Bind Buffer
        const normalBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);

        // Variable that Holds the Normals 1D Array Values
        let normals: number[] = [];


        // Assign the Buffer Array
        if (normalsArr) {
            normals = normalsArr;
        }

        // Generate Normals by Normalizing them to between 0 and 1
        else {
            const arr = [];
            let largest = -1;
            let smallest = Infinity;

            // Find Largest & Smallest Value
            for (const val of verticies) {
                largest = (val > largest) ? val : largest;
                smallest = (val < smallest) ? val : smallest;
            }

            // Normalize all Values
            for (const val of verticies) {
                arr.push(normalize(val, smallest, largest, 0, 1));
            }
            
            normals = arr;
        }



        // Apply data to Buffer
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);

        
        return normalBuffer;
    }
}


function normalize(n: number, start1: number, stop1: number, start2: number, stop2: number) {
    return (n - start1) / (stop1 - start1) * (stop2 - start2) + start2;
}
