import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import moment from 'moment'
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
import VueWechatTitle from 'vue-wechat-title'
import 'highlight.js/styles/github.css'; // 选择你喜欢的主题

Vue.use(VueWechatTitle)
Vue.use(mavonEditor)
Vue.prototype.$moment = moment
Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App),
}).$mount('#app')
