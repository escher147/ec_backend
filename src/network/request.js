import axios from "axios"

export function request(config) {
    const instance = axios.create({
            baseURL: 'http://127.0.0.1:8888/api/private/v1/',
            method: config.method || 'GET',
            timeout: 5000
        })
        // 拦截器
    instance.interceptors.request.use(config => {
        // console.log(config);
        config.headers.Authorization = window.sessionStorage.getItem('token');
        return config;
    })
    return instance(config);
}