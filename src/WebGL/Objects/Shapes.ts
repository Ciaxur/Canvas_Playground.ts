import { WebGL } from "../Core/WebGL";
import { Vector3D, Vector2D, createVector3D } from "../../Math/Vectors";
import { WebGL_BufferLocation, WebGL_TextureBuffer, WebGL_RenderSettings } from "../Global/Interfaces";
import { Texture_Pixels } from "../Global/Types";
import { is2DArray, flatten2DArray } from "../../Math/Array";
import { unitCircle, TWO_PI, PI } from "../../Math/Math";




/*
    WebGL Shapes Abstract Class
*/
export abstract class GenerateShapes {
// Private Static Constants
    private static readonly DEFUALT_CIRCLE_QUALITY = 0.1;      // Cirlce Generation's Default Quality Value

    /** Creates a 3D Cube 
     * 
     * @param position The Vector3D Locaiton of the Shape
     * @param size The Size of the Shape (Optional -> Default = 1)
     * @param texture The Texture Buffer of the Shape (Optional)
     * @returns WebGL_Cube3D Class
     */
    static createCube3D(position?: Vector3D, size?: number, texture?: WebGL_TextureBuffer): Cube3D {
        return new Cube3D(position, size, texture);
    }


    /** Creates a 3D Rectangle 
     * 
     * @param position The Vector3D Locaiton of the Shape
     * @param width The Width of the Shape
     * @param height The Height of the Shape
     * @param depth The Depth (Z-Axis) of the Rectangle (Optional -> 1.0)
     * @param texture The Texture Buffer of the Shape (Optional)
     * @returns WebGL_Rect3D Class
     */
    static createRect3D(position: Vector3D, width: number, height: number, depth?: number, texture?: WebGL_TextureBuffer): Rect3D {
        return new Rect3D(position, width, height, depth, texture);
    }
    
    /** Returns a Shape Object 
     * @param pos Vector2D Position of where the Square is
     * @param size The Size of the Square (Optional -> Default = 1)
     * @param texture The Texture Buffer of the Shape (Optional)
     * @returns The Buffer of the Square
    */
    static Square2D(pos: Vector2D | Vector3D, size?: number, texture?: WebGL_TextureBuffer): Shapes {
        // Set Size
        size = size != undefined ? size : 1;
        
        // Create Vertex Points & Indicies
        const vPoints = ShapeVerticies.Rect3D_Verticies(size, size, 0.001);
        

        // Translate 2D Shape to Position
        for (const vertex of vPoints) {
            for (let x = 0; x < vertex.length; x += 3) {
                // X-Axis
                vertex[x] += pos.x;
                // Y-Axis
                vertex[x + 1] += pos.y;
                
                // Z-Axis
                if (pos instanceof Vector3D) {
                    vertex[x + 2] += pos.z;
                }
            }
        }

        return Shapes.createShape(vPoints, null, texture);
    }

    /** Returns a Shape Object
     * @param pos A Vector for the Origin Point of Shape Object
     * @param quality The Quality of the Circle, Value <= 0.7 but not 0 (Number of Iterations from 0 to 2PI) (Optional -> Default = 0.2)
     * @param radius Circle's Radius (Optional -> Default = 1)
     * @param depth Circle's Z-Axis Thickness (Optional -> Default = 0)
     * @param texture WebGL Texture Buffer for Shape (Optional)
     * @param normalsArr Shape's Normals Array (Optional)
     * @returns Shape Object
     */
    static createCircle(pos: Vector2D | Vector3D, quality?: number, radius?: number, depth?: number, texture?: WebGL_TextureBuffer, normalsArr?: number[] | number[][]): Shapes {
        // Check for Normals Array
        if (normalsArr) {
            // Flatten the Array
            normalsArr = is2DArray(normalsArr) ? flatten2DArray(normalsArr as number[][]) : normalsArr;
        }

        // Check Radius
        radius = radius ? radius : 1;

        // Validate Quality
        if (quality && (quality <= 0 || quality > 0.7)) {
            console.error(new Error("Shape Generation: Circle Creation, Quality value between 0 - 0.7!"));
            return null;
        } else if(!quality) { quality = this.DEFUALT_CIRCLE_QUALITY }; // Assign Default Quality Value




        // Check for Depth (Z-Axis Depth)
        // Validate Depth Value >= 0
        depth = (depth && depth >= 0) ? depth : 0;

        // Generate Points
        const verticies = [[]];
        let theta = 0;

        if (depth) verticies.push([]);      // Create another Shape if depth is required

        // Generate all Points from 0 to TWO_PI
        while (theta <= TWO_PI) {
            // Obtain Results and Adjust to Radius
            const res: Vector3D = unitCircle(theta, '3d') as Vector3D;

            // Create Array of Vector
            const arr = res.mult(radius).toArray();



            // Create Depth
            if (depth) {
                // Create a Copy of Vector if Depth
                const arr2 = res.mult(radius).toArray();

                // Add Depth to Z-Axis of both Faces
                arr[2] = depth;
                arr2[2] = -depth;

                // Apply 2nd Face to Verticies
                for (const val of arr2) {
                    verticies[1].push(val);
                }
            }


            
            // Apply each Value to Vertices as Array
            // Make it as ONE face so one subarray
            for (const val of arr) {
                verticies[0].push(val);
            }

            
            // Interate using quality
            theta += quality;
        }

        // Safety Precaution
        // If Last point doesn't reach
        if (theta < TWO_PI) {
            // Obtain Results and Adjust to Radius
            const res: Vector3D = unitCircle(TWO_PI, '3d') as Vector3D;     // Add one more point AT TWO_PI
            res.mult(radius);

            // Create Array of Vector
            const arr = res.mult(radius).toArray();



            // Create Depth
            if (depth) {
                // Create a Copy of Vector if Depth
                const arr2 = res.mult(radius).toArray();

                // Add Depth to Z-Axis of both Faces
                arr[2] = depth;
                arr2[2] = -depth;

                // Apply 2nd Face to Verticies
                for (const val of arr2) {
                    verticies[1].push(val);
                }
            }

            
            
            // Apply each Value to Vertices as Array
            // Make it as ONE face so one subarray
            for (const val of arr) {
                verticies[0].push(val);
            }
        }



        // Create the Depth (Cylinder)
        if (depth) {
            // Properties
            const MAX_TIMES = verticies[0].length;
            const TOTAL_POINTS_PER_FACE = 4;
            let isSave = false;

            // Used Arrays
            let final2Arrays = [];
            let dummyArr = [];
            let cylinder = [];

            // Algorithm Varaibles
            let i = 0;
            let j = 0;

            // Algorithm Init
            for (let x = 0; x < MAX_TIMES && j < MAX_TIMES; x++) {
                // Pre-Testing
                if ((x + 1) % 2 === 0) {
                    i = (i + 1) % 2;
                }

            
                // Obtain Vector Points
                const arr = [];
                for (let y = 0; y < 3; y++) {
                    arr.push(verticies[i][y + j]);
                }

            
                // Add Points to Dummy Array
                dummyArr.push(arr);


                // Array Tracking of last 2 Vector Points (Arrays)
                if (isSave) {
                    final2Arrays.push(arr);
                }



                // Dump Dummy Array into Verticies
                if (dummyArr.length >= TOTAL_POINTS_PER_FACE) {
                    // Store the Values into the Cylinder Array
                    for (const arr of dummyArr) {
                        for (const val of arr) {
                            cylinder.push(val);
                        }
                    }

                    // Apply Data to Verticies
                    verticies.push(cylinder);

                    // Reset Arrays
                    cylinder = [];
                    dummyArr = [];
                }
            


                // Post-Testing
                if ((x + 1) % 2 === 0) {
                    j += 3;

                    // Add last Values of Array to Array
                    if (final2Arrays.length) {
                        for (const arr of final2Arrays) {
                            dummyArr.push(arr);
                        }
                    }

                    // Reset Array Save States
                    final2Arrays = [];
                    isSave = true;
                }

            }


            // TRYING TO FIX THE LITTLE ANNOYING OPENING PATCH -_-
            if (dummyArr.length != 0) {
                // Get all data values from the Dummy Array
                for (const arr of dummyArr) {
                    for (const val of arr) {
                        cylinder.push(val);
                    }
                }

                // Go from the last known point from the Dummy Array back to the beginning of 
                //  the cylinder vertex point (Loop back around to the first point)
                j = 0;
                i = 1;
                for (let x = 0; x < (TOTAL_POINTS_PER_FACE - dummyArr.length); x++) {
                    for (let y = 0; y < 3; y++) {
                        cylinder.push(verticies[i][y + j]);
                    }
                    j += 3;
                    i = (i + 1) % 2;
                }

                
                verticies.push(cylinder);
            }

        }

        
        // Create the Shape
        const circ = Shapes.createShape(verticies, null, texture, normalsArr);
        
        // Translate Shape
        const z = pos instanceof Vector3D ? pos.z : 0;

        circ.translate(createVector3D(pos.x, pos.y, z));

        // Return Created Shape
        return circ;
    }
}



/**
 * Abstract Class that hold Shape Verticies
 * 
 * - 3D Objects
 *  - Cube
 *  - Rectangle
 * 
 * - 2D Objects
 *  - Square
 */
export abstract class ShapeVerticies {
    /** Returns a 2D Array of a 3D Cube Verticies 
     * 
     * @param size The Size of the Cube (Optional -> Default = 1)
     * @returns 2D Array of a 3D Cube Verticies
     */
    static Cube3D_Verticies(size?: number): number[][] {
        size = size != undefined ? size : 1.0;

        return [
            // Front Face
            [-size, -size,  size,
              size, -size,  size,
              size,  size,  size,
             -size,  size,  size],
            
            // Back face
            [-size, -size, -size,
             -size,  size, -size,
              size,  size, -size,
              size, -size, -size],
            
            // Top face
            [-size,  size, -size,
             -size,  size,  size,
              size,  size,  size,
              size,  size, -size],
            
            // Bottom face
            [-size, -size, -size,
              size, -size, -size,
              size, -size,  size,
             -size, -size,  size],
            
            // Right face
             [size, -size, -size,
              size,  size, -size,
              size,  size,  size,
              size, -size,  size],
            
            // Left face
            [-size, -size, -size,
             -size, -size,  size,
             -size,  size,  size,
             -size,  size, -size]
        ];
    }

    /** Returns a 2D Array of a 3D Rectangle Verticies 
     * 
     * @param width The Width of the Rectangle
     * @param height The Height of the Rectangle
     * @param depth The Depth (Z-Axis) of the Rectangle (Optional -> 1.0)
     * @returns 2D Array of a 3D Rectangle Verticies
     */
    static Rect3D_Verticies(width: number, height: number, depth?: number): number[][] {
        // Width  = X-Axies
        // Height = Y-Axies
        // Depth  = Z-Axies

        // Depth Verification
        if (depth === undefined) {
            depth = 1.0;        // Default = 1.0
        }

        return [
            // Front Face
            [-width, -height,  depth,
              width, -height,  depth,
              width,  height,  depth,
             -width,  height,  depth],
            
            // Back face
            [-width, -height, -depth,
             -width,  height, -depth,
              width,  height, -depth,
              width, -height, -depth],
            
            // Top face
            [-width,  height, -depth,
             -width,  height,  depth,
              width,  height,  depth,
              width,  height, -depth],
            
            // Bottom face
            [-width, -height, -depth,
              width, -height, -depth,
              width, -height,  depth,
             -width, -height,  depth],
            
            // Right face
             [width, -height, -depth,
              width,  height, -depth,
              width,  height,  depth,
              width, -height,  depth],
            
            // Left face
            [-width, -height, -depth,
             -width, -height,  depth,
             -width,  height,  depth,
             -width,  height, -depth]
        ];
    }

    /** Returns a 2D Array of a 2D Square Verticies 
     * 
     * @param size The Size of the Cube (Optional -> Default = 1)
     * @returns 2D Array of a 2D Square Verticies
     */
    static Square2D_Verticies(size?: number): number[][] {
        size = size != undefined ? size : 1.0;

        return [        // Vertex Points
            [-size,  size, 0,              // Top-Left Point
              size,  size, 0,              // Top-Right Point
             -size, -size, 0,              // Bottom-Left Point
              size, -size, 0]               // Bottom-Right Point
        ];
    }
}



// Shapes Classes
/**
 * Abstract Parent Class of All Shapes
 * 
 * - Properties
 *  - Position
 *  - Vertices
 *  - Size (Width & Height)
 *  - Color
 *  - Buffer
 * 
 * 
 * - Methods
 *  - Setting a New Position (Translating)
 */
export abstract class Shapes {
// Protected Variables (Properties)
    protected position: Vector3D;
    protected vertices: number[][];
    protected indicies: number[][];
    protected normals: number[];
    protected width: number;
    protected height: number;
    protected texture: WebGL_TextureBuffer;
    protected textureSrc: Texture_Pixels;

// Rendering Settings Object
    protected renderingSettings: WebGL_RenderSettings;

// Public Variables
    public bufferUpdated: boolean;          // State of whether the buffer updated or not
    public buffer: WebGL_BufferLocation;


// Class Constructor
    /** Initiate Shape Object
     * @param vertices The Raw Object's Verticies
     * @param position The Vector3D Locaiton of the Shape (Optional -> Default = (0, 0, 0))
     * @param texture The Texture Buffer of the Shape (Optional)
     * @param normals The Normals Array (1D or 2D) that will be binded into buffer (Optional)
     */
    constructor(verticies: number[][], position?: Vector3D, texture?: WebGL_TextureBuffer, normals?: number[] | number[][]) {
        // Check if normals param is not numm
        if (normals) {
            // Check if Normals is a 2D Array
            // If so, Flatten it
            this.normals = is2DArray(normals) ? flatten2DArray(normals as number[][]) : normals;
        }

        // Set Vertex Points
        this.vertices = verticies;

        // Create the Indices of Object
        this.indicies = WebGL.generateIndices(this.vertices);

        // Set Texture Information
        if (texture) {
            this.texture = texture;
            this.textureSrc = texture.textureSrc;
        }

        // Check Position & Translate
        position = position ? position : createVector3D();

        this.translate(position);


        // Initiate Default Rendering Settings
        this.initRenderSettings();
    }
    

// Translation Methods
    /** Translates the Shape a new Position 
     * 
     * @param newPos Vector3D of the New Location
    */
    public translate(newPos: Vector3D): void {
        
        // Make a Deep Copy
        this.position = newPos.copy();

        // Translate 3D Cube to a Position
        for (const face of this.vertices) {
            for (let x = 0; x < face.length; x += 3) {
                // X-Axis
                face[x] += this.position.x;
                // Y-Axis
                face[x + 1] += this.position.y;
                // Z-Axis
                face[x + 2] += this.position.z;
            }
        }

        // Generate the Buffer
        this.updateBuffer();
    }

    // public rotateX(radians: number): void {
        
    // }
    

// Buffer Methods
    /** Updates the Buffer */
    public updateBuffer(): void {
        this.bufferUpdated = true;
        this.buffer = WebGL.createBuffer(this.vertices, this.indicies, this.texture, this.normals);
    }

    /** Resets Buffer Updated State */
    public resetBufferUpdateState(): void {
        this.bufferUpdated = false;
    }


// Texture Methods
    /** Applies a Texture to Object 
     * @param texture WebGL Texture Buffer Object
     */
    public applyTexture(texture: WebGL_TextureBuffer): void {
        this.texture = texture;
        this.updateBuffer();
    }

    /** Returns the Text of Object
     * @returns Texture of Object
     */
    public getTexture(): WebGLTexture {
        return this.texture.texture;
    }

    /** Returns the Source of the Texture
     * @returns Texture Source (null if none)
     */
    public getTextureSource(): Texture_Pixels {
        return this.textureSrc ? this.textureSrc : null;
    }


// Render Methods
    /** Sets Default Rendering Settings (null) */
    public initRenderSettings(): void {
        this.renderingSettings = {
            positions: {
                numComponents: null,
                normalize: null,
                offset: null,
                stride: null,
                type: null
            },

            textures: {
                numComponents: null,
                normalize: null,
                offset: null,
                stride: null,
                type: null
            },

            normals: {
                numComponents: null,
                normalize: null,
                offset: null,
                stride: null,
                type: null
            }
        }
    }

    /** Sets Rendering Settings
     * @param settings WebGL Rendering Settings Object
     */
    public setRenderingSettings(settings: WebGL_RenderSettings): void {
        this.renderingSettings = settings;
    }

    /** Returns Rendering Settings Object
     * @returns Rendering Settings of Shape Object
     */
    public getRenderingSettings(): WebGL_RenderSettings {
        return this.renderingSettings;
    }


// Static Methods
    /** Creates a 3D Object (Custom) based on Parameres
     * @param vertices The Raw Object's Verticies
     * @param indicies The Generated Indicies of 3D Object (Optional | Will be generated anyway)
     * @param texture The Texture Buffer of the Shape (Optional)
     * @param normals The Normals Array (1D or 2D)
     */
    static createShape(vertices: number[][], indicies?: number[][], texture?: WebGL_TextureBuffer, normals?: number[] | number[][]): ShapeObject { 
        return new ShapeObject(vertices, indicies, texture, normals);
    }
}


// 3D Shapes Classes
/**
 * 3D Cube Class 
 * Extends WebGL_Shape Parent Class
 */
export class Cube3D extends Shapes {
    // Private Varialbes


    /** Initializes the 3D Cube to it's Initial Properties 
     * 
     * @param position The Vector3D Locaiton of the Shape (Optional -> Default = (0, 0, 0))
     * @param size The Size of the Shape (Optional -> Default = 1)
     * @param texture The Texture Buffer of the Shape (Optional)
     * @param normals The Normals Array (1D or 2D)
    */
    constructor(position?: Vector3D, size?: number, texture?: WebGL_TextureBuffer, normals?: number[] | number[][]) {
        // Check for normals Array
        // Assign Default Normals for Cube Shaped Object
        if (!normals) {
            normals = [
                // Front Face
                0.0, 0.0, 1.0,
                0.0, 0.0, 1.0,
                0.0, 0.0, 1.0,
                0.0, 0.0, 1.0,

                // Back Face
                0.0, 0.0, -1.0,
                0.0, 0.0, -1.0,
                0.0, 0.0, -1.0,
                0.0, 0.0, -1.0,

                // Left Face
                -1.0, 0.0, 0.0,
                -1.0, 0.0, 0.0,
                -1.0, 0.0, 0.0,
                -1.0, 0.0, 0.0,

                // Right Face
                1.0, 0.0, 0.0,
                1.0, 0.0, 0.0,
                1.0, 0.0, 0.0,
                1.0, 0.0, 0.0,

                // Top Face
                0.0, 1.0, 0.0,
                0.0, 1.0, 0.0,
                0.0, 1.0, 0.0,
                0.0, 1.0, 0.0,

                // Bottom Face
                0.0, -1.0, 0.0,
                0.0, -1.0, 0.0,
                0.0, -1.0, 0.0,
                0.0, -1.0, 0.0,
            ]
        }

        // Call Parent Class
        super(ShapeVerticies.Cube3D_Verticies(size), position, texture, normals);

        // Set Dimension Information
        this.width = size;
        this.height = size;

        // Reset Buffer Update State
        this.resetBufferUpdateState();
    }
}

/**
 * 3D Rectangle Class 
 * Extends WebGL_Shape Parent Class
 */
export class Rect3D extends Shapes {
    // Private Varialbes


    /** Initializes the 3D Rectangle to it's Initial Properties 
     * 
     * @param position The Vector3D Locaiton of the Shape (Optional -> Default = (0, 0, 0))
     * @param width The Width of the Shape (Optional -> Default = 1.0)
     * @param height The Height of the Shape (Optional -> Default = 1.0)
     * @param depth The Depth (Z-Axis) of the Rectangle (Optional -> 1.0)
     * @param texture The Texture Buffer of the Shape (Optional)
     * @param normals The Normals Array (1D or 2D)
    */
    constructor(position?: Vector3D, width?: number, height?: number, depth?: number, texture?: WebGL_TextureBuffer, normals?: number[] | number[][]) {
        // Check for normals Array
        // Assign Default Normals for Cube Shaped Object
        if (!normals) {
            normals = [
                // Front Face
                0.0, 0.0, 1.0,
                0.0, 0.0, 1.0,
                0.0, 0.0, 1.0,
                0.0, 0.0, 1.0,

                // Back Face
                0.0, 0.0, -1.0,
                0.0, 0.0, -1.0,
                0.0, 0.0, -1.0,
                0.0, 0.0, -1.0,

                // Left Face
                -1.0, 0.0, 0.0,
                -1.0, 0.0, 0.0,
                -1.0, 0.0, 0.0,
                -1.0, 0.0, 0.0,

                // Right Face
                1.0, 0.0, 0.0,
                1.0, 0.0, 0.0,
                1.0, 0.0, 0.0,
                1.0, 0.0, 0.0,

                // Top Face
                0.0, 1.0, 0.0,
                0.0, 1.0, 0.0,
                0.0, 1.0, 0.0,
                0.0, 1.0, 0.0,

                // Bottom Face
                0.0, -1.0, 0.0,
                0.0, -1.0, 0.0,
                0.0, -1.0, 0.0,
                0.0, -1.0, 0.0,
            ]
        }
        
        // Call Parent Class
        super(ShapeVerticies.Rect3D_Verticies(width, height, depth), position, texture, normals);
        

        // Set Dimension Information
        this.width = width === undefined ? 1.0 : width;
        this.height = height === undefined ? 1.0 : height;

        // Reset Buffer Update State
        this.resetBufferUpdateState();
    }
}

/** 
 * Custom 3D Shape Class
 * Extends WebGL_Shape Parent Class
 */
export class ShapeObject extends Shapes {
    // Private Varialbes


    /** Initializes the 3D Object to it's Initial Properties 
     * 
     * @param vertices The Raw Object's Verticies
     * @param indicies The Generated Indicies of 3D Object (Optional | Will be generated anyway)
     * @param texture The Texture Buffer of the Shape (Optional)
     * @param normals The Normals Array (1D or 2D)
    */
    constructor(vertices: number[][], indicies?: number[][], texture?: WebGL_TextureBuffer, normals?: number[] | number[][]) {
        // Call Parent Class
        super(vertices, null, texture, normals);

        if (indicies) {
            this.indicies = indicies;
        }

        // Set Dimension Information
        this.width = null;
        this.height = null;


        // Translate the Shape to Default Location
        this.translate(createVector3D());

        // Reset Buffer Update State
        this.resetBufferUpdateState();
    }
}










