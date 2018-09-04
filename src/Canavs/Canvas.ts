/**
 * Cavnas Initiation and Setup
 * 
 * Setup HTML5 Canvas API
 *  Configuration is based on the Constants in Constants.ts
 */

/** Module Imports */
import { HEIGHT, WIDTH } from './Constants';


/** Create a Canvas DOM Element and CanvasContext */
export const canvas = <HTMLCanvasElement> document.createElement('canvas');
export const ctx: CanvasRenderingContext2D = canvas.getContext('2d');
document.body.appendChild(canvas);

/** Setup Canvas Dimensions */
canvas.width = WIDTH;
canvas.height = HEIGHT;

/** CTX Properties Setup */
ctx.webkitImageSmoothingEnabled = true;
ctx.oImageSmoothingEnabled = true;
ctx.imageSmoothingEnabled = true;

/** Global Variables */
let fn: Function = () => { };       // Function called inside Draw
let bgColor = null;                 // Background Color
let started = false;                // State of the Canvas Draw

/** Drawing Function
 * @param func Function to call in drawing
 */
export function draw(func: Function): void {
    fn = func;
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

/** Starts Canvas API */
export function startCanvas(): void {
    // Only start if not started
    started
        ? console.error(new Error("Canvas Already Started!"))
        : start();

    started = true;
}




// Initiates Canvas Drawing
function start(): void {
    // Clear Canvas || Draw Background
    if (bgColor) {
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, WIDTH, HEIGHT);
        ctx.fill();
    } else {
        clearCanvas();
    }

    // Draw onto Canvas
    fn();

    // Request Second Frame (Loop)
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
