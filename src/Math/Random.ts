/** Generates an Evently Distributed Random number between a min and max
 * Returns a Random Number between the two params
 * If max or min, defualt is a random number between 0 and 1
 * @param max Largest Random Number (Optional)
 * @param min Smallest Random Number (Optional)
 * @returns A random number between min and max
 */
export function rand(max?: number, min?: number): number {
    // If no Max or no Min, Return a Default of a number between (0 - 1)
    if (max === undefined || min === undefined) { return Math.random() * 1; }

    // Return a Number between max and min
    return Math.random() * (max - min) + min;
}

/** Generates a Random Seed Value
 * @returns Random Seed Value
 */
export function generateSeed(): number {
    const m = 4568984532;                       // Random Large Number
    return Math.random() * m >>> 0;             // Casts to an Unsigned 32-bit Integer
}

/** Generates a Random number using the Guassian Algorithm Distribution 
 * Random number is more likely to generate the min towards the max (least likely)
 * Default: Between 0 & 1
 * @param min Minimum Number Generated (Optional)
 * @param max Maximum Number Generated (Optional)
 */
export function randGuassian(min? : number, max? : number): number {
    let x1, x2, w;

    do {
        x1 = rand();
        x2 = rand();
        w = (x1 * x1) + (x2 * x2);
    } while (w >= 1);

    w = Math.sqrt(-2 * Math.log(w) / w);

    const m = min || 0;
    const s = max || 1;

    return x1 * s + m;
}