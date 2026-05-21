import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/article',
  },
  {
    path: '/',
    name: 'Home',
    component: Home,
    children: [
      {
        path: '/article',
        name: 'Article',
        component: () => import('@/views/article/index.vue'),
        meta: {
          title: ' 首页 - LYW的博客',
        },
      },
      {
        path: '/tag',
        name: 'Tag',
        component: () => import('@/views/tag'),
        meta: {
          title: ' 标签 - LYW的博客',
        },
      },
      {
        path: '/tag/:id',
        name: 'tags',
        component: () => import('@/views/tag/detail'),
        meta: {
          title: ' 标签文章 - LYW的博客',
        },
      },
      {
        path: '/about',
        name: 'About',
        component: () => import('@/views/about'),
        meta: {
          title: ' 关于我 - LYW的博客',
        },
      },
      {
        path: '/archives',
        name: 'Archives',
        component: () => import('@/views/archives'),
        meta: {
          title: ' 归档 - LYW的博客',
        },
      },
      {
        path: '/article/:id',
        name: 'Detail',
        component: () => import('@/views/detail'),
        meta: {
          title: ' 文章详情 - LYW的博客',
        },
      },
      {
        path: '/:pathMatch(.*)*',
        component: () => import('@/views/notFound/index.vue') // 404页面
      }
    ],
  }
]

const router = new VueRouter({
  mode: 'history',
  routes,
})

// 避免冗余的点击导航
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

router.beforeEach((to, from, next) => {
  const tokenStr = window.localStorage.getItem('token')
  if (!tokenStr) {
    if (['/blogAdmin', '/blogNew', '/blogUpdate',
      '/timeAdmin', '/timeNew', '/timeUpdate', '/tagUpdate', '/tagNew', '/tagAdmin'].includes(to.path)) {
      return next('/article')
    }
  }
  next()
})

export default router
