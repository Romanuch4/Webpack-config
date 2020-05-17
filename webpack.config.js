const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');
const {BundleAnalyzerPlugin} = require('webpack-bundle-analyzer');

const isDev = process.env.NODE_ENV === 'development';

const makeOptimization = () => {
  const config = {
    splitChunks: {
      chunks: 'all',
    },
  };

  if(!isDev) {
    config.minimizer = [
      new OptimizeCssAssetsWebpackPlugin(),
      new TerserWebpackPlugin(),
    ];
  };

  return config;
};

const makeFilename = ext => isDev ? `[name].${ext}`: `[name].[hash].${ext}`;

const makeCssLoaders = extra => {
  const loader = [MiniCssExtractPlugin.loader, 'css-loader'];
  if(extra) {
    loader.push(extra);
  }
  return loader;
};

const makeBabelOptions = preset => {
  const opts = {
    presets: ['@babel/preset-env'],
    plugins: [
      '@babel/plugin-proposal-class-properties',
    ],
  };

  if (preset) {
    opts.presets.push(preset);
  }

  return opts;
}

const makeJsLoaders = () => {
  const jsLoaders = [{
    loader: 'babel-loader',
    options: makeBabelOptions(),
  }];
  if (isDev) {
    jsLoaders.push('eslint-loader');
  }
  return jsLoaders;
};

const makePlugins = () => {
  const base = [
    new HTMLWebpackPlugin({
      template: './index.html',
      minify: {
        collapseWhitespace: !isDev,
      },
    }),
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: makeFilename('css'),
    }),
  ];

  if (!isDev) {
    base.push(new BundleAnalyzerPlugin());
  }

  return base;
}

module.exports = {
  context: path.resolve(__dirname, 'src'),
  entry: {
    main: ['@babel/polyfill','./index.js'],
    analytics: './analytics.js',
  },
  devServer: {
    port: 4200,
  },
  devtool: isDev ? 'source-map' : '',
  output: {
    filename: makeFilename('js'),
    path: path.resolve(__dirname, 'dist'),
  },
  mode: 'production',
  optimization: makeOptimization(),
  plugins: makePlugins(),
  module: {
    rules: [
      {
        test: /\.css$/,
        use: makeCssLoaders(),
      },

      {
        test: /\.less$/,
        use: makeCssLoaders('less-loader'),
      },

      {
        test: /\.(png|jpg|svg|gif)/,
        use: ['file-loader'],
      },
      { 
        test: /\.js$/, 
        exclude: /node_modules/, 
        use: makeJsLoaders(), 
      },
      { 
        test: /\.ts$/, 
        exclude: /node_modules/, 
        loader: {
          loader: 'babel-loader',
          options: makeBabelOptions('@babel/preset-typescript'),
        }, 
      },
      { 
        test: /\.jsx$/, 
        exclude: /node_modules/, 
        loader: {
          loader: 'babel-loader',
          options: makeBabelOptions('@babel/preset-react'),
        }, 
      },
    ],
  },
};