const webpack = require('webpack');

module.exports = {
  entry:  __dirname + "/src/index.js",
  output: {
    path: __dirname + "/dist",
    filename: "liteH5Player.debug.js"
  },
  mode: 'development'
}

/*
// Title: Configure webpack to allow browser debugging?
see: https://stackoverflow.com/questions/27626764/configure-webpack-to-allow-browser-debugging
Use below cmd to build debug lib.
$ webpack --devtool source-map







 */