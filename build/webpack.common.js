const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const path = require("path");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack');
const fs = require('fs');
const merge = require('webpack-merge');
const addAssetHtmlWebpackPlugin = require('add-asset-html-webpack-plugin');

const devConfig = require('./webpack.dev');
const prodConfig = require('./webpack.prod');
const { getHtmlWebPackPlugins,entry } = require("./webpack.base");
// 路径
let srcPath = path.join(process.cwd(), './src');
const devMode = process.env.NODE_ENV !== 'production';
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const makePlugins = (configs) => {
    const plugins = [
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
            filename: devMode ? '[name].css' : '[name].[hash].css',
            chunkFilename: devMode ? '[id].css' : '[id].[hash].css',
            filename: '[name].css',
            chunkFilename: '[id].css',
            ignoreOrder: false,
        })
    ]
    //多页面打包
    getHtmlWebPackPlugins().forEach(plugin => {
        plugins.push(plugin)
    })

    //处理公共需求包
    const files = fs.readdirSync(path.resolve(__dirname, '../dll'));
    files.forEach(file => {
        if (/.*\.dll.js$/.test(file)) {
            plugins.push(new addAssetHtmlWebpackPlugin({
                filepath: path.resolve(__dirname, "../dll", file)
            }))
        }
        if (/.*\.manifest.json$/.test(file)) {
            plugins.push(new webpack.DllReferencePlugin({
                manifest: path.resolve(__dirname, "../dll", file)
            }))
        }
    })

    return plugins;
}

const commonConfig = {
    entry: entry(),
    // 模块索引规则
    resolve: {
        extensions: ['.jsx', '.js'],
        alias: {
            api: path.join(srcPath, 'api'),
            commons: path.join(srcPath, 'commons'),
            components: path.join(srcPath, 'components'),
            images: path.join(srcPath, 'images'),
            sources: path.join(srcPath, 'sources'),
            styles: path.join(srcPath, 'styles'),
            views: path.join(srcPath, 'views'),
            reducers: path.join(srcPath, "reducers")
        }
    },
    module: {
        rules: [
            {
                test: /\.(html)$/,
                use: {
                    loader: 'html-loader',
                    options: {
                        attrs: ['script:src', "link:href", "img:src", "a:href"],//解析替换的属性
                        interpolate: true,
                        minimize: false
                    }
                }
            },
            {
                test: /\.(png|jpe?g|gif)$/i,
                loader: 'url-loader',
                options: {
                    limit: 4096,
                    name: '[name][hash:base64:5].[ext]',
                    outputPath: "images/"
                },
            }, {
                test: /\.(ico|mp4|ogg|svg|eot|otf|ttf|woff|woff2)$/i,
                loader: 'file-loader',
            }, {
                test: /\.less$/i,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            publicPath: '/',
                            hmr: process.env.NODE_ENV === 'development',
                        },
                    },
                    { 
                        loader: 'css-loader',
                        options: {
                            importLoaders: 2,  //scss内导入前@***执行前也要走两个loader
                            modules: true//css模块化
                        }
                    }, "postcss-loader", "less-loader"
                ]
            }, {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                use: [
                    { loader: "babel-loader" },
                ]
            }
        ],
    },
    optimization: {
        runtimeChunk: {//老版本未更改hash变化解决
            name: 'runtime'
        },
        usedExports: true,//要做排除的去sideEffects设置
        splitChunks: {
            chunks: "all",//异步同步全部
            // minSize: 30000,//分割的目标文件最小满足
            // minChunks: 2,//调用数
            // maxAsyncRequests: 5,//最大分割数
            // maxInitialRequests: 3,//入口数
            // automaticNameDelimiter: '~',//连接符号
            // name: true,
            cacheGroups: {//满足后分割位置 
                vendors: {
                    test: /[\\/]node_modules[\\/]/,
                    priority: -10, //都符合和情况默认放到的优先级里
                    name: 'vendors'
                },
                // default: {
                //     minChunks: 2,
                //     priority: -20,
                //     reuseExistingChunk: true ,//存在的代码都不重复打包进入
                // }
            }
            // cacheGroups: {
            //     mainStyles: {//根据入口打包不同的css
            //         name: 'main',
            //         test: (m, c, entry = 'main') =>
            //             m.constructor.name === 'CssModule' && recursiveIssuer(m) === entry,
            //         chunks: 'all',
            //         enforce: true,
            //     },
            //       barStyles: {
            //         name: 'bar',
            //         test: (m, c, entry = 'bar') =>
            //           m.constructor.name === 'CssModule' && recursiveIssuer(m) === entry,
            //         chunks: 'all',
            //         enforce: true,
            //       },
            // }

        }
    },
    performance: false,//禁止提示性能问题
}

commonConfig.plugins = makePlugins(commonConfig);


module.exports = () => {
    if (devMode) {
        return merge(commonConfig, devConfig);
    } else {
        return merge(commonConfig, prodConfig);
    }
}



function recursiveIssuer(m) {
    if (m.issuer) {
        return recursiveIssuer(m.issuer);
    } else if (m.name) {
        return m.name;
    } else {
        return false;
    }
}
