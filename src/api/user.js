import request from '@/utils/request'
import qs from 'qs'

// 导出函数，export function xxx
// 导出对象，export default
export function login(data) {
    return request({
        url: '/user/login',
        method: 'post',
        // params传递参数，get请求，拼接在url后面的
        // 使用data传递，post请求，参数放在请求体中，就是以对象形式，json传给后端
        data
    })
}

export function getInfo(token) {
    return request({
        url: '/user/info',
        method: 'get',
        params: { token }
    })
}

export function all(status) {
    return request({
        url: '/user/all',
        method: 'get',
        params: {
            status
        }
    })
}

export function getProUser(pid, roleName) {
    return request({
        url: '/user/getProUser',
        method: 'get',
        params: {
            pid,
            roleName
        }
    })
}

export function deleteUser(uid) {
    return request({
        url: '/user/delete',
        method: 'post',
        data: qs.stringify({
            uid
        })
    })
}

export function roles() {
    return request({
        url: '/user/roles',
        method: 'get'
    })
}

export function edit(data) {
    return request({
        url: '/user/edit',
        method: 'post',
        data
    })
}

export function create(data) {
    return request({
        url: '/user/create',
        method: 'post',
        data
    })
}

export function logout(token) {
    return request({
        url: '/user/logout',
        method: 'post',
        // 使用qs将'Content-Type'改为了 'application/x-www-form-urlencoded'
        // application/x-www-form-urlencoded：数据被编码为名称/值对。这是标准的编码格式。默认行为
        // 同时参数也被格式化了，以键值对的形式发送出去了，避免application/json请求头传输单个数据，后端接受不到参数
        data: qs.stringify({
            token
        })
    })
}