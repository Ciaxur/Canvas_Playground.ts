import { setDraw, ctx, background, setNoClearState, gl, canvas, startCanvas, noDraw } from './Canavs/Canvas';
import { WIDTH, HEIGHT, setCanvasSize, CENTER_X, CENTER_Y, DEFAULT_SHADERS } from './Canavs/Constants';
import { circle, fill, stroke, drawLine, strokeWeight } from './Objects/Shapes';
import { WebGL } from './WebGL/Core/WebGL';
import { WebGL_ShaderProgramInfo, WebGL_TextureBuffer } from './WebGL/Global/Interfaces';
import { within, Vector2D, createVector, createVector3D, createVector2D } from './Math/Vectors';
import { PI, TWO_PI, cos, sin, isPowerOf2, TAU } from './Math/Math';
import { mouse } from './Canavs/Events/Mouse';
import { WebGL_Scene, WebGL_ShapeBuffer, WebGL_Shapes } from './WebGL/Core/ClassTypes';
import { WebGL_Debug } from './WebGL/Debug/WebGL_Debugging';
import { globalize } from './WebGL/Debug/Debug_Globalize';
import { mat4 } from 'gl-matrix';


// Global Variables
let Scene: WebGL_Scene;
const buffers: WebGL_ShapeBuffer = new WebGL.Shapes.Buffer();


// Setup Function
function setup(): void {
    // Initiate Canvas
    background(111, 111, 111);      // Only used for 2D Context Rendering
    setCanvasSize(800, 800);        // Used for WebGL and 2D
    setNoClearState(false);         // Only sets the state so it doesn't matter
    startCanvas('webgl');              // (Optional -> Default = 2d) Sets the Rendering Context

    


    // Debugging
    debug();
}



// Draw Function
function draw(): void {
    WebGL.depthBackground(0.0, 0.0, 0.0);
    Scene.render(buffers);
    
    Scene.rotateY(0.02);

    // Update Buffers
    buffers.updateBuffers();
}




// Run App
function begin() {
    // Begin App
    setup();
    setDraw(draw);
}

// Begin App
begin();




// Functions


// Debugging
function debug() {
    console.log("----DEBUGGING----");

    // Create Shader Program
    const shaderProgram = WebGL.initShaderProgram(DEFAULT_SHADERS.Vertex.Basic, DEFAULT_SHADERS.Fragment.Basic);
    const programInfo = WebGL.createProgramInfo(shaderProgram);

    // Create Scene
    Scene = new WebGL.Scene(WIDTH / HEIGHT, programInfo);

    // Create Textures
    const texture1 = WebGL.Textures.createSolidTexture({ r: 0, g: 255, b: 0 });
    const texture2 = WebGL.Textures.createSolidTexture({ r: 255, g: 0, b: 0 });

    // Create Objects
    const circle = WebGL.Shapes.Generate.createCircle(createVector2D(0, 0), 0.1, null, 1, texture1);
    const cube = WebGL.Shapes.Generate.createCube3D(createVector3D(-5), null, texture2);
    buffers.add([circle, cube]);
}





// Globalize Variables for DEBUGGING CHROME DEV TOOLS
globalize([
    { data: gl, globalName: 'gl' },
    { data: Scene, globalName: 'Scene' },
    { data: noDraw, globalName: 'noDraw' }
]);


