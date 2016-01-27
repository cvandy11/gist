'use strict';

var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var StatsPlugin = require('stats-webpack-plugin');

module.exports = {
    entry: [
        path.join(__dirname, 'app/main.js')
    ],
    output: {
        path: path.join(__dirname, '/dist/'),
        filename: '[name]-[hash].min.js',
    },
    plugins: [
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
        }),
        new webpack.optimize.UglifyJsPlugin({
            compressor: {
            warnings: false,
            screw_ie8: true
        }
    }),
        new ExtractTextPlugin('[name]-[hash].min.css'),
        new HtmlWebpackPlugin({
            template: 'app/index.tpl.html',
            inject: 'body',
            filename: 'index.html'
        })
    ],
    module: {
        loaders: [{
            test: /\.js?$/,
            exclue: /node_modules/,
        loaders: 'babel'
        }, {
            test: /\.json?$/,
            loader: 'json'
        }, {
            test: /\.css$/,
            loader: ExtractTextPluging.extract('style', 'css?modules&localIdentName=[name]---[local]---[hash:base64:5]!postcss')
        }]
    },
    postcss: [
        require('autoprefixer');
    ]
};
