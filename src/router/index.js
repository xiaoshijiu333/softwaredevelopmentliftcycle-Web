import Vue from 'vue'
import VueRouter from 'vue-router'

import Layout from '@/layout'

Vue.use(VueRouter)

// 公共路由，即所有角色都拥有的路由
export const constantRoutes = [
  {
    path: '/login',
    name: 'Login',
    meta: { title: '登录' },
    // which is lazy-loaded when the route is visited. 按需加载，点击的时候才会被加载
    component: () => import(/* webpackChunkName: "about" */ '../views/login'),
    hidden: true  // 隐藏，不然会显示在侧边栏
  },
]

// 按照用户拥有的角色选择加载路由，必须要在meta.roles中定义好，子路由也需要定义
export const asyncRoutes = [
  {
    path: '/',
    component: Layout,
    redirect: '/project',
    name: 'Project',
    meta: { roles: ['manager', 'dev', 'test', 'pro', 'superadmin'], title: '我的项目', icon: 'project' },
    // 设置该属性，则会一直显示在侧边栏，避免了只有一个子路由的情况下，父路由不显示的结果
    alwaysShow: true,
    children: [
      {
        path: 'project',
        component: () => import('@/views/project/index'),
        meta: { roles: ['manager', 'dev', 'test', 'pro', 'superadmin'], mocktitle: '我的项目' },
        hidden: true
      },
      {
        path: 'project/create',
        name: 'CreateProject',
        component: () => import('@/views/project/create'),
        meta: { title: '创建项目', icon: 'create', roles: ['manager', 'superadmin'] },
      },
      {
        path: 'project/edit/:pid',
        name: 'EditProject',
        component: () => import('@/views/project/edit'),
        meta: { title: '编辑项目', icon: 'project', roles: ['manager', 'superadmin'] },
        hidden: true
      },
      {
        path: 'project/detail/:pid',
        name: 'ProjectDetail',
        component: () => import('@/views/project/detail'),
        meta: { title: '项目详情', icon: 'project', roles: ['manager', 'dev', 'test', 'pro', 'superadmin'] },
        hidden: true
      }
    ]
  },
  {
    path: '/dev',
    component: Layout,
    redirect: '/dev/list',
    name: 'DevManage',
    meta: { roles: ['dev', 'superadmin'], title: '研发管理', icon: 'dev' },
    // 设置该属性，则会一直显示在侧边栏，避免了只有一个子路由的情况下，父路由不显示的结果
    alwaysShow: true,
    children: [
      {
        path: 'list',
        component: () => import('@/views/dev/index'),
        meta: { roles: ['dev', 'superadmin'], icon: 'dev', title: '研发阶段项目' },
      },
      {
        path: 'create/:pid',
        component: () => import('@/views/dev/create'),
        meta: { roles: ['dev', 'superadmin'], icon: 'project', title: '创建任务' },
        hidden: true
      },
      {
        path: 'task/list/:pid',
        component: () => import('@/views/dev/list'),
        meta: { roles: ['dev', 'superadmin'], icon: 'project', title: '任务列表' },
        hidden: true
      },
      {
        path: 'task/edit/:tid',
        component: () => import('@/views/dev/edit'),
        meta: { roles: ['dev', 'superadmin'], icon: 'project', title: '编辑任务' },
        hidden: true
      }
    ]
  },
  {
    path: '/test',
    component: Layout,
    redirect: '/test/list',
    name: 'TestManage',
    meta: { roles: ['test', 'superadmin'], title: '测试管理', icon: 'test' },
    // 设置该属性，则会一直显示在侧边栏，避免了只有一个子路由的情况下，父路由不显示的结果
    alwaysShow: true,
    children: [
      {
        path: 'list',
        component: () => import('@/views/testcase/index'),
        meta: { roles: ['test', 'superadmin'], icon: 'test', title: '测试阶段项目' },
      },
      {
        path: 'create/:pid',
        component: () => import('@/views/testcase/create'),
        meta: { roles: ['test', 'superadmin'], icon: 'project', title: '创建测试用例' },
        hidden: true
      },
      {
        path: 'case/list/:pid',
        component: () => import('@/views/testcase/list'),
        meta: { roles: ['test', 'superadmin'], icon: 'project', title: '测试用例列表' },
        hidden: true
      },
      {
        path: 'case/edit/:pid/:cid',
        component: () => import('@/views/testcase/edit'),
        meta: { roles: ['test', 'superadmin'], icon: 'project', title: '编辑测试用例' },
        hidden: true
      }
    ]
  },
  {
    path: '/bug',
    component: Layout,
    redirect: '/bug/list',
    name: 'BugManage',
    meta: { roles: ['test', "dev", 'superadmin'], title: '缺陷管理', icon: 'bug' },
    // 设置该属性，则会一直显示在侧边栏，避免了只有一个子路由的情况下，父路由不显示的结果
    alwaysShow: true,
    children: [
      {
        path: 'list',
        component: () => import('@/views/bug/index'),
        meta: { roles: ['test', "dev", 'superadmin'], icon: 'bug', title: '缺陷列表' },
      },
    ]
  },
  {
    path: '/pro',
    component: Layout,
    redirect: '/pro/index',
    name: 'ProManage',
    meta: { roles: ['pro', 'superadmin'], title: '发布管理', icon: 'pro' },
    // 设置该属性，则会一直显示在侧边栏，避免了只有一个子路由的情况下，父路由不显示的结果
    alwaysShow: true,
    children: [
      {
        path: 'index',
        component: () => import('@/views/pro/index'),
        meta: { roles: ['pro', 'superadmin'], icon: 'pro', title: '待发布项目' },
      },
      {
        path: 'create/:pid',
        component: () => import('@/views/pro/create'),
        meta: { roles: ['pro', 'superadmin'], icon: 'pro', title: '发布项目' },
        hidden: true
      }
    ]
  },
  {
    path: '/user',
    component: Layout,
    redirect: '/user/index',
    name: 'UserManage',
    meta: { roles: ['superadmin'], title: '用户管理', icon: 'usermanager' },
    // 设置该属性，则会一直显示在侧边栏，避免了只有一个子路由的情况下，父路由不显示的结果
    alwaysShow: true,
    children: [
      {
        path: 'index',
        component: () => import('@/views/user/list'),
        meta: { roles: ['superadmin'], icon: 'usermanager', title: '用户列表' },
      },
    ]
  },
  {
    path: '/msg',
    component: Layout,
    redirect: '/msg/index',
    name: 'MsgManage',
    meta: { roles: ['manager', 'dev', 'test', 'pro', 'superadmin'], title: '消息管理', icon: 'message' },
    // 设置该属性，则会一直显示在侧边栏，避免了只有一个子路由的情况下，父路由不显示的结果
    alwaysShow: true,
    children: [
      {
        path: 'index',
        component: () => import('@/views/msg/list'),
        meta: { roles: ['manager', 'dev', 'test', 'pro', 'superadmin'], icon: 'message', title: '消息列表' },
      },
    ]
  }
]

const createRouter = () => new VueRouter({
  mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// 重置路由，在登出的时候会调用
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
