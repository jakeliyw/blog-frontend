<template>
  <div class="admin">
    <div class="nav-title">
      <h2 class="page-title">{{title}}</h2>
      <v-divider></v-divider>
    </div>
  </div>
</template>

<script>
export default {
  name: 'index',
  props: {
    title: String,
  },
}
</script>

<style scoped lang="scss">
@import "../../style/Admin";
.admin{
  @include Admin;
}
</style>
