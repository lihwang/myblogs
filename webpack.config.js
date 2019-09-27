const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
let pkg = require('./package.json');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin


// 路径
let srcPath = path.join(__dirname, './src');
// 入口脚本路径
let entryPath = path.join(srcPath, 'entrys');
// 业务组件路径
let componentPath = path.join(srcPath, 'components');
// 环境域名
let __URL_HOST__ = process.env.GULP_ENV === "prod" ? "" : "";
// mini-css-extract-plugin 配置
let cssExtractLoader = pkg.assetExtractCss ? MiniCssExtractPlugin.loader : {
    loader: 'style-loader'
};


const {
    CleanWebpackPlugin
} = require('clean-webpack-plugin');
const webpack = require('webpack');

const devMode = false;
module.exports = {
    mode: devMode ? "development" : "production",
    entry: {
        app: './src/index.js',
        another: './src/another-module.js'
    },
    output: {
        filename: '[name].[chunkhash].js',
        path: path.resolve(__dirname, 'dist'),
        chunkFilename: '[name].bundle.js',
    },
    devtool: 'inline-source-map',
    devServer: {
        contentBase: './dist',
        hot: true
    },
    module: {
        rules: [{
            test: /\.css$/,
            use: [
                // {
                //     loader: MiniCssExtractPlugin.loader,
                //     options: {
                //         publicPath: '../',
                //         hmr: devMode,
                //     },
                // },
                'style-loader',
                'css-loader',
            ],

        }, {
            test: /\.(png|jpg|gif)$/,
            use: [{
                loader: 'url-loader',
                options: {
                    limit: 8192
                }
            }]
        }, {
            test: /\.(woff|woff2|eot|ttf|otf)$/,
            use: [
                'file-loader'
            ]
        }]
    },
    // optimization:{
    //     splitChunks: {
    //         chunks: "async",
    //         minSize: 30000,
    //         minChunks: 1,
    //         maxAsyncRequests: 5,
    //         maxInitialRequests: 3,
    //         automaticNameDelimiter: '~',
    //         name: true,
    //         cacheGroups: {
    //             vendors: {
    //                 test: /[\\/]node_modules[\\/]/,
    //                 priority: -10
    //             },
    //         default: {
    //                 minChunks: 2,
    //                 priority: -20,
    //                 reuseExistingChunk: true
    //             }
    //         }
    //     },
    //     runtimeChunk:true
    // },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            title: 'Caching'
        }),
        new webpack.HashedModuleIdsPlugin(), //第二个选择是使用 HashedModuleIdsPlugin，推荐用于生产环境构建：
        new webpack.NamedModulesPlugin(),
        // new webpack.HotModuleReplacementPlugin(),  //热更新(HMR)不能和[chunkhash]同时使用。1： 如果是开发环境，将配置文件中的chunkhash 替换为hash2：如果是生产环境，不要使用参数 --hot
        // new BundleAnalyzerPlugin()
        // new MiniCssExtractPlugin({
        //     filename: devMode ? '[name].css' : '[name].[hash].css',
        //     chunkFilename: devMode ? '[id].css' : '[id].[hash].css',
        //     ignoreOrder: false, // Enable to remove warnings about conflicting order
        // }),
    ]
};