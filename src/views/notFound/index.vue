<template>
  <div class="content">
    <img
      :src="require('@/assets/image/404.png')"
      alt="背景图片"
      class="not-access-img"
    />
    <span class="not-access">噢~噢 资源未找到</span>
  </div>
</template>

<script>
export default {
  name: "notFound",
  data: () => ({}),
};
</script>
<style lang="scss" scoped>
/* 移动端样式 */
@media (max-width: 768px) {
  img {
    width: 100%;
    height: auto;
  }
}

/* 平板设备 */
@media (min-width: 769px) and (max-width: 1024px) {
  img {
    width: 80%;
    height: auto;
  }
}

/* PC端样式 */
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
    width: 350px;
    height: 130px;
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
