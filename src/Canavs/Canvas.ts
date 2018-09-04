/**
 * Cavnas Initiation and Setup
 * 
 * Setup HTML5 Canvas API
 *  Configuration is based on the Constants in Constants.ts
 */

/** Module Imports */
import { HEIGHT, WIDTH, DEFAULT_SHADERS } from './Constants';
import { initEvents } from './Events/Events';
import { RenderContext } from './Types';
import { readStrFile } from '../IO/FileIO';


/** Create a Canvas DOM Element and CanvasContext */

export const canvas = <HTMLCanvasElement> document.createElement('canvas');
export let ctx: CanvasRenderingContext2D = null;
export let gl: WebGLRenderingContext = null;
document.body.appendChild(canvas);

/** Setup Canvas Dimensions */
canvas.width = WIDTH;
canvas.height = HEIGHT;

/** Global Variables */
let fn: Function = () => { };       // Function called inside Draw
let canvasInit: boolean = false;    // State of Canvas
let bgColor = null;                 // Background Color
let bgDrawn = false;                // State of Background Drawn
let started = false;                // State of the Canvas Draw
let drawStop = false;               // State of Stopping Canvas Draw
let noClear = false;                // State of Clearing Canvas


/** Drawing Function
 * @param func Function to call in drawing
 */
export function setDraw(func: Function): void {
    fn = func;

    // Initiate Canvas
    if (!canvasInit) {
        // Make Sure ctx or gl is Initiated
        // If not Default Start
        if (!ctx && !gl) {
            startCanvas('2d');
        }
        canvasInit = true
    };
}

/** Clears the Entire Screen */
export function clearCanvas(): void {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
}

/** Sets a Background Color for the Canvas
 * @param r The Red Value Color 0 - 255
 * @param g The Green Value Color 0 - 255
 * @param b The Blue Value Color 0 - 255
 */
export function background(r: number, g: number, b: number): void {
    // Check Values Between 0 and 255
    if (between(r, 0, 255) && between(g, 0, 255) && between(b, 0, 255)) {
        bgColor = `rgb(${r}, ${g}, ${b})`;
    }
}

/** Resets Background Draw State to false */
export function resetBackgroundState(): void {
    bgDrawn = false;
}

/** Setst the No Clearing State
 * @param state The state of the No Clear
 */
export function setNoClearState(state: boolean): void {
    noClear = state;
}

/** Starts Canvas API 
 * Only ONE Canvas at a time
 * 
 * @param context The Canvas Rendering Context used (2d | webgl)
*/
export function startCanvas(context: RenderContext): void {
    // Throw error if already started
    if (started) {
        console.error(new Error("Canvas Already Started!"));
        return;
    }

    // Only start if not started
    else {
        // 2D Rendering Canvas
        if (context === '2d') {
            ctx = canvas.getContext(context);

            /** CTX Properties Setup */
            ctx.webkitImageSmoothingEnabled = true;
            ctx.oImageSmoothingEnabled = true;
            ctx.imageSmoothingEnabled = true;
        }

        // WebGL Canvas
        else if (context === 'webgl') {
            // Load WebGL Context
            gl = canvas.getContext(context);

            // Load Deafult WebGL Shaders
            initDefaultShaders();
        }
            
        // Throw error if neither
        else {
            console.error(new Error("Invalid Canvas Context!"));
            return;
        }

        // Initiate Canvas Events
        initEvents();

        // Initiate the Canvas
        start()
    }

    started = true;
    drawStop = false;
}

/** Stop Canvas API */
export function noDraw(): void {
    drawStop = true;
    started = false;
}




// Initiates Canvas Drawing
function start(): void {
    // Non-WebGL Drawing
    if (ctx) {
        // No Clear | Draw Background | Clear Canvas
        if (noClear) {
            // Draw Initial Background only
            bgDrawn ? null : drawBackground();
        }
        else if (bgColor) {
            drawBackground();
        } else {
            clearCanvas();
        }
    }

    // WebGL Drawing
    // TO BE ADDED LATER HERE..........................


    // Draw onto Canvas
    fn();

    // Request Second Frame (Loop)
    // Loop if not to stop
    if(!drawStop)
        window.requestAnimationFrame(start);
}

/**
 *  Checks if value between two numbers
 * 
 * Throws Error if num1 >= num2
 * Throws Error if value < num1
 * Throws Error if value > num2
 * 
 * @param value The Value to check
 * @param num1 First Number
 * @param num2 Second Number
 * 
 * @returns True or False
 */
function between(value: number, num1: number, num2: number): boolean {
    // Pre Check
    if (num1 >= num2) {
        console.error(new Error("Num1 cannot be larger or equal to Num2"));
        return null;
    }

    else if (value < num1) {
        console.error(new Error("Value cannot be less than Num1"));
        return null;
    }

    else if (value > num2) {
        console.error(new Error("Value cannot be larger than Num2"));
        return null;
    }

    // Check Value
    else {
        return (value >= num1 && value <= num2);
    }
}

/** Draws Background */
function drawBackground(): void {
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    ctx.fill();

    // Set Background Draw State
    bgDrawn = true;
}




/** WebGL Init Functions */
/** Initiates Default Shaders */
function initDefaultShaders(): void {
    DEFAULT_SHADERS.Fragment.Basic = (readStrFile(__dirname + 'Shaders/Basic.frag', true) as string);
    DEFAULT_SHADERS.Vertex.Basic = (readStrFile(__dirname + 'Shaders/Basic.vert', true) as string);
}