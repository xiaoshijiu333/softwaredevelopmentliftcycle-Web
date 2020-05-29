import request from '@/utils/request'
import qs from 'qs'

export function getAll(pid) {
    return request({
        url: '/comment/all',
        method: 'get',
        // params传递参数，get请求，拼接在url后面的
        // 使用data传递，post请求，参数放在请求体中，就是以对象形式，json传给后端
        params: {
            pid: pid
        }
    })
}

export function create(token, pid, context) {
    return request({
        url: '/comment/create',
        method: 'post',
        // params传递参数，get请求，拼接在url后面的
        // 使用data传递，post请求，参数放在请求体中，就是以对象形式，json传给后端
        data: qs.stringify({
            token: token,
            pid: pid,
            context: context
        })
    })
}