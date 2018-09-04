/* 
 * Title: Simple Vector Class
 * 
 * Can Create 2D or 3D Vectors using methods.
 * Calculations from two or three Vectors 
 *  - Adding | Subtracting | Mutliplying | Dividing | Distance
 * Since Vector2D or Vector3D is an Object, a method is available to create a Deep Copy
*/

/** 2D Vector Interface with x-Point and y-Point */
export interface Vector2D {
    x: number;
    y: number;
}

/** 2D Size Interface with Width and Height */
export interface Size2D {
    width: number;
    height: number;
}

/** 3D Vector Interface with x-Point, y-Point, z-Point */
export interface Vector3D {
    x: number;
    y: number;
    z: number;
}




/** 2D Vector Class Object
 * A two Dimentional Vector Object with two Elements (x, y)
 * Calculations from two Vectors
 * Vector Methods for Manipulation
*/
export class Vector2D {
    public x: number;
    public y: number;
    
    /** Create a 2D Vector with Parameters
     * @constructor Create a 2D Vector
     * @param x Vector X Point (Optional)
     * @param y Vector Y Point (Optional)
     */
    constructor(x?: number, y?: number) {
        this.x = x != undefined ? x : 0;
        this.y = y != undefined ? y : 0;
    };

    /** Adds Vector2D to current vector 
     * Or a Scalar value to Current Vector
     * 
     * @param vec2 The Vector2D or Scalar Value
     * @returns Current Object for Chaining
    */
    public add(vec2: Vector2D | number): Vector2D {
        // Add as Vector
        if (vec2 instanceof Vector2D) {
            this.x += vec2.x;
            this.y += vec2.y;
        }

        // Add as Scalar
        else {
            this.x += vec2;
            this.y += vec2;
        }

        return this;
    }

    /** Subtracts Vector2D from current vector 
     * Or a Scalar value to Current Vector
     * 
     * @param vec2 The Vector2D or Scalar Value
     * @returns Current Object for Chaining
    */
    public sub(vec2: Vector2D | number): Vector2D {
        // Sub as Vector
        if (vec2 instanceof Vector2D) {
            this.x -= vec2.x;
            this.y -= vec2.y;
        }

        // Sub as Scalar
        else {
            this.x -= vec2;
            this.y -= vec2;
        }

        return this;
    }

    /** Multiplies Vector2D from current vector 
     * Or multiply as Scalar
     * 
     * @param vec2 The Vector2D or Scalar Value
     * @returns Current Object for Chaining
    */
    public mult(vec2: Vector2D | number): Vector2D {
        // Vector Multiplication
        if (vec2 instanceof Vector2D) {
            this.x *= vec2.x;
            this.y *= vec2.y;
        }

        // Scalar Multiplication
        else {
            this.x *= vec2;
            this.y *= vec2;
        }

        return this;
    }

    /** Divides Vector2D from current vector 
     * Or Scalar Division
     * 
     * @param vec2 The Vector2D or Scalar Value
     * @returns Current Object for Chaining
    */
    public div(vec2: Vector2D | number): Vector2D {
        // Vector Division
        if (vec2 instanceof Vector2D) {
            this.x /= vec2.x;
            this.y /= vec2.y;
        }

        // Scalar Division
        else {
            this.x /= vec2;
            this.y /= vec2;
        }

        return this;
    }

    /** Returns a Deep Copy of current Vector Object 
     * @returns Deep Copy of Current Vector Object
    */
    public copy(): Vector2D {
        return new Vector2D(this.x, this.y);
    }

    /** Returns an Array Version of Current Vector
     * @returns Array Version of Current Vector
     */
    public toArray(): number[] {
        return [ this.x, this.y ];
    }
};

/** 3D Vector Class Object
 * A two Dimentional Vector Object with two Elements (x, y)
 * Calculations from two Vectors
 * Vector Methods for Manipulation
*/
export class Vector3D extends Vector2D {
    public z: number;
    
    /** Create a 3D Vector with Parameters 
     * @constructor Create a 3D Vector
     * @param x Vector X Point (Optional)
     * @param y Vector Y Point (Optional)
     * @param z Vector Z Point (Optional)
    */
    constructor(x?: number, y?: number, z?: number) {
        // Create the 2D Class
        super(x, y);

        // Assign the 3D Class
        this.z = z != undefined ? z : 0;
    }

    /** Adds Vector3D to current vector 
     * Or a Scalar value to Current Vector
     * 
     * @param vec2 The Vector2D or Vector3D or Scalar Value
     * @returns Current Object for Chaining
    */
    public add(vec2: Vector2D | Vector3D | number): Vector2D {
        // Call the Parent add Function
        super.add(vec2);

        // Add as Vector3D 
        if (vec2 instanceof Vector3D) {
            this.z += vec2.z;
        }

        // Add as Scalar
        else if(typeof(vec2) === "number") {
            this.z += vec2;
        }

        return this;
    }

    /** Subtracts Vector3D from current vector 
     * Or a Scalar value to Current Vector
     * 
     * @param vec2 The Vector2D or Vector3D or Scalar Value
     * @returns Current Object for Chaining
    */
    public sub(vec2: Vector2D | Vector3D | number): Vector2D {
        // Call the Parent sub Function
        super.sub(vec2);

        // Sub as Vector
        if (vec2 instanceof Vector3D) {
            this.z -= vec2.z;
        }

        // Sub as Scalar
        else if(typeof(vec2) === "number") {
            this.z -= vec2;
        }

        return this;
    }

    /** Multiplies Vector3D from current vector 
     * Or multiply as Scalar
     * 
     * @param vec2 The Vector2D or Vector3D or Scalar Value
     * @returns Current Object for Chaining
    */
    public mult(vec2: Vector2D | Vector3D | number): Vector2D {
        // Call the Parent mult Function
        super.mult(vec2);

        // Vector Multiplication
        if (vec2 instanceof Vector3D) {
            this.z *= vec2.z;
        }

        // Scalar Multiplication
        else if(typeof(vec2) === "number") {
            this.z *= vec2;
        }

        return this;
    }

    /** Divides Vector3D from current vector 
     * Or Scalar Division
     * 
     * @param vec2 The Vector2D or Vector3D or Scalar Value
     * @returns Current Object for Chaining
    */
    public div(vec2: Vector2D | Vector3D | number): Vector2D {
        // Call the Parent div Function
        super.div(vec2);

        // Vector Division
        if (vec2 instanceof Vector3D) {
            this.z /= vec2.z;
        }

        // Scalar Division
        else if(typeof(vec2) === "number") {
            this.z /= vec2;
        }

        return this;
    }

    /** Returns a Deep Copy of current Vector Object 
     * @returns Deep Copy of Current Vector Object
    */
    public copy(): Vector3D {
        return new Vector3D(this.x, this.y, this.z);
    }

    /** Returns an Array Version of Current Vector
     * @returns Array Version of Current Vector
     */
    public toArray(): number[] {
        const arr = super.toArray();
        arr.push(this.y);
        return arr;
    }
}





/** Creates and returns a 2D or 3D Vector Object 
 * @param x Vector X Point (Optional)
 * @param y Vector Y Point (Optional)
 * @param z Vector Z Point (Optional)
*/
export function createVector(x?: number, y?: number, z?: number): Vector2D | Vector3D {
    return z != undefined ? new Vector3D(x, y, z) : new Vector2D(x, y);
}

/** Creates and returns a 2D Vector Object 
 * @param x Vector X Point (Optional)
 * @param y Vector Y Point (Optional)
 * */
export function createVector2D(x?: number, y?: number): Vector2D {
    return new Vector2D(x, y);
}

/** Creates and returns a 3D Vector Object 
 * @param x Vector X Point (Optional)
 * @param y Vector Y Point (Optional)
 * @param z Vector Y Point (Optional)
 * */
export function createVector3D(x?: number, y?: number, z?: number): Vector3D {
    return new Vector3D(x, y, z);
}


/** Calculates the Distance between two 2D Vector Points
 * @param x1 -First x Vector Point
 * @param y1 -First y Vector Point
 * @param x2 -Second x Vector Point
 * @param y2 -Second y Vector Point
 */
export function dist(x1:number, y1:number, x2:number, y2:number): number {
    return Math.sqrt(Math.pow((x1 - x2), 2) + Math.pow((y1 - y2), 2));
}

/** Calculates if Vector1 is within Vector2 from the Center of Vector
 * @param vec1 - Primary Vector (Location)
 * @param size1 - Primary Size (Offset)
 * @param vec2 - Secondary Vector (Location)
 * @param size2 - Secondary Size (Offset)
 * @returns A Boolean on the state of the two vectors overlaying
 */
export function within(vec1: Vector2D, size1: Size2D, vec2: Vector2D, size2: Size2D): Boolean {
    if ((vec1.x - size1.width / 2)  < (vec2.x + (size2.width / 2))  &&
        (vec1.x + size1.width / 2)  > (vec2.x - (size2.width / 2))  &&
        (vec1.y - size1.height / 2) < (vec2.y + (size2.height / 2)) &&
        (vec1.y + size1.height / 2) > (vec2.y - (size2.height / 2))) {
        return true;
    }

    return false;
}