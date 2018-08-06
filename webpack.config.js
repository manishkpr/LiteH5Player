const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = (env, options) => {
  console.log(`This is the Webpack 4 'mode': ${options.mode}`);
  const devMode = (options.mode === 'development') ? true : false;

  const jsOutputName = devMode ? 'liteH5Player.debug.js' : 'liteH5Player.min.js';
  const cssOutputName = devMode ? 'liteH5Player.debug.css' : 'liteH5Player.min.css';
  return {
    entry: path.join(__dirname, 'src/index.js'),
    output: {
      path: path.join(__dirname, 'dist'),
      filename: path.join('js', jsOutputName)
    },
    module: {
      rules: [
      // {
      //   enforce: "pre",
      //   test: /\.js$/,
      //   include: [
      //     path.join(__dirname, 'src')
      //   ],
      //   exclude: [
      //     path.join(__dirname, 'src/externals')
      //   ],
      //   use: {
      //     // For options, see .eslintrc.js
      //     loader: "eslint-loader"
      //   }
      // },
      {
        test: /\.js$/,
        include: [
          path.join(__dirname, 'src'),
          path.join(__dirname, 'third_party/hlsjs/src')
        ],
        use: {
          // For options, see .babelrc
          loader: 'babel-loader'
        }
      }, {
        test: /\.(sa|sc|c)ss$/,
        include: [
          path.join(__dirname, 'src/ui')
        ],
        use: [{
          //loader: devMode ? 'style-loader' : MiniCssExtractPlugin.loader, // 'style-loader' creates style nodes from JS strings;
          loader: MiniCssExtractPlugin.loader
        }, {
          loader: 'css-loader', // translates CSS into CommonJS
          options: { minimize: devMode ? false : true }
        }, {
          loader: 'sass-loader' // compiles Sass to CSS
        }]
      }, {
        test: /\.(png|jpg|gif)$/,
        use: [{
          loader: 'file-loader',
          options: {
            name: './assets/img/[name].[ext]'
          }
        }]
      }, {
        test: /\.svg$/,
        use: {
          loader: 'svg-url-loader',
          options: {}
        }
      }]
    },
    plugins: [
      new MiniCssExtractPlugin({
        // Options similar to the same options in webpackOptions.output
        // both options are optional
        filename: path.join('css', cssOutputName),
        chunkFilename: '[id].css'
      }),
      new HtmlWebpackPlugin({ // Also generate a test.html
        filename: 'index.html',
        template: 'samples/demo/index.html'
      })
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


// Webpack4 integrate .scss
1. webpack配置sass模块的加载 -- https://www.cnblogs.com/ww03/p/6037710.html
2. Webpack 4 config.js (SCSS to CSS and Babel) ok_hand The Simplest Usage -- https://gist.github.com/mburakerman/629783c16acf5e5f03de60528d3139af

// Webpack integrate TypeScript
1. https://webpack.js.org/guides/typescript/

// Webpack4 extracs css
1. https://github.com/webpack-contrib/mini-css-extract-plugin

// Title: Configure webpack to allow browser debugging?
see: https://stackoverflow.com/questions/27626764/configure-webpack-to-allow-browser-debugging
Use below cmd to build debug lib.
$ webpack --devtool source-map

// Title: configure css with React
1. https://javascriptplayground.com/css-modules-webpack-react/
2. opensource FYI
a. scotch-react-todo
b. react-css-modules-webpack

// Title: use eslint in webpack
1. Install eslint & eslint-loader
2. 'eslint init' to generate .eslintrc.js config file.
3. config webpack.config.js



 */