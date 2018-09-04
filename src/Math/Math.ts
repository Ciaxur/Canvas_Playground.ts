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

// Math Formulas
export const abs        = Math.abs;
export const squrt      = Math.sqrt;
export const pow        = Math.pow;
export const floor      = Math.floor;
export const ceil       = Math.ceil;
export const round      = Math.round;


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
