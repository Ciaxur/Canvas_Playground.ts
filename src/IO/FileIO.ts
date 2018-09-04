/** Loads a Path File as String & Returns Data whether Sync or Async is Enabled
 * @param path String path to the file
 * @returns Promise Object or String
 */
export function readStrFile(path: string, sync?: boolean): Promise<string> | string {
    // Initiate XML Request
    const xhr = new XMLHttpRequest();
    
    // Synchronous
    if (sync) {
        xhr.open('GET', path, false);
        xhr.send();

        if (xhr.status === 200) {
            return xhr.responseText;
        }

        return null;
    }

    // Asynchronous
    else {
        return new Promise((res, err) => {
            xhr.open('GET', path, true);
    
            // Set Get Data to Text
            xhr.responseType = 'text';

    
            // Load Data
            xhr.onload = () => {

                // Retrieve As Text
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        res(xhr.responseText);
                    } else {
                        err(new Error(xhr.statusText));
                    }
                }

            };

            xhr.onerror = () => {
                err(new Error(xhr.statusText));
            };

            xhr.send(null);
        });
    }
}