const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

module.exports = {
  entry: {
    'ngraph.path': './index.js',
    'ngraph.path.min': './index.js'
  },
  output: {
    filename: '[name].js',
    library: 'ngraphPath',
    libraryTarget: 'umd'
  },
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        test: /.*\.min.*/
      })
    ]
  }
}
