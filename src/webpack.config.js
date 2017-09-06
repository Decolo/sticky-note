var webpack = require('webpack')
var path = require('path')

module.exports = {
  entry: path.join(__dirname, 'js/app/index.js'),
  output: {
    path: path.join(__dirname, '../dist'),
    filename: 'bundle.js'
  },
  devServer: {
    contentBase: path.join(__dirname, '../dist'),
    compress: true,
    port: 9000
  },
  module: {
    rules: [
      { 
        test: /\.js$/, 
        exclude: /node_modules/, 
        loader: "babel-loader" 
      },
      {
        test: /\.css/,
        loader: 'style!css',
      },
      {
        test: /\.(png|jpg)$/,
　　　　　loader: 'url-loader?limit=8192',
      },
      {
        test: /\.scss$/,
        use: [{
            loader: "style-loader" // creates style nodes from JS strings
        }, {
            loader: "css-loader" // translates CSS into CommonJS
        }, {
            loader: "sass-loader" // compiles Sass to CSS
        }]
      },
    ]
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: 'jquery'
    }),
  ],
  devtool: 'source-map',
}