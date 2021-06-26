import { request } from "./request"
export function loginReq(username, password) {
    return request({
        url: 'login',
        method: 'POST',
        params: {
            username,
            password
        }
    })
}