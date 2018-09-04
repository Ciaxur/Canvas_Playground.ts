import { Vector2D, createVector, createVector2D, createVector3D, Vector3D } from "./Vectors";

/**
 * Simple Math Values and Formulas
 */

// The PI Values
export const PI         = Math.PI;
export const TWO_PI     = Math.PI * 2;
export const HALF_PI    = Math.PI / 2;
export const THIRD_PI   = Math.PI / 3;
export const QURATER_PI = Math.PI / 4;
export const FIFTH_PI   = Math.PI / 5;
export const TAU        = TWO_PI;

// Math Formulas
export const abs        = Math.abs;
export const squrt      = Math.sqrt;
export const pow        = Math.pow;
export const floor      = Math.floor;
export const ceil       = Math.ceil;
export const round      = Math.round;

// Trig Formulas
export const sin        = Math.sin;
export const cos        = Math.cos;
export const tan        = Math.tan;

// Hyperbolic-Trig Formulas
export const sinh       = Math.sinh;
export const cosh       = Math.cosh;
export const tanh       = Math.tanh;


// Custom Formulas

/**
 * Squares the num parameter 
 * 
 * @param num The number that will be squared
 * 
 * @returns The Squared Value
 */
export function squared(num: number): number {
    return Math.pow(num, 2);
}

/** Returns the Change Rotated Vector (cx, cy)
 * The Change in the Rotation at 1 Point Difference (If no normalized parameter)
 * So if angle rotation of (0, 0) will result in (1, 0);
 * 
 * @param vecPoint The Initial Point
 * @param angle The Angle of Rotation from the Initial Vector
 * @param normalized Normalize the result difference to value (Defualt is 1)
 * 
 * @returns A Vector that holds the Change in the Initial Vector Point (cx, cy)
 */
export function rotate(vecPoint: Vector2D, angle: number, normalized ?: number): Vector2D {
    // Calculate the Change
    const cx = Math.cos(angle);
    const cy = Math.sin(angle);

    // Assign the new Point Loaction
    const x = vecPoint.x + (cx * (normalized ? normalized : 1));
    const y = vecPoint.y + (cy * (normalized ? normalized : 1));

    // Return the Result as a 2D Vector
    return createVector(x, y);
}

/** Checks if Value is Power of 2 or Not
 * - Example: 2, 4, 6, 8...
 * 
 * @returns Boolean on whether it's true or not
 */
export function isPowerOf2(value: number): boolean {
    return (value & (value - 1)) == 0;
}

/** Calculates Circle Unit Vectors (x, y)
 * @param theta Angle in Radians
 * @param vectorType The Type of Vector to create and return (2D or 3D Vector) (Optional -> Default = 2D Vector)
 * @returns Vector2D Object
 */
export function unitCircle(theta: number, vectorType?: '2d' | '3d'): Vector3D | Vector2D {
    if (vectorType === '3d')    return createVector3D(cos(theta), sin(theta), 0.0);
    else                        return createVector2D(cos(theta), sin(theta))
}