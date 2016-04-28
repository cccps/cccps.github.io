var webpack = require('webpack');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
    // entry: [
    //     'webpack-dev-server/client?http://localhost:3000',
    //     'webpack/hot/only-dev-server',
    //     "./src/js/entry.js",
    // ],
    entry : {
        'index': "./src/js/entry.js"
    },
    output: {
        // publicPath: "http://127.0.0.1:3000/build/",
        publicPath: "./",
        path: __dirname+'/build/',
        filename: "[name].bundle.js"
    },
    module: {
        loaders: [
            { 
                test: /\.css$/, 
                loader: ExtractTextPlugin.extract("style-loader", "css-loader!autoprefixer")
                // loader: "style!css!autoprefixer"
            },
            { 
                test: /\.less$/, 
                loader: ExtractTextPlugin.extract("style-loader", "css-loader!autoprefixer!less")
                // loader: "style!css!autoprefixer!less"
            },
            { 
                test: /\.(png|jpg)$/, 
                loader: "url?limit=60000&name=[name].[ext]" 
            },
            { 
                test: /(\.jsx|entry.js)$/, 
                loader: "jsx" 
            }
        ]
    },
    plugins: [
        new webpack.BannerPlugin('This file is created by chocking'),
        new ExtractTextPlugin("[name].css")
        // new webpack.HotModuleReplacementPlugin(),
        // new webpack.NoErrorsPlugin()
    ],
    // resolve: {
    //     alias: {
    //         jquery: "../js/plugins/jquery-2.1.4.min.js"//针对jsx文件引用路径
    //     }
    // }
};