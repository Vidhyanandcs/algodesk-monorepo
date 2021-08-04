import path from 'path';
import NodePolyfillPlugin from 'node-polyfill-webpack-plugin';

import { fileURLToPath } from 'url';

Object.defineProperty(global, '__dirname', {
    __proto__: null,
    get: () => {
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);
        return __dirname;
    }
});

export default {
    mode: 'production',
    entry: './src/index.ts',
    output: {
        filename: 'algodesk-sdk.min.js',
        path: path.resolve(__dirname, 'dist/browser'),
        library: {
            type: 'umd',
            name: 'algodesk-sdk',
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