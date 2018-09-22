import { gl } from "../../Canavs/Canvas";
import { WebGL_BufferLocation, WebGL_ShaderProgramInfo, WebGL_TextureBuffer } from '../Global/Interfaces';
import { is2DArray, flatten2DArray } from "../../Math/Array";
import { GL_Examples } from "../Examples/Examples";
import { Textures } from "../Material/Textures";
import { Lighting } from "../Material/Lighting";
import { Scene } from "./Scene";
import { ShapeBuffer } from "../Memory/Buffer";
import { GenerateShapes, ShapeVerticies, Shapes, Cube3D, Rect3D, ShapeObject } from "../Objects/Shapes";
import { readStrFile } from "../../IO/FileIO";
import { DEFAULT_SHADERS } from "../../Canavs/Constants";



/**
 * Abstract WebGL Drawing Class used only for drawing functions (Static Functions)
 * 
 * DRAWING
 * - Background Draw
 * 
 * 
 * PROGRAM INFO / SHADER
 * - Compile Shader Program (Vertex and Fragment Shaders)
 * - Loads Shaders from Source Based on Type and Compiles it
 * - Create Shader Program Information
 * - Loads Shader File from Path
 * 
 *  
 * BUFFERS
 * - Create 2D Buffer Vertex (Color is optional)
 * - Create 3D Buffer Vertex (Color / Indicies / Texture)
 * 
 * SHAPE MANIPULATION
 * - Generates Indicies Based on Verticies
 * - Generate Triangular Indicie Form
 */
export abstract class WebGL {

// Public Class Variables
    static Examples = GL_Examples;

    // Scene Classes & Setting
    static Scene = Scene;
    static Lighting = Lighting;
    static Textures = Textures;

    // Shape Objects & Properties
    static Shapes = {
        Buffer: ShapeBuffer,
        Generate: GenerateShapes,
        Verticies: ShapeVerticies,
        Shape: Shapes,

        Create: {
            Cube3D: Cube3D,
            Rect3D: Rect3D,
            ShapeObject: ShapeObject
        }
    }


// Public Read-Only Variables
    static readonly VERTEX_SOURCE_SMAMPLE   = WebGL.Examples.getVSourceSample();       // Sample Code ( Vertex )
    static readonly FRAGMENT_SOURCE_SMAMPLE = WebGL.Examples.getFSourceSample();       // Sample Code ( Fragment )
    static readonly DEFAULT_SHADER_SOURCE = DEFAULT_SHADERS;



// VERIFICATIONS
    /** Verifies WebGL's Status 
     * @returns Boolean Status Good(true) ; Bad(false)
    */
    static VERIFY_WEBGL_STATUS(): boolean {
        if (gl === null) {
            console.error("WebGL Status Failed! Check if WebGL is supported by browser.");
            return false;
        }

        return true;
    }


// BACKGROUND DRAW
    /** Draws Background Based on RGB / RGBA
     * Values are (0-1) NOT (0-255)
     * 
     * @param r The Red Color Value
     * @param g The Green Color Value
     * @param b The Blue Color Value
     * @param alpha The Alpha Value (Optional)
     */
    static background(r: number, g: number, b: number, alpha ?: number): void {
        // Verify WebGL Status
        if (!WebGL.VERIFY_WEBGL_STATUS()) return;

        // Sets the Clear Color to Specified
        gl.clearColor(r, g, b, alpha | 1.0);

        // Clears WebGL Color Buffer
        gl.clear(gl.COLOR_BUFFER_BIT);
    }

    /** Draws RGB / RGBA Background with Deapth 
     * Values are (0-1) NOT (0-255)
     * 
     * @param r The Red Color Value
     * @param g The Green Color Value
     * @param b The Blue Color Value
     * @param alpha The Alpha Value (Optional -> Default = 1.0)
     * @param clearDepth The Depth to Clear at (Optional -> Default = 1.0 which is EVERYTHING)
     * @param depthFunc The Depth Function used to Clear (Optional -> Default = LEQUEL)
    */
    static depthBackground(r: number, g: number, b: number, alpha ?: number, clearDepth?: number, depthFunc?: number): void {
        // Verify WebGL Status
        if (!WebGL.VERIFY_WEBGL_STATUS()) return;

        // Sets the Clear Color to Specified
        gl.clearColor(r, g, b, alpha | 1.0);

        // Clear the Depth
        gl.clearDepth(clearDepth | 1.0);

        // Enable Depth Test
        gl.enable(gl.DEPTH_TEST);

        // Use the Depth function
        // Default: Near things Obscure far things (LEQUAL)
        gl.depthFunc(depthFunc | gl.LEQUAL);

        // Clears WebGL Color Buffer or Depth Buffer
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    }


// PROGRAM INFO & SHADER
    /** Creates a Shader Program from the given Vertex and Fragment Source Codes
     * 
     * @param vsSource The Vetrtex Source Code
     * @param fsSource The Fragment Source Code
     * 
     * @returns New WebGL Shader Program
     */
    static initShaderProgram(vsSource: string, fsSource: string): WebGLProgram {
        // Verify WebGL Status
        if (!WebGL.VERIFY_WEBGL_STATUS()) return null;

        // Load the Shaders
        const vertextShader:  WebGLShader = WebGL.loadShader(gl, gl.VERTEX_SHADER, vsSource);
        const fragmentShader: WebGLShader = WebGL.loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

        // Create the Shader Program
        const shaderProgram: WebGLProgram = gl.createProgram();
        
        // Attach the Compiled Shaders
        gl.attachShader(shaderProgram, vertextShader);
        gl.attachShader(shaderProgram, fragmentShader);

        // Link the Program to the Rendering Context
        gl.linkProgram(shaderProgram);


        // Check Linking Shader Program Status
        if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
            console.error(new Error("An error occured Linking the Shaders: " + gl.getProgramInfoLog(shaderProgram)));
            return null;
        }

        // Return the Created Shader Program
        return shaderProgram;
    }

    /** Creates a Program Information Object from a given Shader Program 
     * 
     * @param shaderProgram The Shader Program that will be used to create it's Information
    */
    static createProgramInfo(shaderProgram: WebGLProgram): WebGL_ShaderProgramInfo {
        // Verify WebGL Status
        if (!WebGL.VERIFY_WEBGL_STATUS()) return null;
        
        return {
            program: shaderProgram,
            attribLocations: {
                vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
                vertexColor: gl.getAttribLocation(shaderProgram, 'aVertexColor'),
                textureCoord: gl.getAttribLocation(shaderProgram, 'aTextureCoord'),
                vertexNormal: gl.getAttribLocation(shaderProgram, 'aVertexNormal')
            },
            uniformLocations: {
                projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
                modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
                uSampler: gl.getUniformLocation(shaderProgram, 'uSampler'),
                normalMatrix: gl.getUniformLocation(shaderProgram, 'uNormalMatrix'),
            }
        };
    }


// SHADERS
    /** Creates a Shader of Given Type. Unloads Source and Compiles it
     * 
     * @param gl WebGL Rendering Context
     * @param type The Shader Type to be Rendered
     * @param source The Shader Source Code
     * 
     * @returns The Compiled WebGL Shader
     */
    static loadShader(gl: WebGLRenderingContext, type: number, source: string): WebGLShader {
        const shader: WebGLShader = gl.createShader(type);

        // Send Source Code to Shader Object
        gl.shaderSource(shader, source);

        // Compile the Shader Program
        gl.compileShader(shader);

        // Check Compilation Status
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.error(new Error("An error occured Compiling the Shaders: " + gl.getShaderInfoLog(shader)));
            gl.deleteShader(shader);
            return null;
        }

        // Return Compiled Shader
        return shader;
    }
    
    /** Loads a Shader from File (Async) 
     * 
     * @param path The Path to the Shader File or an Array of Shader Paths
     * @returns A Promise
     */
    static loadShaderFromFile(path: string | string[]): Promise<string | string[]> {
        // Multiple Paths (Array)
        if (path instanceof Array) {
            // Create an Array of Promises
            const isLoaded = [];

            for (const shader of path) {
                isLoaded.push(readStrFile(shader));
            }
            
            return Promise.all(isLoaded);
        }
        
        // Single Path
        else {
            return (readStrFile(path) as Promise<string>);
        }
    }


// BUFFERS
    /** Creates a Buffer with Textures 
     * 
     * Creates a 3D Buffer Based on Points (X, Y, Z)
     * Apply Color to Faces
     * 
     * Points (X, Y, Z) have to be divisible by 3
     * 
     * Position Verticies can be a 2D Array based on each Face [ [x,y,z ...], [x,y,z ...] ]
     *  So each Sub-Array would be a set of Verticies that connect a Face
     * Same with Indicies (2D Array based on each Face...)
     * 
     * @param positions The [ X, Y, Z ] Positions of Each Point
     * @param indices The Triangular Indices for each Face of the object (Each face is two triangles)
     * @param textures Texture Buffer that will be assign to the 3D Buffer (Optional Default -> WHITE)
     * @param normalsArr Object's Normals Values (Optional -> Default Algorithmically Generated)
     */
    static createBuffer(positions: number[] | number[][], indices: number[] | number[][],  textures?: WebGL_TextureBuffer, normalsArr?: number[] | number[][]): WebGL_BufferLocation {
        // Verify WebGL Status
        if (!WebGL.VERIFY_WEBGL_STATUS()) return null;

        // Flatten Verticies & Indicies if 2D Array
        // Only if it's not a Float32Array
        positions = is2DArray(positions) ? flatten2DArray(positions as number[][]) : positions as number[];
        indices = is2DArray(indices) ? flatten2DArray(indices as number[][]) : indices as number[];

        // Validate Points Match 3D Shape
        if (positions.length % 3) {
            console.error(new Error("Failed to Create Vertex Buffer! 3D Buffer Positions have to be [X, Y, Z]."));
            return null;
        }

        // Buffer Object Varialbe
        const buffer3D: WebGL_BufferLocation = {
            position: null,
            vertexCount: indices.length
        };



        // Validate Colors and Create Varialbes Used
        const posNum = (positions.length / 3) / 4;        // Total Number of Vertex Points PER (X, Y, Z) -> Each Face = 4(Verticies = 3 Points (x,y,z))
        
        // Make sure no Texture was Loaded
        // Create Default Texture (White)
        if (!textures || !textures.texture) {
            textures = this.Textures.createSolidTexture({
                r: 255,
                g: 255,
                b: 255
            });
        }
        
        // Map Textures onto 3D Object
        {
            // Generate Texture Coordinates
            textures.textureCoordinates = this.Textures.generateTextureCoordinates(posNum);

            // Create a Texture Coordinate Buffer
            const textureCoorBuffer = gl.createBuffer();

            // Bind the Texture Coordinate Buffer
            gl.bindBuffer(gl.ARRAY_BUFFER, textureCoorBuffer);

            // Assign to WebGL
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textures.textureCoordinates), gl.STATIC_DRAW);

            // Add Data to Overall Buffer
            buffer3D.textureCoord = textureCoorBuffer;
            buffer3D.texture = textures.texture;
        }



        // Create the Vertex Position Buffer
        {
            const posBuffer = gl.createBuffer();

            // Select posBuffer as "Active One"
            gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
            buffer3D.position = posBuffer;

            // Pass Position to WebGL to Build Shape
            // Create Float32Array from Javascript Array then Fill into Current Buffer
            gl.bufferData(
                gl.ARRAY_BUFFER,
                new Float32Array(positions as number[]),
                gl.STATIC_DRAW);
        }



        // Create Indices Buffer and apply it
        {
            const indexBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

            // Send Indices Element array to GL
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices as number[]), gl.STATIC_DRAW);

            // Assign the Buffer to the Overall Buffer Object
            buffer3D.indices = indexBuffer;

            // Unbind Buffer when Done
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
        }


        // Unbind Buffer when Done
        gl.bindBuffer(gl.ARRAY_BUFFER, null);

        // Create Normals (Lighting)
        // Check if Normals Array is given
        if (normalsArr) {
            // Flatten Normals Array
            normalsArr = is2DArray(normalsArr) ? flatten2DArray(normalsArr as number[][]) : normalsArr;
        }

        const normalBuffer = this.Lighting.generateNormals(positions as number[], normalsArr as number[]);
        buffer3D.normal = normalBuffer;



        // Return the Created Buffer Position
        return buffer3D;
    }

// SHAPE MANIPULATION
    /** Generates an Array of Indices based on the 2D Array 
     * The 2D Array is to split up each faces
     * 
     * @param vertices The 2D Array of Verticies
     * @returns A 2D Array of the Connected Indecies
     */
    static generateIndices(vertices?: number[][]): number[][] {
        // Varialbes
        const arr = [];
        let lastVert = 0;

        // Loop through each Face the Array
        for (const face of vertices) {
            let vertices = 0;
            for (let x = 0; x < face.length; x += 3) {
                vertices++;
            }

            // Get Each Face Indicies
            const result = this.genTriangleIndicies(vertices, lastVert);
            arr.push(result);

            lastVert = result[result.length - 1] + 1;     // Keep Track of the Last Vertex (non-index form)
            vertices = 0;
        }

        return arr;
    }

    /** Generate Indicies Connections (In Triangle Form) based on the Total Number of Vertices
     * Indicies can be offsetd but default to Origin Vertex of 0
     * 
     * @param totalVertex The Total Vertex Points
     * @param offset Indicies Offset from Origin (Optional)
     */
    static genTriangleIndicies(totalVertex: number, offset?: number): number[] {
        // Error Handling
        if (totalVertex <= 0) {
            console.error(new Error("Generate Triangle Indicies: Total Vertex Number is Invalid!"));
            return null;
        }

        // Handle Lower than 3 Vertex Points
        else if (totalVertex < 3) {
            // Create Vertex Variables
            const defaultArr = [0, 1, 2];
            const resArr = [];

            // Apply the Vertex Points with Offset Values
            for (let x = 0; x < totalVertex; x++) {
                resArr.push(defaultArr[x] + offset);
            }
            
            // Return the Result
            return resArr;
        }




        // Variables
        const arr = [];             // Result Array
        let tNum = 1;               // Triangle Number

        // Generate the Indicies
        while (true) {
            // Add Origin Point
            arr.push(0);

            // Go to next 2 Points (Triangle)
            for (let x = tNum; x < (tNum + 2); x++) {
                arr.push(x);
            }

            // Go to Next Triangle
            tNum++;

            if (arr[arr.length - 1] === totalVertex - 1) {
                break;
            }

            // Safety (No Single Shape is going to take 1000 Triangle Splits)
            if (tNum >= 1000) break;
        }
        
        // Offset the Indicies
        if (offset) {
            for (let x = 0; x < arr.length; x++) arr[x] = arr[x] + offset;
        }

        return arr;
    }


}
