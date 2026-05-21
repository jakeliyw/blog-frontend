<template>
  <v-app id="inspire">
    <v-app-bar app color="teal" dark>
      <img
        class="brand-avatar"
        :src="require('@/assets/image/head.webp')"
        alt="avatar"
        @click="home"
      />
      <v-toolbar-title @click="home" class="brand-title">LYW</v-toolbar-title>

      <v-spacer></v-spacer>

      <v-toolbar-items class="d-none d-md-flex">
        <v-btn
          v-for="item in menuList"
          :key="item.id"
          text
          :to="item.path"
          router
          class="menu-btn"
          :class="{ 'v-btn--active': isActive(item.path) }"
        >
          <v-icon left>{{ item.icon }}</v-icon>
          {{ item.title }}
        </v-btn>
      </v-toolbar-items>

      <v-btn icon class="ml-2" @click="openSearch" aria-label="open search">
        <v-icon>mdi-magnify</v-icon>
      </v-btn>

      <v-btn
        icon
        class="ml-2"
        @click="toggleDark"
        :aria-label="isDark ? 'switch to light mode' : 'switch to dark mode'"
      >
        <v-icon>{{ isDark ? "mdi-white-balance-sunny" : "mdi-weather-night" }}</v-icon>
      </v-btn>

      <v-menu offset-y>
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
            link
            style="width: 100px"
          >
            <v-list-item-title v-text="item.title"></v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <v-main class="remove-top">
      <div class="flex-container">
        <div class="back-top">
          <img
            :src="require('@/assets/image/top.png')"
            alt="返回顶部"
            v-if="btnFlag"
            class="go-top"
            @click="backTop"
          />
        </div>

        <nuxt />
      </div>
    </v-main>

    <SearchModal v-model="searchDialog" />

    <v-snackbar v-model="snackbar.show" :color="snackbar.color" :timeout="snackbar.timeout">
      {{ snackbar.message }}
      <template v-slot:action="{ attrs }">
        <v-btn text v-bind="attrs" @click="snackbar.show = false">关闭</v-btn>
      </template>
    </v-snackbar>
  </v-app>
</template>

<script>
import { onNotify, offNotify } from "@/utils/notify";
import SearchModal from "@/components/SearchModal.vue";
export default {
  name: "DefaultLayout",
  components: {
    SearchModal,
  },
  head() {
    return {
      htmlAttrs: {
        class: this.$store.state.theme.dark ? "theme-dark" : "",
      },
    };
  },
  data() {
    return {
      scrollTop: 0,
      btnFlag: false,
      searchDialog: false,
      snackbar: {
        show: false,
        message: "",
        color: "error",
        timeout: 3000,
      },
      menuList: [
        { id: 1, title: "首页", icon: "mdi-home", path: "/article" },
        { id: 2, title: "归档", icon: "mdi-clock-time-eight", path: "/archives" },
        { id: 3, title: "标签", icon: "mdi-tag", path: "/tag" },
      ],
    };
  },
  computed: {
    isDark() {
      return !!this.$vuetify.theme.dark;
    },
  },
  mounted() {
    if (process.client) {
      window.addEventListener("scroll", this.scrollToTop, true);
    }
    onNotify(this.handleNotify);
  },
  destroyed() {
    if (process.client) {
      window.removeEventListener("scroll", this.scrollToTop);
    }
    offNotify(this.handleNotify);
  },
  methods: {
    handleNotify(payload) {
      const nextMessage = payload && payload.message ? payload.message : "服务器异常";
      const nextColor = payload && payload.color ? payload.color : "error";
      this.snackbar.message = nextMessage;
      this.snackbar.color = nextColor;
      this.snackbar.show = true;
    },
    isActive(path) {
      const currentPath = this.$route.path;
      return path === "/article" && currentPath.startsWith("/article/")
        ? true
        : currentPath === path;
    },
    home() {
      this.$router.push({ path: "/article" });
    },
    toggleDark() {
      const next = !this.$vuetify.theme.dark;
      this.$vuetify.theme.dark = next;
      this.$store.commit("theme/setDark", next);
      localStorage.setItem("theme", next ? "dark" : "light");
      document.cookie = `theme=${next ? "dark" : "light"}; path=/; max-age=31536000`;
      if (next) {
        document.documentElement.classList.add("theme-dark");
      } else {
        document.documentElement.classList.remove("theme-dark");
      }
    },
    openSearch() {
      this.searchDialog = true;
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
  margin-top: 1rem;
}

.menu-btn {
  font-size: 1.4rem;
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

.brand-title {
  cursor: pointer;
  font-size: 1.4rem;
  font-family: "Georgia", serif;
  color: white;
  font-weight: 400;
  letter-spacing: 0.5px;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
}

.brand-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 10px;
  cursor: pointer;
  border: 1.5px solid rgba(255, 255, 255);
}

.v-icon {
  color: white !important;
}

@media screen and (min-width: 979px) {
  .remove-top {
    padding: 0px !important;
  }
}

.remove-top {
  background-color: #eee;
  padding: 64px 0px 42px !important;
}

.theme-dark .v-application .remove-top {
  background-color: #16181d;
}

.theme-dark .v-application .v-app-bar {
  background-color: #1b1f26 !important;
}



</style>
