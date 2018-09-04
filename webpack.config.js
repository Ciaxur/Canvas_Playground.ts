/**
 * Webpack Configuration
 *  More Info: https://webpack.js.org/configuration
 */


const path = require('path');

/**
 * Client Configuration Part of the Webpack
 */
const clientConfig = {
    // Config Target and Mode
    mode: "development",        // development | production | none
    target: 'web',              // Web Targeted (web | node)


    // Entry Files
    entry: {
        app: './src/app.ts',    // Main App
    },


    // Resolve Path for Typescript in 'src' Directory
    resolve: {
        extensions: ['.ts'],
        modules: [
            path.resolve('src'),
            path.resolve('node_modules')
        ]
    },

    // Apply Loaders
    module: {
        rules: [
            {   // Typescript Loader
                test: /\.ts$/,
                use: 'ts-loader'
            }
        ]
    },

    
    // Specify Output
    output: {
        filename: '[name].js',                  // Outputs Files as their own Name
        path: path.resolve(__dirname, 'dist')
    }
};

// Multiple Configuration Exports
module.exports = [clientConfig];