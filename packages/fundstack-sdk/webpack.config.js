const path = require('path');
const webpack = require('webpack');
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin")


module.exports = {
    mode: "development",
    entry: {
        app: ['./index.js']
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'js/[name].bundle.js',
        crossOriginLoading: "anonymous"
    },
    resolve: {
        extensions: ['.js']
    },
    module: {
        rules: [
            {
                test: /\.(js)$/,
                exclude: /(node_modules)/,
                use: ['babel-loader'],
            },
            {
                test: /\.teal$/i,
                use: 'raw-loader',
            },
        ]
    },
    plugins: [
        new NodePolyfillPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.DefinePlugin({
            'KEY': JSON.stringify("VALUE"),
        })
    ],
}