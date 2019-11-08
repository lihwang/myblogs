let path = require('path');
let glob = require("glob");
let HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

let baseOption = require('./webpack.setting').get();
//测试性质的导入

// 闭包基本参数
// let baseOption = {};

// html插件chunks

// 初始化
// let init = function (options) {
//     baseOption = options;
// }

//页面列表
let entryPages=()=>{
    let pattern=path.join(baseOption.pagePath,'*.html');
    let pages = [];
    glob.sync(pattern).forEach(function(fullFileName){
        let name = path.parse(fullFileName).name;
        pages.push(name);
    })
    return pages;
}

let entry=()=>{
    let entry={};
    let pages=entryPages();
    pages.forEach(item=>{
        entry[item]=path.join(baseOption.entryPath,item);
    })
    return entry;
}


let getHtmlWebPackPlugins=()=>{
    let plugins=[];
    let pages=entryPages();
    pages.forEach(item=>{
        let page=item;
        //chunks
        let chunksArray=[];
        chunksArray.push(page);
        plugins.push(new HtmlWebpackPlugin({
            template:path.join(baseOption.pagePath,`${page}.html`),
            filename:path.join(baseOption.distPath,`${page}.html`),
            chunks:chunksArray,
            //TODO:配置不懂
            alterAssetTags: (htmlPluginData) => { // 为插入的标签添加 crossorigin 属性，允许跨域脚本提供详细错误信息。
                if (baseOption.alterAssetTags) {
                    let assetTags = [].concat(htmlPluginData.head).concat(htmlPluginData.body);
                    assetTags.forEach((assetTag) => {
                        if (assetTag.tagName == 'script' || assetTag.tagName == 'link') {
                            assetTag.attributes.crossorigin = 'anonymous';
                        }
                    });
                }

                return htmlPluginData;
            }
        }))
    })
    return plugins;
}

// //获取loader加载器
// let getLoaders=()=>{
//     return [
        
//     ]
// }


module.exports = {
    getHtmlWebPackPlugins,
    entry
    // init,
    // entryPages,
    // getConfig
}