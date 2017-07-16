
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');


const babelLoaderConfiguration = {
  test: /\.js$/,
  include: [
    path.resolve(__dirname, 'src'),
    path.resolve(__dirname, 'node_modules/react-native-uncompiled'),
    path.resolve(__dirname, 'node_modules/react-router-native')
  ],
  use: {
    loader: 'babel-loader',
    options: {
      cacheDirectory: true,
      presets: ['react-native'],
      plugins: ['transform-runtime']
    }
  }
};

const imageLoaderConfiguration = {
  test: /\.(gif|jpe?g|png|svg)$/,
  use: {
    loader: 'url-loader',
    options: {
      name: '[name].[ext]'
    }
  }
};

module.exports = [
  {
    entry: {
      index: './src'
    },

    output: {
      path: path.resolve(__dirname, 'lib'),
      filename: '[name].js'
    },

    target: 'electron-renderer',

    module: {
      rules: [
        babelLoaderConfiguration,
        imageLoaderConfiguration
      ]
    },

    devtool: 'inline-source-map',

    plugins: [
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify('production')
      }),
      new HtmlWebpackPlugin({
        template: './src/index.html'
      })
    ],

    resolve: {
      alias: {
        'react-native': 'react-native-web',
        'react-router-native': 'react-router'
      },
      extensions: [ '.web.js', '.js' ]
    }
  },
  {
    entry: {
      electron: './src/electron'
    },

    target: 'electron-main',

    output: {
      path: path.resolve(__dirname, 'lib'),
      filename: '[name].js'
    },

    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /(node_modules|bower_components)/,
          use: {
            loader: 'babel-loader'
          }
        }
      ]
    },

    devtool: 'inline-source-map',

    node: {
      __dirname: false,
      __filename: false
    }
  }
]
