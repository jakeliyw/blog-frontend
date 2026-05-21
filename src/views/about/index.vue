<template>
  <div class="admin">
    <!-- <header-title :title="title" /> -->
    <div class="typewriter">
          擅长Vue、React全家桶，熟练Nodejs、Nestjs、MySQL、等技术栈，
          个人认为前端在AI的冲击下，未来几年，如果前端不转型，将会被淘汰，
          所以，目前前端处境，要么研究混合开发，学Flutter、React Native，鸿蒙
          要么All in Java， 根据我目前的目标，我选择的是Java。
    </div>
    <br />
    <div class="nav-title">
      <h2 class="page-title">关于博客</h2>
      <v-divider></v-divider>
    </div>
    <div class="typewriter">
      博客技术栈:
        <ul style="margin-top: 10px; margin-left: -5px;">
          <li>
            博客前台：Vue全家桶
          </li>
          <li>
            博客后台：React 18、Ant Design Pro
          </li>
          <li>
            后端：Nestjs、MySQL、JWT、Mysql、Docker
          </li>
        </ul>
    </div>
    <!-- <v-row justify="center">
      <v-tooltip left>
        <template v-slot:activator="{ on, attrs }">
          <v-icon
            class="translate"
            @click.stop="dialog = true"
            color="teal"
            v-bind="attrs"
            v-on="on"
          >
            mdi-wechat
          </v-icon>
        </template>
        <span>二维码</span>
      </v-tooltip>
      <v-dialog
        v-model="dialog"
        max-width="200"
        max-height="200px"
        class="dialog"
      >
        <v-card>
          <img :src="require('../../assets/image/wechat.jpg')" alt="wechat" />
        </v-card>
      </v-dialog>
    </v-row> -->
  </div>
</template>
<script>
import HeaderTitle from "@/components/HeaderTitle";
export default {
  name: "about",
  components: {
    HeaderTitle,
  },
  data: () => ({
    dialog: false,
    title: "关于我",
  }),
};
</script>
<style scoped lang="scss">
.admin {
  @include Admin;
}
.content {
  padding: 0 10px;
}
.translate {
  margin-top: 5vw;
  font-size: 28px;
}
img {
  width: 200px;
  height: 200px;
}
.v-card {
  max-height: 200px;
}

.typewriter {
    width: 99%;
    background-color: #fff;
    margin: 20px auto 0 auto;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    font-family: 'Georgia', serif;
    color: #2c3e50;
    border-left: 6px solid #42b983;
}
        

</style>
