import axios from 'axios'
import QS from 'qs'
import store from '@/store/index'
import router from '../router'
import NProgress from 'nprogress'
import { notify } from '@/utils/notify'
import 'nprogress/nprogress.css'

const service = axios.create({
  baseURL: '',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
  },
})

service.interceptors.request.use(
  config => {
    NProgress.start()
    // 每次发送请求之前判断vuex中是否存在token
    // 如果存在，则统一在http请求的header都加上token，这样后台根据token判断你的登录情况
    // 即使本地存在token，也有可能token是过期的，所以在响应拦截器中要对返回状态进行判断
    const token = store.state.token
    token && (config.headers.Authorization = token)
    return config
  },
  error => {
    return Promise.error(error)
  })

service.interceptors.response.use(
  response => {
    // 如果返回的状态码为200，说明接口请求成功，可以正常拿到数据
    // 否则的话抛出错误
    if (response.status === 200) {
      const data = response && response.data ? response.data : null
      const code = data && typeof data.code !== 'undefined' ? data.code : undefined
      if (typeof code !== 'undefined' && code !== 0) {
        const message = data && data.message ? data.message : '服务器异常'
        notify(message, 'error')
        const err = new Error(message)
        err.statusCode = 500
        err.response = response
        return Promise.reject(err)
      }
      return Promise.resolve(response)
    } else {
      return Promise.reject(response)
    }
  },
  error => {
    if (error.response.status) {
      switch (error.response.status) {
        // case 401:
        //   router.replace({
        //     path: '/blogLogin',
        //     query: {
        //       redirect: router.currentRoute.fullPath,
        //     },
        //   })
        //   break
        // case 403:
        //   alert('登陆过期，请重新登陆')
        //   // 清除token
        //   localStorage.removeItem('token')
        //   store.commit('detail/settoken', null)
        //   // 跳转登录页面，并将要浏览的页面fullPath传过去，登录成功后跳转需要访问的页面
        //   setTimeout(() => {
        //     router.replace({
        //       path: '/article',
        //       query: {
        //         redirect: router.currentRoute.fullPath,
        //       },
        //     })
        //   }, 1000)
        //   break
        // 404请求不存在
        case 404:
          console.error('网络请求不存在')
          break
        // 其它错误，直接抛出错误提示
        case 500:
          console.error('服务器错误')
          break
        default:
          console.error(error.response.data.message)
      }
      return Promise.reject(error.response)
    }
  })

// GET方法
export function get (url, params) {
  return new Promise((resolve, reject) => {
    service.get(url, {
      params,
    }).then(res => {
      resolve(res.data)
    }).catch(err => {
      reject(err.data)
    }).finally(() => {
      NProgress.done()
    })
  })
}

// POST方法
export function post (url, params) {
  return new Promise((resolve, reject) => {
    service.post(url, QS.stringify(params)).then(res => {
      resolve(res.data)
    }).catch(err => {
      reject(err.data)
    }).finally(() => {
      NProgress.done
    })
  })
}
