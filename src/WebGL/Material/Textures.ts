import { gl } from "../../Canavs/Canvas";
import { isPowerOf2 } from "../../Math/Math";
import { WebGL_TextureBuffer, RGBA } from '../Global/Interfaces';
import { Texture_Pixels } from "../Global/Types";


/** WebGL Texture Abstract Class
 * 
 * - Loads in Textures from URL
 * - Loads in Animating Textures from URL
 * - Generates Texture Coordinates
 * - Creates Solid Textures from RGBA Values
 */
export abstract class Textures {
    /** Creates a Texture from URL
     * 
     * - Repeating texture (false) -> Causes UV Wrapping and Mipmapping
     * - Repeating texture (true) -> Causes Repeating Textures
     * 
     * @param url Image URL
     * @param repeatingTexture Sets repeating texture to true (Optional -> false)
     * @returns WebGL Texure
     */
    static loadTexture(url: string, repeatingTexture?: boolean): WebGL_TextureBuffer {
        const texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);

        // Have a Preset Texture by the time the Texture Loads
        const level = 0;
        const internalFormat = gl.RGBA;
        const width = 1;
        const height = 1;
        const border = 0;
        const srcFormat = gl.RGBA;
        const srcType = gl.UNSIGNED_BYTE;

        const pixel = new Uint8Array([0, 0, 0, 255]);     // Opaque Blue
        
        // Load Texture
        gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, width, height, border, srcFormat, srcType, pixel);


        // Load in the URL-Texture
        const image = new Image();
        image.onload = () => {
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, srcFormat, srcType, image);

            // WebGL1 Has Different Requierments on Image Dimensions
            // Let's Check
            if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
                // It's Power of 2. Generate mips
                gl.generateMipmap(gl.TEXTURE_2D);
            } else {
                // Repeates Textures
                if (repeatingTexture) {
                    // gl.NEAREST is allowed instaed of gl.LINEAR  |  Neither Mipmap
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
                    // Prevents s-coordinate Wrapping (Casues Repeating)
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                    // Prevents t-coordinate Wrapping (Casues Repeating)
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
                    
                }

                // Wraps Texture
                else {
                    // Not Power of 2. Turn off mips and set wrapping to clamp to edge
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
                }
            }
        };
        // Load Image
        image.src = url;





        return {
            textureCoordinates: null,
            texture,
            textureSrc: image
        }
    }

    /** Creates an Animating Texture from URL 
     * @param url The URL to load Texture from
     * @returns A Promise with the WebGL Texture Buffer Object
     */
    static loadAnimatingTexture(url: string): WebGL_TextureBuffer {
        // Create an Empty Texture
        const texture = this.createSolidTexture(null, () => {
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        });

        // Create Texture Data
        const textureBufferData: WebGL_TextureBuffer = {
            texture: texture.texture,
            textureCoordinates: null,
            textureSrc: null
        };


        // Video Variable Data
        const video = document.createElement('video');
        textureBufferData.textureSrc = video;

        // Video Properties Setup
        video.autoplay = true;
        video.muted = true;
        video.loop = true;


        // Update Texture when Done Loading Video
        video.onloadeddata = () => {
            // Update Texture
            this.updateTexture(texture.texture, video);
        }


        // Set Video Data
        video.src = url;
        video.play();


        // Return Texture Object
        return textureBufferData;
    }


    /** Generates Texture Coordinates based on the total number of faces
     * 
     * @param faces The total number of faces on object
     * @returns 1D Array of Texture Coordinates
     */
    static generateTextureCoordinates(faces: number): number[] {
        const arr = [];

        // Add Texture Coordinates to EACH face
        for (let x = 0; x < faces; x++) {
            arr.push(
                0.0,  0.0,
                1.0,  0.0,
                1.0,  1.0,
                0.0,  1.0
            );
        }

        return arr;
    }

    /** Creates a Solid Texture from RGBA Object
     * @param RGBA Color of the Entire Shape (Colors Range from 0 - 255) (Optional | Default is White)
     * @param filterFn Function that overrides the WebGL Fiters (Optional | Default is Set to Mag, Min, & Nearest)
     * @param width The Width of the Texture (Optional | Default is 1)
     * @param height The Height of the Texture (Optional | Default is 1)
     * @returns WebGL Texture
     */
    static createSolidTexture(rgba?: RGBA, filterFn?: Function, width?: number, height?: number): WebGL_TextureBuffer {
        // Set Default RGBA
        if (!rgba) {
            rgba = {
                r: 255,
                g: 255,
                b: 255
            }
        }
        
        // Validate RGBA Data
        rgba.a = rgba.a ? rgba.a : 255;     // Default Alpha = 255
        
        // Create the Data
        const data = new Uint8Array([rgba.r, rgba.g, rgba.b, rgba.a]);
        const texture_width = width | 1;    // Default = 1
        const texture_height = height | 1;  // Default = 1

        // Create and Bind Texture to WebGL
        const texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);

        // Apply Data to Texture
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, texture_width, texture_height, 0, gl.RGBA, gl.UNSIGNED_BYTE, data);
        
        // Apply Override Textures
        if (filterFn) {
            filterFn();
        }

        else {
            // Apply Default Texture Filters
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        }


        return {
            texture,
            textureCoordinates: null
        };
    }

    /** Updates Given Texture with new Data 
     * @param texture The Target WebGL Texture
     * @param data Data being Updated onto the Target
     * @returns Nothing, since Updated Data is in the GPU Memory
    */
    static updateTexture(texture: WebGLTexture, data: Texture_Pixels): void {
        // Default Texture Options
        const level = 0;
        const internalFormat = gl.RGBA;
        const srcFormat = gl.RGBA;
        const srcType = gl.UNSIGNED_BYTE;

        // Bind the Texture
        gl.bindTexture(gl.TEXTURE_2D, texture);

        // Update Texture
        gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, srcFormat, srcType, data);

    }
}








