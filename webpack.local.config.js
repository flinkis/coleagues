var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

/**
 * This is the Webpack configuration file for local development. It contains
 * local-specific configuration such as the React Hot Loader, as well as:
 *
 * - The entry point of the application
 * - Where the output file should be
 * - Which loaders to use on what files to properly transpile the source
 *
 * For more information, see: http://webpack.github.io/docs/configuration.html
 */
module.exports = {
    // Efficiently evaluate modules with source maps
    devtool: "eval",

    // Set entry point to ./src/router and include necessary files for hot load
    entry:  [
        'webpack-dev-server/client?http://localhost:9090',
        'webpack/hot/only-dev-server',
        './src/router.jsx'
    ],

    // This will not actually create a bundle.js file in ./build. It is used
    // by the dev server for dynamic hot loading.
    output: {
        path: __dirname + "/build/",
        filename: "app.js",
        publicPath: "http://localhost:9090/build/"
    },

    // Necessary plugins for hot load
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        new ExtractTextPlugin('[name].css'),
    ],

    // Transform source code using Babel and React Hot Loader
    module: {
        rules: [
            {
                enforce: "pre",
                test: /\.jsx$/,
                exclude: /node_modules/,
                loader: "eslint-loader"
            },
            {
                test: /\.jsx$/,
                exclude: /node_modules/,
                loaders: [ "react-hot-loader", "babel-loader" ]
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
                        { loader: 'postcss-loader', options: { config: { path: './config/postcss.config.js' } } }
                    ]
                })
            }
        ]
    },

    // Automatically transform files with these extensions
    resolve: {
        extensions: ['.js', '.jsx', '.css']
    },
}
