
const webpack = require('webpack');

let devConfig = {
    mode: "development",
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
        proxy:{
            "/react/api":{
                target:"https://www.dell-lee.com",
                secure:false,//htts转发处理
                pathRewrite:{
                    "header.json":"demo.json",
                },
                changeOrigin:true,
                // bypass: function(req, res, proxyOptions) {
                //     if (req.headers.accept.indexOf('html') !== -1) {
                //       console.log('Skipping proxy for browser request.');
                //       return false;
                //     }
                // }
            },

        }
    },
    output:{
        filename: '[name].js',
        chunkFilename: '[name].js',
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin()//配合devServer,样式和js调试
    ],
    optimization:{  //要做排除的去sideEffects设置
        usedExports:true,
    }
}

module.exports=devConfig;

