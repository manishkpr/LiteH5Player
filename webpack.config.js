var path = require('path');

module.exports = {
  entry: path.join(__dirname, "src/index.js"),
  output: {
    path: path.join(__dirname, "dist"),
    filename: "liteH5Player.debug.js"
  },
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.js$/,
        include: [
          path.join(__dirname, 'src')
        ],
        loader: 'babel-loader',
        query: {
          presets: ['es2015', 'babel-preset-react']
        }
      }
    ]
  }
};


/*
// webpack basic usage
Reference1: webpack中文网 -- https://webpack.docschina.org
Reference2: webpack 4 教程 -- https://blog.zfanw.com/webpack-tutorial/#%E4%B8%BA%E4%BB%80%E4%B9%88%E9%80%89%E6%8B%A9-webpack

// webpack convert es6 to es5
Refer1: 使用webpack 进行ES6开发 -- https://segmentfault.com/a/1190000004457636

// webpack integrate css/img to SDK
webpack 4 教程
https://blog.zfanw.com/webpack-tutorial/#%E4%B8%BA%E4%BB%80%E4%B9%88%E9%80%89%E6%8B%A9-webpack




// Title: Configure webpack to allow browser debugging?
see: https://stackoverflow.com/questions/27626764/configure-webpack-to-allow-browser-debugging
Use below cmd to build debug lib.
$ webpack --devtool source-map

// Title: configure css with React
1. https://javascriptplayground.com/css-modules-webpack-react/
2. opensource FYI
a. scotch-react-todo
b. react-css-modules-webpack





 */



