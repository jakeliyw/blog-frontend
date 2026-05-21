<template>
  <div class="login">
    <div class="content">
      <div class="frame">
        <div class="login">
          <div class="verification">
            <!--            提示导航条-->
            <div class="home">
              <span class="font-login">登陆</span>
              <!--              返回首页-->
              <span class="article" @click="article">返回首页</span>
            </div>
            <!--            表单验证区域-->
            <v-form ref="form" v-model="valid" lazy-validation>
              <v-text-field
                v-model="loginForm.username"
                :counter="10"
                :rules="nameRules"
                label="用户名"
                required
              ></v-text-field>
              <v-text-field
                v-model="loginForm.password"
                :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                :rules="[rules.required, rules.min]"
                :type="show1 ? 'text' : 'password'"
                label="密码"
                hint="至少8个字符"
                counter
                @click:append="show1 = !show1"
              ></v-text-field>
              <!--              按钮-->
              <v-btn
                :disabled="!valid"
                color="teal"
                class="mr-4 login-page"
                @click="validate"
              >
                登陆
              </v-btn>
            </v-form>
          </div>
        </div>
        <!--            弹窗提示-->
        <v-snackbar
          :color="color"
          v-model="snackbar"
          :multi-line="multiLine"
          :top="y === 'top'"
        >
          {{ text }}
          <template v-slot:action="{ attrs }">
            <v-btn color="color" text v-bind="attrs" @click="snackbar = false">
              关闭
            </v-btn>
          </template>
        </v-snackbar>
        <!--        背景图片-->
        <div class="img-range">
          <img
            :src="require('@/assets/image/background-main.png')"
            alt="背景图片"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { postLogin } from "@/api/blogLogin/blogLogin";

export default {
  name: "login",
  data: () => ({
    valid: true,
    multiLine: true,
    color: "",
    y: "top",
    snackbar: false,
    text: "",
    show1: false,
    loginForm: {
      username: "",
      password: "",
    },
    rules: {
      required: (value) => !!value || "必填.",
      min: (v) => v.length >= 8 || "密码最少8个字符",
    },
    nameRules: [
      (v) => !!v || "必填",
      (v) => (v && v.length <= 10) || "昵称最少10个字符",
    ],
  }),
  methods: {
    async validate() {
      const { data: token } = await postLogin(this.loginForm);
      window.localStorage.setItem("token", token);
      this.$store.commit("detail/settoken", token);
      this.$router.push({ name: "admin" });
    },
    article() {
      this.$router.push({ name: "article" });
    },
  },
};
</script>

<style scoped lang="scss">
.font-login {
  font-size: 26px;
  font-weight: 900;
}
.login {
  @include login;
}

.home {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.article {
  font-size: 16px;
  color: #8f8fa9;
  text-decoration: underline;
  cursor: pointer;
}
</style>
