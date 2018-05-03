var debug = process.env.NODE_ENV !== "production";
var webpack = require('webpack');

//frontend folder fucked up the webpack build

module.exports = {
  context: __dirname,
  devtool: debug ? "inline-sourcemap" : null,
  entry: "./frontend/src/scripts.js",
  output: {
    path: __dirname + "frontend/src/",
    filename: "scripts.min.js"
  },
  plugins: debug ? [] : [
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({ mangle: false, sourcemap: false }),
  ],
};
