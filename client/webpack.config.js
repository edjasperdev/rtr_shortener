var path = require('path');
var webpack = require('webpack');
var HTMLWebpackPlugin = require('html-webpack-plugin');
var htmlWebPack = new HTMLWebpackPlugin({
    template: 'app/index.html'
  });
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var extractPlugin = new ExtractTextPlugin({
  filename: 'main.css'
});

// var UglifyJsPlugin = new webpack.optimize.UglifyJsPlugin();


module.exports = {
  entry: './app/index.js',
  output:{
    path: path.resolve(__dirname, 'dist'),
    filename: 'index_bundle.js',
    publicPath: '/'
  },
  module: {
    rules: [
        { test: /\.js$/, use: 'babel-loader'},
        { 
          test: /\.scss$/, 
          use: extractPlugin.extract({
            use: ['css-loader','sass-loader', 'import-glob-loader']
          })
        },
        {
          test: /\.(jpe?g|png|gif)(\?.*)?$/i,
          use:['file-loader?name=[name].[ext]','image-webpack-loader'

          ]
        }
    ]
  },
  plugins:[
    extractPlugin, 
    htmlWebPack, 
    // UglifyJsPlugin
  ]
}