<template>
  <div id="app">
    <v-app id="inspire">
      <!-- 顶部导航栏 -->
      <v-app-bar app color="teal" dark>

        <!-- 网站标题 -->
        <v-toolbar-title @click="home" style="cursor:pointer; font-size: 1.4rem;font-family: 'Georgia', serif;">LYW1</v-toolbar-title>

        <v-spacer></v-spacer>

        <!-- 大屏幕菜单：md及以上显示 -->
        <v-toolbar-items class="d-none d-md-flex">
          <v-btn
            v-for="item in menuList"
            :key="item.id"
            text
            :to="item.path"
            router
            style="font-size: 1.4rem;"
            :class="{ 'v-btn--active': isActive(item.path) }"
          >
            <v-icon left>{{ item.icon }}</v-icon>
            {{ item.title }}
          </v-btn>
        </v-toolbar-items>

        <!-- 小屏幕汉堡菜单：md以下显示 -->
        <v-menu offset-y >
          <template v-slot:activator="{ on, attrs }">
            <v-btn icon v-bind="attrs" v-on="on" class="d-md-none">
              <v-icon>mdi-menu</v-icon>
            </v-btn>
          </template>

          <v-list>
          <v-list-item
              v-for="item in menuList"
              :key="item.id"
              :to="item.path"
              router
              @click="$refs.menu?.save && $refs.menu.save(item.path)"
              link
              style="width: 80px"
            >
              <v-list-item-title v-text="item.title"></v-list-item-title>
            </v-list-item>`
          </v-list>

        </v-menu>
      </v-app-bar>

      <!-- 页面内容 -->
      <v-main class="remove-top" style="background-color: #eee; padding:64px 0px 42px !important;">
        <div class="flex-container">
          <!-- 回到顶部按钮 -->
          <div class="back-top">
            <img
              :src="require('../assets/image/top.png')"
              alt="顶部"
              v-if="btnFlag"
              class="go-top"
              @click="backTop"
            />
          </div>

          <router-view></router-view>
        </div>
      </v-main>

    </v-app>
  </div>
</template>

<script>
export default {
  name: "Home",
  data() {
    return {
      scrollTop: 0,
      btnFlag: false,
      menuList: [],
    };
  },
  mounted() {
    this.getMenu();
    window.addEventListener("scroll", this.scrollToTop, true);
  },
  destroyed() {
    window.removeEventListener("scroll", this.scrollToTop);
  },
  methods: {
    getMenu() {
      this.menuList = [
        { id: 1, title: "首页", icon: "mdi-home", path: "/article" },
        { id: 2, title: "归档", icon: "mdi-clock-time-eight", path: "/archives" },
        { id: 3, title: "标签", icon: "mdi-tag", path: "/tag" },
        { id: 4, title: "关于我", icon: "mdi-face-man-profile", path: "/about" },
      ];
    },
    isActive(path) {
      const currentPath = this.$route.path;
      return path === "/article" && currentPath.startsWith("/detail")
        ? true
        : currentPath === path;
    },
    home() {
      this.$router.push({ path: "/article" });
    },
    backTop() {
      const that = this;
      const timer = setInterval(() => {
        const ispeed = Math.floor(-that.scrollTop / 5);
        document.documentElement.scrollTop = document.body.scrollTop =
          that.scrollTop + ispeed;
        if (that.scrollTop === 0) {
          clearInterval(timer);
        }
      }, 16);
    },
    scrollToTop() {
      const scrollTop =
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop;
      this.scrollTop = scrollTop;
      this.btnFlag = this.scrollTop > 0;
    },
  },
};
</script>

<style scoped lang="scss">
.flex-container {
  padding: 12px;
  margin-left: auto;
  margin-right: auto;
}

.v-btn--active {
  background-color: rgba(255, 255, 255, 0.2);
}

.back-top {
  position: fixed;
  right: 1%;
  bottom: 45px;
  z-index: 999;

  img {
    width: 50px;
    height: 50px;
    cursor: pointer;
  }
}

.v-toolbar-title {
  color: white;
  font-weight: 400;
  font-size: 1.4rem;
  letter-spacing: 0.5px;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
}

a {
  color: white;
  text-decoration: none;

  img {
    width: 15px;
    margin-right: 5px;
  }
}

.v-icon {
  color: white !important;
}

/* 内容上移 */
@media screen and (min-width: 979px) {
  .remove-top {
    padding: 0px !important;
  }
}
</style>
