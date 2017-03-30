import Path from 'path';
import webpack from 'webpack';

const path = (...parts) => Path.join(__dirname, '..', ...parts);

export default {
  entry: ['babel-polyfill', path('src', 'index.js')],
  devtool: 'source-map',
  target: 'node',
  output: {
    libraryTarget: 'commonjs',
    library: 'handler',
    filename: 'index.js',
    path: path('build')
  },
  module: {
    rules: [
      { test: /\.json$/, loader: 'json-loader' },
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' },
      { test: /\.xml$/, loader: 'xml-loader', options: { explicitArray: false } }
    ]
  }
};
