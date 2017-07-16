
const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

const babelLoaderConfiguration = {
  test: /\.js$/,

  include: [
    path.resolve(__dirname, 'src')
  ],
  use: {
    loader: 'babel-loader'
  }
};

const imageLoaderConfiguration = {
  test: /\.(gif|jpe?g|png|svg)$/,
  use: {
    loader: 'url-loader',
    options: {
      name: 'images/[name].[ext]'
    }
  }
};

const extractSass = new ExtractTextPlugin({
    filename: "css/[name].css"
});

const sassLoaderConfiguration = {
  test: /\.scss$/,
  use: extractSass.extract({
    use: [{
      loader: "css-loader"
    }, {
      loader: "sass-loader"
    }]
  })
};

module.exports = [
  {
    entry: {
      site: './src/site'
    },

    output: {
      path: path.resolve(__dirname, 'lib'),
      filename: 'js/[name].js',
      libraryTarget: 'var',
      library: '<%= projectName %>'
    },

    module: {
      rules: [
        babelLoaderConfiguration,
        imageLoaderConfiguration,
        sassLoaderConfiguration
      ]
    },

    devtool: 'inline-source-map',

    plugins: [
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify('production')
      }),
      extractSass
    ],

    resolve: {
      alias: {

      },
      extensions: [ '.js' ]
    }
  }
]
