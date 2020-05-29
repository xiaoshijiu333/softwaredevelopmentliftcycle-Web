import request from '@/utils/request'

export function create(data) {
    return request({
        url: '/deploy/create',
        method: 'post',
        data
    })
}

export function getById2(pid) {
    return request({
        url: '/deploy/getById',
        method: 'get',
        params: {
            pid
        }
    })
}