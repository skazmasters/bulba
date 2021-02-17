import webpack from 'webpack';
import path from 'path';
import config from './gulp/config';
// import "babel-polyfill";
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

export default (env) => {
  let isProduction,
    webpackConfig;

  if (env === undefined) {
    env = process.env.NODE_ENV;
  }

  isProduction = env === 'production';

  webpackConfig = {
    context: path.join(__dirname, config.src.js),
    entry: {
      app:"./app.js",
    },
    output: {
      path: path.join(__dirname, config.dest.js),
      filename: '[name].js',
      publicPath: 'js/',
    },
    devtool: isProduction ? '#source-map' : '#cheap-module-eval-source-map',
    // resolve: {
    //   extensions: ['.js'],
    //   alias: {
    //     TweenLite: path.resolve('node_modules', 'gsap/src/uncompressed/TweenLite.js'),
    //     TweenMax: path.resolve('node_modules', 'gsap/src/uncompressed/TweenMax.js'),
    //     TimelineLite: path.resolve('node_modules', 'gsap/src/uncompressed/TimelineLite.js'),
    //     TimelineMax: path.resolve('node_modules', 'gsap/src/uncompressed/TimelineMax.js'),
    //     ScrollMagic: path.resolve('node_modules', 'scrollmagic/scrollmagic/uncompressed/ScrollMagic.js'),
    //     'animation.gsap': path.resolve('node_modules', 'scrollmagic/scrollmagic/uncompressed/plugins/animation.gsap.js'),
    //     'debug.addIndicators': path.resolve('node_modules', 'scrollmagic/scrollmagic/uncompressed/plugins/debug.addIndicators.js'),
    //   },
    // },
    module: {
      rules: [
        {
          enforce: 'pre',
          test: /\.js$/,
          exclude: [
            path.resolve(__dirname, 'node_modules'),
          ],
          loader: 'eslint-loader',
          options: {
            fix: true,
            cache: true,
            ignorePattern: __dirname + '/src/js/lib/'
          }
        }, {
          test: /\.js$/,
          loader: 'babel-loader',
          exclude: [
            path.resolve(__dirname, 'node_modules'),
          ],
        }],
    },
    plugins: [
      new webpack.LoaderOptionsPlugin({
        options: {
          eslint: {
            formatter: require('eslint-formatter-pretty')
          }
        }
      }),

      new webpack.ProvidePlugin({
        $: 'jquery',
        jquery: 'jquery',
        jQuery: 'jquery',
        'window.jquery': 'jquery',
        'window.jQuery': 'jquery'
      }),

      new webpack.NoEmitOnErrorsPlugin(),

      new BundleAnalyzerPlugin({
        analyzerMode: 'static',
        analyzerPort: 4000,
        openAnalyzer: false,
      }),
    ],
  };

  if (isProduction) {
    webpackConfig.plugins.push(
      new webpack.LoaderOptionsPlugin({
        minimize: true,
      }),
      new webpack.optimize.ModuleConcatenationPlugin(),
      new webpack.optimize.DedupePlugin(),
      new UglifyJsPlugin({
        uglifyOptions: {
          ie8: false,
          ecma: 5,
        },
        // output: {
        //   comments: false,
        // },
      })
    );
  }
  return webpackConfig;
};
