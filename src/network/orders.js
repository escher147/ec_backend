// 订单管理相关网络请求
import { request } from "./request"
// 请求订单列表数据
export function getOrders(queryInfo) {
    return request({
        url: 'orders',
        methods: 'GET',
        params: queryInfo
    })
}
// 获取订单物流信息
export function getLogistics() {
    return request({
        url: '/kuaidi/804909574412544580',
        method: 'GET'
    })
}