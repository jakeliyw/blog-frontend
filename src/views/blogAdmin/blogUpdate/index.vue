<template>
  <div>
    <header-title :title="title" />
    <v-form>
      <v-container>
        <v-row>
          <v-col cols="12" sm="6">
            <v-text-field
              label="博客名称"
              single-line
              outlined
              v-model="upblog.title"
            ></v-text-field>
          </v-col>
          <v-col class="d-flex" cols="12" sm="6">
            <v-select
              :items="items"
              :menu-props="{ top: true, offsetY: true }"
              label="请选择标签"
              v-model="upblog.tags"
              outlined
            >
            </v-select>
          </v-col>
          <v-col cols="12" sm="6">
            <v-text-field
              label="博客副内容"
              single-line
              outlined
              v-model="upblog.subContent"
            ></v-text-field>
          </v-col>
        </v-row>
        <mavon-editor v-model="upblog.content" />
        <div class="my-2">
          <v-btn large color="teal" @click="postBlog" class="newtitle">发表博客</v-btn>
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
import { getDetail, postNewBlog } from '@/api/blogAdmin/blogUpdate'
import { blogTag } from '@/api/blogAdmin/blogNew'

export default {
  name: 'update',
  components: {
    HeaderTitle,
  },
  data: () => ({
    title: '文章更新',
    multiLine: true,
    color: '',
    y: 'top',
    snackbar: false,
    text: '',
    items: [],
    upblog: [
      {
        title: '',
        subContent: '',
        content: '',
        createtime: '',
        author: '',
        tags: '',
      },
    ],
  }),
  mounted () {
    this.getTag()
    this.getupdate()
  },
  methods: {
    async getupdate () {
      const detailid = this.$store.state.detail.id.id
      if (!detailid) {
        return
      }
      const { data: res } = await getDetail({
        id: detailid,
        upblog: this.upblog,
      })
      this.items.push(res.tags)
      this.upblog = res
    },
    async getTag () {
      const { data: res } = await blogTag()
      this.items = res.listData.map(item => {
        return item.tags
      })
    },
    async postBlog () {
      const upDateid = this.$store.state.detail.id.id
      if (!upDateid) {
        alert('没有需要更新的数据')
        return
      }
      this.upblog.id = upDateid
      await postNewBlog(this.upblog)
      this.$router.push({ name: 'article' })
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

.v-note-wrapper {
  position: static;
}
</style>
