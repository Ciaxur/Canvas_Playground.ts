/** Globalizes Variables to call in Chrome Dev Tools Console
 * 
 * @param entry The Array of the Variable that will be Globalized { Data -> variable ; globalName -> The Global Name }
 */
export function globalize(entry: Array<{ data: any, globalName: string }>): void {
    // Globalize all in Array
    for (const obj of entry) {
        (window as any)[obj.globalName] = obj.data;
    }
}
