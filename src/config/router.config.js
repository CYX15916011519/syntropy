// eslint-disable-next-line
import { UserLayout, BasicLayout, RouteView, BlankLayout, PageView } from '@/layouts'

export const asyncRouterMap = [

  {
    path: '/',
    name: 'index',
    component: BasicLayout,
    meta: { title: '首页' },
    redirect: '/basic/basicmaterialsetup',
    children: [
      // dashboard
      // other
      {
        path: '/basic',
        name: 'basic',
        component: PageView,
        meta: { title: '基本资料', icon: 'file-text', permission: [ 'dashboard' ] },
        redirect: '/basic/basicmaterialsetup',
        children: [
          {
            path: '/basic/basicmaterialsetup',
            name: 'basicmaterialsetup',
            component: () => import('@/views/basic/materialsetup'),
            meta: { title: '物料模板设置', icon: 'tag', keepAlive: false, permission: [ 'dashboard' ] }
          }, {
            path: '/basic/codemanage',
            name: 'basiccodemanage',
            component: () => import('@/views/basic/codemanage'),
            meta: { title: '编码对应管理', icon: 'book', keepAlive: true, permission: [ 'dashboard' ] }
          },
          {
            path: '/basic/BOMImport',
            name: 'basicBOMImport',
            component: () => import('@/views/basic/BOMImport'),
            meta: { title: 'BOM导入', icon: 'import', keepAlive: true, permission: [ 'dashboard' ] }
          }
        ]
      },
      {
        path: '/connect',
        name: 'connect',
        component: () => import('@/views/connect/manage'),
        meta: { title: '连接管理', icon: 'deployment-unit', permission: [ 'dashboard' ] }
      }
    ]
  },
  {
    path: '*', redirect: '/404', hidden: true
  }
]

/**
 * 基础路由
 * @type { *[] }
 */
export const constantRouterMap = [
  {
    path: '/user',
    component: UserLayout,
    redirect: '/user/login',
    hidden: true,
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/Login')
      },
      {
        path: 'register',
        name: 'register',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/Register')
      },
      {
        path: 'register-result',
        name: 'registerResult',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/RegisterResult')
      },
      {
        path: 'recover',
        name: 'recover',
        component: undefined
      }
    ]
  },

  {
    path: '/test',
    component: BlankLayout,
    redirect: '/test/home',
    children: [
      {
        path: 'home',
        name: 'TestHome',
        component: () => import('@/views/Home')
      }
    ]
  },

  {
    path: '/404',
    component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/404')
  }

]
