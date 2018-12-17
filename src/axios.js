import axios from "axios";
import router from "./router/router.js";//配置路由的文件
import {MessageBox} from 'element-ui';

const Axios = axios.create({
    baseURL: process.env.API_BASEURL, // 基础URL
    responseType: "json",
    withCredentials: true, // 是否允许带cookie这些
    headers: {
        // "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
        "Content-Type": "application/json;charset=utf-8"
        // contentType: "text/plain",
    }
});
//messageBox是否只显示一次
let messageIsOpened = false;
//(添加请求拦截器)
Axios.interceptors.request.use(
    config => {
        // 在发送请求之前做某件事
        if (config.method === "post") {
            // 序列化
            // config.data = qs.stringify(config.data);
            // config.data = JSON.stringify(config.data);
        }
        var token = localStorage.getItem('token') || '';
        // 若是有做鉴权token , 就给头部带上token
        // 若是需要跨站点,存放到 cookie 会好一点,限制也没那么多,有些浏览环境限制了 localstorage 的使用
        if (token) {
            config.headers.Authorization = 'Bearer ' + token;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

//返回状态判断(添加响应拦截器)
Axios.interceptors.response.use(
    res => {
        //对响应数据做些事
        // if (res.data && !res.data.success) {
        //   return Promise.reject(res.data.error);
        // }

        return res;
    },
    error => {
        if (error.response) {
            switch (error.response.status) {
                case 401:
                    if (!messageIsOpened) {
                        messageIsOpened = !messageIsOpened;
                        MessageBox({
                            type: 'info',
                            message: error.response.data.msg
                        }).then(()=>{
                            messageIsOpened = !messageIsOpened;
                        });
                    }
                    // 返回 401 清除token信息并跳转到登录页面
                    router.replace({
                        path: '/login'
                    });
            }
        }
// 用户登录的时候会拿到一个基础信息,比如用户名,token,过期时间戳
// 直接丢localStorage或者sessionStorage
        if (!window.localStorage.getItem("token")) {
            // 若是接口访问的时候没有发现有鉴权的基础信息,直接返回登录页
            this.$router.push({
                path: "/login"
            });
        }
// else {
//   // 若是有基础信息的情况下,判断时间戳和当前的时间,若是当前的时间大于服务器过期的时间
//   // 乖乖的返回去登录页重新登录
//   let lifeTime =
//     JSON.parse(window.localStorage.getItem("token")).lifeTime * 1000;
//   let nowTime = new Date().getTime(); // 当前时间的时间戳

//   if (nowTime > lifeTime) {
//     Message({
//       showClose: true,
//       message: "登录状态信息过期,请重新登录",
//       type: "error"
//     });
//     this.$router.push({
//       path: "/login"
//     });
//   } else {
//     // 下面是接口回调的satus ,因为我做了一些错误页面,所以都会指向对应的报错页面
//     // if (error.response.status === 403) {
//     //     this.$router.push({
//     //         path: "/error/403"
//     //     });
//     // }
//     // if (error.response.status === 500) {
//     //     this.$router.push({
//     //         path: "/error/500"
//     //     });
//     // }
//     // if (error.response.status === 502) {
//     //     this.$router.push({
//     //         path: "/error/502"
//     //     });
//     // }
//     // if (error.response.status === 404) {
//     //     this.$router.push({
//     //         path: "/error/404"
//     //     });
//     // }
//   }
// }
// 返回 response 里的错误信息
// let errorInfo = error.data.error ? error.data.error.message : error.data;
// return Promise.reject(errorInfo);error.response.data
        return Promise.reject(error);
    }
)
;

// 对axios的实例重新封装成一个plugin ,方便 Vue.use(xxxx)
export default {
    install: function (Vue, Option) {
        Object.defineProperty(Vue.prototype, "$ajax", {value: Axios});
    }
};
