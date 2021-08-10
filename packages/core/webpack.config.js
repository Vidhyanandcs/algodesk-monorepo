const path = require('path');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');

module.exports = {
    mode: 'production',
    entry: './index.ts',
    output: {
        filename: 'algodesk-core.min.js',
        path: path.resolve(__dirname, 'dist/browser'),
        library: {
            type: 'umd',
            name: 'algodesk-core',
        },
        clean: true
    },
    devtool: 'source-map',
    resolve: {
        extensions: ['.ts', '.js'],
    },
    plugins: [
        new NodePolyfillPlugin(),
    ],
    module: {
        rules: [
            {
                test: /\.ts$/,
                loader: 'ts-loader',
                options: {
                    configFile: path.resolve(__dirname, 'tsconfig-browser.json'),
                },
            },
            { test: /\.js$/, loader: 'source-map-loader' },
        ]
    },
};