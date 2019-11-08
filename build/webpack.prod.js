const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
// const WorkboxPlugin = require("workbox-webpack-plugin");  //线上使用google插件
let path = require('path');
const pkg=require("../package.json");
const webpack = require('webpack');
let __URL_HOST__ = process.env.GULP_ENV === "prod" ? "线上域名" : "测试域名";
const prodConfig = {
    mode: "production",
    output: {
        path: path.join(process.cwd(), `./dist/${pkg.version}/assets`),
        publicPath: `//${__URL_HOST__}/${pkg.version}/assets/`,
        filename: 'js/[name].js?t=[hash]'
    },
    optimization: {
        minimizer: [new OptimizeCSSAssetsPlugin({})]
    },
    // output: {
    //     filename: '[name].[contenthash].js',//[contenthash]文件内容进行变化，仅线上使用
    //     chunkFilename: '[name].[contenthash].js',
    // },
    plugins:[
        new webpack.LoaderOptionsPlugin({
            minimize: true
        })
    ]
}

module.exports = prodConfig;