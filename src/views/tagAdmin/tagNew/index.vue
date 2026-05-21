<template>
  <div>
    <header-title :title="title" />
    <v-form>
      <v-container>
        <v-row>
          <v-col cols="12" sm="6">
            <v-text-field
              label="标签名称"
              single-line
              outlined
              v-model="upTag.tags"
            ></v-text-field>
          </v-col>
        </v-row>
        <div class="my-2">
          <v-btn large color="teal" @click="postBlog" class="newtitle">添加标签</v-btn>
        </div>
      </v-container>
    </v-form>
    <!--            弹窗提示-->
    <v-snackbar
      :color="color"
      v-model="snackbar"
      :multi-line="multiLine"
      :top="y === 'top'"
    >
      {{ text }}
      <template v-slot:action="{ attrs }">
        <v-btn
          color="color"
          text
          v-bind="attrs"
          @click="snackbar = false"
        >
          关闭
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>
<script>
import HeaderTitle from '@/components/HeaderTitle'
import { tagNew } from '@/api/tagAdmin/tagAdmin'

export default {
  name: 'update',
  components: {
    HeaderTitle,
  },
  data: () => ({
    title: '标签更新',
    multiLine: true,
    color: '',
    y: 'top',
    snackbar: false,
    text: '',
    upTag: {
      tags: '',
    },
  }),
  methods: {
    async postBlog () {
      await tagNew(this.upTag)
      this.$router.push({ name: 'tagadmin' })
    },
  },
}
</script>
<style scoped lang="scss">

.admin {
  @include Admin;
}

.newtitle {
  color: white;
}
</style>
