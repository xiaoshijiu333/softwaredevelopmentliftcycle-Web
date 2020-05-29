import request from '@/utils/request'

export function create(data) {
    return request({
        url: '/bug/create',
        method: 'post',
        data
    })
}

export function getList(name, roleNum) {
    return request({
        url: '/bug/getList',
        method: 'get',
        params: {
            name,
            roleNum
        }
    })
}

export function edit(data) {
    return request({
        url: '/bug/edit',
        method: 'post',
        data
    })
}
