import { Texture_Pixels } from "./Types";


/** Shader Program Information Interface */
export interface WebGL_ShaderProgramInfo {
    program: WebGLProgram;

    attribLocations: {
        vertexPosition: number,
        vertexColor?: number,
        textureCoord?: number,
        vertexNormal?: number
    };

    uniformLocations: {
        projectionMatrix: WebGLUniformLocation;
        modelViewMatrix: WebGLUniformLocation;
        normalMatrix?: WebGLUniformLocation;
        uSampler: WebGLUniformLocation;
        isColor?: WebGLUniformLocation;
    };
}

/** WebGL Buffer Loaction Interface */
export interface WebGL_BufferLocation {
    // Location & Shape
    position: WebGLBuffer;
    vertexCount: number;
    indices?: WebGLBuffer;
    
    // Texture
    textureCoord?: WebGLBuffer;
    texture?: WebGLTexture;

    // Lighting
    normal?: WebGLBuffer;
}

/** RGBA Color Interface */
export interface RGBA {
    r: number;
    g: number;
    b: number;
    a?: number;
}

/** WebGL Texture Buffer Interface */
export interface WebGL_TextureBuffer {
    textureCoordinates: number[];
    texture: WebGLTexture;
    textureSrc?: Texture_Pixels;         // Original Texture Source
};





/** WebGL Rendering Interfaces 
 * 
 * - Rendering Information
 * - Vertex Context Information
*/
export interface WebGL_RenderSettings {
    // Rederning Information
    positions:  WebGL_RenderVertexContext;
    textures:   WebGL_RenderVertexContext;
    normals:    WebGL_RenderVertexContext;
}

interface WebGL_RenderVertexContext {
    numComponents?:  number;        // Pull x Values per Iteration
    type:           number;         // Data Type in Buffer
    normalize:      boolean;        // Normalization State
    stride:         number;         // How many Bytes from one Set to the next 
    offset:         number;         // How many Bytes inside the Buffer to start from
}



/** Lighting Interfaces */
/** Lighting States Interface */
export interface LightingData {
    // Uniform Location Data
    uniform: {
        ambientData: WebGLUniformLocation;
        diffuseData: WebGLUniformLocation;
        specularData: WebGLUniformLocation;
        phongData: WebGLUniformLocation;
        experimental: WebGLUniformLocation;
    };
}