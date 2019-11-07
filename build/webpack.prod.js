const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const WorkboxPlugin = require("workbox-webpack-plugin");  //线上使用google插件
const prodConfig = {
    mode: "production",
    optimization: {
        minimizer: [new OptimizeCSSAssetsPlugin({})]
    },
    output: {
        filename: '[name].[contenthash].js',//[contenthash]文件内容进行变化，仅线上使用
        chunkFilename: '[name].[contenthash].js',
    },
    plugins: [
        // new WorkboxPlugin.GenerateSW({  //server-work
        //     clientsClaim: true,
        //     skipWaiting: true
        // })
    ],
}

module.exports = prodConfig;