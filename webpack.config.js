/**
 * Webpack Configuration
 *  More Info: https://webpack.js.org/configuration
 */


const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');



/**
 * Server Configuration Part of the Webpack
 */
const serverConfig = {
    // Config Target and Mode
    mode: "development",        // development | production | none
    target: 'node',              // Web Targeted (web | node)


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


    // Plugins
    plugins: [
        new CopyWebpackPlugin([
            {
                from: './src/Resources/**/*',
                to: 'Resources/',
                flatten: true
            },
            {
                from: './src/Shaders/**/*',
                to: 'Shaders/',
                flatten: true
            }
        ])
    ],


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
module.exports = [serverConfig];
