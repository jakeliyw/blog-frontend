<template>
  <v-app>
    <router-view v-wechat-title='$route.meta.title'></router-view>
  </v-app>
</template>

<script>

export default {
  name: 'App',
}
</script>
<style lang="scss">
#nprogress .bar {
  background: #F9D741 !important; //自定义颜色
}
::selection {
  color: #fff;
  background: teal;
}

/* 移除代码块的外边距和内边距 */
.v-note-show .hljs {
  padding: 12px !important;
  margin: 0 !important;
}

/* 如果 <pre> 也有 padding/margin，可以这样移除 */
.v-note-show pre {
  padding: 0 !important;
  margin: 0 !important;
}



</style>
