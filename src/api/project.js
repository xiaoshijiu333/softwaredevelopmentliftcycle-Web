import request from '@/utils/request'
import qs from 'qs'

// 根剧用户token查询该用户参与的项目（筛选条件状态）
// isDoing:true筛选正在进行的，false全部
export function getList(token, isDoing, status) {
    return request({
        url: '/project/getList',
        method: 'get',
        // params传递参数，get请求，拼接在url后面的
        // 使用data传递，post请求，参数放在请求体中，就是以对象形式，json传给后端
        params: {
            token: token,
            isDoing: isDoing,
            status: status
        }
    })
}

export function create(data) {
    return request({
        url: '/project/create',
        method: 'post',
        data
    })
}

export function deletePro(pid) {
    return request({
        url: '/project/delete',
        method: 'post',
        data: qs.stringify({
            pid
        })
    })
}

export function getById(pid) {
    return request({
        url: '/project/getById',
        method: 'get',
        params: {
            pid: pid
        }
    })
}

export function edit(data) {
    return request({
        url: '/project/edit',
        method: 'post',
        data
    })
}

export function editState(pid, projectState) {
    return request({
        url: '/project/editState',
        method: 'post',
        data: qs.stringify({
            pid,
            projectState
        })
    })
}