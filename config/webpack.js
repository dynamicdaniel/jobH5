'use strict';

const path = require('path');
const webpack = require('webpack');

module.exports = (app, defaultConfig /* , dev */) => {
  defaultConfig.plugins[3] = new webpack.optimize.CommonsChunkPlugin({
    name: 'manifest',
    filenameTemplate: 'manifest.js',
    minChunks:Infinity
  });
  return {
    ...defaultConfig,
    resolve: {
      extensions: ['.json', '.js', '.jsx'],
      alias: {
        client: path.join(__dirname, '../client'),
        images: path.join(__dirname, '../client/images'),
        themes: path.join(__dirname, '../client/themes'),
      },
    },
    module:{  
      rules:[  
        {
          test: /\.jsx|.js$/,
          loader: 'babel-loader',
          query: {
              // cacheDirectory: './webpack_cache/',
              plugins: [
                  ["transform-runtime", {
                      "polyfill": false,
                      "regenerator": true
                  }],
                  ["import", { libraryName: "antd-mobile", style: "css" }]
              ],
              presets: [
                  'es2015',
                  'stage-0',
                  'react',
              ]
          },
          exclude: /node_modules/,
        }, 
        {  
          test: /\.css$/,  
          loader: "style-loader!css-loader"  
        },  
        {  
          test: /\.scss$/,  
          loader: "style-loader!css-loader!sass-loader"  
        }, 
        {
          test: /\.(jpe?g|png|gif|svg)$/i,
          use:[{
            loader:'url-loader?limit=5120&name=images/[name].[ext]'
          }]
        } 
      ]  
      },  
  };
};