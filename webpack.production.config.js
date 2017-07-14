const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

/**
 * This is the Webpack configuration file for production.
 */
module.exports = {
    context: path.resolve(__dirname, 'src'),

    entry: [
        "babel-polyfill",
        './router.jsx'
    ],

    output: {
        path: path.resolve(__dirname, 'build/'),
        filename: "app.js"
    },

    plugins: [
        new ExtractTextPlugin('[name].css'),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production')
        })
    ],

    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: "babel-loader"
            },
            {
                test: /\.css$/, 
                use: ExtractTextPlugin.extract({
                    use: [
                        {
                            loader: 'css-loader',
                            options: {
                                modules: true,
                                importLoaders: 1,
                                localIdentName: '[name]__[local]--[hash:base64:5]'
                            }
                        },
                        { loader: 'postcss-loader', options: { config: { path: 'config/postcss.config.js' } } }
                    ]
                })
            }
        ]
    },

    resolve: {
        extensions: ['.js', '.jsx', '.css'],
    },
}
