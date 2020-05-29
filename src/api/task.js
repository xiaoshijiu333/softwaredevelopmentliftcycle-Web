import request from '@/utils/request'
import qs from 'qs'

export function create(data) {
    return request({
        url: '/task/create',
        method: 'post',
        data
    })
}

export function getList(name, pid) {
    return request({
        url: '/task/getList',
        method: 'get',
        params: {
            name: name,
            pid: pid
        }
    })
}

export function deleteTask(tid) {
    return request({
        url: '/task/delete',
        method: 'post',
        data: qs.stringify({
            tid
        })
    })
}

export function getById(tid) {
    return request({
        url: '/task/getById',
        method: 'get',
        params: {
            tid
        }
    })
}

export function edit(data) {
    return request({
        url: '/task/edit',
        method: 'post',
        data
    })
}

export function gante(pid) {
    return request({
        url: '/task/gante',
        method: 'get',
        params: {
            pid
        }
    })
}