<template>
  <div>
    <header-title :title="title" />
    <v-form>
      <v-container>
        <v-row>
          <v-col cols="12" sm="6">
            <v-text-field
              label="时间名称"
              single-line
              outlined
              v-model="upDate.title"
            ></v-text-field>
          </v-col>
        </v-row>
        <mavon-editor v-model="upDate.content" />
        <div class="my-2">
          <v-btn large color="teal" @click="postTime" class="newtitle">更新时间</v-btn>
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
import { timeUpdate, timeDetail } from '@/api/timeAdmin/timeAdmin'

export default {
  name: 'timeUpdate',
  components: {
    HeaderTitle,
  },
  data: () => ({
    title: '时间更新',
    multiLine: true,
    color: '',
    y: 'top',
    snackbar: false,
    text: '',
    upDate: [
      {
        title: '',
        content: '',
        createtime: '',
        author: '',
      },
    ],
  }),
  mounted () {
    this.getupdate()
  },
  methods: {
    async getupdate () {
      const deteilId = this.$store.state.detail.timeId.id
      if (!deteilId) {
        return
      }
      const { data: res } = await timeDetail({
        id: deteilId,
      })
      this.upDate = res
    },
    async postTime () {
      const deteilId = this.$store.state.detail.timeId.id
      if (!deteilId) {
        alert('没有需要更新的数据')
        return
      }
      this.upDate.id = deteilId
      await timeUpdate(this.upDate)
      this.$router.push({ name: 'timeline' })
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
