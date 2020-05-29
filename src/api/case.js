import request from '@/utils/request'
import qs from 'qs'

export function create(data) {
    return request({
        url: '/case/create',
        method: 'post',
        data
    })
}

export function getList(name, pid) {
    return request({
        url: '/case/getList',
        method: 'get',
        params: {
            name: name,
            pid: pid
        }
    })
}


export function deleteCase(cid) {
    return request({
        url: '/case/delete',
        method: 'post',
        data: qs.stringify({
            cid
        })
    })
}

export function edit(data) {
    return request({
        url: '/case/edit',
        method: 'post',
        data
    })
}

export function getById(cid) {
    return request({
        url: '/case/getById',
        method: 'get',
        params: {
            cid
        }
    })
}