<template>
  <v-app>
    <div class="content">
      <img :src="imgError" :alt="titleText" class="not-access-img" />
      <span class="not-access">{{ titleText }}</span>
    </div>
  </v-app>
</template>

<script>
export default {
  props: {
    error: {
      type: Object,
      default: () => ({}),
    },
  },
  computed: {
    isNotFound() {
      return this.error && this.error.statusCode === 404;
    },
    titleText() {
      return this.isNotFound ? "资源未找到" : "服务暂时不可用";
    },
    imgError() {
      return this.isNotFound ? require("@/assets/image/404.svg") : require("@/assets/image/500.svg");
    },
  },
};
</script>

<style lang="scss" scoped>
@media (max-width: 768px) {
  img {
    width: 100%;
    height: auto;
  }
}

@media (min-width: 769px) and (max-width: 1024px) {
  img {
    width: 80%;
    height: auto;
  }
}

@media (min-width: 1025px) {
  img {
    width: 600px;
    height: auto;
  }
}

.content {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: inherit;
  flex-direction: column;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  .not-access-img {
    width: auto;
    height: auto;
    margin-bottom: 20px;
  }
  .not-access {
    color: #333;
    font-size: 20px;
    font-weight: 400;
    letter-spacing: 0.5px;
    line-height: 1.6;
  }
}
</style>
