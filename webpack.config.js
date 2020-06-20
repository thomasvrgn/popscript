const path = require('path')

module.exports = {
  mode: 'production',
  watch: true,
  entry: './dist/index.js',
  target: 'node',
  output: {
    path: path.resolve(__dirname, 'dist', 'build'),
    filename: 'popscript.js'
  }
}