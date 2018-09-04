/*
    Simple Array Manipulation Library
*/

/** Flattens any 2D Array into 1D Array
 * 
 * @param arr 2D Array
 * @returns Flat 1D Array
 */
export function flatten2DArray(arr: any[][]): any[] {
    const flatArr = [];

    // Loop through each Sub-Array
    for (const data of arr) {
        for (let x = 0; x < data.length; x++) {
            flatArr.push(data[x]);
        }
    }

    return flatArr;
}

/** Verifies if Array Parameter is a 2D Array or more 
 * 
 * @param arr The array that will be verified
 * @returns True or False based on if 2D array or not
 */
export function is2DArray(arr: Array<any>): boolean {
    // Check if 2D Array
    if (arr.length && arr[0] instanceof Array) {
        return true;
    }

    // Failed | Not 2D Array
    return false;
}

/** Transforms a 1D Array to a 2D Array based on offset
 * 
 * @param arr The 1D Array that will be Transformed to 2D Array
 * @param offset The Offset of the values being encapsuled into a sub array
 * @returns A 2D Array with Offset values
 */
export function arrayTo2D(arr: any[], offset: number): any[][] {
    // 2D Array Results
    const arr2D = [];
    
    // Loop through each Value of the array
    // Accumulate based on offsets
    for (let x = 0; x < arr.length; x += offset) {
        // Create Sub-Array
        arr2D.push([]);

        // Loop through the Values within Offset
        for (let i = x; i < offset + x; i++) {
            arr2D[arr2D.length - 1].push(arr[i]);
        }
    }

    return arr2D;
}