/* eslint-disable global-require, import/no-extraneous-dependencies, comma-dangle */
const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const combineLoaders = require('webpack-combine-loaders');

module.exports = function generateConfig(target) {
  const entry = [
    'babel-polyfill',
    target === 'client' ? './src/client.jsx' : './app.js',
  ];
  const loaders = ['babel'];
  const plugins = [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: `'${process.env.NODE_ENV}'`,
        WEBPACK: `'${process.env.WEBPACK}'`,
        PORT: `'${process.env.PORT}'`,
        API_URL: `'${process.env.API_URL}'`,
      },
    }),
  ];
  const cssLoader = {
    test: /\.css$/,
  };

  const postcss = [require('postcss-import')({ addDependencyTo: webpack }), require('autoprefixer'), require('precss')];

  if (process.env.NODE_ENV === 'production' || target === 'server') {
    if (!process.env.PORT) {
      throw new Error('No PORT specified!');
    }

    if (target === 'client') {
      plugins.push(new ExtractTextPlugin('bundle.css'));
      plugins.push(new webpack.optimize.UglifyJsPlugin());
    } else {
      plugins.push(new ExtractTextPlugin('assets/bundle.css'));
    }

    cssLoader.loader = ExtractTextPlugin.extract(
        'style-loader',
        combineLoaders([
          {
            loader: 'css-loader',
            query: {
              modules: true,
              localIdentName: '[name]__[local]___[hash:base64:5]',
            },
          }, {
            loader: 'postcss-loader'
          }
        ])
      );
  } else {
    entry.splice(1, 0, 'webpack-hot-middleware/client');

    loaders.splice(0, 0, 'react-hot');
    cssLoader.loader = 'style-loader!css-loader?modules=true&importLoaders=1!postcss-loader';

    plugins.unshift(new webpack.HotModuleReplacementPlugin(), new webpack.NoErrorsPlugin());
  }

  const config = {
    entry,
    output: {
      filename: target === 'client' ? 'bundle.js' : 'app.compiled.js',
      path: target === 'client' ? path.join(__dirname, 'build') : __dirname,
      publicPath: '/',
    },
    module: {
      loaders: [
        {
          test: /\.jsx?$/,
          exclude: /(node_modules)/,
          loaders,
        },
        {
          test: /\.json$/,
          loader: 'json-loader',
        },
        cssLoader,
        {
          test: /\.(png|jpg|svg)$/,
          loader: 'url-loader?name=assets/[name].[ext]&limit=8192', // inline base64 URLs for <=8k images, direct URLs for the rest
        },
      ],
    },
    plugins,
    postcss,
    resolve: {
      extensions: ['', '.js', '.jsx'],
    },
  };

  if (target === 'server') {
    config.target = 'node';
    config.node = {
      __dirname: false,
    };
  }

  return config;
};
