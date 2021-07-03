// 商品相关网络请求

/*
 *分类相关请求
 */
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

/* 
 *参数属性相关请求 
 */

// 获取分类参数
export function getCateAttributes(id, sel) {
    return request({
        url: `categories/${id}/attributes`,
        method: 'GET',
        params: {
            sel
        }
    })
}
// 添加动态参数或者静态属性
export function postCateAttribute(id, attr_name, attr_sel) {
    return request({
        url: `categories/${id}/attributes`,
        method: 'POST',
        data: {
            attr_name,
            attr_sel
        }
    })
}
// 根据 ID 查询参数
export function getAttributeById(id, attrId, attr_sel) {
    return request({
        url: `categories/${id}/attributes/${attrId}`,
        method: 'GET',
        data: {
            attr_sel
        }
    })
}

// 编辑动态参数或静态属性
export function putCateAttribute(id, attrId, attr_name, attr_sel, attr_vals) {
    return request({
        url: `categories/${id}/attributes/${attrId}`,
        method: 'PUT',
        data: {
            attr_name,
            attr_sel,
            attr_vals
        }
    })
}
// 根据删除属性或参数
export function deleteCateAttribute(id, attrid) {
    return request({
        url: `categories/${id}/attributes/${attrid}`,
        method: 'DELETE'
    })
}

/* 
    商品相关请求
*/
// 获取商品列表
export function getGoodsList(queryInfo) {
    return request({
        url: 'goods',
        method: 'GET',
        params: queryInfo
    })
}
// 添加商品
export function postGoods(goodsInfo) {
    return request({
        url: 'goods',
        method: 'POST',
        data: goodsInfo
    })
}
// 删除商品
export function deleteGoods(id) {
    return request({
        url: 'goods/' + id,
        method: 'DELETE'
    })
}