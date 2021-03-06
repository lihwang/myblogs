import axios from 'axios';
import config from 'commons/config';
import qs from "qs";
import Toast from 'frag/react/Toast';
import go from 'components/CodovaRouterGo';

// 请求超时
const TIMEOUT = 10000;
// 请求队列
let fetchQueue = {};
// 是否开启请求锁。
let fetchLock = true;
console.log(config.public.rpcPath.h5)
// 创建axios实例
const _fetch = axios.create({
    baseURL: config.public.rpcPath.h5, 

    // 超时
    timeout: TIMEOUT,

    // 是否跨域携带cookie
    withCredentials: true,

    headers: {
        "wd-url": location.href,
        // "wd-utoken": "9c15479edd688e29b4fbfe40bbeec1c8"
    }
})

// 请求拦截器
_fetch.interceptors.request.use(function (config) {
    // REST风格接口
    for (let key in config.data) {
        if (key.indexOf("{") == 0) {
            config.url = config.url.replace(key, config.data[key]);
            delete config.data[key];
        }
    }

    config.data = Object.assign({ _stamp: (new Date()).getTime() }, config.data);

    // get传参
    if (config.method == "get" && config.data) {
        config.url += `?${qs.stringify(config.data)}`
    }

    if (config.method == "post" && !config.headers["Content-Type"]) {
        config.url += `?${qs.stringify(config.data)}`
    }

    // 请求锁, 
    let lock = config.fetchLock != undefined && config.fetchLock != null ? config.fetchLock : fetchLock;

    if (lock) {
        // 如果有同个请求在队列中，则取消即将发送的请求
        if (fetchQueue[config.url]) {
            let cancel;
            config.cancelToken = new axios.CancelToken(c => {
                cancel = c;
            })
            cancel("cancel");
        } else {
            // 添加入请求队列
            fetchQueue[config.baseURL + config.url] = 1
        }
    }

    // 在发送请求之前做些什么
    return config;
}, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});

// 添加请求返回拦截器
_fetch.interceptors.response.use(function (res) {
    // 是否有请求锁
    let lock = res.config.fetchLock != undefined && res.config.fetchLock != null ? res.config.fetchLock : fetchLock;
    if (lock) {
        // 移除出请求队列
        delete fetchQueue[res.config.url];
    }
    // 处理异常
    const data = res.data
    const code = +data.code
    // 约定code=0即为成功
    if (code === 0) {
        return data;
    } else {
        // 打印错误信息
        console.log(data.message);
        let showToast = true;

        // 如果创建订单接口，则不提示错误信息
        if (res.config.url.indexOf("/create_order") >= 0) {
            // 不提示错误信息
            showToast = false;
            if (code != 40061) {
                // 跳转订单失败页
                let locationPathArr = location.pathname.split("/");
                locationPathArr.pop();
                go(`${location.protocol}//${location.host}${locationPathArr.join("/")}/orderDetail.html?erroMsg=${data.message}#/Detail`)
            }
        }

        // 如果是请求用户信息
        if (res.config.url.indexOf("user/query") >= 0) {
            // 不提示错误信息
            showToast = false;
        }

        // 登录失效
        if (code == 10001) {
            showToast = false;
            Toast.info("登录已失效，即将返回首页重新登录", 2000);
            setTimeout(() => {
                location.replace(`//static1.${config.public.defineEnv == "prod" ? "weidai.com.cn" : "wdai.com"}/static/fed/fed/h5.menberCenter/unionvipCircle.index.html?reLogin=1`)
            }, 2000)
            return;
        }

        // 结束上一个toast
        Toast.hide();

        // 打印错误信息
        !!showToast && Toast.info(data.message, 2000);
        return Promise.reject(data);
    }
}, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
})


export default _fetch;