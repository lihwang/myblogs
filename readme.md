新博客


react使用react-hot-loader实现局部热更新

解析jsx和js 使用   loader: "babel-loader",
需要对babel进行配置(如果不懂可以参考babel官网)
    1.@babel/preset-env是针对es6语法的
    2.@babel/preset-react是针对react的
    3.@babel/core是babel的核心
    [babel-loader是给webpack配置使用的作为导入口不操作文件]
    
### webpack插件说明 
1. [glob](https://www.jianshu.com/p/ce7cf53274bb)


### 书写注意点
1. 所有引用型的数据全部已闭包的形式输出出去，通过私有变量来控制通过指定方法操作数据