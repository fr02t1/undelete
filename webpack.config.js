const path = require('path');

module.exports = (env, argv) => ({
  entry: [
    'whatwg-fetch',
    './src/index.tsx' // Update entry point if your main file is now a TypeScript file
  ],
  devServer: {
    static: path.resolve(__dirname, 'dist'),
    historyApiFallback: true
  },
  devtool: argv.mode !== 'production' ? 'eval-cheap-module-source-map' : false,
  module: {
    rules: [
      {
        test: /\.tsx?$/, // Add support for .ts and .tsx files
        exclude: /node_modules/,
        use: 'ts-loader'
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader'
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'] // Add .ts and .tsx as resolvable extensions
  }
});