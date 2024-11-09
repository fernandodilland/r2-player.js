// webpack.config.js

const path = require('path');

module.exports = {
  entry: './src/index.js',               // Entry point for your library
  output: {
    path: path.resolve(__dirname, 'dist'),          // Output folder
    filename: 'r2-player.min.js',                   // Bundle name
    library: 'R2Player',                             // Global library name
    libraryTarget: 'umd',                            // UMD format for compatibility
    globalObject: 'this',                            // For compatibility across environments
  },
  module: {
    rules: [
      {
        test: /\.js$/,                                // Process .js files
        exclude: /node_modules/,                      // Exclude node_modules
        use: {
          loader: 'babel-loader',                     // Use babel-loader
          options: {
            presets: ['@babel/preset-env'],           // Use preset-env
          },
        },
      },
    ],
  },
  externals: {},                                       // Do not define externals, as we will include hls.js
  mode: 'production',                                  // Production mode for minification
};