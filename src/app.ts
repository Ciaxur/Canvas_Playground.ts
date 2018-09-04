import { setDraw, ctx, background, setNoClearState, gl, canvas, startCanvas, noDraw } from './Canavs/Canvas';
import { WIDTH, HEIGHT, setCanvasSize, CENTER_X, CENTER_Y, DEFAULT_SHADERS } from './Canavs/Constants';
import { circle, fill, stroke, drawLine, strokeWeight } from './Objects/Shapes';
import { WebGL } from './WebGL/Core/WebGL';
import { WebGL_ShaderProgramInfo } from './WebGL/Global/Interfaces';
import { within, Vector2D, createVector, createVector3D, createVector2D } from './Math/Vectors';
import { PI, TWO_PI, cos, sin, isPowerOf2, TAU } from './Math/Math';
import { mouse } from './Canavs/Events/Mouse';
import { WebGL_Scene, WebGL_ShapeBuffer, WebGL_Shapes } from './WebGL/Core/ClassTypes';
import { WebGL_Debug } from './WebGL/Debug/WebGL_Debugging';
import { globalize } from './WebGL/Debug/Debug_Globalize';


// Global Variables
let shaderProgram: WebGLProgram;
let programInfo: WebGL_ShaderProgramInfo;
let WebGLScene: WebGL_Scene;
const buffers: WebGL_ShapeBuffer = new WebGL.Shapes.Buffer();
const shapes: WebGL_Shapes[] = [];

// Setup Function
function setup(): void {
    // Initiate Canvas
    background(111, 111, 111);      // Only used for 2D Context Rendering
    setCanvasSize(800, 800);        // Used for WebGL and 2D
    setNoClearState(false);         // Only sets the state so it doesn't matter
    startCanvas('webgl');              // (Optional -> Default = 2d) Sets the Rendering Context

    
    // Create Textures
    // const texture = WebGL.Textures.loadTexture('./Resources/WoodCrate_Texture.png', true);
    const solidTexture = WebGL.Textures.createSolidTexture({
        r: 111,
        g: 111,
        b: 111
    });
    // const animTexture = WebGL_Textures.loadAnimatingTexture("./Resources/Firefox.mp4");
    

    // Preload Data
    shaderProgram = WebGL.initShaderProgram(DEFAULT_SHADERS.Vertex.Basic, DEFAULT_SHADERS.Fragment.Basic);
    programInfo = WebGL.createProgramInfo(shaderProgram);

    // Add Custom Shape
    const verticies = [
        // Face 1
        [   1,  1,  0,
            1, -1,  0,
            -1, -1,  0,
            -1,  1,  0,
        ]
    ];
    const indicies = WebGL.generateIndices(verticies);



    // Add Shape(s)
    for (let x = 0; x < 0; x++) {
        // const pos = createVector3D(x * 3, 0, 0);
        const pos = createVector3D(x * 3, 0, 0);

        // Create the Shape into Shapes Arr
        shapes.push(WebGL.Shapes.Generate.createCube3D(pos, 0.8, solidTexture));
        // shapes.push(WebGL_Generate_Shapes.createRect3D(pos, 2, 1));

        // Add Shape into the Buffer Class
        buffers.add(shapes[x]);
    }


    // Create the WebGL Scene
    WebGLScene = new WebGL.Scene(WIDTH / HEIGHT, programInfo);
    WebGLScene.bindBuffers(buffers);
    WebGLScene.translateZ(-6);
    WebGLScene.translateY(-3);
    WebGLScene.rotateX(-PI / 3);
    // WebGLScene.disableDefaultBackground();
    // WebGLScene.setLightingType("default");

    // Debugging
    debug();
}



// Draw Function
function draw(): void {
    WebGL.depthBackground(0.0, 0.0, 0.0);
    WebGLScene.render(buffers);
    
    WebGLScene.rotateY(0.01);

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

    // Circle Shape
    const circ = WebGL.Shapes.Generate.createCircle(createVector2D(), null, null, 0.5);
    buffers.add(circ);

    // WebGL Data
    WebGL_Debug.logActiveAttributes(shaderProgram, gl);
    
    
    // Render to Canvas
    WebGLScene.setLightingType('default');
    // WebGLScene.resetRotation();
    // WebGLScene.translateY(0);
    WebGLScene.bindBuffers(buffers);
    WebGLScene.render(buffers);
}





// Globalize Variables for DEBUGGING CHROME DEV TOOLS
globalize([
    { data: gl, globalName: 'gl' },
    { data: noDraw, globalName: 'noDraw' }
]);


