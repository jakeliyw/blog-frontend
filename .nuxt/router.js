import Vue from 'vue'
import Router from 'vue-router'
import { normalizeURL, decode } from 'ufo'
import { interopDefault } from './utils'
import scrollBehavior from './router.scrollBehavior.js'

const _21536117 = () => interopDefault(import('..\\src\\pages\\archives\\index.vue' /* webpackChunkName: "pages/archives/index" */))
const _c117dc94 = () => interopDefault(import('..\\src\\pages\\article\\index.vue' /* webpackChunkName: "pages/article/index" */))
const _8b963cdc = () => interopDefault(import('..\\src\\pages\\tag\\index.vue' /* webpackChunkName: "pages/tag/index" */))
const _5d801aa8 = () => interopDefault(import('..\\src\\pages\\index.vue' /* webpackChunkName: "pages/index" */))
const _1d27099e = () => interopDefault(import('..\\src\\pages\\article\\_id.vue' /* webpackChunkName: "pages/article/_id" */))
const _535bbf0c = () => interopDefault(import('..\\src\\pages\\tag\\_id.vue' /* webpackChunkName: "pages/tag/_id" */))

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
    component: _21536117,
    name: "archives"
  }, {
    path: "/article",
    component: _c117dc94,
    name: "article"
  }, {
    path: "/tag",
    component: _8b963cdc,
    name: "tag"
  }, {
    path: "/",
    component: _5d801aa8,
    name: "index"
  }, {
    path: "/article/:id",
    component: _1d27099e,
    name: "article-id"
  }, {
    path: "/tag/:id",
    component: _535bbf0c,
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
