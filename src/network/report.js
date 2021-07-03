// 数据报表相关网络请求
import { request } from "./request";
export function getReports() {
    return request({
        url: 'reports/type/1'
    })
}