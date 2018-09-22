/**
 * Links two Verticies together starting from the first set of verticies to the next
 * Number of Verticies from vert1 will be adapted to fit onto vert2 (To Be Updated to do so...)
 * 
 * @param vert1 The First (main) set of Verticies
 * @param vert2 The Second set of Verticies
 * 
 * @returns Array of all the Connection Verticies
 */
export function linkVertices(vert1: number[], vert2: number[]): number[][] {
    // Properties
    const MAX_TIMES = vert1.length;
    const TOTAL_POINTS_PER_FACE = 4;
    let isSave = false;

    // Used Arrays
    let final2Arrays = [];
    let dummyArr = [];
    let cylinder = [];

    // Array that holds the Two Vert Arrays
    // This way the Algorithm can alternate between them
    const verticies = [vert1, vert2];

    // Result Array
    const result = [];

    // Algorithm Varaibles
    let i = 0;
    let j = 0;

    // Algorithm Init
    for (let x = 0; x < MAX_TIMES && j < MAX_TIMES; x++) {
        // Pre-Testing
        if ((x + 1) % 2 === 0) {
            i = (i + 1) % 2;
        }

    
        // Obtain Vector Points
        const arr = [];
        for (let y = 0; y < 3; y++) {
            arr.push(verticies[i][y + j]);
        }

    
        // Add Points to Dummy Array
        dummyArr.push(arr);


        // Array Tracking of last 2 Vector Points (Arrays)
        if (isSave) {
            final2Arrays.push(arr);
        }



        // Dump Dummy Array into Verticies
        if (dummyArr.length >= TOTAL_POINTS_PER_FACE) {
            // Store the Values into the Cylinder Array
            for (const arr of dummyArr) {
                for (const val of arr) {
                    cylinder.push(val);
                }
            }

            // Apply Data to Result Array
            result.push(cylinder);

            // Reset Arrays
            cylinder = [];
            dummyArr = [];
        }
    


        // Post-Testing
        if ((x + 1) % 2 === 0) {
            j += 3;

            // Add last Values of Array to Array
            if (final2Arrays.length) {
                for (const arr of final2Arrays) {
                    dummyArr.push(arr);
                }
            }

            // Reset Array Save States
            final2Arrays = [];
            isSave = true;
        }
        

    }


    // TRYING TO FIX THE LITTLE ANNOYING OPENING PATCH -_-
    if (dummyArr.length != 0) {
        // Get all data values from the Dummy Array
        for (const arr of dummyArr) {
            for (const val of arr) {
                cylinder.push(val);
            }
        }

        // Go from the last known point from the Dummy Array back to the beginning of 
        //  the cylinder vertex point (Loop back around to the first point)
        j = 0;
        i = 1;
        for (let x = 0; x < (TOTAL_POINTS_PER_FACE - dummyArr.length); x++) {
            for (let y = 0; y < 3; y++) {
                cylinder.push(verticies[i][y + j]);
            }
            j += 3;
            i = (i + 1) % 2;
        }

        
        result.push(cylinder);
    }

    return result;
}