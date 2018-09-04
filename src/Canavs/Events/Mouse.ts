import { canvas } from "../Canvas";


/**
 * Mouse Class Handle All Mouse Data and Properites Needed
 *  for Canvas 2D & 3D
 */
class Mouse {
   // Public Data
    public x: number;           // x-axis Location On Canvas
    public y: number;           // y-axis Location On Canvas
        
// Methods
    /** Initiates Mouse Class */
    constructor() {
        this.x = 0;
        this.y = 0;
    }
}






// Mouse Variables
export const mouse = new Mouse();


/**
 * Initiates All Mouse Events
 */
export function initMouseEvents(): void {
    // Verify Canvas is Valid
    if (!canvas) {
        console.error("Failed to Initiate Mouse Events! Error: Canvas was not Initiated.")
        return;
    }
    
    // Mouse Movement Event Listner
    canvas.onmousemove = (e) => {
        // Set Mouse Location
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    }
}



