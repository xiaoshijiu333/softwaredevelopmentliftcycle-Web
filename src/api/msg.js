import request from '@/utils/request'
import qs from 'qs'

export function getList(name) {
    return request({
        url: '/msg/getList',
        method: 'get',
        params: {
            name
        }
    })
}

export function deleteMsg(mid) {
    return request({
        url: '/msg/delete',
        method: 'post',
        data: qs.stringify({
            mid
        })
    })
}

export function read(mid) {
    return request({
        url: '/msg/read',
        method: 'post',
        data: qs.stringify({
            mid
        })
    })
}

export function allRead(name) {
    return request({
        url: '/msg/allRead',
        method: 'post',
        data: qs.stringify({
            name
        })
    })
}

export function notice(data) {
    return request({
        url: '/msg/notice',
        method: 'post',
        data
    })
}

export function noticeByName(name, messageTitle) {
    return request({
        url: '/msg/noticeByName',
        method: 'post',
        data: qs.stringify({
            name,
            messageTitle
        })
    })
}

export function noticeByPro(pid, messageTitle) {
    return request({
        url: '/msg/noticeByPro',
        method: 'post',
        data: qs.stringify({
            pid,
            messageTitle
        })
    })
}

export function notReadNum(name) {
    return request({
        url: '/msg/notReadNum',
        method: 'get',
        params: {
            name
        }
    })
}