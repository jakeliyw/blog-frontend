<template>
  <div>
    <header-title :title="title" />
    <div class="container">
      <v-data-table
        :headers="headers"
        :items="cardsData"
        sort-by="calories"
        class="elevation-1"
      >
        <template v-slot:top>
          <v-toolbar flat color="white">
            <!--            搜索-->
            <v-text-field
              v-model="keyword"
              append-icon="search"
              label="Search"
              single-line
              hide-details
              @keyup.enter.native="getList"
            >
            </v-text-field>

            <v-spacer></v-spacer>
            <!--            新建博客-->
            <v-btn
              color="teal"
              dark
              class="mb-2"
              @click="newBlog"
            >添加时间
            </v-btn>
          </v-toolbar>
        </template>
        <!--        修改按钮-->
        <template v-slot:item.actions="{ item }">
          <v-icon
            small
            class="mr-2"
            @click="editItem(item)"
            color="primary"
          >
            mdi-pencil
          </v-icon>
          <!--          删除按钮-->
          <v-icon
            small
            color="red"
            @click="deleteItem(item)"
          >
            mdi-delete
          </v-icon>
        </template>
      </v-data-table>
    </div>
  </div>
</template>

<script>
import HeaderTitle from '@/components/HeaderTitle'
import { timeAdmin, timeDel } from '@/api/timeAdmin/timeAdmin'

export default {
  name: 'admin',
  components: {
    HeaderTitle,
  },
  data: () => ({
    title: '时间管理',
    multiLine: true,
    headers: [
      {
        text: '时间标题',
        align: 'start',
        sortable: true,
        value: 'title',
      },
      {
        text: '操作',
        value: 'actions',
        sortable: false,
      },
    ],
    cardsData: [],
    keyword: '',
  }),

  mounted () {
    this.getList()
  },

  methods: {
    // 获取数据
    async getList () {
      const { data: res } = await timeAdmin({
        keyword: this.keyword,
      })
      this.cardsData = res
    },
    // 新增数据
    newBlog () {
      this.$router.push({ name: 'timenew' })
    },
    // 修改数据
    editItem (item) {
      this.$store.commit('detail/timeDateil', item)
      this.$router.push({ name: 'timeupdate' })
    },
    // 删除数据
    async deleteItem (item) {
      confirm(`你确定要删除${item.title}吗?`) && await timeDel({
        id: item.id,
      })
      this.getList()
    },
  },
}
</script>
<style scoped lang="scss">
.container {
  border: 1px solid #eee;
  background: #fff;
  border-radius: 4px;
  -webkit-box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05);
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05);
  margin: 20px auto;
  overflow: hidden;
}
</style>
