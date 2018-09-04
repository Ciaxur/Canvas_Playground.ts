import { WebGL } from "./WebGL";
import { WebGL_ShaderProgramInfo } from '../Global/Interfaces';
import { PI } from "../../Math/Math";
import { mat4 } from "gl-matrix";
import { gl } from "../../Canavs/Canvas";
import { LightingTypes } from "../Global/Types";
import { WebGL_Lighting, WebGL_ShapeBuffer } from "./ClassTypes";


/**
 * WebGL Scene Class used to Keep track of the Scene being drawn onto
 * 
 * - While Drawing Colors, Textures ALWAY override Normal Colors
 */
export class Scene {
// Private Variables
    // Perspective Matrix Values
    private ASPECT_RATIO: number;       // Usually = CANVAS.WIDTH / CANVAS.HEIGHT
    private FOV: number;                // Default = 45
    private ROTATION: number[];         // Default = [0, 0, 0]          ->   [x, y, z]
    private CAMERA_POS: number[];       // Default = [0.0, 0.0, -10.0]  -> [x, y, z]
    private PROG_INFO: WebGL_ShaderProgramInfo;
    private DRAW_BKG: boolean;          // Draw Default Background (Default -> True)

    // Lighting Data
    private LIGHTING: WebGL_Lighting;

    // Rendering & Camera Varialbes
    private MAX_RENDER_Z: number;       // Maximum Z Render (Default = 100.0)
    private Matrix_Projection: mat4;    // Projection Matrix of Camera
    private Matrix_ModelView: mat4;     // Model View Matrix (Camera)
    
    
// Initial Methods
    /** Initiate the Perspection of the Scene
     * 
     * @param aspect_ratio The Aspect Ration
     * @param programInfo The WebGL Shader Program Information used to draw the object (Optional)
     * @param fieldOfView The FOV Degree (Optional -> Default = 45)
     * @param maxZ The Maximum Z-Axis Render (Optional -> Default = 100.0)
     * @param minZ The Minimum Z-Axis Render (Optional -> Default = 0.1)
     */
    constructor(aspect_ratio: number, programInfo?: WebGL_ShaderProgramInfo, fieldOfView?: number, maxZ?: number, minZ?: number) {
        // Assign Perspective Matrix
        this.ASPECT_RATIO = aspect_ratio;
        this.FOV = fieldOfView | 45;
        this.ROTATION = [0.0, 0.0, 0.0];
        this.CAMERA_POS = [0.0, 0.0, -10.0];
        this.PROG_INFO = programInfo;
    
        // Asign Rendering Properties
        this.MAX_RENDER_Z = maxZ | 100.0;
        this.DRAW_BKG = true;

        // Set Default Matrix Values
        this.initMatricies();

        // Assign Default Lighting
        if(this.PROG_INFO)
            this.LIGHTING = new WebGL.Lighting(this.PROG_INFO.program);
    }
    
    
// Rendering Methods
    /** Renders the Scene using the Perspective Matrix Values, Shaders, and Buffers of Object 
     * @param buffers The WebGL Shape Buffer that will be Rendered
     * @param program The WebGL Program that will be used (Optional -> Defaulted to the One given in BindBuffers)
    */
    public render(buffers: WebGL_ShapeBuffer, program?: WebGLProgram): void {
        // Clear Background to Depth Default Values
        if(this.DRAW_BKG)
            WebGL.depthBackground(0.0, 0.0, 0.0);
        
        
        // Assign Program to be used
        if (program) {
            gl.useProgram(program);
        }
        
        // Draw the Object(s)
        for(const buffer of buffers.buffers) {
            const vertexCount = buffer.vertexCount;
            const offset = 0;

            // Indicies Vertex Positioning
            if (buffer.indices) {
                const type = gl.UNSIGNED_SHORT;
                gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
            }

            // Positional Vertex
            else {
                gl.drawArrays(gl.TRIANGLE_STRIP, offset, vertexCount);
            }
        }
    }


    /** Binds Buffers into WebGL Memory
     * @param buffers The Shape Buffer Object
     * @param programInfo The WebGL Shader Program Information (Optional -> If provided, Current one will be overwritten)
     */
    public bindBuffers(buffers: WebGL_ShapeBuffer, programInfo?: WebGL_ShaderProgramInfo): void {
        // Validate Program Information is Available in either Param or as Varialbe
        if (!programInfo && !this.PROG_INFO) {
            console.error(new Error("WebGL Scene Error! No Program Information Defined!"));
            return;
        }
    
        // Overwrite Program Information if Provided
        programInfo ? this.setProgramInfo(programInfo) : null;

        // WebGL Set Program to Use while Drawing
        gl.useProgram(this.PROG_INFO.program);



        // Setup Scene Rendering Information
        let bufferNum = -1;     // Buffer Number
        // Bind all Buffers
        for (const buffer of buffers.buffers) {
            // Keep Track of Buffer Data
            bufferNum++;
            const renderSettings = buffers.getRenderSettings(bufferNum);
            

        
            // Tell WebGL how to pull out positions from the position buffer into vertexPosition attribute
            {
                // Render Settings for Position Attribute (Override)
                const positionSettings = renderSettings.positions;

                // Number of Elements per Attribute (vecX | Default -> vec3)
                const numComponents = 3;
    
                // Default Params
                const type = gl.FLOAT;                                              // Data in Buffer is 32Bit Float
                const normalize = false;                                            // No Normalization
                const stride = numComponents * Float32Array.BYTES_PER_ELEMENT;      // How many Bytes from one Set to the next 
                const offset = 0;                                                   // How many Bytes inside the Buffer to start from
    
                // Apply Instructions
                gl.bindBuffer(gl.ARRAY_BUFFER, buffer.position);
                gl.vertexAttribPointer(
                    this.PROG_INFO.attribLocations.vertexPosition,
                    numComponents | positionSettings.numComponents,
                    type | positionSettings.type,
                    positionSettings.normalize ? true : normalize,
                    stride | positionSettings.stride,
                    offset | positionSettings.offset
                );
                gl.enableVertexAttribArray(this.PROG_INFO.attribLocations.vertexPosition);
            }



            // Texture
            // Tell WebGL how to pull out the texture coordinates from buffer
            {
                // Render Settings for Texture Attribute (Override)
                const textureSettings = renderSettings.textures;

                // Default Settings
                const numComponents = 2;                                                     // Every Coordinate Composed of 2 Values
                const type = gl.FLOAT;                                                       // Buffer Data is 32-Bit Flaot
                const normalize = false;
                const stride = numComponents * Float32Array.BYTES_PER_ELEMENT;               // How many Bytes to get from one set to next
                const offset = 0;                                                            // How many Bytes inside the buffer to start from

                // Disable Normal Color FragColor for GL
                gl.uniform1i(this.PROG_INFO.uniformLocations.isColor, 0);

                // Apply Instructions
                gl.bindBuffer(gl.ARRAY_BUFFER, buffer.textureCoord);
                gl.vertexAttribPointer(
                    this.PROG_INFO.attribLocations.textureCoord,
                    numComponents | textureSettings.numComponents,
                    type | textureSettings.type,
                    textureSettings.normalize ? true : normalize,
                    stride | textureSettings.stride,
                    offset | textureSettings.offset
                );
                gl.enableVertexAttribArray(this.PROG_INFO.attribLocations.textureCoord);

                // Tell WebGL to affect texture unit 0
                gl.activeTexture(gl.TEXTURE0);

                // Bind Texture to Texture0
                gl.bindTexture(gl.TEXTURE_2D, buffer.texture);

                // Tell the Shader we bound the texture to Texture0
                gl.uniform1i(this.PROG_INFO.uniformLocations.uSampler, 0);
            }


            // Normals (Lighting)
            // Tell WebGL how to pull Normals from Buffer into vertexNormal attribute
            if (buffer.normal) {
                // Render Settings for Normals Attribute (Override)
                const normalsSettings = renderSettings.normals;

                // Default Pointer Data
                const numComponents = 3;
                const type = gl.FLOAT;
                const normalize = false;
                const stride = numComponents * Float32Array.BYTES_PER_ELEMENT;
                const offset = 0;

                // Bind Buffer
                gl.bindBuffer(gl.ARRAY_BUFFER, buffer.normal);

                // Handle Pointer Attribute
                gl.vertexAttribPointer(
                    this.PROG_INFO.attribLocations.vertexNormal,
                    numComponents | normalsSettings.numComponents,
                    type | normalsSettings.type,
                    normalsSettings.normalize ? true : normalize,
                    stride | normalsSettings.stride,
                    offset | normalsSettings.offset
                );

                // Enable Attribute
                gl.enableVertexAttribArray(this.PROG_INFO.attribLocations.vertexNormal);


                // Create the Matrix Shader for Normals
                const normalMatrix = mat4.create();

                mat4.invert(normalMatrix, this.Matrix_ModelView);
                mat4.transpose(normalMatrix, normalMatrix);

                // Set Shader Uniforms for Normals
                gl.uniformMatrix4fv(
                    this.PROG_INFO.uniformLocations.normalMatrix,
                    false,
                    normalMatrix
                );
            }

        
        
            // Set Shader Uniforms
            gl.uniformMatrix4fv(
                this.PROG_INFO.uniformLocations.projectionMatrix,
                false,
                this.Matrix_Projection
            );
            gl.uniformMatrix4fv(
                this.PROG_INFO.uniformLocations.modelViewMatrix,
                false,
                this.Matrix_ModelView
            );
        }
    }

    /** Updates Camera Matricies in WebGL Memory */
    public updateCameraBuffer(): void {
        // Update Camera Matricies
        gl.uniformMatrix4fv(
            this.PROG_INFO.uniformLocations.modelViewMatrix,
            false,
            this.Matrix_ModelView
        );
    }
    

// Lighting Manipulation Methods
    /** Sets Lighting Type and Updates Shaders 
     * @param type The New Lighting Type
     */
    public setLightingType(type: LightingTypes): void {
        this.LIGHTING.setType(type);
    }

    
// Camera Methods
    /** Rotates the Camera Matrix at X-Axis
     * 
     * @param radians The Radians Value to rotate the Perspective Matrix
     */
    public rotateX(radians: number): void {
        // Rotate Camera
        mat4.rotateX(
            this.Matrix_ModelView,
            this.Matrix_ModelView,
            radians
        );

        
        // Update Camera Buffer
        this.updateCameraBuffer();
    }
    
    /** Rotates the Camera Matrix at Y-Axis
     * 
     * @param radians The Radians Value to rotate the Perspective Matrix
     */
    public rotateY(radians: number): void {
        // Rotate Camera
        mat4.rotateY(
            this.Matrix_ModelView,
            this.Matrix_ModelView,
            radians
        );

        
        // Update Camera Buffer
        this.updateCameraBuffer();
    }
    
    /** Rotates the Camera Matrix at Z-Axis
     * 
     * @param radians The Radians Value to rotate the Perspective Matrix
     */
    public rotateZ(radians: number): void {
        // Rotate Camera
        mat4.rotateX(
            this.Matrix_ModelView,
            this.Matrix_ModelView,
            radians
        );

        
        // Update Camera Buffer
        this.updateCameraBuffer();
    }

    /** Resets Rotations Back to Default */
    public resetRotation(): void {
        // Set all Values to 0
        if (this.ROTATION) {
            for (let x = 0; x < this.ROTATION.length; x++) {
                this.ROTATION[x] = 0;
            }
        }

        // Reassign Rotation to a new Array of 0's
        else {
            this.ROTATION = [0, 0, 0];
        }

        // Update Camera Buffer
        this.updateCameraBuffer();
    }
    
    /** Moves Camera in X-Axis 
     * 
     * @param pixels How many Pixels to move camera from origin
    */
    public translateX(pixels: number): void {
        this.CAMERA_POS[0] = pixels;

        // Assign Camera Look Math
        mat4.lookAt(
            this.Matrix_ModelView,
            this.CAMERA_POS, [0, 0, 0], [0, 1, 0]
        );
    }
    
    /** Moves Camera in Y-Axis 
     * 
     * @param pixels How many Pixels to move camera from origin
    */
    public translateY(pixels: number): void {
        this.CAMERA_POS[1] = pixels;
        
        // Assign Camera Look Math
        mat4.lookAt(
            this.Matrix_ModelView,
            this.CAMERA_POS, [0, 0, 0], [0, 1, 0]
        );
    }
        
    /** Moves Camera in Z-Axis 
     * 
     * @param pixels How many Pixels to move camera from origin
    */
    public translateZ(pixels: number): void {
        this.CAMERA_POS[2] = pixels;
        
        // Assign Camera Look Math
        mat4.lookAt(
            this.Matrix_ModelView,
            this.CAMERA_POS, [0, 0, 0], [0, 1, 0]
        );
    }

    /** Moves Camera Back to Origin Point */
    public translateToOrigin(): void {
        // Set all Values to 0
        if (this.CAMERA_POS) {
            for (let x = 0; x < this.CAMERA_POS.length; x++) {
                this.CAMERA_POS[x] = 0;
            }
        }

        // Reassign to a new Array of 0's
        else {
            this.CAMERA_POS = [0, 0, 0];
        }
        
        // Assign Camera Look Math
        mat4.lookAt(
            this.Matrix_ModelView,
            this.CAMERA_POS, [0, 0, 0], [0, 1, 0]
        );
    }

// Rendering Properties Methods
    /** Disables Default Bacgkround Draw */
    public disableDefaultBackground(): void {
        this.DRAW_BKG = false;
    }

    /** Enables Default Background Draw */
    public enableDefaultBackground(): void {
        this.DRAW_BKG = true;
    }

// Setting Data
    /** Sets Program Info
     * @param programInfo Shader Program Information WebGL_ShaderProgramInfo
     */
    public setProgramInfo(programInfo: WebGL_ShaderProgramInfo): void {
        this.PROG_INFO = programInfo;
        this.LIGHTING = new WebGL.Lighting(this.PROG_INFO.program);
    }


// Private Methods
    /** Initiates Viewing Matricies to Default Values */
    private initMatricies(): void {
        // Create a Perspective Matrix (Camera Distortion Simulation)
        // Field of View = 45 Degrees (Width & Height)
        const fieldOfView = this.FOV * PI / 180;  // In Radians
        
        // Distance Variables
        // Only see object between 0.1 Units and 100 Units away from Camera
        const zNear = 0.1;
        const zFar = this.MAX_RENDER_Z;
        
        
    
        // Create GL Matrix
        // 4x4 Matrix -> { x-Axis , y-Axis , z-Axis , translation }
        const projectionMatrix = mat4.create();
        
        mat4.perspective(
            projectionMatrix,
            fieldOfView,
            this.ASPECT_RATIO,
            zNear,
            zFar);
        
        
        // Set Drawing to "Identity Point", Center of Scene
        const modelViewMatrix = mat4.create();
        mat4.lookAt(modelViewMatrix, [0, 0, -10], [0, 0, 0], [0, 1, 0]);

        // Store Matricies into Scene Variables
        this.Matrix_Projection = projectionMatrix;
        this.Matrix_ModelView = modelViewMatrix;
    }
}