// 商品相关网络请求
// 获取商品分类列表
import { request } from "./request";
export function getGoodsCate(queryInfo) {
    return request({
        url: 'categories',
        method: 'GET',
        params: queryInfo
    })
}
// 添加商品分类
export function postGoodCate(cateInfo) {
    return request({
        url: 'categories',
        method: 'POST',
        data: cateInfo
    })
}
// 编辑商品分类
export function putEditCate(id, cat_name) {
    return request({
        url: 'categories/' + id,
        method: 'PUT',
        data: {
            cat_name
        }
    })
}
// 删除商品分类
export function deleteCate(id) {
    return request({
        url: 'categories/' + id,
        method: 'DELETE'
    })
}