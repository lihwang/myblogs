const path = require('path');
//用于在构建前清除dist目录中的内容 *prd
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
//html模板
const HtmlWebpackPlugin = require('html-webpack-plugin');

//测试环境最简单的跑起来

module.exports = {
  entry: {
    index: path.resolve(__dirname, './src/entrys/index/index')
  },
  mode: "none",
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/[name].js'
  },
  // 模块解析
  module: {
    rules: [{ //jsx处理
      test: /(\.jsx|\.js)$/,
      // exclude: /node_modules/,
      // issuer 条件（导入源）
      loader: "babel-loader",
    }, {
      test: /\.css/,
      use: ['style-loader', 'css-loader']
    }, {
      test: /\.scss$/,
      use: ['style-loader', 'css-loader', 'sass-loader']
    }, {
      test: /\.(png|svg|jpg|gif)$/,
      use: [
        {
          loader: 'url-loader',
          options: {
            limit: 8192,    // 小于8k的图片自动转成base64格式，并且不会存在实体图片
            outputPath: 'images/'   // 图片打包后存放的目录
          }
        }
      ]
    },
    {
      test: /\.(woff|woff2|eot|ttf|otf)$/,
      use: ['file-loader']
    }
    ]
  },
  resolve: { //解析别名
    extensions: [".js", ".json", ".jsx", ".css"], // 使用的扩展名
    alias: {
      "images": path.resolve(__dirname, "./src/images") // 缩短书写路径或者别名
    }
  },
  devtool: "source-map", // 调试
  externals: ["react"], // 不要遵循/打包这些模块，而是在运行时从环境中请求他们
  // 插件
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      // 在src目录下创建一个index.html页面当做模板来用 用哪个html作为模板
      template: path.resolve(__dirname, './src/pages/index.html'),
      hash: true, // 会在打包好的bundle.js后面加上hash串
      chunks: ['index']   // 对应关系,index.js对应的是index.html
    })
  ],
  // devServer: {//服务代理
  //   proxy: { // proxy URLs to backend development server
  //     '/api': 'http://localhost:3000'
  //   },
  //   contentBase: path.join(__dirname, 'public'), // boolean | string | array, static file location
  //   compress: true, // enable gzip compression
  //   historyApiFallback: true, // true for index.html upon 404, object for multiple paths
  //   hot: true, // hot module replacement. Depends on HotModuleReplacementPlugin
  //   https: false, // true for self-signed, object for cert authority
  //   noInfo: true, // only errors & warns on hot reload
  // },

}
