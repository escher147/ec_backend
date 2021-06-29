import { request } from "./request";

// 获取type为list的权限列表
export function getListRights() {
    return request({
        url: 'rights/list',
        method: 'GET'
    })
}
// 获取type为tree的权限列表
export function getTreeRights() {
    return request({
        url: 'rights/tree',
        method: 'GET'
    })
}
// 分配权限
export function postRoleRights(roleId, rids) {
    return request({
        url: `roles/${roleId}/rights`,
        method: 'POST',
        data: {
            rids
        }
    })
}