import axios from "axios"
// 导入nprogress和css文件
import NProgress from "nprogress";
// import 'nprogress/nprogress.css'

export function request(config) {
    const instance = axios.create({
            baseURL: 'http://127.0.0.1:8888/api/private/v1/',
            method: config.method || 'GET',
            timeout: 5000
        })
        // 拦截器
        // 在request拦截器中展示加载进度条，Nprogress.start()
    instance.interceptors.request.use(config => {
            // console.log(config);
            NProgress.start();
            config.headers.Authorization = window.sessionStorage.getItem('token');
            return config;
        })
        // 在response拦截器中隐藏进度条，Nprogress.done()
    instance.interceptors.response.use(config => {
        NProgress.done();
        return config;
    })
    return instance(config);
}