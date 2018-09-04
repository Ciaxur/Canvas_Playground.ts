import { canvas } from "./Canvas";

/**
 * Constant Variables for Playground Setup
 */

// Canvas Dimensions
export let WIDTH = 300;
export let HEIGHT = 300;


// Functions
export function setCanvasSize(width: number, height: number): void {
    // Set Global Variablse
    WIDTH = width;
    HEIGHT = height;

    // Set Canvas Size
    canvas.width = WIDTH;
    canvas.height = HEIGHT;
}