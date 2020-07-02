const path = require("path")

module.exports = {
    entry: './client/canvas.js',
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'client_dist')
    },
    node: {
        fs: 'empty'
      },
}
