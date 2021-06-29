import { request } from "./request";

// 获取角色列表
export function getRoles() {
    return request({
        url: 'roles',
        method: 'GET'
    })
}
// 添加角色
export function postAddRole(roleName, roleDesc) {
    return request({
        url: 'roles',
        method: 'POST',
        data: {
            roleName,
            roleDesc
        }
    })
}
// 删除角色指定权限
export function removeRoleRight(roleId, rightId) {
    return request({
        url: `roles/${roleId}/rights/${rightId}`,
        method: 'DELETE'
    })
}
// 修改角色信息
export function putEditRole(id, roleName, roleDesc) {
    return request({
        url: 'roles/' + id,
        method: 'PUT',
        data: {
            roleName,
            roleDesc
        }
    })
}
// 删除角色
export function removeRole(id) {
    return request({
        url: 'roles/' + id,
        method: 'DELETE'
    })
}