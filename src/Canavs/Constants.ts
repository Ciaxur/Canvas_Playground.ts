import { canvas } from "./Canvas";

/**
 * Constant Variables for Playground Setup
 */

// Canvas Dimensions
export let WIDTH = 300;
export let HEIGHT = 300;
export let CENTER_X = WIDTH / 2;
export let CENTER_Y = HEIGHT / 2;

// WebGL Shaders Object Data
export let DEFAULT_SHADERS = {
    // Vertex Shaders
    Vertex: {
        Basic: "",
    },

    // Fragment Shaders
    Fragment: {
        Basic: "",
    }
}

// Functions
export function setCanvasSize(width: number, height: number): void {
    // Set Global Variablse
    WIDTH = width;
    HEIGHT = height;
    CENTER_X = WIDTH / 2;
    CENTER_Y = HEIGHT / 2;

    // Set Canvas Size
    canvas.width = WIDTH;
    canvas.height = HEIGHT;
}
