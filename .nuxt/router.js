import Vue from 'vue'
import Router from 'vue-router'
import { normalizeURL, decode } from 'ufo'
import { interopDefault } from './utils'
import scrollBehavior from './router.scrollBehavior.js'

const _16232ef4 = () => interopDefault(import('..\\src\\pages\\archives\\index.vue' /* webpackChunkName: "pages/archives/index" */))
const _53b2e067 = () => interopDefault(import('..\\src\\pages\\article\\index.vue' /* webpackChunkName: "pages/article/index" */))
const _0440b0c3 = () => interopDefault(import('..\\src\\pages\\tag\\index.vue' /* webpackChunkName: "pages/tag/index" */))
const _2b49d0d7 = () => interopDefault(import('..\\src\\pages\\index.vue' /* webpackChunkName: "pages/index" */))
const _137bd08f = () => interopDefault(import('..\\src\\pages\\article\\_id.vue' /* webpackChunkName: "pages/article/_id" */))
const _ca8bf02a = () => interopDefault(import('..\\src\\pages\\tag\\_id.vue' /* webpackChunkName: "pages/tag/_id" */))

const emptyFn = () => {}

Vue.use(Router)

export const routerOptions = {
  mode: 'history',
  base: '/',
  linkActiveClass: 'nuxt-link-active',
  linkExactActiveClass: 'nuxt-link-exact-active',
  scrollBehavior,

  routes: [{
    path: "/archives",
    component: _16232ef4,
    name: "archives"
  }, {
    path: "/article",
    component: _53b2e067,
    name: "article"
  }, {
    path: "/tag",
    component: _0440b0c3,
    name: "tag"
  }, {
    path: "/",
    component: _2b49d0d7,
    name: "index"
  }, {
    path: "/article/:id",
    component: _137bd08f,
    name: "article-id"
  }, {
    path: "/tag/:id",
    component: _ca8bf02a,
    name: "tag-id"
  }],

  fallback: false
}

export function createRouter (ssrContext, config) {
  const base = (config._app && config._app.basePath) || routerOptions.base
  const router = new Router({ ...routerOptions, base  })

  // TODO: remove in Nuxt 3
  const originalPush = router.push
  router.push = function push (location, onComplete = emptyFn, onAbort) {
    return originalPush.call(this, location, onComplete, onAbort)
  }

  const resolve = router.resolve.bind(router)
  router.resolve = (to, current, append) => {
    if (typeof to === 'string') {
      to = normalizeURL(to)
    }
    return resolve(to, current, append)
  }

  return router
}
