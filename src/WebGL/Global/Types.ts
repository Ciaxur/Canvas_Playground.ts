/** WebGL Type References */

// Shape Dimensions
export type Dimensions = "3D" | "2D";

// Lighting Types
export type LightingTypes = "ambient" | "default" | "diffuse" | "specular" | "phong" | "experimental" ;

// Texture Pixles for WebGL's "texImage2D" method
export type Texture_Pixels = ImageBitmap | ImageData | HTMLVideoElement | HTMLImageElement | HTMLCanvasElement;