import { asyncRoutes, constantRoutes } from '@/router'

/**
 * 判断该路由是否包含该角色，包含返回true，不包含以及没定义route.meta.roles的话返回false
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return false
  }
}

/**
 * 通过角色过滤路由，返回该角色下的可访问的路由
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []

  routes.forEach(route => {
    // ...：对象的复制
    const tmp = { ...route }
    // 判断该route有没有该role，从route的mete的role属性看有没有对应的
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        // 要想子路由也可以显示，子路由也需要定义好route.meta.roles
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      // 将该route放入待返回的数组中
      res.push(tmp)
    }
  })

  return res
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    // concat方法连接两个数组，生成一个新数组返回
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  generateRoutes({ commit }, roles) {
    return new Promise(resolve => {
      const accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
      // if (roles.includes('admin')) {
      //   // 角色包含admin，可访问的路由为asyncRoutes
      //   accessedRoutes = asyncRoutes || []
      // } else {
      //   // 没有admin，
      //   accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
      // }
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
