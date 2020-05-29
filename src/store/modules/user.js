import { getToken, setToken, removeToken } from '@/utils/auth'
import { login, getInfo, logout } from '@/api/user'
import { resetRouter } from '@/router'

const getDefaultState = () => {
    return {
        name: '',
        token: getToken(),
        phone: '',
        headphoto: '',
        roles: []
    }
}

const state = getDefaultState()

const mutations = {
    RESET_STATE: (state) => {
        Object.assign(state, getDefaultState())
    },
    SET_TOKEN: (state, token) => {
        state.token = token
    },
    SET_NAME: (state, name) => {
        state.name = name
    },
    SET_PHONE: (state, phone) => {
        state.phone = phone
    },
    SET_HEADPHOTO: (state, headphoto) => {
        state.headphoto = headphoto
    },
    SET_ROLES: (state, roles) => {
        state.roles = roles
    }
}

const actions = {

    // login 获取token
    login({ commit }, userInfo) {
        // 把userInfo对象中的username和password属性赋值给相应的那两个对象
        console.log(userInfo);
        const { phone, password } = userInfo
        return new Promise((resolve, reject) => {
            // 调用api中的login
            login({ phone: phone.trim(), password: password }).then(response => {
                const { data } = response
                // commit就是执行mutations中的方法
                commit('SET_TOKEN', data.token)
                // 将Token保存到Cokies中
                setToken(data.token)
                console.log("获取到的token是：" + data.token)
                resolve()
            }).catch(error => {
                console.log('reject')
                reject(error)
            })
        })
    },

    // 根据token获取user info
    getInfo({ commit, state }) {
        return new Promise((resolve, reject) => {
            getInfo(state.token).then(response => {
                const { data } = response

                if (!data) {
                    reject('Verification failed, please Login again.')
                }

                const { userRoles, username, phone, headPhoto } = data

                // roles must be a non-empty array
                if (!userRoles || userRoles.length <= 0) {
                    reject('getInfo: roles must be a non-null array!')
                }

                commit('SET_NAME', username)
                commit('SET_PHONE', phone)
                commit('SET_ROLES', userRoles)
                commit('SET_HEADPHOTO', headPhoto)
                resolve(data)
            }).catch(error => {
                reject(error)
            })
        })
    },

    // remove token
    resetToken({ commit }) {
        return new Promise(resolve => {
            commit('SET_TOKEN', '')
            removeToken()
            resolve()
        })
    },

    // user logout
    logout({ commit, state }) {
        return new Promise((resolve, reject) => {
            logout(state.token).then(() => {
                removeToken() // must remove  token  first
                resetRouter()
                commit('RESET_STATE')
                resolve()
            }).catch(error => {
                reject(error)
            })
        })
    },
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}