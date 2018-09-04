// Module Imports
import { startCanvas } from "./Canvas";


// Global Variables
let preloaded = false;

/**
 * Preload Data before initiating Canvas
 * 
 * @param fn Function to call before initiating
 */
export async function preload(fn ?: Function) {
    // Only Preload if not preloaded before
    if (!preloaded) {
        fn ? await fn() : null;
        startCanvas();
    }
    
    preloaded = true;
}

