import { request } from "./request";
// 获取用户数据
export function getUsers(queryInfo) {
    return request({
        url: '/users',
        method: 'GET',
        params: queryInfo
    })
}
// 修改用户状态
export function putUserState(uId, type) {
    return request({
        url: `users/${uId}/state/${type}`,
        method: 'PUT'
    })
}

// 添加用户
export function postUser(addForm) {
    return request({
        url: '/users',
        method: 'POST',
        data: addForm
    })
}
// 根据id获取用户信息
export function getUserById(id) {
    return request({
        url: 'users/' + id,
        method: 'GET'
    })
}
// 修改用户信息
export function putEditUser(id, email, mobile) {
    return request({
        url: 'users/' + id,
        method: 'PUT',
        data: {
            email,
            mobile
        }
    })
}
// 删除用户
export function deleteUser(id) {
    return request({
        url: 'users/' + id,
        method: 'DELETE'
    })
}