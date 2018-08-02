// This is a template webpack config file with minimal configuration.
// Users are free to create their own webpack configuration files in their application.
const webpack = require('webpack');
const path = require('path');
module.exports = {
  entry: './lib/applicationInsightsDataClient.ts',
  devtool: 'source-map',
  output: {
    filename: 'applicationInsightsDataClientBundle.js',
    path: __dirname,
    libraryTarget: 'var',
    library: 'applicationInsightsDataClient'
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        exclude: /(node_modules|test)/
      }
    ]
  },
  // "ms-rest-js" and "ms-rest-azure-js" are dependencies of this library.
  // Customer is expected to import/include this library in browser javascript
  // (probably using the script tag in their html file).
  externals: {
    "ms-rest-js": "msRest",
    "ms-rest-azure-js": "msRestAzure"
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"]
  },
  node: {
    fs: false,
    net: false,
    path: false,
    dns: false,
    tls: false,
    tty: false,
    v8: false,
    Buffer: false
  }
};
