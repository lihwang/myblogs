var path = require('path');

module.exports={
      // 出口
  output: {
    publicPath: '/',
    path: path.resolve(__dirname, 'dist'),
    filename: '[name]-[hash].js'
  },
  module:{
      
  }
}