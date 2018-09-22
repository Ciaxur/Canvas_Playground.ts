import { Shapes } from "../Objects/Shapes";
import { WebGL_BufferLocation, WebGL_RenderSettings } from "../Global/Interfaces";



/**
 * WebGL Shape Buffer Class
 * - Buffer Class Supports Any Shape Object (2D or 3D)
 * 
 * - Organizes Buffers
 * - Updates them
 * - Keeps track of them
 * 
 */
export class ShapeBuffer {
// Private Varaibles
    private shapeObj: Shapes[];                      // Array of the Shape Objects

// Public Variables
    public readonly buffers: WebGL_BufferLocation[];        // The Buffer of each Shape
    

// Methods
    /** Initiates Buffer Properties */
    constructor() {
        this.shapeObj = [];
        this.buffers = [];
    }

    /** Adds new Shape into Buffer Class 
     * 
     * @param shape The Shape Object or array of Shape Objects that will be added to current Buffer Class
     */
    public add(shapes: Shapes | Shapes[]): void {
        // Assign the Array of shapes OR add the ONE shape to array
        const arr: Shapes[] = shapes instanceof Array ? shapes : [shapes];

        // Loop through the array adding data to ShapeBuffer class
        for (const shape of arr) {
            this.shapeObj.push(shape);
            this.buffers.push(shape.buffer);
        }
    }

    /** Removes a Shape based on its Index Value 
     * 
     * @param index The Index of the Shape to remove
     * @returns The Removed Shape Object
    */
    public remove(index: number): Shapes {
        let remShape: Shapes;

        // Validate Index Value
        if (index > -1 && index <= this.shapeObj.length) {
            this.buffers.splice(index, 1);
            remShape = this.shapeObj.splice(index, 1)[0];
        }

        // Throw Error
        else {
            console.error(new Error(`Invalid Index Value! Valid Values are 0 through ${this.shapeObj.length}!`));
            return null;
        }

        // Return the Removed Shape
        return remShape;
    }

    /** Checks and Updates Buffer if Shape Object Buffer Updated */
    public updateBuffers(): void {
        // Loop through each shape checking if
        //  it's buffer updated
        for (let x = 0; x < this.shapeObj.length; x++) {
            // Update the BUffers if a shape buffer updated
            if (this.shapeObj[x].bufferUpdated) {
                this.buffers[x] = this.shapeObj[x].buffer;
            }
        }
    }

    /** Returns the Texture of Shape based on index
     * @param index The index of the Shape to return texture of
     * @returns Texture of Shape Object
     */
    public getTexture(index: number): WebGLTexture {
        return this.shapeObj[index].getTexture();
    }

    /** Returns the Shape Object at given Index 
     * @param index Shape Object Index
     */
    public getShape(index: number): Shapes {
        return this.shapeObj[index];
    }

    /** Returns the Render Settings of Object at given Index 
     * @param index Shape Object Index
     */
    public getRenderSettings(index: number): WebGL_RenderSettings {
        return this.shapeObj[index].getRenderingSettings();
    }
}