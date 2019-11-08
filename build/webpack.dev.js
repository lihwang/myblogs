
const webpack = require('webpack');
const path=require('path');
let devServerProxy = {
    '/proxy/': {
      target: '代理服务地址',
      pathRewrite: {
        '^/proxy/': '/'
      },
      logLevel: 'debug', // 修改 webpack-dev-server 的日志等级
      secure: false, // 忽略检查代理目标的 SSL 证书
      changeOrigin: true, // 修改代理目标请求头中的 host 为目标源
      onProxyReq: (proxyReq, req /*, res*/) => { // 代理目标请求发出前触发
        /**
         * 当代理 POST 请求时 http-proxy-middleware 与 body-parser 有冲突。
         * [Modify Post Parameters](https://github.com/chimurai/http-proxy-middleware/blob/master/recipes/modify-post.md)
         * [Edit proxy request/response POST parameters](https://github.com/chimurai/http-proxy-middleware/issues/61)
         * [socket hang up error with nodejs](http://stackoverflow.com/questions/25207333/socket-hang-up-error-with-nodejs)
         */
        let body = req.body;
        let method = req.method.toLowerCase();
  
        if (body && method == 'post') {
          let contentType = req.get('Content-Type');
          contentType = contentType ? contentType.toLowerCase() : '';
  
          if (contentType.includes('application/json')) {
            // 使用 application/json 类型提交表单
            let bodyData = JSON.stringify(body);
  
            proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
            proxyReq.write(bodyData);
          } else if (contentType.includes('application/x-www-form-urlencoded')) {
            // 使用 application/x-www-form-urlencoded 类型提交表单
            let bodyData = Object.keys(body).map((key) => {
              let val = body[key];
              val = val ? val : '';
              return encodeURIComponent(key) + '=' + encodeURIComponent(val);
            }).join('&');
  
            proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
            proxyReq.write(bodyData);
          } else if (contentType.includes('multipart/form-data')) {
            // 使用 multipart/form-data 类型提交表单
          }
        }
      },
      onProxyRes: ( /*proxyRes, req, res*/) => { // 代理目标响应接收后触发
      },
      onError: ( /*err, req, res*/) => { // 代理目标出现错误后触发
      }
    }
  };


let devConfig = {
    mode: "development",
    output: {
        filename: '[name].js',
        publicPath: '/',
        chunkFilename: '[name]-[id].[chunkhash:8].bundle.js',
        path: path.resolve(__dirname, '../dist'),
    },
    devtool: 'cheap-module-eval-source-map', //开发，cheap-module-eval-source-map  线上：cheap-module-source-map
    devServer: {
        contentBase: './dist',
        port: 8080,
        open: true,
        hot: true,
        hotOnly: true,//即使没有热更新也不刷新
        // historyApiFallback:true,
        historyApiFallback:{
            rewrites:[
                { from: "/abc.html", to: '/list.html' }
            ]
        },
        proxy:devServerProxy
    },
    output:{
        filename: '[name].js',
        chunkFilename: '[name].js',
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),//配合devServer,样式和js调试
        new webpack.DefinePlugin({
            __define_debug__: true,
        }),
    ],
    optimization:{  //要做排除的去sideEffects设置
        usedExports:true,
    }
}

module.exports=devConfig;


