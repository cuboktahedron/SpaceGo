var webpack = require('webpack');

module.exports = {
  output: {
    filename: 'bundle.js'
  },
  devtool: 'source-map',
  plugins: [new webpack.optimize.UglifyJsPlugin()]
};

